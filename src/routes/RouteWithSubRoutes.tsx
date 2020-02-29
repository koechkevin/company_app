import { connect } from 'dva';
import { Redirect, Route, RouteComponentProps } from 'dva/router';
import queryString from 'query-string';
import React, { FC } from 'react';
import DocumentTitle from 'react-document-title';

import { RouteConfig } from './config';

interface Props extends RouteConfig {
  app: any;
  permissions: string[];
}

export const RouteWithSubRoutes: FC<Props> = (route) => {
  const { path, name, app, routes, permissions, auth } = route;
  return (
    <Route
      path={path}
      render={(props: RouteComponentProps<any>) => {
        // Match location query string
        const reg = /\?\S*/g;
        const queryParams = window.location.href.match(reg);
        const { params } = props.match;
        const title = `Aurora Web App-${name}`;

        Object.keys(params).forEach((key: string) => {
          params[key] = params[key] && params[key].replace(reg, '');
        });

        props.match.params = { ...params };

        const mergeProps = {
          app,
          ...props,
          query: queryParams ? queryString.parse(queryParams[0]) : {},
        };

        if(auth && !permissions.includes(auth)){
          return <Redirect to="/exception/403" />
        }

        return route.component ? (
          <DocumentTitle title={title}>
            <route.component {...mergeProps} routes={routes} />
          </DocumentTitle>
        ) : null;
      }}
    />
  );
};

const mapStateToProps = (state: any) => ({
  permissions: state.global.auth.permissions,
});

export default connect(mapStateToProps)(RouteWithSubRoutes);
