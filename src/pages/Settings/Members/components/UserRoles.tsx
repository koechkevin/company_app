import { Text, ThemedRadio } from '@aurora_app/ui-library';
import { Col, Row } from 'antd';
import { connect } from 'dva';
import { Link } from 'dva/router';
import React, { FC } from 'react';

import { Dispatch } from '../../../../models/dispatch';
import { RolesConstants } from '../../../../utils/constants';

import styles from './UserRoles.module.scss';

interface Props {
  role: string;
  roleTitle?: string;
  subRoleTitle?: string;
  additionalRoles: string[];
  setUserRole: (role: string) => void;
  setAdditionalRoles: (subRoles: string) => void;
}

const UserRoles: FC<Props> = (props) => {
  const { roleTitle, subRoleTitle, setAdditionalRoles, setUserRole, role, additionalRoles } = props;

  return (
    <>
      <Row>
        <Col span={12}>
          <Text strong>{roleTitle || 'Role'}</Text>
        </Col>
        <Col className={styles.link} span={12}>
          <Link to="">Learn about roles</Link>
        </Col>
      </Row>
      <Row style={{ marginTop: 16 }} gutter={12}>
        <Col span={12}>
          <ThemedRadio
            checked={role === RolesConstants.CompanyAdmin}
            label="Admin"
            theme="blue"
            onClick={() => setUserRole(RolesConstants.CompanyAdmin)}
          />
        </Col>
        <Col span={12}>
          <ThemedRadio
            onClick={() => setUserRole(RolesConstants.CompanyRecruiter)}
            checked={role === RolesConstants.CompanyRecruiter}
            label="Recruiter"
            theme="green"
          />
        </Col>
        <Col span={12}>
          <ThemedRadio
            onClick={() => setUserRole(RolesConstants.CompanyMember)}
            checked={role === RolesConstants.CompanyMember}
            label="Team Member"
            theme="primary"
          />
        </Col>
        <Col span={12}>
          <ThemedRadio
            onClick={() => setUserRole(RolesConstants.CompanyGuest)}
            checked={role === RolesConstants.CompanyGuest}
            label="Guest"
            theme="primary"
          />
        </Col>
      </Row>
      {role === RolesConstants.CompanyAdmin && (
        <>
          <Row style={{ marginTop: 16 }}>
            <Text className={styles.text} strong>
              {subRoleTitle || 'Admin Subroles (Optional)'}
            </Text>
          </Row>
          <Row style={{ marginTop: 16 }} gutter={12}>
            <Col span={12}>
              <ThemedRadio
                onClick={() => setAdditionalRoles(RolesConstants.CompanyBilling)}
                checked={additionalRoles.includes(RolesConstants.CompanyBilling)}
                label="Billing"
                theme="purple"
              />
            </Col>
            <Col span={12}>
              <ThemedRadio
                onClick={() => setAdditionalRoles(RolesConstants.CompanyOwner)}
                checked={additionalRoles.includes(RolesConstants.CompanyOwner)}
                label="Owner"
                theme="gold"
              />
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

const mapStateToProps = ({ profile }: any) => ({
  role: profile.role,
  additionalRoles: profile.additionalRoles,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setUserRole: (role: string) => dispatch({ type: 'profile/loadUserRole', payload: role }),
  setAdditionalRoles: (subRoles: string) => dispatch({ type: 'profile/loadAdditionalRoles', payload: subRoles }),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserRoles);
