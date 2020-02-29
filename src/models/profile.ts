import humps from 'humps';
import { pullAllBy, uniq } from 'lodash';

import { Action, Effects } from '../models/dispatch';
import { ActivityLog, CandidateProfile, CompanyProfile, UserProfile } from '../models/user';
import { UserService } from '../services';
import { statusAssign } from '../utils/dataFormat';
import { PageHelper } from '../utils/pageHelper';
import { PageInfo } from '../utils/pageHelper/PageInfo';

export interface ProfilesPagination {
  companyProfiles: PageInfo;
  candidateProfiles: PageInfo;
}

export interface ProfileState {
  profile: UserProfile | null;
  profiles: UserProfile[];
  companyProfiles: CompanyProfile[];
  candidateProfiles: CandidateProfile[];
  pagination: ProfilesPagination;
  activityLog: ActivityLog[];
  role: string;
  additionalRoles: string[];
  isEditing: boolean;
  editing: string;
  onlineUsers: string[];
}

const initialState: ProfileState = {
  profile: null,
  profiles: [],
  companyProfiles: [],
  candidateProfiles: [],
  role: '',
  additionalRoles: [],
  pagination: {
    companyProfiles: PageHelper.create(),
    candidateProfiles: PageHelper.create(),
  },
  activityLog: [],
  isEditing: false,
  editing: '',
  onlineUsers: [],
};

export default {
  namespace: 'profile',

  state: initialState,

  effects: {
    *fetchProfiles({ payload }: Action, { call, put }: Effects) {
      try {
        const { profiles } = payload;

        const { data } = yield call(UserService.fetchUserProfiles, {
          filters: {
            profile_id: profiles.join(),
          },
          expand: 'signature',
        });

        if (data && Array.isArray(data.items)) {
          data.items = humps.camelizeKeys(data.items);

          yield put({
            type: 'loadProfiles',
            payload: { profiles: data.items },
          });
        }
      } catch (error) {
        throw error;
      }
    },

    *fetchCompanyProfiles(action: Action, { call, put }: Effects) {
      try {
        const { pageInfo } = action.payload;
        let paginationConfig = pageInfo;
        if (!pageInfo) {
          paginationConfig = PageHelper.create();
        }

        const { data, pagination } = yield call(UserService.fetchCompanyProfiles, {
          expand: 'signed_avatar,profile,departments',
          ...PageHelper.requestFormat(paginationConfig),
        });

        if (data && Array.isArray(data.items)) {
          data.items = humps.camelizeKeys(data.items);

          yield put({
            type: 'setPageInfo',
            payload: {
              key: 'companyProfiles',
              pageInfo: Object.assign(paginationConfig, pagination),
            },
          });

          yield put({
            type: 'loadCompanyProfiles',
            payload: { companyProfiles: data.items },
          });
          yield put({
            type: 'composeProfiles',
            payload: {
              newProfiles: data.items,
            },
          });
        }
      } catch (err) {
        throw err;
      }
    },

    *fetchCandidateProfiles(action: Action, { call, put }: Effects) {
      try {
        const { pageInfo } = action.payload;
        let paginationConfig = pageInfo;
        if (!pageInfo) {
          paginationConfig = PageHelper.create();
        }

        const { data, pagination } = yield call(UserService.fetchCandidateProfiles, {
          expand: 'profile',
          ...PageHelper.requestFormat(paginationConfig),
        });

        if (data && Array.isArray(data.items)) {
          data.items = humps.camelizeKeys(data.items);

          yield put({
            type: 'setPageInfo',
            payload: {
              key: 'candidateProfiles',
              pageInfo: Object.assign(paginationConfig, pagination),
            },
          });

          yield put({
            type: 'loadCandidateProfiles',
            payload: { candidateProfiles: data.items },
          });
          yield put({
            type: 'composeProfiles',
            payload: {
              newProfiles: data.items,
            },
          });
        }
      } catch (err) {
        throw err;
      }
    },

    *composeProfiles(action: Action, { put }: Effects) {
      try {
        const { newProfiles } = action.payload;
        const composedProfiles = newProfiles.map((profile: CompanyProfile | CandidateProfile) => {
          return {
            ...profile.profile,
            profile,
          };
        });

        yield put({
          type: 'saveComposedProfiles',
          payload: { composedProfiles },
        });
      } catch (err) {
        throw err;
      }
    },

    *fetchUserProfile(action: Action, { call, put }: any) {
      try {
        const { payload } = action;
        const response = yield call(UserService.fetchUserProfile, payload);

        yield put({
          type: 'loadUserProfile',
          payload: response.data,
        });
      } catch (error) {
        throw error;
      }
    },

    *fetchCompanyProfile({ payload }: Action, { call, put }: Effects) {
      try {
        const { profileId } = payload;
        const response = yield call(UserService.fetchCompanyUserProfile, profileId, {
          expand: 'signed_avatar,profile,departments,avatar,company,timezone',
        });
        const data: any = humps.camelizeKeys(response.data);
        yield put({ type: 'loadUserProfile', payload: data });
        yield put({ type: 'loadUserRole', payload: data.profile.role });
        yield put({ type: 'loadAdditionalRoles', payload: data.profile.additionalRoles });
      } catch (err) {
        throw err;
      }
    },

    *updateCompanyUserProfile({ payload }: Action, { call, put }: Effects) {
      try {
        const { profileId, ...body } = payload;
        const { data } = yield call(UserService.updateCompanyUserProfile, profileId, humps.decamelizeKeys(body));
        yield put({ type: 'loadUserProfile', payload: humps.camelizeKeys(data) });
        yield put({ type: 'loadEditing', payload: false });
        yield put({ type: 'loadEditingCard', payload: '' });
      } catch (err) {
        throw err;
      }
    },

    *fetchActivityLog(action: Action, { call, put }: any) {
      try {
        const { payload } = action;
        const response = yield call(UserService.fetchActivityLog, payload);

        yield put({
          type: 'loadActivityLog',
          payload: response.data,
        });
      } catch (error) {
        throw error;
      }
    },
  },

  reducers: {
    loadProfiles(state: ProfileState, { payload }: Action): ProfileState {
      const newProfiles = pullAllBy<UserProfile>(payload.profiles, state.profiles, 'profileId');
      return {
        ...state,
        profiles: [...state.profiles, ...newProfiles],
      };
    },

    loadCompanyProfiles(state: ProfileState, { payload }: Action): ProfileState {
      const newCompanyProfiles = pullAllBy<CompanyProfile>(payload.companyProfiles, state.companyProfiles, 'profileId');
      return {
        ...state,
        companyProfiles: [...state.companyProfiles, ...newCompanyProfiles],
      };
    },

    loadCandidateProfiles(state: ProfileState, { payload }: Action): ProfileState {
      const newCandidates = pullAllBy<CandidateProfile>(
        payload.candidateProfiles,
        state.candidateProfiles,
        'profileId',
      );
      return {
        ...state,
        candidateProfiles: [...state.candidateProfiles, ...newCandidates],
      };
    },

    saveComposedProfiles(state: ProfileState, { payload }: Action): ProfileState {
      const newProfiles = pullAllBy<UserProfile>(payload.composedProfiles, state.profiles, 'profileId');
      return {
        ...state,
        profiles: [...state.profiles, ...newProfiles],
      };
    },

    setProfileStatus(state: ProfileState, { payload }: Action): ProfileState {
      return {
        ...state,
        profiles: payload && payload.length ? statusAssign(payload, state.profiles) : state.profiles,
      };
    },

    setOnlineUsersIds(state: ProfileState, { payload }: Action): ProfileState {
      return {
        ...state,
        onlineUsers: payload,
      };
    },

    setPageInfo(state: ProfileState, { payload }: Action): ProfileState {
      const { pageInfo, key } = payload;
      return {
        ...state,
        pagination: {
          ...state.pagination,
          [key]: pageInfo,
        },
      };
    },

    loadUserProfile(state: ProfileState, { payload }: Action): ProfileState {
      const profiles = state.profiles.map((profile: UserProfile) => {
        if (profile.profileId === payload.profileId) {
          return {
            ...profile,
            profile: {
              ...profile.profile,
              ...payload,
            },
          };
        }
        return profile;
      });
      return { ...state, profile: { ...state.profile, ...payload }, profiles };
    },

    loadActivityLog(state: ProfileState, { payload }: Action): ProfileState {
      return { ...state, activityLog: payload };
    },

    loadUserRole: (state: ProfileState, { payload }: Action): ProfileState => ({
      ...state,
      role: payload,
      additionalRoles: [],
    }),

    loadEditing: (state: ProfileState, { payload }: Action): ProfileState => ({
      ...state,
      isEditing: payload,
    }),

    loadAdditionalRoles: (state: ProfileState, { payload }: Action): ProfileState => ({
      ...state,
      additionalRoles: typeof payload === 'string' ? uniq([...state.additionalRoles, payload]) : payload || [],
    }),

    loadEditingCard: (state: ProfileState, { payload }: Action): ProfileState => ({
      ...state,
      editing: payload,
    }),

    resetRoles: (state: ProfileState): ProfileState => ({
      ...state,
      additionalRoles: [],
      role: '',
    }),
  },
};
