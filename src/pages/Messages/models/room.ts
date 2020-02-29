import { ProductType } from '@aurora_app/ui-library/lib/utils';
import { notification } from 'antd';
import { routerRedux } from 'dva/router';
import humps from 'humps';
import { filter, find, includes, sample, uniq } from 'lodash';

import { Action, Effects } from '../../../models/dispatch';
import { Routes } from '../../../routes';
import { ChannelService } from '../../../services';
import { ChannelTypes } from '../../../utils/constants';
import { typingStatusAssign } from '../../../utils/dataFormat';
import { PageHelper } from '../../../utils/pageHelper';
import { memberExistsInThreads } from '../../../utils/utils';
import { Job } from '../../Jobs/models/typed';
import { Room } from './typed';

export interface RoomState {
  rooms: Room[];
  room: Room; // current active room
  selected: string[]; // candidates IDs that have been selected to be joined
}

const initRoom: Room = {
  id: '',
};

const initialState: RoomState = {
  rooms: [],
  room: initRoom,
  selected: [],
};

export default {
  namespace: 'room',

  state: initialState,

  effects: {
    *fetchRooms(action: Action, { call, put, take, select }: Effects) {
      let rooms = [];

      const { data } = yield call(ChannelService.fetchChannels, null, {
        'per-page': 300,
        sort: '-last_message_at',
      });

      let profilesId: string[] = [];
      if (data.items) {
        data.items.forEach((room: Room) => {
          profilesId = [...profilesId, ...room.members];
        });
      }

      yield put({
        type: 'profile/fetchProfiles',
        payload: { profiles: uniq(profilesId) },
      });
      yield take('profile/fetchProfiles/@@end');

      if (data && Array.isArray(data.items)) {
        data.items = humps.camelizeKeys(data.items);

        rooms = data.items.map((room: any) => ({
          ...room,
          messages: [],
          draft: '',
          draftId: '',
        }));
      }

      yield put({ type: 'fetchRoomsSuccess', payload: { data: rooms } });
      yield put({ type: 'draft/fetchDrafts' });

      const onlineUsers = yield select((state: any) => state.profile.onlineUsers);
      yield put({ type: 'profile/setProfileStatus', payload: onlineUsers });
      yield put({ type: 'message/subscribeNewMessages' });
    },

    *addRoom(action: Action, { call, put, select }: Effects) {
      const rooms = yield select((state: any) => state.room.rooms);
      const profile = yield select((state: any) => state.global.profile);
      const selected = yield select((state: any) => state.room.selected);

      if (!includes(selected, profile.profileId)) {
        selected.push(profile.profileId);
      }

      const id = memberExistsInThreads(rooms, selected);

      if (id) {
        yield put({ type: 'common/showOrHideModal', modal: 'showAddDirectMessageModal', payload: false });
        yield put({ type: 'showHiddenRoom', payload: id });
        return;
      }

      try {
        let { data } = yield call(ChannelService.postChannel, 'todo-action-code', {
          type: 'direct-message',
          members: selected,
        });

        data = humps.camelizeKeys(data);

        yield put({ type: 'appendRoom', payload: data });
        yield put({ type: 'common/showOrHideModal', modal: 'showAddDirectMessageModal', payload: false });
        yield put(routerRedux.push(`${Routes.Channel}/${data.id}`));
      } catch (err) {
        const {
          response: {
            data: { name, message },
          },
        } = err;

        notification.error({ message: name, description: message });
      }
    },

    *selectRoom({ payload }: Action, { put, take, select }: Effects) {
      const { id } = payload;

      let threads = yield select((state: any) => state.room.rooms);

      /** load threads when access chat-room directly */
      if (threads.length === 0) {
        yield take('fetchRooms/@@end');
        yield take('draft/fetchDrafts/@@end');
        threads = yield select((state: any) => state.room.rooms);
      }

      const thread = find(threads, (th) => th.id === id);

      yield put({ type: 'setRoom', payload: thread });

      const message = yield select((state: any) => state.message.message);

      yield put({ type: 'message/initState', payload: { message } });

      yield put({
        type: 'message/fetchMessages',
        payload: { id, pageInfo: PageHelper.create() },
      });

      yield put({ type: 'draftsGroup' });
    },

    *gotoRoom({ payload }: Action, { put, select }: Effects) {
      const { id } = payload;
      const threads = yield select((state: any) => state.room.rooms);
      const thread = find(threads, (th) => th.id === id);

      if (thread && thread.members.length === 1) {
        // select users
        yield put({
          type: 'select',
          payload: { id: thread.members[0].id },
        });
      } else {
        yield put({ type: 'common/showOrHideModal', modal: 'showListDirectMessageModal', payload: false });
        yield put({ type: 'showHiddenRoom', payload: id });
      }
    },

    *hideRoomView({ payload }: Action, { put, call, select }: Effects) {
      const threads = yield select((state: any) => state.room.rooms);
      const thread = yield select((state: any) => state.room.room);
      const unhiddenThreads = threads.filter((thread: any) => !thread.isHidden);
      const randomThread = sample(unhiddenThreads);

      const { data } = yield call(ChannelService.hideChatRoom, {
        hide: true,
        rooms: [payload],
      });

      if (data.success) {
        yield put({ type: 'hideRoom', payload });

        if (thread && thread.id && payload === thread.id) {
          yield put({ type: 'selectRoom', payload: { id: randomThread.id } });
          yield put(routerRedux.push(`${Routes.Channel}/${randomThread.id}`));
        }
      }
    },

    *showHiddenRoom({ payload }: Action, { put, call }: Effects) {
      const { data } = yield call(ChannelService.hideChatRoom, {
        hide: false,
        rooms: [payload],
      });
      if (data.success) {
        yield put({ type: 'showRoom', payload });
        yield put(routerRedux.push(`${Routes.Channel}/${payload}`));
      }
    },

    *select({ payload: { id } }: Action, { put, select }: Effects) {
      let selected: string[] = yield select((state: any) => state.room.selected);
      const profiles = yield select((state: any) => state.profile.profiles);
      const isExisted = find(selected, (item) => item === id);

      if (!isExisted) {
        const selectedProfile = find(profiles, (profile) => profile.profileId === id);
        /** select multiple company users */
        if (selectedProfile && selectedProfile.productId === ProductType.Company) {
          selected = [...selected, id];
        }
        /** just can select only one candidate */
        if (selectedProfile && selectedProfile.productId === ProductType.Candidate) {
          selected = selected.filter((id: string) => {
            const profile = find(profiles, (item) => item.profileId === id);

            return profile.productId !== ProductType.Candidate;
          });
          selected = [...selected, id];
        }
      } else {
        selected = filter(selected, (select) => select !== id);
      }

      yield put({
        type: 'setSelected',
        payload: {
          selected,
        },
      });
    },
  },

  reducers: {
    fetchRoomsSuccess(state: RoomState, { payload: { data } }: Action): RoomState {
      return { ...state, rooms: data };
    },

    setRoom(state: RoomState, { payload }: Action): RoomState {
      return {
        ...state,
        rooms: state.rooms.map((thread) => {
          return thread.id !== payload.id ? thread : { ...thread, ...payload };
        }),
        room: { ...state.room, ...payload },
      };
    },

    resetRoom(state: RoomState, { payload }: Action): RoomState {
      return { ...state, room: initRoom };
    },

    setRooms(state: RoomState, { payload }: Action): RoomState {
      return {
        ...state,
        rooms: state.rooms.map((thread) => {
          return thread.id !== payload.id ? thread : { ...thread, ...payload };
        }),
      };
    },

    setSelected(state: RoomState, { payload: { selected } }: Action): RoomState {
      return { ...state, selected };
    },

    appendRoom(state: RoomState, { payload }: Action): RoomState {
      if (!state.selected.length) {
        return state;
      }

      return {
        ...state,
        selected: [],
        rooms: [{ ...payload, isHidden: false }, ...state.rooms],
      };
    },

    removeThread(state: RoomState, { payload }: Action): RoomState {
      return {
        ...state,
        room: initRoom,
        rooms: filter(state.rooms, (thread) => thread.id !== payload),
      };
    },

    hideRoom(state: RoomState, { payload }: Action): RoomState {
      return {
        ...state,
        rooms: state.rooms.map((room) => {
          return room.id !== payload ? room : { ...room, isHidden: true };
        }),
      };
    },

    showRoom(state: RoomState, { payload }: Action): RoomState {
      const room = find(state.rooms, (room) => room.id === payload) || initRoom;
      return {
        ...state,
        room,
        rooms: state.rooms.map((room) => {
          return room.id !== payload ? room : { ...room, isHidden: false };
        }),
      };
    },

    setTypingStatus(state: RoomState, { payload }: Action): RoomState {
      return {
        ...state,
        rooms: state.rooms.map((room: Room): Room => typingStatusAssign(payload, room)),
        room: state.room && typingStatusAssign(payload, state.room),
      };
    },

    draftsGroup(state: RoomState) {
      return {
        ...state,
        rooms: state.rooms.map((room: Room) => ({ ...room, isDrafted: Boolean(room.draft) })),
      };
    },
  },
};
