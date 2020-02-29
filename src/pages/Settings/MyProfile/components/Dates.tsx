import { Icon, InputCard, ListItem, Text } from '@aurora_app/ui-library';
import { faCalendar } from '@fortawesome/pro-light-svg-icons';
import { Col, Row } from 'antd';
import { connect } from 'dva';
import { get } from 'lodash';
import moment from 'moment';
import React, { FC } from 'react';

import { utcToLocalTime } from '../../../../utils/utils';

import styles from './Dates.module.scss';

interface Props {
  myProfile: any;
  profiles: any[];
}
const Dates: FC<Props> = (props) => {
  const { myProfile, profiles } = props;
  const editedBy =
    get(myProfile, 'profile.updatedBy') &&
    profiles.find((prof) => prof.profileId === get(myProfile, 'profile.updatedBy'));

  const createdBy =
    get(myProfile, 'profile.createdBy') &&
    profiles.find((prof) => prof.profileId === get(myProfile, 'profile.createdBy'));

  const updatedAt =
    get(myProfile, 'profile.updatedAt') &&
    moment(utcToLocalTime(get(myProfile, 'profile.updatedAt'))).format('D MMM YYYY, h:mm A');

  const createdAt =
    get(myProfile, 'profile.createdAt') &&
    moment(utcToLocalTime(get(myProfile, 'profile.createdAt'))).format('D MMM YYYY, h:mm A');

  return (
    <InputCard style={{ marginTop: 24, padding: '12px 8px 16px ' }}>
      <ListItem title="Dates" style={{ padding: '12px 8px' }} leading={<Icon icon={faCalendar} />} />
      <Row className={styles.dates} gutter={16}>
        <Col span={8}>
          <Text>Invited on</Text>
        </Col>
        <Col span={16}>
          <Text>{createdAt}</Text>
        </Col>
        <Col span={8}>
          <Text>Invited by</Text>
        </Col>
        <Col span={16}>
          <Text>{createdBy}</Text>
        </Col>
        <Col span={8}>
          <Text>Edited on</Text>
        </Col>
        <Col span={16}>
          <Text>{updatedAt}</Text>
        </Col>
        <Col span={8}>
          <Text>Edited by</Text>
        </Col>
        <Col span={16}>
          <Text>{editedBy && `${get(editedBy, 'profile.firstname')} ${get(editedBy, 'profile.lastname')}`}</Text>
        </Col>
      </Row>
    </InputCard>
  );
};

const mapStateToProps = ({ profile }: any) => ({
  myProfile: profile.profile || {},
  profiles: profile.profiles,
});

export default connect(mapStateToProps)(Dates);
