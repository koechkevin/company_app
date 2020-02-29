import { Avatar } from '@aurora_app/ui-library';
import { connect } from 'dva';
import React, { FC } from 'react';

import { CompanyProfile } from '../../../models/user';
import { getAvatarUrl, getInitials } from '../../../utils/utils';

import styles from './ListItem.module.scss';

interface TeamMemberProfile extends CompanyProfile {
  profiles: any[]
}

const HiringTeamMember: FC<TeamMemberProfile> = (props) => {
  const { profiles, firstname, lastname, profileId } = props;
  const profile = profiles.find((prof: any) => prof.profileId === profileId);
  return profile ? (
    <span className={styles.avatar}>
      <Avatar
        src={getAvatarUrl(profile)}
        size={24}
        color={profile.avatarColor}
        style={{
          fontWeight: 'bold',
          fontSize: '12px',
        }}
      >
        {firstname && lastname && `${getInitials(firstname)}${getInitials(lastname)}`}
      </Avatar>
    </span>
  ) : (
    <span />
  );
};

export default connect((state: any) => ({ profiles: state.profile.profiles }))(HiringTeamMember);