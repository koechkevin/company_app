import humps from 'humps';

import { CompanySettings } from '../../../models/company';
import { Action, Effects } from '../../../models/dispatch';
import { CompanyService } from '../../../services';

interface SettingsState {
  companySettings: CompanySettings;
}
const initialState: SettingsState = {
  companySettings: {
    isEoeEnabled: false,
  },
};

export default {
  namespace: 'settings',

  state: initialState,

  effects: {
    *updateCompany({ payload }: Action, { put, call }: Effects) {
      try {
        const { id, key, params } = payload;
        let { data } = yield call(CompanyService.updateCompany, id, humps.decamelizeKeys(params));

        if (data) {
          data = humps.camelizeKeys(data);
          yield put({ type: 'global/loadCompanyDetails', payload: data });
          yield put({ type: 'common/showOrHideModal', modal: key, payload: false });
        }
      } catch (error) {
        throw error;
      }
    },

    *updateCompanySettings(action: Action, { call, put, select }: any) {
      try {
        const { payload } = action;
        const companyId = yield select(
          ({
            global: {
              companyDetails: { companyId },
            },
          }: any) => companyId,
        );
        const { data } = yield call(CompanyService.updateCompanySettings, companyId, humps.decamelizeKeys(payload));
        yield put({ type: 'loadCompanySettings', payload: humps.camelizeKeys(data) });
      } catch (error) {
        throw error;
      }
    },

    *fetchCompanySettings(action: Action, { call, put, select }: any) {
      try {
        const companyId = yield select(
          ({
            global: {
              companyDetails: { companyId },
            },
          }: any) => companyId,
        );
        const { data } = yield call(CompanyService.fetchCompanySettings, companyId);
        yield put({ type: 'loadCompanySettings', payload: humps.camelizeKeys(data) });
      } catch (error) {
        throw error;
      }
    },
  },

  reducers: {
    loadCompanySettings: (state: SettingsState, { payload }: Action): SettingsState => ({
      ...state,
      companySettings: { ...state.companySettings, ...payload },
    }),
  },
};
