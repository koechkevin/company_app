import { Text } from '@aurora_app/ui-library';
import { Row } from 'antd';
import React, { CSSProperties, FC } from 'react';

import styles from './FieldView.module.scss';

interface FieldProps {
  label?: string;
  value?: string;
  style?: CSSProperties;
}

const FieldView: FC<FieldProps> = (props) => {
  const { label, style, value } = props;

  return (
    <Row className={styles.fieldView} style={style}>
      <Row>
        <Text className={styles.label}>{label}</Text>
      </Row>
      <Row>
        <Text className={styles.value}>{value && value}</Text>
      </Row>
    </Row>
  );
};

export default FieldView;
