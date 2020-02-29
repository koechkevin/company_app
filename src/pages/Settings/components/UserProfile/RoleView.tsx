import { Text } from '@aurora_app/ui-library';
import { Col, Row } from 'antd';
import React, { FC } from 'react';

import { RoleTag } from '../../../../components';

import styles from './RoleView.module.scss';

interface Props {
  roles: string[];
  onClick?: (e: any) => void;
}

const RoleView: FC<Props> = (props) => {
  const { roles, ...restProps } = props;

  return (
    <Row {...restProps} className={styles.roles}>
      <Row style={{ height: '100%' }} gutter={12} align="middle" type="flex">
        <Col>
          <Text>Role</Text>
        </Col>
        {roles.map((role: any, index: number) => (
          <RoleTag key={role} role={role} />
        ))}
      </Row>
    </Row>
  );
};

export default RoleView;
