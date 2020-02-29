import { Icon, Loading, Title } from '@aurora_app/ui-library';
import { faChevronDown } from '@fortawesome/pro-light-svg-icons';
import { Row } from 'antd';
import { connect } from 'dva';
import React, { FC, useEffect } from 'react';
import { useMedia } from 'react-use';

import { CompanyProfile } from '../../../models/user';
import { AccountInformation, Dates, TimeZone, UserDetail } from './components';

import styles from './MyProfile.module.scss';

interface Props extends CompanyProfile {
  profileId: string;
  loading: boolean;
  fetchTimezones: () => void;
  fetchCompanyLocations: () => void;
  fetchCompanyProfile: (id: string) => void;
}

const MyProfile: FC<Props> = (props) => {
  const { fetchCompanyProfile, profileId, loading, fetchTimezones, fetchCompanyLocations } = props;
  const isMobile: boolean = useMedia('(max-width: 575px)');

  useEffect(() => {
    fetchTimezones();
    fetchCompanyLocations();
  }, [fetchTimezones, fetchCompanyLocations]);

  useEffect(() => {
    if (profileId) {
      fetchCompanyProfile(profileId);
    }
  }, [profileId, fetchCompanyProfile]);

  if (loading) {
    return <Loading spinning />;
  }

  return (
    <Row className={styles.myProfile}>
      <Row className={styles.header} type="flex" justify="space-between" align="middle">
        <Title className={styles.title} level={4}>
          {isMobile ? 'Profile Overview' : 'Your Profile'}
        </Title>
        {isMobile && <Icon icon={faChevronDown} />}
      </Row>
      <Row style={{ paddingTop: 24 }}>
        <UserDetail />
        <AccountInformation />
        <TimeZone />
        <Dates />
      </Row>
    </Row>
  );
};

const mapStateToProps = ({ global, loading }: any) => ({
  ...global.profile.profile,
  loading: loading.effects['profile/fetchCompanyProfile'],
});

const mapDispatchToProps = (dispatch: any) => ({
  fetchCompanyProfile: (profileId: string) => {
    dispatch({ type: 'profile/fetchCompanyProfile', payload: { profileId } });
  },

  fetchTimezones: () => dispatch({ type: 'common/getTimezones' }),

  fetchCompanyLocations: (params?: any) => {
    dispatch({ type: 'common/fetchCompanyLocations', payload: { params } });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(MyProfile);
