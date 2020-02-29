import { SettingsMenu } from '@aurora_app/ui-library';
import { Col, Layout, Row } from 'antd';
import { connect } from 'dva';
import { Switch } from 'dva/router';
import React, { FC, useEffect } from 'react';
import { useMedia } from 'react-use';

import { Company } from '../../models/company';
import { Dispatch } from '../../models/dispatch';
import { RouteWithSubRoutes } from '../../routes';
import { RouteConfig } from '../../routes/config';

import styles from './Settings.module.scss';

interface Props {
  app: any;
  company: Company;
  routes: RouteConfig[];
  location: Location;
  handlePageTitle: (title: string) => void;
}

const Settings: FC<Props> = (props) => {
  const { app, routes, location, handlePageTitle, company } = props;

  const isMobile = useMedia('(max-width: 768px)');

  useEffect(() => {
    handlePageTitle('Settings');
  }, [handlePageTitle]);

  return (
    <Layout className={styles.settings}>
      <Row type="flex" style={{ flexWrap: 'nowrap', height: '100%' }}>
        {!isMobile && (
          <Col className={styles.menuBar}>
            <SettingsMenu
              routes={routes}
              location={location}
              logoUrl={company.signedLogo?.thumbnails[0].signedUrl}
            />
          </Col>
        )}
        <Col className={styles.routes}>
          <Switch>
            {routes.map((item: RouteConfig, index: number) =>
              item.routes ? (
                item.routes.map((item: RouteConfig, i: number) => <RouteWithSubRoutes key={i} app={app} {...item} />)
              ) : (
                <RouteWithSubRoutes key={index} app={app} {...item} />
              ),
            )}
          </Switch>
        </Col>
      </Row>
    </Layout>
  );
};

const mapStateToProps = ({ global }: any) => ({
  company: global.companyDetails,
});

export const mapDispatchToProps = (dispatch: Dispatch) => ({
  handlePageTitle(title: string) {
    dispatch({
      type: 'global/changeHeaderTitle',
      payload: { title },
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
