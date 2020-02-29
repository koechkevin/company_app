import { ChannelMenu } from '@aurora_app/ui-library';
import { ChatStatus } from '@aurora_app/ui-library/lib/utils';
import { faPencil } from '@fortawesome/pro-light-svg-icons';
import { faCircle as faCircleOutline, IconDefinition } from '@fortawesome/pro-regular-svg-icons';
import { faCircle } from '@fortawesome/pro-solid-svg-icons';
import { connect } from 'dva';
import { includes } from 'lodash';
import React, { FC } from 'react';
import { UserProfile } from '../../../models/user';

import { ChannelTypes, ChatColors } from '../../../utils/constants';
import { dmUsers, getCurrentUser } from '../../../utils/utils';
import { Room } from '../models/typed';

interface Props {
  rooms: Room[];
  currentRoom: Room;
  profile: UserProfile;
  userProfiles: UserProfile[];
}

const prepareRooms = (rooms: Room[], currentRoom: Room, userProfiles: UserProfile[], profile: UserProfile): Room[] => {
  return rooms
    .filter((room: Room) => room.isDrafted)
    .map((room: Room) => {
      const isMyAccount: boolean = room.type === ChannelTypes.SelfMessage;
      const isChatbot: boolean = room.type === ChannelTypes.ChatBotMessage;
      const isCurrent: boolean = currentRoom && room.id === currentRoom.id;
      const members: UserProfile[] = userProfiles
        ? userProfiles.filter((item) => {
            return item.profileId !== profile.profileId && includes(room.members, item.profileId);
          })
        : [];
      const roomName: string = members.map((profile) => getCurrentUser(profile)).join(', ');
      const dmProfiles = dmUsers(members, profile);
      const isOnline: boolean = dmProfiles && dmProfiles.chatStatus === ChatStatus.online;

      let tooltip: string = isMyAccount ? getCurrentUser(profile) + ' (me)' : '';
      if (members.length > 1) {
        tooltip = roomName;
      }

      let icon: IconDefinition = faPencil;
      let iconSize: number = 16;
      let iconColor: ChatColors = ChatColors.OfflineGray;
      if (isCurrent) {
        iconSize = 11;

        if (isOnline || isMyAccount) {
          iconColor = ChatColors.OnlineGreen;
          icon = faCircle;
        } else {
          icon = faCircleOutline;
        }
        if (isChatbot) {
          iconColor = ChatColors.ChatBotBlue;
          icon = faCircle;
        }
      }
      let isTyping: boolean = false;
      if (room.typing && room.typing.filter((member) => member !== profile.profileId).length) {
        isTyping = true;
      }

      return {
        ...room,
        icon,
        tooltip,
        isTyping,
        iconColor,
        lock: false,
        iconWidth: iconSize,
        iconHeight: iconSize,
        removable: !isMyAccount && !isChatbot,
        name: isMyAccount ? 'Notes (me)' : roomName,
        path: `/app/channel/${room.id}`,
        count: members.length > 1 && isCurrent ? members.length : undefined,
      };
    });
};

const DraftMenu: FC<Props> = (props) => {
  const { rooms, currentRoom, profile, userProfiles } = props;
  // Todo: job applied channels
  const list: Room[] = rooms ? prepareRooms(rooms, currentRoom, userProfiles, profile) : [];
  return <>{list.length ? <ChannelMenu title="Drafts" list={list} /> : null}</>;
};

const mapStateToProps = ({ global, room, profile }: any) => ({
  rooms: room.rooms,
  currentRoom: room.room,
  profile: global.profile,
  userProfiles: profile.profiles,
});

export default connect(mapStateToProps)(DraftMenu);
