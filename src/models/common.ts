import humps from 'humps';

import { CompanyService, SocketEvents, SocketService } from '../services';
import { SocketErrors } from '../services/SocketEvents';
import { cookieKeys } from '../utils/constants';
import { getCookie } from '../utils/cookies';
import { CompanyDepartment } from './company';
import { Action, Effects } from './dispatch';

const socketInstance = SocketService.Instance;

export interface CommonState {
  socketError: any;
  departments: CompanyDepartment[];
  timezones: any[];
  locations: any[];
}

const initState: CommonState = {
  socketError: null,
  departments: [],
  locations: [],
  timezones: [],
};

export default {
  namespace: 'common',

  state: initState,

  effects: {
    *connectSocket({ payload }: Action, { call, put }: Effects) {
      yield call(socketInstance.reconnect);
      yield put({ type: 'subscribeError' });
      yield put({ type: 'subscribeOnline' });
    },

    *getTimezones(action: Action, { call, put }: Effects) {
      try {
        const { data } = yield call(CompanyService.fetchTimezones);
        if (data) {
          const items = humps.camelizeKeys(data.items);
          const sortedZones = Object.values(items).sort((a: any, b: any) => (a.utcOffset > b.utcOffset ? 1 : -1));
          yield put({ type: 'loadTimezones', payload: sortedZones });
        }
      } catch (err) {
        throw err;
      }
    },

    *disconnectSocket({ payload }: Action, { call }: Effects) {
      yield call(socketInstance.disconnect);
    },

    *subscribeOnline({ payload }: Action, { call, select, take, put }: Effects) {
      try {
        const socketChannel = yield call(socketInstance.onSubscribe, SocketEvents.Online);

        while (true) {
          const data = yield take(socketChannel);
          yield put({ type: 'profile/setOnlineUsersIds', payload: data });
        }
      } catch (error) {
        throw error;
      }
    },

    *subscribeError(action: Action, { call, take, put }: Effects) {
      try {
        const socketChannel = yield call(socketInstance.onSubscribe, SocketEvents.Error);

        while (true) {
          const data = yield take(socketChannel);

          if (data) {
            const { payload, code, message } = data;

            if (code === SocketErrors.InvalidToken) {
              const userToken = getCookie(cookieKeys.USER_TOKEN_KEY);
              const profileId = getCookie(cookieKeys.SELECTED_PROFILE_ID);

              if (userToken) {
                if (profileId) {
                  yield put({
                    type: 'global/selectProfile',
                    payload: { profileId, token: userToken },
                  });
                } else {
                  yield put({ type: 'global/fetchMyProfiles', payload: userToken });
                }

                yield take('global/saveAuthData');
                yield call(socketInstance.onTokenRefresh);
              } else {
                yield put({ type: 'global/logout' });
              }
            }

            yield put({ type: 'loadSocketError', payload: payload || message });
          }
        }
      } catch (error) {
        throw error;
      }
    },

    *fetchCompanyDepartments(action: Action, { call, put }: Effects) {
      try {
        const { data } = yield call(CompanyService.fetchDepartments);

        if (data) {
          yield put({ type: 'loadDepartments', payload: humps.camelizeKeys(data.items) });
        }
      } catch (err) {
        throw err;
      }
    },

    *fetchCompanyLocations({ payload }: Action, { put, call }: Effects) {
      try {
        const { params } = payload;
        const { data } = yield call(CompanyService.fetchLocations, params);
        if (data) {
          yield put({ type: 'loadLocations', payload: humps.camelizeKeys(data.items) });
        }
      } catch (error) {
        throw error;
      }
    },
  },

  reducers: {
    loadSocketError(state: CommonState, { payload }: Action): CommonState {
      return { ...state, socketError: payload };
    },

    loadDepartments(state: CommonState, { payload }: Action): CommonState {
      return { ...state, departments: payload };
    },

    showOrHideModal(state: CommonState, { modal, payload }: Action): CommonState {
      return { ...state, [modal]: payload };
    },

    loadTimezones(state: CommonState, { payload }: Action): CommonState {
      return { ...state, timezones: payload };
    },

    loadLocations(state: CommonState, { payload }: Action): CommonState {
      return { ...state, locations: payload };
    },
  },
};
