import { ErrorBoundary } from '@aurora_app/ui-library';
import { IconDefinition } from '@fortawesome/pro-regular-svg-icons';
import { Layout } from 'antd';
import { connect } from 'dva';
import { RouteComponentProps } from 'dva/router';
import React, { useEffect } from 'react';

import styles from './App.module.scss';
import { Header, SideMenu } from './components';
import { CommonModel, ProfileModel } from './models';
import { Company } from './models/company';
import { Dispatch } from './models/dispatch';
import { Auth, UserProfile } from './models/user';
import JobsModel from './pages/Jobs/models/jobs';
import { DraftModel, MessageModel, ModalContainer, RoomModel } from './pages/Messages';
import { AppRoutes, menu, RouteConfig, routesConfig } from './routes';
import { registerModel } from './utils';

const { Content } = Layout;

interface ChatHeaderDetails {
  statusIcon: IconDefinition;
  iconColor: string;
  jobPosition: string;
  chatRoomStatus: string;
  isManyUsers: boolean;
}

interface InternalProps extends RouteComponentProps<any> {
  app: any;
  auth: Auth;
  title: string;
  collapsed: boolean;
  profile: UserProfile;
  onlineUsers: string[];
  companyDetails: Company;
  chatHeaderDetails: ChatHeaderDetails;
  jumpTo: () => void;
  connect: () => void;
  disconnect: () => void;
  fetchThreads: () => void;
  fetchProfiles: () => void;
  fetchAllProfiles: () => void;
  fetchCompanyDetails: () => void;
  handlePageTitle: (title: string) => void;
  handleCollapse: (collapsed: boolean) => void;
  setProfileStatus: (onlineUsers: string[]) => void;
}

const App: React.FC<InternalProps> = (props) => {
  const {
    app,
    auth,
    title,
    jumpTo,
    connect,
    location,
    collapsed,
    disconnect,
    onlineUsers,
    fetchThreads,
    companyDetails,
    handleCollapse,
    handlePageTitle,
    fetchCompanyDetails,
    chatHeaderDetails,
    setProfileStatus,
  } = props;
  const { pathname } = location;
  const { isManyUsers } = chatHeaderDetails;
  const isAuthenticated = auth && auth.isAuthenticated;

  registerModel(app, CommonModel);
  registerModel(app, ProfileModel);
  registerModel(app, RoomModel);
  registerModel(app, MessageModel);
  registerModel(app, DraftModel);
  registerModel(app, JobsModel);

  useEffect(() => {
    if (isAuthenticated) {
      connect();
      fetchThreads();
      fetchCompanyDetails();
    }

    return () => disconnect();
  }, [fetchCompanyDetails, fetchThreads, connect, disconnect, isAuthenticated]);

  useEffect(() => {
    const route = routesConfig.find((d: RouteConfig) => d.path === pathname);

    if (route) {
      handlePageTitle(route.name);
    }
  }, [handlePageTitle, pathname]);

  useEffect(() => {
    setProfileStatus(onlineUsers);
  }, [onlineUsers, setProfileStatus]);

  return (
    <Layout className={styles.app}>
      <SideMenu
        menu={menu}
        jumpTo={jumpTo}
        location={location}
        collapsed={collapsed}
        name={companyDetails.name}
        handleCollapse={handleCollapse}
        avatarUrl={companyDetails.signedLogo?.thumbnails[0].signedUrl}
        avatarColor={companyDetails.avatarColor}
      />
      <Layout style={{ backgroundColor: '#fff' }}>
        <Header
          title={title}
          handleCollapse={() => handleCollapse(!collapsed)}
          statusIcon={!isManyUsers && chatHeaderDetails.statusIcon}
          iconColor={!isManyUsers && chatHeaderDetails.iconColor}
          jobPosition={!isManyUsers && chatHeaderDetails.jobPosition}
          chatRoomStatus={!isManyUsers ? chatHeaderDetails.chatRoomStatus : ''}
        />
        <ErrorBoundary>
          <Content className={styles.content}>
            <AppRoutes app={app} auth={auth} />
          </Content>
        </ErrorBoundary>
      </Layout>
      <ModalContainer />
    </Layout>
  );
};

const mapStateToProps = ({ global, profile }: any) => {
  return {
    title: global.title,
    profile: global.profile,
    collapsed: global.collapsed,
    companyDetails: global.companyDetails,
    chatHeaderDetails: global.chatHeaderDetails,
    onlineUsers: profile && profile.onlineUsers,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    connect() {
      dispatch({ type: 'common/connectSocket' });
    },

    disconnect() {
      dispatch({ type: 'common/disconnectSocket' });
    },

    fetchCompanyDetails() {
      dispatch({ type: 'global/fetchCompany' });
    },

    fetchThreads() {
      dispatch({
        type: 'room/fetchRooms',
      });
    },

    jumpTo() {
      dispatch({ type: 'message/setSelected', payload: { selected: [] } });
      dispatch({
        type: 'common/showOrHideModal',
        modal: 'showListDirectMessageModal',
        payload: true,
      });
    },

    handleCollapse(collapsed: boolean) {
      dispatch({
        type: 'global/changeMenuCollapsed',
        payload: collapsed,
      });
    },

    handlePageTitle(title: string) {
      dispatch({
        type: 'global/changeHeaderTitle',
        payload: { title },
      });
    },

    setProfileStatus(onlineUsers: string[]) {
      dispatch({
        type: 'profile/setProfileStatus',
        payload: onlineUsers,
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
