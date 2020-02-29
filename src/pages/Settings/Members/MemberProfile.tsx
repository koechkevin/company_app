import { Avatar, Button, Icon, Loading, Tabs, Text } from '@aurora_app/ui-library';
import { faLongArrowLeft, faPencil } from '@fortawesome/pro-light-svg-icons';
import { Col, Row, Tabs as AntdTabs } from 'antd';
import { connect } from 'dva';
import { Link, RouteComponentProps } from 'dva/router';
import { get } from 'lodash';
import React, { FC, useEffect } from 'react';

import { RoleTag } from '../../../components';
import { Dispatch } from '../../../models/dispatch';
import { CompanyProfile } from '../../../models/user';
import { getInitials } from '../../../utils/utils';
import { Params } from '../models/interfaces';
import UserProfile from './UserProfile';

import styles from './MemberProfile.module.scss';

const { TabPane } = AntdTabs;

interface Props extends RouteComponentProps<Params> {
  roles: string[];
  loading: boolean;
  memberProfile: CompanyProfile;
  fetchMemberProfile: (id: string) => void;
}

const MemberProfile: FC<Props> = (props) => {
  const { roles, match, loading, memberProfile, fetchMemberProfile } = props;
  const { profileId } = match.params;

  useEffect(() => {
    fetchMemberProfile(profileId);
  }, [profileId, fetchMemberProfile]);

  if (loading) {
    return <Loading spinning />;
  }

  return (
    <Row className={styles.memberProfile}>
      <Row className={styles.header}>
        <Link to="/app/settings/team/members">
          <Icon hover icon={faLongArrowLeft} />
        </Link>
        <Text>Edit</Text>
      </Row>
      <Col className={styles.profile}>
        <Row type="flex">
          <Col style={{ width: 116 }}>
            <Row className={styles.avatar}>
              <Avatar
                size={112}
                src={get(memberProfile, 'signedAvatar.signedUrl')}
                style={{ backgroundColor: get(memberProfile, 'profile.avatarColor'), fontSize: 55 }}
              >
                {`${getInitials(memberProfile.firstname || ' ')}${getInitials(memberProfile.lastname || ' ')}`}
              </Avatar>
              <span className={styles.icon}>
                <Icon icon={faPencil} />
              </span>
            </Row>
          </Col>
          <Row gutter={12} style={{ width: 'calc(100% - 116px)' }}>
            <Col className={styles.userInfo} span={14}>
              <Col style={{ marginTop: 22 }}>
                <Text className={styles.name} strong>
                  {`${memberProfile.firstname} ${memberProfile.lastname}`}
                </Text>
              </Col>
              <Col>
                <Text className={styles.signature}>{memberProfile.signature || '__'}</Text>
              </Col>
              <Col>
                {roles.map((role: string) => (
                  <RoleTag key={role} role={role} />
                ))}
              </Col>
            </Col>
            <Col style={{ textAlign: 'right', paddingRight: 0 }} span={10}>
              <Button style={{ marginTop: 22 }} type="primary" shape="round">
                Revoke User Access
              </Button>
            </Col>
          </Row>
        </Row>
      </Col>
      <Col className={styles.tabs}>
        <Tabs tabBarExtraContent={<span className={styles.lastLogin}>Last Login Today at 4:35PM</span>}>
          <TabPane tab="User Profile" key="0">
            <UserProfile />
          </TabPane>
          <TabPane tab="Jobs List" key="1" />
          <TabPane tab="Activity Log" key="2" />
          <TabPane tab="Login History" key="3" />
        </Tabs>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ loading, profile }: any) => {
  const roles: string[] = [profile.role, ...profile.additionalRoles];
  return {
    memberProfile: profile?.profile || {},
    roles,
    loading: loading.effects['profile/fetchCompanyProfile'],
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchMemberProfile: (profileId: string) => dispatch({ type: 'profile/fetchCompanyProfile', payload: { profileId } }),
});

export default connect(mapStateToProps, mapDispatchToProps)(MemberProfile);
