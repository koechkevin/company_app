import { faTimesCircle } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, List, Row, Select, Tabs } from 'antd';
import { connect } from 'dva';
import { debounce, get } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';

import { WithModalConnect } from '../../../components';
import { Dispatch } from '../../../models/dispatch';
import { ProfilesPagination } from '../../../models/profile';
import { CandidateProfile, CompanyProfile, UserProfile } from '../../../models/user';
import { PageInfo } from '../../../utils/pageHelper/PageInfo';
import { getCurrentUser } from '../../../utils/utils';
import { Candidate } from '../components';

import styles from './AddDirectMessage.module.scss';

const { Option } = Select;
const { TabPane } = Tabs;

interface Props {
  profiles: UserProfile[];
  companyProfiles: CompanyProfile[];
  candidateProfiles: CandidateProfile[];
  profilesPagination: ProfilesPagination;
  selected: string[];
  add: () => void;
  fetchCandidates: () => void;
  hideModal: (modal: string) => void;
  handleSelect: (id: string) => void;
  handleChange: (selected: any) => void;
  fetchCandidateProfiles: (pageInfo?: PageInfo) => void;
  fetchCompanyProfiles: (pageInfo?: PageInfo) => void;
}

const AddDirectMessage: React.FC<Props> = (props) => {
  const {
    add,
    selected,
    profiles,
    hideModal,
    handleChange,
    handleSelect,
    companyProfiles,
    candidateProfiles,
    fetchCandidateProfiles,
    fetchCompanyProfiles,
    profilesPagination,
  } = props;
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchCandidateProfiles();
  }, [fetchCandidateProfiles]);

  useEffect(() => {
    if (profilesPagination) {
      const { candidateProfiles } = profilesPagination;
      const currentPage = candidateProfiles.getCurrentPage();
      const pageCount = candidateProfiles.getPageCount();

      if (currentPage < pageCount) {
        fetchCandidateProfiles(candidateProfiles.jumpPage(currentPage + 1));
      }
    }
  }, [fetchCandidateProfiles, profilesPagination]);

  useEffect(() => {
    fetchCompanyProfiles();
  }, [fetchCompanyProfiles]);

  useEffect(() => {
    if (profilesPagination) {
      const { companyProfiles } = profilesPagination;
      const currentPage = companyProfiles.getCurrentPage();
      const pageCount = companyProfiles.getPageCount();

      if (currentPage < pageCount) {
        fetchCompanyProfiles(companyProfiles.jumpPage(currentPage + 1));
      }
    }
  }, [fetchCompanyProfiles, profilesPagination]);

  const renderOptions = useCallback(() => {
    let options = profiles;
    if (search) {
      options = profiles.filter((userProfile) => {
        const re = new RegExp(search, 'gi');
        return getCurrentUser(userProfile).match(re);
      });
    }

    return options.map((userProfile, idx) => (
      <Option value={userProfile.profileId + ''} key={idx} title={getCurrentUser(userProfile)}>
        <div className={styles.selected}>
          <span>{getCurrentUser(userProfile)}</span>
        </div>
      </Option>
    ));
  }, [profiles, search]);

  const onSearch = debounce((text: string) => setSearch(text), 400);
  const onChange = (value: string[]): void => {
    setSearch('');
    handleChange(value);
  };

  return (
    <div className={styles.root}>
      <span onClick={() => hideModal('showAddDirectMessageModal')}>
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
            onSearch={onSearch}
            onChange={onChange}
            filterOption={false}
            className={styles.select}
            onBlur={() => setSearch('')}
            value={selected.map((id) => id + '')}
            placeholder="Start typing e.g. john, administrator or @johnsimms"
          >
            {renderOptions()}
          </Select>
          <Button type="primary" shape="round" onClick={add}>
            Go
          </Button>
        </Row>
        <Row>
          <Tabs defaultActiveKey="candidates">
            <TabPane tab="Team" key="team">
              <List />
            </TabPane>
            <TabPane tab="Company Users" key="company-users">
              <List
                className={styles.list}
                dataSource={companyProfiles}
                renderItem={(companyProfile, idx) => {
                  return (
                    <Candidate
                      key={`company-user-${idx}`}
                      profileId={companyProfile.profileId}
                      name={`${companyProfile.firstname} ${companyProfile.lastname}`}
                      avatarShape={'circle'}
                      avatarColor={get(companyProfile, 'profile.avatarColor', '#ccc')}
                      signature={companyProfile.signature}
                      inCall={get(companyProfile, 'profile.inCall', false)}
                      selected={selected}
                      select={handleSelect}
                    />
                  );
                }}
              />
            </TabPane>
            <TabPane tab="Candidates" key="candidates">
              <List
                className={styles.list}
                dataSource={candidateProfiles}
                renderItem={(candidateProfile, idx) => {
                  return (
                    <Candidate
                      key={`candidate-${idx}`}
                      profileId={candidateProfile.profileId}
                      name={`${candidateProfile.firstname} ${candidateProfile.lastname}`}
                      avatarColor={get(candidateProfile, 'profile.avatarColor', '#ccc')}
                      inCall={get(candidateProfile, 'profile.inCall', false)}
                      avatarShape={'square'}
                      selected={selected}
                      select={handleSelect}
                    />
                  );
                }}
              />
            </TabPane>
          </Tabs>
        </Row>
      </div>
    </div>
  );
};

const mapStateToProps = ({ room, profile }: any) => ({
  ...room,
  profiles: profile.profiles,
  companyProfiles: profile.companyProfiles,
  candidateProfiles: profile.candidateProfiles,
  profilesPagination: profile.pagination,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchCandidateProfiles(pageInfo?: PageInfo) {
    dispatch({
      type: 'profile/fetchCandidateProfiles',
      payload: { pageInfo },
    });
  },

  fetchCompanyProfiles(pageInfo?: PageInfo) {
    dispatch({
      type: 'profile/fetchCompanyProfiles',
      payload: { pageInfo },
    });
  },

  handleSelect(id: string) {
    dispatch({
      type: 'room/select',
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
    dispatch({ type: 'room/addRoom' });
  },
});

const Connected = connect(mapStateToProps, mapDispatchToProps)(AddDirectMessage);

export default WithModalConnect(Connected);
