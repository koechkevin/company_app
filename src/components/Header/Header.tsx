import {
  Avatar,
  ChangePassword,
  ChatHeader,
  Header as AuroraHeader,
  Icon,
  Menu as AuroraMenu,
  Text,
} from '@aurora_app/ui-library';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/pro-regular-svg-icons';
import { faBell, faLifeRing, faSearch, faStream } from '@fortawesome/pro-regular-svg-icons';
import { Col, Dropdown, Menu as AntMenu, Row } from 'antd';
import { connect } from 'dva';
import { capitalize, get } from 'lodash';
import React, { FC } from 'react';
import { useMedia } from 'react-use';

import { Company } from '../../models/company';
import { Dispatch } from '../../models/dispatch';
import { UserProfile } from '../../models/user';
import WithModalConnect from '../HOCs/WithModalConnect';
import Menu from './Menu';

import styles from './Header.module.scss';

interface Error {
  message: string;
  field: string;
}

interface Props {
  title?: string;
  iconColor?: string;
  jobPosition?: string;
  collapsed: boolean;
  location?: object;
  errors: Error[];
  company: Company;
  profileId: string;
  profile: UserProfile;
  showPasswordModal: boolean;
  chatRoomStatus?: string;
  statusIcon?: IconDefinition;
  changePasswordLoading: boolean;
  onAdd: () => void;
  logout: () => void;
  handleCollapse: () => void;
  linkToNewMessage: () => void;
  hideModal: (modal: string) => void;
  showModal: (modal: string) => void;
  changePassword: (profileId: string, data: any) => void;
  setPasswordValidationErrors: (payload: Error[]) => void;
}

export const Header: FC<Props> = (props) => {
  const {
    title,
    logout,
    errors,
    profile,
    company,
    showModal,
    statusIcon,
    iconColor,
    jobPosition,
    hideModal,
    collapsed,
    profileId,
    chatRoomStatus,
    handleCollapse,
    changePassword,
    linkToNewMessage,
    showPasswordModal,
    changePasswordLoading,
    setPasswordValidationErrors,
  } = props;
  const isMobile = useMedia('(max-width: 575px)');
  const visible = isMobile || collapsed;

  const submitData = (data: any) => {
    setPasswordValidationErrors([]);
    changePassword(profileId, data);
  };

  return (
    <AuroraHeader>
      <Row className={styles.wrapper} type="flex" justify="space-between" align="middle">
        <Col>
          {visible && <Icon icon={faStream} onClick={handleCollapse} />}
          <span className={styles.title} style={{ paddingLeft: visible ? 15 : 0 }}>
            <Row type="flex" style={{ flexWrap: 'nowrap' }}>
              {title}
              <ChatHeader
                statusIcon={statusIcon}
                iconColor={iconColor}
                jobPosition={jobPosition}
                chatRoomStatus={capitalize(chatRoomStatus)}
              />
            </Row>
          </span>
        </Col>
        <Row style={{ flexWrap: 'nowrap' }} type="flex" align="middle">
          <Icon color="#2c2c2e" icon={faSearch} />
          <Icon color="#2c2c2e" icon={faLifeRing} />
          <Icon color="#2c2c2e" icon={faBell} />
          <Dropdown
            trigger={['click']}
            overlay={
              <AuroraMenu>
                <AntMenu.Item>New Job</AntMenu.Item>
                <AntMenu.Item>New Candidate</AntMenu.Item>
                <AntMenu.Item onClick={linkToNewMessage}>New Message</AntMenu.Item>
              </AuroraMenu>
            }
          >
            <Row align="middle" type="flex" className={styles.newBtn}>
              <Icon color="#0050C8" icon={faPlus} />
              <Text ellipsis>New</Text>
            </Row>
          </Dropdown>
          <Dropdown
            trigger={['click']}
            overlay={
              <Menu company={company} onLogout={logout} onChangePassword={() => showModal('showPasswordModal')} />
            }
          >
            <span className={styles.avatar}>
              <Avatar icon="user" size={32} style={{ backgroundColor: get(profile, 'avatarColor') }} />
            </span>
          </Dropdown>
        </Row>
      </Row>
      <ChangePassword
        errors={errors}
        onOk={submitData}
        visible={showPasswordModal}
        loading={changePasswordLoading}
        onCancel={() => hideModal('showPasswordModal')}
      />
    </AuroraHeader>
  );
};

const mapStateToProps = ({ global, loading, common }: any) => {
  return {
    profile: global.profile,
    collapsed: global.collapsed,
    company: global.companyDetails,
    profileId: global.profile.profileId,
    errors: global.passwordValidationErrors,
    showPasswordModal: common.showPasswordModal,
    changePasswordLoading: loading.effects['global/changeMyPassword'],
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  logout: () => dispatch({ type: 'global/logout' }),

  inviteDirectMessageMember: () => dispatch({ type: 'directMessage/inviteMembers' }),

  setPasswordValidationErrors: (payload: Error[]) => dispatch({ type: 'global/setPasswordValidationErrors', payload }),

  changePassword: (profileId: string, data: any) =>
    dispatch({ type: 'global/changeMyPassword', payload: { profileId, data } }),

  linkToNewMessage: () => {
    dispatch({ type: 'message/setSelected', payload: { selected: [] } });
    dispatch({
      type: 'common/showOrHideModal',
      modal: 'showAddDirectMessageModal',
      payload: true,
    });
  },
});

const ConnectedHeader = WithModalConnect(Header);

export default connect(mapStateToProps, mapDispatchToProps)(ConnectedHeader);
