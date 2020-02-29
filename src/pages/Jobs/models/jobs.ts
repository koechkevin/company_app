import humps from 'humps';
import { pullAllBy } from 'lodash';

import { Action } from '../../../models/dispatch.d';
import { JobService } from '../../../services';
import { JobParams, Pagination } from '../../../utils/constants';
import { PageHelper } from '../../../utils/pageHelper';
import { Job, Jobs } from './typed.d';

const { fetchJobs, fetchJob } = JobService;

export interface JobState {
  job: Job;
  jobs: Jobs;
  jobParams: JobParams;
  pagination: Pagination;
}

export default {
  namespace: 'jobs',

  state: {
    jobs: [],
    job: {},
    jobParams: {
      expand: 'location,hiring_team,applications_count,new_applications_count',
    },
    pagination: PageHelper.create(1, '-created_at', 10),
  },

  subscriptions: {},

  effects: {
    *fetchJobs(action: Action, { call, put, select }: any) {
      try {
        let items;
        const { actionCode, payload } = action;
        const { pagination: paginationConfig, jobParams } = yield select(({ jobs }: any) => jobs);
        const params = {
          ...jobParams,
          ...payload,
        };
        const { data, pagination } = yield call(fetchJobs, actionCode, {
          ...PageHelper.requestFormat(paginationConfig),
          ...params,
        });

        if (data && data.items && Array.isArray(data.items)) {
          items = humps.camelizeKeys(data.items);
        }

        yield put({
          type: 'paginationData',
          payload: pagination,
        });
        yield put({ type: 'loadJobs', payload: items });
      } catch (err) {
        throw err;
      }
    },

    *fetchJob(action: Action, { call, put }: any) {
      try {
        const { payload } = action;
        const res = yield call(fetchJob, payload);

        yield put({ type: 'loadJob', payload: res.data });
      } catch (error) {
        throw error;
      }
    },

    *fetchJobByIds({ payload: { ids } }: Action, { call, put }: any) {
      try {
        let items: any[] = [];

        const { data } = yield call(fetchJobs, 'action-code', {
          'filters[job_id]': ids.join(','),
        });

        if (data && data.items && Array.isArray(data.items)) {
          items = humps.camelizeKeys(data.items);
        }

        yield put({
          type: 'loadJobs',
          payload: items,
        });
      } catch (err) {
        throw err;
      }
    },
  },

  reducers: {
    loadJobs(state: JobState, { payload }: Action) {
      return {
        ...state,
        jobs: [...state.jobs, ...pullAllBy(payload, state.jobs, 'jobId')],
      };
    },

    loadJob(state: JobState, { payload }: Action) {
      return { ...state, job: payload };
    },

    paginationData(state: JobState, { payload }: Action) {
      return { ...state, pagination: { ...state.pagination, ...payload } };
    },
  },
};
