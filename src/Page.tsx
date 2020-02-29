import { connect } from 'dva';
import { Redirect, Route, routerRedux, Switch } from 'dva/router';
import React, { FC, useCallback, useEffect } from 'react';
import { hot } from 'react-hot-loader/root';

import App from './App';
import { __DEV__ } from './env';
import { Dispatch } from './models/dispatch';
import { Auth } from './models/user.d';
import { PublicPages } from './pages';
import { Routes } from './routes';
import { localStorageKey } from './utils/constants';

const { ConnectedRouter } = routerRedux;
const { Error403, Error404, Error500, Login, ForgotPassword, FillNewPassword } = PublicPages;

interface Props {
  app: any;
  auth: Auth;
  history: any;
  logout: () => void;
}

const Page: FC<Props> = (props) => {
  const { app, auth, history, logout } = props;

  const onStorageChange = useCallback(
    (e: any) => {
      if ((e.key === localStorageKey.PROFILE_MODEL || !e.key) && !e.newValue) {
        logout();
      }
    },
    [logout],
  );

  useEffect(() => {
    window.addEventListener('storage', onStorageChange);
    return () => window.removeEventListener('storage', onStorageChange);
  }, [onStorageChange]);

  return (
    <ConnectedRouter history={history}>
      <Switch>
        <Route exact path="/" render={() => <Redirect to="/app/home" push />} />
        <Route exact path="/app" render={() => <Redirect to="/app/home" push />} />
        <Route path="/app" render={(props: any) => <App app={app} auth={auth} {...props} />} />
        <Route path={Routes.ForgotPassword} component={ForgotPassword} />
        <Route path={Routes.FillNewPassword} component={FillNewPassword} />
        <Route path="/login" component={Login} />
        <Route path="/exception/403" component={Error403} />
        <Route path="/exception/404" component={Error404} />
        <Route path="/exception/500" component={Error500} />
        <Redirect to="/exception/404" />
      </Switch>
    </ConnectedRouter>
  );
};

const mapStateToProps = ({ global }: any) => ({
  auth: global.auth,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  logout: () => {
    dispatch({ type: 'global/logout' });
  },
});

const EnhancedPage = connect(mapStateToProps, mapDispatchToProps)(Page);

export default __DEV__ ? hot(EnhancedPage) : EnhancedPage;
