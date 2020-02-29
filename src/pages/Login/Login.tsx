import { connect } from 'dva';
import React, { FC, useEffect, useState } from 'react';

import { Dispatch } from '../../models/dispatch';
import { BasicAuth } from '../../models/user';
import AuthPageLayout from '../ForgotPassword/components/AuthPageLayout';
import FormContent from './components/FormContent';

interface Props {
  loading: boolean;
  login: (props: BasicAuth) => void;
  authCredentials: { match: boolean; error: string };
}

export const Login: FC<Props> = (props) => {
  const { login, loading, authCredentials } = props;

  const initialState = {
    authCredentials: {
      match: true,
      error: '',
    },
  };
  const [state, setState] = useState(initialState);

  useEffect(() => {
    document.title = 'Aurora Web App';
  }, []);

  useEffect(() => {
    setState((s: any) => ({
      ...s,
      authCredentials,
    }));
  }, [authCredentials]);

  return (
    <AuthPageLayout>
      <FormContent login={login} loading={loading} authCredentials={state.authCredentials} />
    </AuthPageLayout>
  );
};

const mapStateToProps = ({ global, loading }: any) => ({
  showAlert: global.showAlert,
  authCredentials: global.authCredentials,
  loading:
    loading.effects['global/login'] ||
    loading.effects['global/fetchMyProfiles'] ||
    loading.effects['global/selectProfile'],
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  login: (params: BasicAuth) => {
    dispatch({
      type: 'global/login',
      payload: params,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
