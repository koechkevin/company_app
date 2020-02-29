import { Button, Input, Select } from '@aurora_app/ui-library';
import React, { FC } from 'react';

import { Col, Form, Row } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { connect } from 'dva';

import { CompanyDepartment } from '../../../../models/company';
import { Dispatch } from '../../../../models/dispatch';
import { CompanyProfile } from '../../../../models/user';
import { RoleView } from '../../components';

import styles from './EditUserProfileForm.module.scss';

interface FormProps extends FormComponentProps {
  memberProfile: CompanyProfile;
  departments: CompanyDepartment[];
  roles: string[];
  updateLoading: boolean;
  additionalValues: CompanyProfile;
  action: (data: any) => void;
  onCancel: () => void;
  onEditRole: () => void;
  setMemberProfile: (data: any) => void;
}

const ProfileForm: FC<FormProps> = (props) => {
  const {
    form,
    roles,
    action,
    onCancel,
    onEditRole,
    departments,
    updateLoading,
    memberProfile,
    setMemberProfile,
    additionalValues,
  } = props;
  const { getFieldDecorator, getFieldsValue, getFieldValue } = form;

  const updateProfile = () => {
    const selectedDepartments = departments.filter(
      (dept: CompanyDepartment) => dept.name === getFieldValue('departments'),
    );
    const departmentsId = selectedDepartments.map((dept: CompanyDepartment) => dept.departmentId);
    setMemberProfile({ departments: selectedDepartments });
    action({
      ...getFieldsValue(),
      departments: departmentsId,
      profileId: memberProfile.profileId,
      ...additionalValues,
    });
  };

  return (
    <Form>
      <Row className={[styles.space, styles.form].join(' ')} type="flex" justify="space-between">
        <Col span={12}>
          {getFieldDecorator('firstname', { initialValue: memberProfile.firstname })(
            <Input validateStatus="" label="First Name" />,
          )}
        </Col>
        <Col span={12}>
          {getFieldDecorator('lastname', { initialValue: memberProfile.lastname })(
            <Input validateStatus="" label="Last Name" />,
          )}
        </Col>
        <Col span={12}>
          {getFieldDecorator('email', { initialValue: memberProfile.email })(<Input validateStatus="" label="Email" />)}
        </Col>
        <Col span={12}>
          {getFieldDecorator('signature', { initialValue: memberProfile.signature })(
            <Input validateStatus="" label="Signature" />,
          )}
        </Col>
        <Col span={12}>
          {getFieldDecorator('departments', { initialValue: memberProfile?.departments[0]?.name })(
            <Select
              options={departments.map((department) => ({ value: department.name }))}
              showArrow={false}
              colon={false}
              showSearch
              validateStatus=""
              label="Department"
            />,
          )}
        </Col>
        <Col span={12}>
          <RoleView roles={roles} onClick={onEditRole} />
        </Col>
      </Row>
      <Row className={styles.submitArea}>
        <Col>
          <Button onClick={onCancel} type="primary" shape="round" ghost>
            Cancel
          </Button>
        </Col>
        <Col>
          <Button onClick={updateProfile} loading={updateLoading} type="primary" shape="round">
            Save Changes
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

const mapStateToProps = ({ common, loading, profile }: any) => {
  const roles: string[] = [profile.role, ...profile.additionalRoles];

  return {
    roles,
    role: profile.role,
    departments: common.departments,
    memberProfile: profile?.profile || {},
    additionalRoles: profile.additionalRoles,
    updateLoading: loading.effects['profile/updateCompanyUserProfile'],
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  action: (data: any) => dispatch({ type: 'profile/updateCompanyUserProfile', payload: data }),
  setUserRole: (role: string) => dispatch({ type: 'profile/loadUserRole', payload: role }),
  setAdditionalRoles: (subRoles: string) => dispatch({ type: 'profile/loadAdditionalRoles', payload: subRoles }),
  setMemberProfile: (data: any) => dispatch({ type: 'profile/loadUserProfile', payload: data }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Form.create<FormProps>()(ProfileForm));
