import { Col, Row } from 'antd';
import React, { FC } from 'react';

import { FieldView, RoleView } from '../../components';

interface Props {
  firstName: string;
  lastName: string;
  email: string;
  signature: string;
  department: string;
  roles: string[];
}

const ProfileInfo: FC<Props> = (props) => {
  const { firstName, lastName, department, signature, email, roles } = props;

  return (
    <Row type="flex" justify="space-between" gutter={8}>
      <Col span={12}>
        <FieldView label="First Name" value={firstName} />
      </Col>
      <Col span={12}>
        <FieldView label="Last Name" value={lastName} />
      </Col>
      <Col span={12}>
        <FieldView label="Email" value={email} />
      </Col>
      <Col span={12}>
        <FieldView label="Signature" value={signature} />
      </Col>
      <Col span={12}>
        <FieldView label="Department" value={department} />
      </Col>
      <Col span={12}>
        <RoleView roles={roles} />
      </Col>
    </Row>
  );
};

export default ProfileInfo;
