import { Icon, Text } from '@aurora_app/ui-library';
import { IconDefinition } from '@fortawesome/pro-regular-svg-icons';
import { Row } from 'antd';
import React, { FC } from 'react';

import styles from './CardView.module.scss';

interface Props {
  title?: string;
  className?: string;
  titleIcon?: IconDefinition;
}

const CardView: FC<Props> = (props) => {
  const { children, titleIcon, title, className } = props;
  const classNames = `${styles.children} ${className || ''}`;

  return (
    <Row className={styles.card}>
      <Row className={styles.head} type="flex" align="middle">
        {titleIcon && <Icon icon={titleIcon} />}
        <Text>{title}</Text>
      </Row>
      <Row className={classNames}>{children}</Row>
    </Row>
  );
};

export default CardView;
