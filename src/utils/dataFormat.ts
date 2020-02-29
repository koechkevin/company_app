import { ChatStatus } from '@aurora_app/ui-library/lib/utils';

import { FileModel } from '../models/file';
import { UserProfile } from '../models/user';
import { Message, Room } from '../pages/Messages/models/typed';
import { getCurrentUser } from '../utils/utils';

export const statusAssign = (onlineIds: string[], profiles: UserProfile[]) => {
  return profiles.map((element) => ({
    ...element,
    chatStatus: onlineIds.includes(element.profileId) ? ChatStatus.online : ChatStatus.offline,
  }));
};

// Function handles setting of the currently typing users in room
export const typingStatusAssign = ({ isTyping, profileId, roomId }: any, room: Room): Room => {
  if (room.id === roomId) {
    // If someone already typing in the room
    if (room.typing) {
      // If it is the beginning of typing, and we need to add profile id to the array
      if (isTyping) {
        return {
          ...room,
          typing: !room.typing.includes(profileId) ? [...room.typing, profileId] : room.typing,
        };
      }

      // If it is finish of typing, and we need to remove profile id from the array
      return {
        ...room,
        typing: room.typing.filter((profile) => profile !== profileId),
      };
    }
    // If user is the first one who starts typing
    if (isTyping) {
      return {
        ...room,
        typing: [profileId],
      };
    }
  }

  return room;
};

interface Msg {
  id: string;
  roomId: string;
  file?: FileModel;
  message: string;
  forwarding?: Msg;
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
  updatedMessage?: Date;
  isDeleted: boolean;
  read?: string[];
  threadInformation: { count: number; authors: string[]; lastMessageAt: Date };
}

export const msgConverter = (msg: Msg): Message => {
  return {
    id: msg.id,
    roomId: msg.roomId,
    type: 'Normal',
    file: msg.file,
    text: msg.message,
    forwarding: msg.forwarding ? msgConverter(msg.forwarding) : null,
    createdAt: msg.createdAt || new Date(),
    updatedAt: msg.updatedAt || new Date(),
    replies: [],
    author: msg.createdBy,
    editable: false,
    isModified: Boolean(msg.updatedMessage),
    isDeleted: msg && msg.isDeleted,
    read: msg.read,
    threadInfo: msg.threadInformation
      ? {
          count: msg.threadInformation.count,
          authors: msg.threadInformation.authors,
          lastMessageAt: msg.threadInformation.lastMessageAt,
        }
      : null,
  };
};

/**
 * Format room members data
 * @param {Room} room
 * @param {UserProfile[]} profiles
 * @returns {Room}
 */
export const formatRoomMembers = (room: Room, profiles: UserProfile[]): Room => {
  let members: UserProfile[] = [];

  if (room.members && room.members.length && typeof room.members[0] === 'string') {
    members = room.members.map((profileId: string) => {
      const userProfile = profiles.find((item) => item.profileId === profileId);

      return {
        ...userProfile,
        name: userProfile ? getCurrentUser(userProfile) : '',
      };
    });
    room.members = members;
  }

  return room;
};
