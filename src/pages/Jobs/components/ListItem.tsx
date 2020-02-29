import { Icon } from '@aurora_app/ui-library';
import { faEllipsisH } from '@fortawesome/pro-light-svg-icons';
import { Checkbox, Col, Row, Skeleton, Typography } from 'antd';
import { get } from 'lodash';
import React from 'react';

import { Job } from '../models/typed';
import HiringTeamMember from './HiringTeamMember';
import JobTitleColumn from './JobTitleColumn';

import styles from './ListItem.module.scss';

const { Text } = Typography;

interface Props extends Job {
  loading: boolean;
  onCheck?: () => void;
  newApplicationsCount?: string;
}

const ListItem: React.FC<Props> = (props) => {
  const { loading, jobTitle, applicationsCount, location, hiringTeam, newApplicationsCount } = props;
  // This is fake data to be updated once the API is ready
  const jobBoards: string[] = ['LinkedIn', 'Hired.com', 'Facebook.com', 'LinkedIn', 'Hired.com', 'Facebook.com'];

  const newApplicants = parseInt(newApplicationsCount || '', 10);

  return (
    <Row className={styles.listItem} gutter={12}>
      <Skeleton loading={loading} title={false} paragraph={{ rows: 2 }} active>
        <Col span={10}>
          <Row>
            <Col span={6}>
              <Row type="flex">
                <Checkbox />
                <Text className={styles.jobId}>{get(props, 'publicId')}</Text>
              </Row>
            </Col>

            <Col className={styles.jobTitle} span={18}>
              <Text strong>{jobTitle}</Text>
              <JobTitleColumn {...props} />
            </Col>
          </Row>
        </Col>
        <Col span={14}>
          <Row gutter={12}>
            <Col className={styles.location} span={6}>
              <Col>
                {location && (
                  <>
                    {location.city && <span className={styles.city}>{`${location.city}`}</span>}
                    {location.state && <span className={styles.state}>{`, ${location.state}`}</span>}
                    {location.country && <span className={styles.country}>{`, ${location.country}`}</span>}
                  </>
                )}
              </Col>
            </Col>

            <Col span={7} className={styles.jobBoards}>
              <Col>{`${jobBoards[0]}, ${jobBoards[1]}`}</Col>
              {jobBoards.length >= 3 && <span className={styles.moreBoards}>{`+${jobBoards.length - 2} more`}</span>}
            </Col>

            <Col span={6} className={styles.applicants}>
              <Col>{applicationsCount || '__'}</Col>
              {newApplicants ? (
                <Col>
                  <div className={styles.new}>{`${newApplicants} new`}</div>
                </Col>
              ) : null}
            </Col>

            <Col span={4} className={styles.hiringTeam}>
              {hiringTeam && hiringTeam.map((member: any, i: number) => <HiringTeamMember {...member} key={i} />)}
            </Col>

            <Col span={1} className={styles.elipsis}>
              <span className={styles.moreBtn}>
                <Icon icon={faEllipsisH} />
              </span>
            </Col>
          </Row>
        </Col>
      </Skeleton>
    </Row>
  );
};

export default ListItem;
