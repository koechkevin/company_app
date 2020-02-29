import { timestampFormat } from '@aurora_app/ui-library/lib/utils';
import { Col, Row, Typography } from 'antd';
import React from 'react';

import { getIcon, toTimeString } from '../../../utils/utils';
import { Job } from '../models/typed';
import JobStatus from './JobStatus';

import styles from './ListItem.module.scss';

const { Text } = Typography;

const JobTitleColumn: React.FC<Job> = (props) => {
  const { createdAt, isExpired, updatedAt, status } = props;

  const icon = getIcon(status);

  return (
    <Row>
      <Col>
        {isExpired ? (
          <>
            <Text className={styles.status}>
              Expired {createdAt && timestampFormat(new Date(toTimeString(createdAt)), new Date())}
            </Text>
            <span className={styles.buttonLink}>Close</span>
            <span className={styles.buttonLink}>Renew</span>
          </>
        ) : (
          <JobStatus
            status={status.toLowerCase()}
            createdAt={createdAt}
            updatedAt={updatedAt}
            isExpired={isExpired}
            icon={icon}
          />
        )}
      </Col>
    </Row>
  );
};

export default JobTitleColumn;
