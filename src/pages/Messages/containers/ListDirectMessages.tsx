import { faTimesCircle } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, List, Row, Select } from 'antd';
import { connect } from 'dva';
import filter from 'lodash/filter';
import React, { useState } from 'react';

import { WithModalConnect } from '../../../components';

import { Dispatch } from '../../../models/dispatch';
import { UserProfile } from '../../../models/user';
import { Thread } from '../components';
import { Room } from '../models/typed';

import styles from './AddDirectMessage.module.scss';

const { Option } = Select;

interface Props {
  rooms: Room[];
  selected: string[];
  add: () => void;
  hideModal: (modal: string) => void;
  handleSelect: (id: string) => void;
  handleChange: (selected: any) => void;
}

const ListDirectMessage: React.FC<Props> = (props) => {
  const { rooms, selected, handleChange, handleSelect, add, hideModal } = props;
  const candidates: UserProfile[] = [];
  let _threads = [...rooms];

  const [keyword, setKeyword] = useState<string>('');

  rooms.forEach((thread: Room) => {
    if (thread.members && thread.members.length === 1) {
      candidates.push(thread.members[0]);
    }
  });

  if (selected.length) {
    _threads = filter(rooms, (thread: Room) => thread.members !== undefined && thread.members.length === 1);
  }

  const handleSearch = (value: string) => {
    setKeyword(value);
  };

  return (
    <div className={styles.root}>
      <span onClick={() => hideModal('showListDirectMessageModal')}>
        <FontAwesomeIcon icon={faTimesCircle} className={styles.close} />
      </span>
      <div className={styles.container}>
        <Row>
          <h1>Direct Message</h1>
        </Row>
        <Row type="flex" justify="space-between" className={styles.selectWrapper}>
          <Select
            showSearch
            mode="multiple"
            className={styles.select}
            onSearch={handleSearch}
            onChange={handleChange}
            value={selected.map((id) => id + '')}
            placeholder="find or start a conversation"
          >
            {candidates
              ? candidates.map((candidate: UserProfile, idx: number) => {
                  return (
                    <Option value={candidate.profileId + ''} key={idx}>
                      <div className={styles.selected}>
                        {/*<Avatar size={16} src={candidate.avatar} dot status={candidate.status} />*/}
                        {/*<span>{candidate.name}</span>*/}
                      </div>
                    </Option>
                  );
                })
              : null}
          </Select>
          <Button type="primary" shape="round" onClick={add}>
            Go
          </Button>
        </Row>
        <Row>
          <div style={{ marginTop: 10 }}>Recent conversations</div>
          <List
            className={styles.list}
            dataSource={filter(
              _threads,
              (th: Room) => th.name !== undefined && th.name.toLowerCase().indexOf(keyword) !== -1,
            )}
            renderItem={(th: Room, idx: number) => {
              return <Thread {...th} selected={selected} select={handleSelect} key={idx} />;
            }}
          />
        </Row>
      </div>
    </div>
  );
};

const mapStateToProps = ({ room }: any) => ({
  ...room,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  handleSelect(id: string) {
    dispatch({
      type: 'room/gotoRoom',
      payload: { id },
    });
  },

  handleChange(selected: any) {
    dispatch({
      type: 'room/setSelected',
      payload: { selected },
    });
  },

  add() {
    dispatch({
      type: 'room/addThread',
    });
  },
});

const Connected = connect(mapStateToProps, mapDispatchToProps)(ListDirectMessage);

export default WithModalConnect(Connected);
