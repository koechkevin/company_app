import { Col, Input, Row, Select } from 'antd';
import debounce from 'lodash/debounce';
import React, { FC } from 'react';
import { Room } from '../../models/typed';

import styles from './Share.module.scss';

interface Props {
  threads?: Room[];
  onSelect: (id: string) => void;
  onChange: (text: string) => void;
}

const { Option } = Select;
const { TextArea } = Input;

const OptionRender = (thread: Room) => (
  <Row className={styles.option}>
    <Col className={styles.avatars}>
      {/*{uniqBy(thread.members, (member: UserProfile) => member.profileId).map((member: UserProfile) => (
        <Avatar size={16} src={member.avatar} key={member.id} />
      ))}*/}
    </Col>
    <Col className={styles.text}>{thread.name}</Col>
  </Row>
);

const Share: FC<Props> = (props) => {
  const { threads, onSelect, onChange } = props;

  const debounced = debounce(onChange, 500);

  return (
    <div className={styles.root}>
      <Row>
        <span className={styles.label}>Share with</span>
        <Select
          className={styles.select}
          showSearch
          defaultActiveFirstOption={true}
          placeholder="Search for channel or person"
          onChange={onSelect}
        >
          {threads &&
            threads.map((thread: Room) => {
              return (
                <Option key={thread.id} value={thread.id}>
                  {OptionRender(thread)}
                </Option>
              );
            })}
        </Select>
      </Row>
      <Row>
        <TextArea
          placeholder="Add a message, if you'd like"
          onChange={(evt) => {
            const text = evt.target.value;
            debounced(text);
          }}
        />
      </Row>
    </div>
  );
};

export default Share;
