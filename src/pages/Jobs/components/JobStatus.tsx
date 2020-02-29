import { Icon } from '@aurora_app/ui-library';
import { timestampFormat } from '@aurora_app/ui-library/lib/utils';
import { Typography } from 'antd';
import React from 'react';

import { Status, toTimeString } from '../../../utils/utils';

import styles from './ListItem.module.scss';

const { Text } = Typography;

interface StatusProps {
  createdAt: string;
  isExpired: boolean;
  updatedAt: string;
  status: string;
  icon: any;
}

const JobStatus: React.FC<StatusProps> = (props) => {
  const { createdAt, updatedAt, icon, status } = props;

  const styleName = styles[status.split(' ').join('-')];
  const className = [styles.status, styleName].join(' ');

  return icon ? (
    <div className={className}>
      {icon && <Icon icon={icon} />}
      <Text style={{ marginLeft: 12 }}>
        {`${status !== Status.draft ? status : ''} `}
        <span className={styles.time}>{`${updatedAt &&
          timestampFormat(new Date(toTimeString(updatedAt)), new Date())}`}</span>
      </Text>

      {status === Status.draft && <span className={styles.buttonLink}>Edit</span>}

      {status === Status.paused && <span className={styles.buttonLink}>Activate</span>}
    </div>
  ) : (
    <Text className={styles.label}>
      Posted {createdAt && timestampFormat(new Date(toTimeString(createdAt)), new Date())}
    </Text>
  );
};


export default  JobStatus;
