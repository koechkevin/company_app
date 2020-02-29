import humps from 'humps';
import filter from 'lodash/filter';
import { Action, Effects } from '../../../models/dispatch';
import { ChannelService } from '../../../services';

import { Draft } from './typed';

export interface DraftState {
  drafts: Draft[];
}

const initialState: DraftState = {
  drafts: [],
};

export default {
  namespace: 'draft',

  state: initialState,

  effects: {
    *fetchDrafts(action: Action, { put, all, call }: Effects) {
      const { data } = yield call(ChannelService.fetchDraftMessages);

      if (data && Array.isArray(data.items)) {
        data.items = humps.camelizeKeys(data.items);

        yield all(
          data.items
            .filter((draft: Draft) => !draft.threadId)
            .map((draft: any) =>
              put({
                type: 'room/setRooms',
                payload: {
                  id: draft.roomId,
                  draft: !draft.threadId && draft.message ? draft.message : '',
                  threadDraft: draft.threadId && draft.message,
                  draftId: !draft.threadId && draft.id ? draft.id : '',
                  draftThreadId: draft.threadId,
                },
              }),
            ),
        );
        yield put({
          type: 'setDraftsSuccess',
          payload: data.items,
        });
        yield put({ type: 'room/draftsGroup' });
      }
    },

    *createDraftMessages({ payload }: Action, { call, put }: Effects) {
      const { id, message, draftThreadId } = payload;

      let { data } = yield call(ChannelService.createDraftMessages, id, {
        message,
        thread_id: draftThreadId,
      });
      data = humps.camelizeKeys(data);
      if (!draftThreadId) {
        yield put({
          type: 'room/setRooms',
          payload: {
            id,
            draft: data && !data.threadId ? data.message : '',
            draftId: data.id,
            draftThreadId: data && data.threadId,
          },
        });
      }

      yield put({
        type: 'setDrafts',
        payload: data,
      });

      yield put({ type: 'room/draftsGroup' });
    },

    *updateDraftMessages({ payload }: Action, { call, put }: Effects) {
      const { id, draftId, message, draftThreadId } = payload;
      const { data } = yield call(ChannelService.updateDraftMessages, id, draftId, {
        message,
      });

      if (data) {
        data.items = humps.camelizeKeys(data);

        const draft = data.message;
        if (!draftThreadId) {
          yield put({
            type: 'room/setRooms',
            payload: { id, draft, draftId },
          });
        }
        yield put({ type: 'room/draftsGroup' });
        yield put({ type: 'updateDraftsAfterUpdate', payload: { data } });
      }
    },

    *deleteDraftMessages({ payload }: Action, { call, put }: Effects) {
      const { id, draftId, draftThreadId } = payload;

      yield call(ChannelService.deleteDraftMessages, id, draftId);

      if (!draftThreadId) {
        yield put({
          type: 'room/setRoom',
          payload: { id, draft: '', draftId: '', isDrafted: false },
        });
      }

      yield put({
        type: 'updateDraftsAfterDelete',
        payload: draftId,
      });

      /** clear draft */
      if (draftThreadId) {
        yield put({
          type: 'message/updateMessageDraft',
          payload: { data: { draftText: '', draftId: '' } },
        });
      }

      yield put({ type: 'room/draftsGroup' });
    },
  },

  reducers: {
    setDraftsSuccess(state: DraftState, { payload }: Action): DraftState {
      return {
        ...state,
        drafts: payload,
      };
    },

    setDrafts(state: DraftState, { payload }: Action): DraftState {
      return {
        ...state,
        drafts: [...state.drafts, payload],
      };
    },

    updateDraftsAfterDelete(state: DraftState, { payload }: Action): DraftState {
      return {
        ...state,
        drafts: filter(state.drafts, (draft) => draft.id !== payload),
      };
    },

    updateDraftsAfterUpdate(state: DraftState, { payload }: Action): DraftState {
      return {
        ...state,
        drafts: state.drafts
          ? state.drafts.map((draft: Draft) => {
              return draft.id !== payload.data.items.id
                ? draft
                : {
                    ...draft,
                    ...payload.data.items,
                  };
            })
          : [],
      };
    },
  },
};
