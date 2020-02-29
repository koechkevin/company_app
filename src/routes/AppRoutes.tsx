import { Redirect, Route, Switch } from 'dva/router';
import React, { Component } from 'react';

import { Auth } from '../models/user.d';
import { RouteConfig, routesConfig } from './config';
import { Routes } from './Routes';
import RouteWithSubRoutes from './RouteWithSubRoutes';

interface InternalProps {
  app: any;
  auth: Auth;
}

class AppRoutes extends Component<InternalProps> {
  public requireAuth(permission: string, component: any) {
    const { auth } = this.props;
    const { permissions } = auth;

    if (!permissions || !permissions.includes(permission)) {
      return <Redirect to="/404" />;
    }

    return component;
  }

  public requireLogin(component: any, permission?: string) {
    const { auth } = this.props;
    const { isAuthenticated, permissions, isChecking } = auth;

    if (!isChecking && (!isAuthenticated || !permissions)) {
      return <Redirect to={Routes.Login} key={Routes.Login} />;
    }

    return permission ? this.requireAuth(permission, component) : component;
  }

  public render() {
    const { app } = this.props;

    return (
      <Switch>
        {routesConfig.map((route: RouteConfig, i: number) =>
          route.component ? this.requireLogin(<RouteWithSubRoutes key={i} app={app} {...route} />, route.auth) : null,
        )}
        <Route render={() => <Redirect to="/app/exception/404" />} />
      </Switch>
    );
  }
}

export default AppRoutes;
