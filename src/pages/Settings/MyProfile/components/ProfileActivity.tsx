import { Avatar, Icon, InputCard, ListItem } from '@aurora_app/ui-library';
import { faCalendar } from '@fortawesome/pro-light-svg-icons';
import React, { FC } from 'react';

const ProfileActivity: FC<any> = (props) => {
  return (
    <InputCard style={{ padding: '8px 8px 16px', marginTop: 24 }}>
      <ListItem
        title="Profile Activity"
        style={{ marginBottom: 8, padding: '12px 8px' }}
        leading={<Icon icon={faCalendar} />}
      />
      <ListItem
        title="Edited by Emile Clark"
        description="4 Jan 2020, 3:33 PM"
        leading={
          <Avatar size={40} style={{ fontWeight: 'bold', fontSize: 18 }} color="#5D85CE" src="">
            EC
          </Avatar>
        }
      />
      <ListItem
        title="Created by Emile Clark"
        description="1 Jan 2020, 1:33 PM"
        leading={
          <Avatar size={40} style={{ fontWeight: 'bold', fontSize: 18 }} color="#5D85CE" src="">
            EC
          </Avatar>
        }
      />
    </InputCard>
  );
};

export default ProfileActivity;
