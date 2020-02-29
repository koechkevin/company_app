import { Avatar } from '@aurora_app/ui-library';
import { faPhone } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, Row } from 'antd';
import indexOf from 'lodash/indexOf';
import React, { Fragment } from 'react';
import { getNameInitials } from '../../../../utils/utils';

import styles from './Candidate.module.scss';

interface Props {
  profileId: string;
  name: string;
  avatar?: string;
  avatarColor: string;
  signature?: string;
  avatarShape: string;
  inCall: boolean;
  selected: string[];
  select: (id: string) => void;
}

const Candidate: React.FC<Props> = (props) => {
  const { profileId, name, signature, avatar, avatarColor, avatarShape, inCall, selected, select } = props;

  return (
    <Row
      type="flex"
      className={styles.candidate}
      onClick={() => select(profileId)}
      style={{ backgroundColor: indexOf(selected, profileId) !== -1 ? 'rgba(1, 113, 211, 0.05)' : 'inherit' }}
    >
      <Col>
        <Row type="flex">
          <div className={styles.avatar}>
            <Avatar
              src={avatar}
              size={32}
              style={{ background: avatarColor }}
              shape={avatarShape}
            >
              {getNameInitials(name)}
            </Avatar>
          </div>
          <Row>
            <h5>{name}</h5>
          </Row>
          <h6>{signature ? `#${signature}` : null}</h6>
        </Row>
      </Col>
      <Col className={styles.inCall}>
        {inCall && (
          <Fragment>
            <FontAwesomeIcon icon={faPhone} />
            <span>In Call</span>
          </Fragment>
        )}
      </Col>
    </Row>
  );
};

export default Candidate;
