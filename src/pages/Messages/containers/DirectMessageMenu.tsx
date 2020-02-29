import { ChannelMenu, Icon } from '@aurora_app/ui-library';
import { ChannelItem } from '@aurora_app/ui-library/lib/Menu';
import { ChatStatus } from '@aurora_app/ui-library/lib/utils';
import { faPlus } from '@fortawesome/pro-light-svg-icons';
import { faCircle as faCircleOutline, IconDefinition } from '@fortawesome/pro-regular-svg-icons';
import { faCircle } from '@fortawesome/pro-solid-svg-icons';
import { connect } from 'dva';
import { find, includes } from 'lodash';
import React, { FC } from 'react';

import { Dispatch } from '../../../models/dispatch';
import { UserProfile } from '../../../models/user';
import { ChannelTypes, ChatColors } from '../../../utils/constants';
import { dmUsers, getCurrentUser, hasCandidateUser } from '../../../utils/utils';
import { Room } from '../models/typed';

import styles from './DirectMessageMenu.module.scss';

interface Props {
  rooms: Room[];
  dispatch: Dispatch;
  profile: UserProfile;
  userProfiles: UserProfile[];
  showAddModal: () => void;
  hideThread: (item: ChannelItem) => void;
}

const prepareRooms = (rooms: Room[], userProfiles: UserProfile[], profile: UserProfile): Room[] => {
  return rooms
    .filter((room: Room) => {
      const unhidden = !room.isHidden;
      const notDrafted = !room.isDrafted;
      const dmsAndSelfs =
        room.type === ChannelTypes.DirectMessage ||
        room.type === ChannelTypes.SelfMessage ||
        room.type === ChannelTypes.ChatBotMessage;
      return unhidden && notDrafted && dmsAndSelfs;
    })
    .map((room: Room) => {
      const isMyAccount: boolean = room.type === ChannelTypes.SelfMessage;
      const isChatbot: boolean = room.type === ChannelTypes.ChatBotMessage;
      const members: UserProfile[] = userProfiles
        ? userProfiles.filter((item) => {
            return item.profileId !== profile.profileId && includes(room.members, item.profileId);
          })
        : [];
      const roomName: string = members.map((profile) => getCurrentUser(profile)).join(', ');
      const dmProfiles = dmUsers(members, profile);

      let tooltip = isMyAccount ? getCurrentUser(profile) + ' (me)' : '';
      if (members.length > 1) {
        tooltip = roomName;
      }

      let icon: IconDefinition = faCircleOutline;
      let iconColor: ChatColors = ChatColors.OfflineGray;

      if (isChatbot) {
        iconColor = ChatColors.ChatBotBlue;
        icon = faCircle;
      }

      if (isMyAccount || (dmProfiles && dmProfiles.chatStatus === ChatStatus.online)) {
        icon = faCircle;
        iconColor = ChatColors.OnlineGreen;
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
        iconWidth: 11,
        iconHeight: 11,
        removable: !isMyAccount && !isChatbot,
        name: isMyAccount ? 'Notes (me)' : roomName,
        path: `/app/channel/${room.id}`,
        count: members.length > 1 ? members.length : undefined,
        hasACandidate: hasCandidateUser(members),
      };
    });
};

const DirectMessageMenu: FC<Props> = (props) => {
  const { rooms, hideThread, showAddModal, profile, userProfiles } = props;
  const list: Room[] = rooms ? prepareRooms(rooms, userProfiles, profile) : [];

  const botMsg: Room | undefined = find(list, (item) => item.type === ChannelTypes.ChatBotMessage);
  const selfMsg: Room | undefined = find(list, (item) => item.type === ChannelTypes.SelfMessage);

  const teamChats: Room[] = list
    .filter(
      (item) =>
        item.type !== ChannelTypes.ChatBotMessage && item.type !== ChannelTypes.SelfMessage && !item.hasACandidate,
    )
    .slice(0, 8);

  const candidateChats: Room[] = list
    .filter(
      (item) =>
        item.type !== ChannelTypes.ChatBotMessage && item.type !== ChannelTypes.SelfMessage && item.hasACandidate,
    )
    .slice(0, 10);

  let updatedList: Room[] = [];

  if (list.length) {
    if (botMsg) {
      updatedList.push(botMsg);
    }
    if (selfMsg) {
      updatedList.push(selfMsg);
    }
    updatedList = [...updatedList, ...teamChats];
  }

  return (
    <>
      {/* contains chats with only company users */}
      <ChannelMenu
        title="Team"
        titleButton={<Icon icon={faPlus} className={styles.addIcon} onClick={showAddModal} />}
        list={updatedList}
        onRemove={hideThread}
      />
      {/* contains all chats that has a candidate user */}
      <ChannelMenu
        title="Applicants"
        titleButton={<Icon icon={faPlus} className={styles.addIcon} onClick={showAddModal} />}
        list={candidateChats}
        onRemove={hideThread}
        className={styles.menu}
      />
    </>
  );
};

const mapStateToProps = ({ global, room, profile }: any) => ({
  ...room,
  profile: global.profile,
  userProfiles: profile.profiles,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  showAddModal() {
    dispatch({ type: 'room/setSelected', payload: { selected: [] } });
    dispatch({
      type: 'common/showOrHideModal',
      modal: 'showAddDirectMessageModal',
      payload: true,
    });
  },

  hideThread(item: ChannelItem) {
    dispatch({
      type: 'room/hideRoomView',
      payload: item.id,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(DirectMessageMenu);
