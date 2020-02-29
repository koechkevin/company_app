import { Avatar as AuroraAvatar, Icon } from '@aurora_app/ui-library';
import { getNameInitials } from '@aurora_app/ui-library/lib/utils';
import { faPen } from '@fortawesome/pro-regular-svg-icons';
import { Row } from 'antd';
import React, { FC } from 'react';

import { Company } from '../../../../models/company';
import styles from './Avatar.module.scss';

interface Props {
  company: Company;
}

export const Avatar: FC<Props> = (props) => {
  const { company } = props;
  const { avatarColor, name } = company;

  return (
    <Row className={styles.avatar}>
      <AuroraAvatar size="large" shape="square" style={{ backgroundColor: avatarColor }}>
        {getNameInitials(name)}
      </AuroraAvatar>
      <Icon hover className={styles.icon} icon={faPen} />
    </Row>
  );
};

export default Avatar;
