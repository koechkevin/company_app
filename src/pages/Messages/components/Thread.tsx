import { Col, Row } from 'antd';
import indexOf from 'lodash/indexOf';
import React from 'react';

import { UserProfile } from '../../../models/user';

import styles from './Thread.module.scss';

interface Props {
  selected: string[];
  id?: string;
  name?: string;
  members?: UserProfile[];
  updatedAt?: Date;
  select: (id: string) => void;
}

const Thread: React.FC<Props> = (props) => {
  const { id, name, members, updatedAt, selected, select } = props;

  return members && members.length ? (
    <Row
      type="flex"
      className={styles.root}
      style={{
        backgroundColor:
          members.length === 1 && indexOf(selected, members[0].profileId) !== -1
            ? 'rgba(1, 113, 211, 0.05)'
            : 'inherit',
      }}
      onClick={() => id && select(id)}
    >
      <Col className={styles.col}>
        <div className={styles.avatars}>
          {/*{members.length > 1 ? (
            <>
              <Avatar src={members[0].avatar} />
              <Avatar src={members[1].avatar} />
            </>
          ) : (
            <Avatar src={members[0].avatar} />
          )}*/}
        </div>
        <span className={styles.text}>{name}</span>
      </Col>
      <Col className={styles.col}>{updatedAt}</Col>
    </Row>
  ) : (
    <div />
  );
};

export default Thread;
