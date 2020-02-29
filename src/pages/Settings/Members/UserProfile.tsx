import { Button, Icon, ListItem, Modal } from '@aurora_app/ui-library';
import { faPencil } from '@fortawesome/pro-light-svg-icons';
import { faCalendarCheck, faPaperPlane, faUserCircle } from '@fortawesome/pro-regular-svg-icons';

import { Col, Row, Typography } from 'antd';
import { connect } from 'dva';
import React, { FC, useEffect, useState } from 'react';

import { CompanyDepartment } from '../../../models/company';
import { Dispatch } from '../../../models/dispatch';
import { CompanyProfile } from '../../../models/user';
import { CardView } from '../components';
import { EditUserProfileForm, ProfileInfo, UserRoles } from './components';

import styles from './UserProfile.module.scss';

const { Text } = Typography;

interface ProfileInfoValues {
  firstName: string;
  lastName: string;
  email: string;
  signature: string;
  department: string;
  roles: string[];
}

const Dates: FC<any> = () => {
  return (
    <CardView titleIcon={faCalendarCheck} title="Dates">
      <Row className={styles.dates} gutter={12}>
        <Col span={10}>
          <Text>Created On</Text>
        </Col>
        <Col span={14}>
          <Text>Sunday, 31 April 2019</Text>
        </Col>
        <Col span={10}>
          <Text>Invited By</Text>
        </Col>
        <Col span={14}>
          <Text>John Smith</Text>
        </Col>
        <Col span={10}>
          <Text>Modified On</Text>
        </Col>
        <Col span={14}>
          <Text>Sunday, 31 April 2019</Text>
        </Col>
        <Col span={10}>
          <Text>Modified By</Text>
        </Col>
        <Col span={14}>
          <Text>Jack Smith</Text>
        </Col>
      </Row>
    </CardView>
  );
};

interface Props {
  role: string;
  roles: string[];
  editing: boolean;
  updateLoading: boolean;
  additionalRoles: string[];
  memberProfile: CompanyProfile;
  departments: CompanyDepartment;
  fetchDepartments: () => void;
  updateProfile: (data: any) => void;
  setEditing: (isEditing: boolean) => void;
}

const UserProfile: FC<Props> = (props) => {
  const { memberProfile, roles, role, additionalRoles, updateLoading, fetchDepartments, editing, setEditing } = props;
  const title = `${memberProfile?.firstname} ${memberProfile?.lastname}'s Roles`;
  const [visible, setVisible] = useState(false);
  const [additionalValues, setAdditionalValues] = useState({});

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const values: ProfileInfoValues = {
    firstName: memberProfile?.firstname,
    lastName: memberProfile?.lastname,
    email: memberProfile?.email || '',
    department: memberProfile?.departments && memberProfile?.departments[0]?.name,
    signature: memberProfile?.signature || '',
    roles,
  };

  const handleOk = () => {
    setAdditionalValues({ role, additionalRoles: additionalRoles?.length ? additionalRoles : null });
    setVisible(false);
  };

  return (
    <Row className={styles.userProfile}>
      <ListItem
        title="Profile Details"
        className={styles.title}
        leading={<Icon color="#1d1d1d" icon={faUserCircle} style={{ marginLeft: -8 }} />}
        trailing={
          !editing && <Icon hover onClick={() => setEditing(true)} icon={faPencil} style={{ marginRight: -16 }} />
        }
      />
      <Row>
        {editing ? (
          <EditUserProfileForm
            additionalValues={additionalValues}
            onCancel={() => setEditing(false)}
            onEditRole={() => setVisible(true)}
          />
        ) : (
          <ProfileInfo {...values} />
        )}
        <Row type="flex" justify="space-between" gutter={8}>
          <Col span={12}>
            <Dates />
          </Col>
          <Col span={12}>
            <CardView className={styles.passwordRecovery} titleIcon={faPaperPlane} title="Password Recovery">
              <Button type="primary" shape="round">
                Email Reset Password Recovery
              </Button>
            </CardView>
          </Col>
        </Row>
      </Row>
      <Modal
        okText="Save"
        title={title}
        onOk={handleOk}
        visible={visible}
        onCancel={() => setVisible(false)}
        okButtonProps={{ loading: updateLoading }}
      >
        <UserRoles
          role={role}
          roleTitle="Main Role"
          subRoleTitle="Subroles (Optional)"
          additionalRoles={additionalRoles}
        />
      </Modal>
    </Row>
  );
};

const mapStateToProps = ({ loading, profile, common }: any) => {
  const roles: string[] = [profile.role, ...profile.additionalRoles];
  return {
    roles,
    role: profile.role,
    editing: profile.isEditing,
    departments: common.departments,
    memberProfile: profile?.profile,
    additionalRoles: profile.additionalRoles,
    updateLoading: loading.effects['profile/updateCompanyUserProfile'],
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  updateProfile: (data: any) => dispatch({ type: 'profile/updateCompanyUserProfile', payload: data }),
  setUserRole: (role: string) => dispatch({ type: 'profile/loadUserRole', payload: role }),
  setAdditionalRoles: (subRoles: string) => dispatch({ type: 'profile/loadAdditionalRoles', payload: subRoles }),
  setEditing: (isEditing: boolean) => dispatch({ type: 'profile/loadEditing', payload: isEditing }),
  fetchDepartments: () => dispatch({ type: 'common/fetchCompanyDepartments' }),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
