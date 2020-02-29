import { Avatar, Button, Filter, ListItem, Menu, Title, UserListItem } from '@aurora_app/ui-library';
import { Col, Input, List, Menu as AntdMenu, Row } from 'antd';
import { connect } from 'dva';
import { get } from 'lodash';
import React, { FC, useEffect, useState } from 'react';

import { Dispatch } from '../../../models/dispatch';
import { ProfilesPagination } from '../../../models/profile';
import { CompanyProfile } from '../../../models/user';
import { PageInfo } from '../../../utils/pageHelper/PageInfo';
import { getProfileDepartments, getProfileFullName } from '../../../utils/utils';
import { InviteUser, MoreMenu } from './components';

import styles from './Members.module.scss';

interface Props {
  history: any;
  loading: boolean;
  companyProfiles: CompanyProfile[];
  profilesPagination: ProfilesPagination;
  fetchCompanyProfiles: (pageInfo?: PageInfo) => void;
}

const { Item } = AntdMenu;

const filterOptions = [
  {
    name: 'Member',
    selected: 'John Doe',
    overlay: (
      <Menu className={styles.overlay}>
        <Item>
          <Input placeholder="Search" className={styles.search} />
        </Item>
        <Item>All</Item>
        <Item>
          <Row type="flex">
            <Col>
              <Avatar size={30}>
                <span />
              </Avatar>
            </Col>
            <Col style={{ alignSelf: 'center', marginLeft: 6 }}>John Doe</Col>
          </Row>
        </Item>
      </Menu>
    ),
  },
];

const Members: FC<Props> = (props) => {
  const { companyProfiles, loading, fetchCompanyProfiles, profilesPagination } = props;
  const [modalOpen, setModalOpen] = useState<boolean>(false);

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

  return (
    <>
      <ListItem
        className={styles.title}
        style={{ padding: '5px 16px' }}
        leading={<Title level={4}>Team Members</Title>}
        trailing={
          <Button onClick={() => setModalOpen(true)} type="primary" shape="round">
            Invite people
          </Button>
        }
      />
      <Row className={styles.search}>
        <Filter filterOptions={filterOptions} query={{ location: 'San Francisco' }} onSearch={() => {}} />
      </Row>
      <List
        split={false}
        loading={loading}
        dataSource={companyProfiles}
        className={styles.list}
        renderItem={(member: CompanyProfile) => (
          <UserListItem
            email={get(member, 'email')}
            status={get(member, 'chatStatus')}
            name={getProfileFullName(member)}
            signature={get(member, 'signature')}
            roles={[get(member, 'profile.role')]}
            isInvited={member.status === 'inactive'}
            department={getProfileDepartments(member)}
            avatarColor={get(member, 'profile.avatarColor')}
            avatarUrl={get(member, 'signedAvatar.signedUrl')}
            dropdownProps={{
              trigger: ['click'],
              overlay: <MoreMenu profileId={member.profileId} />,
            }}
          />
        )}
      />
      <InviteUser visible={modalOpen} onCancel={() => setModalOpen(false)} />
    </>
  );
};

const mapStateToProps = ({ loading, profile }: any) => ({
  loading: loading.effects['profile/fetchCompanyProfiles'],
  companyProfiles: profile.companyProfiles,
  profilesPagination: profile.pagination,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchCompanyProfiles(pageInfo?: PageInfo) {
    dispatch({
      type: 'profile/fetchCompanyProfiles',
      payload: { pageInfo },
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Members);
