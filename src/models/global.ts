import { IconDefinition } from '@fortawesome/pro-light-svg-icons';
import { notification } from 'antd';
import { routerRedux } from 'dva/router';
import humps from 'humps';
import JWTDecode from 'jwt-decode';
import { get } from 'lodash';

import { Routes } from '../routes';
import { AuthService, AxiosInstance, CompanyService, UserService } from '../services';
import { cookieKeys, exceptionRoutes, localStorageKey, ProfileType } from '../utils/constants';
import { deleteCookie, getCookie, setCookie } from '../utils/cookies';
import { Company } from './company';
import { Action, Effects } from './dispatch';
import { Auth, DecodedToken, UserProfile } from './user';

// Global state interface
export interface GlobalState {
  auth: Auth;
  profile: UserProfile;
  title: string;
  chatHeaderDetails: {
    title?: string;
    statusIcon?: IconDefinition;
    iconColor?: string;
    jobPosition?: string;
    chatRoomStatus?: string;
  };
  collapsed: boolean;
  showAlert: boolean;
  authCredentials: { match: boolean; error: string };
  passwordValidationErrors: any[];
  companyDetails: Company | {};
  passwordRecovered: boolean;
  emailSent: boolean;
  emailSendingErrors: any[];
}

const initialState: GlobalState = {
  auth: {
    isChecking: true,
    isAuthenticated: false,
    permissions: [],
  },
  title: '',
  profile: {
    profileId: '',
    userId: '',
    productId: '',
    role: '',
    status: '',
    isDeleted: false,
    type: '',
    additionalRoles: [],
    chatStatus: 'offline',
  },
  chatHeaderDetails: {
    title: '',
    iconColor: '',
    jobPosition: '',
    chatRoomStatus: '',
  },
  collapsed: false,
  showAlert: false,
  authCredentials: { match: true, error: '' },
  passwordValidationErrors: [],
  companyDetails: {},
  passwordRecovered: false,
  emailSent: false,
  emailSendingErrors: [],
};

export default {
  namespace: 'global',

  state: initialState,

  effects: {
    *login({ payload }: Action, { call, put }: any) {
      try {
        yield put({ type: 'checkAuthCredentials', payload: { match: true, error: '' } });
        const response = yield call(AuthService.loginAccount, payload);
        const { data } = response;

        if (data) {
          yield put({ type: 'fetchMyProfiles', payload: data.token });
        }
      } catch (error) {
        const {
          response: {
            data: { status, message },
          },
        } = error;

        if (status === 403) {
          yield put({
            type: 'checkAuthCredentials',
            payload: { match: false, error: message },
          });
        } else {
          throw error;
        }
      }
    },

    *fetchMyProfiles({ payload }: Action, { call, put }: any) {
      try {
        const { data } = yield call(UserService.fetchUserMyProfiles, payload, {
          expand: 'profile.company',
        });

        if (data && data.items && Array.isArray(data.items)) {
          data.items = humps.camelizeKeys(data.items);
          let domain = window.location.hostname;
          // Fake domain for the localhost requests
          if (process.env.REACT_APP_BUILD === undefined) {
            domain = 'company-1.hr.dev.aurora.app';
          }
          const profile = data.items.find((item: UserProfile) => {
            if (item.type === ProfileType.company) {
              const companyDomain = get(item, 'profile.company.auroraUrl');

              return companyDomain === domain;
            }
            return false;
          });

          if (profile) {
            yield put({
              type: 'saveAuthUser',
              payload: {
                token: payload,
                profileId: profile.profileId,
              },
            });

            yield put({
              type: 'selectProfile',
              payload: {
                token: payload,
                profileId: profile.profileId,
              },
            });
          } else {
            // If cannot find profile in current company, try to find profile from another company and redirect
            const newProfile = data.items.find((item: UserProfile) => {
              if (item.type === ProfileType.company) {
                const companyDomain = get(item, 'profile.company.auroraUrl');
                return companyDomain && companyDomain !== domain;
              }
              return false;
            });

            if (newProfile) {
              yield put({
                type: 'saveAuthUser',
                payload: {
                  token: payload,
                },
              });
              window.location.href = 'https://' + get(newProfile, 'profile.company.auroraUrl');
            } else {
              yield put({
                type: 'checkAuthCredentials',
                payload: { match: false, error: 'We can’t find that user profile, please try again.' },
              });
            }
          }
        }
      } catch (error) {
        throw error;
      }
    },

    *selectProfile({ payload }: Action, { call, put }: any) {
      try {
        const { token, profileId } = payload;
        let { data } = yield call(AuthService.selectProfile, profileId, token);

        if (data) {
          data = humps.camelizeKeys(data);

          if (data.profile && !data.profile.timezone) {
            yield call(
              UserService.updateCompanyUserProfile,
              profileId,
              {
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
              },
              { headers: { Authorization: `Bearer ${data.token}` } },
            );
          }

          yield put({
            type: 'saveAuthData',
            payload: {
              token: data.token,
              profile: data.profile,
            },
          });
          yield put({ type: 'loadUserProfile', payload: data.profile });
          yield put({ type: 'showAlert', payload: false });
          yield put({
            type: 'authorize',
            payload: {
              isChecking: false,
              isAuthenticated: true,
              permissions: [],
            },
          });
          yield put(routerRedux.push(window.location.pathname));
        }
      } catch (error) {
        const { response } = error;

        if (response && response.status === 401) {
          yield put({ type: 'logout' });
        } else {
          throw error;
        }
      }
    },

    *fetchCompany({ payload }: Action, { call, put, select }: Effects) {
      try {
        const profile = yield select((state: any) => state.global.profile);
        let { data } = yield call(CompanyService.fetchCompany, profile.profile.companyId, {
          expand: 'signed_logo',
        });

        if (data) {
          data = humps.camelizeKeys(data);
          yield put({ type: 'loadCompanyDetails', payload: data });
        }
      } catch (error) {
        throw error;
      }
    },

    *logout(action: Action, { put }: any) {
      yield put({
        type: 'deauthorize',
        payload: {
          isChecking: false,
          isAuthenticated: false,
          permissions: [],
        },
      });
    },

    *changeHeaderTitle({ payload }: Action, { put }: Effects) {
      yield put({ type: 'loadPageTitle', payload });
      yield put({ type: 'loadChatHeaderDetails', payload });
    },

    *changeMyPassword({ payload }: Action, { call, put }: Effects) {
      try {
        const { profileId, data } = payload;
        yield call(UserService.changeMyPassword, profileId, humps.decamelizeKeys(data));
        yield put({ type: 'setPasswordValidationErrors', payload: [] });
        yield put({ type: 'common/showOrHideModal', modal: 'showPasswordModal', payload: false });
        notification.open({ message: 'Your password changed successfully' });
      } catch (error) {
        const { response } = error;

        if (response && response.status === 422) {
          const { data } = response;
          const errors = data.map((each: any) => ({ ...each, field: humps.camelize(each.field) }));
          yield put({ type: 'setPasswordValidationErrors', payload: errors });
        } else {
          throw error;
        }
      }
    },

    *forgotPassword({ payload }: Action, { call, put }: Effects) {
      try {
        yield call(AuthService.forgotPassword, payload);
        yield put({ type: 'loadEmailSent', payload: true });
        yield put({ type: 'loadEmailSendingErrors', payload: [] });
      } catch (error) {
        const { response } = error;
        if (response && response.status === 404) {
          yield put({
            type: 'loadEmailSendingErrors',
            payload: [
              {
                fieldName: 'email',
                message: 'We couldn’t find that email. Please try again.',
              },
            ],
          });
          return;
        }
        throw error;
      }
    },

    *fillNewPassword({ payload }: Action, { call, put }: Effects) {
      try {
        const { authKey, data } = payload;
        yield call(AuthService.fillNewPassword, humps.decamelizeKeys(data), authKey);
        yield put({ type: 'loadPasswordRecovered', payload: true });
      } catch (error) {
        throw error;
      }
    },
  },

  reducers: {
    authorize(state: GlobalState, { payload }: Action): GlobalState {
      return { ...state, auth: payload };
    },

    deauthorize(state: GlobalState, { payload }: Action): GlobalState {
      deleteCookie(cookieKeys.SELECTED_PROFILE_ID, false);
      deleteCookie(cookieKeys.USER_TOKEN_KEY);
      deleteCookie(cookieKeys.PROFILE_TOKEN_KEY, false);
      localStorage.removeItem(localStorageKey.PROFILE_MODEL);
      return { ...state, auth: payload };
    },

    showAlert(state: GlobalState, { payload }: Action): GlobalState {
      return { ...state, showAlert: payload };
    },

    changeMenuCollapsed(state: GlobalState, { payload }: Action): GlobalState {
      return { ...state, collapsed: payload };
    },

    loadUserProfile(state: GlobalState, { payload }: Action): GlobalState {
      return { ...state, profile: payload };
    },

    saveAuthUser(state: GlobalState, { payload }: Action): GlobalState {
      setCookie(cookieKeys.USER_TOKEN_KEY, payload.token, 10 * 365 * 24 * 60 * 60);
      if (payload.profileId) {
        setCookie(cookieKeys.SELECTED_PROFILE_ID, payload.profileId, 10 * 365 * 24 * 60 * 60, false);
      }
      return state;
    },

    saveAuthData(state: GlobalState, { payload }: Action): GlobalState {
      setCookie(cookieKeys.PROFILE_TOKEN_KEY, payload.token, 60 * 60, false);
      localStorage.setItem(localStorageKey.PROFILE_MODEL, JSON.stringify(payload.profile));
      return state;
    },

    loadCompanyDetails(state: GlobalState, { payload }: Action): GlobalState {
      return { ...state, companyDetails: payload };
    },

    checkAuthCredentials(state: GlobalState, { payload }: Action): GlobalState {
      return { ...state, authCredentials: payload };
    },

    loadPageTitle(state: GlobalState, { payload }: Action): GlobalState {
      return { ...state, title: payload.title };
    },

    loadChatHeaderDetails(state: GlobalState, { payload }: Action): GlobalState {
      return { ...state, chatHeaderDetails: payload };
    },

    setPasswordValidationErrors: (state: GlobalState, { payload }: Action): GlobalState => ({
      ...state,
      passwordValidationErrors: payload,
    }),

    loadPasswordRecovered: (state: GlobalState, { payload }: Action): GlobalState => ({
      ...state,
      passwordRecovered: payload,
    }),

    loadEmailSent: (state: GlobalState, { payload }: Action): GlobalState => ({
      ...state,
      emailSent: payload,
    }),

    loadEmailSendingErrors: (state: GlobalState, { payload }: Action): GlobalState => ({
      ...state,
      emailSendingErrors: payload,
    }),
  },

  subscriptions: {
    setup({ dispatch, history }: any) {
      return history.listen(({ pathname }: Location) => {
        if (exceptionRoutes.includes(pathname)) {
          return;
        }

        const token = getCookie(cookieKeys.PROFILE_TOKEN_KEY);
        const userToken = getCookie(cookieKeys.USER_TOKEN_KEY);
        const profileId = getCookie(cookieKeys.SELECTED_PROFILE_ID);
        const profile = JSON.parse(localStorage.getItem(localStorageKey.PROFILE_MODEL) || '{}');

        try {
          if (token && profile) {
            const now = new Date().getTime();
            const decoded: DecodedToken = JWTDecode(token);

            // Rewrite authorization token
            AxiosInstance.defaults.headers = {
              Authorization: `Bearer ${token}`,
            };

            const permissions: string[] = profile.additionalRoles
              ? [profile.role, ...profile.additionalRoles]
              : [profile.role];

            dispatch({
              type: 'authorize',
              payload: {
                isChecking: false,
                isAuthenticated: true,
                permissions,
              },
            });

            if (decoded && decoded.exp && decoded.exp * 1000 <= now) {
              dispatch({
                type: 'selectProfile',
                payload: {
                  profileId,
                  token: userToken,
                },
              });

              return;
            }

            dispatch({ type: 'loadUserProfile', payload: profile });

            if (pathname === Routes.Login) {
              dispatch(routerRedux.push(Routes.Home));
            }

            return;
          }

          if (userToken) {
            if (profileId) {
              dispatch({
                type: 'selectProfile',
                payload: {
                  profileId,
                  token: userToken,
                },
              });
              return;
            }
            dispatch({ type: 'fetchMyProfiles', payload: userToken });

            return;
          }

          const publicRoutes: string[] = [
            Routes.FillNewPassword,
            Routes.Login,
            Routes.ForgotPassword,
            '/exception/404',
          ];

          if (!publicRoutes.includes(pathname)) {
            dispatch(routerRedux.push(Routes.Login));
            return;
          }
        } catch (error) {
          throw error;
        }
      });
    },
  },
};
