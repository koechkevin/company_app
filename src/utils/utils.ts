import { ChatStatus } from '@aurora_app/ui-library/lib/utils';
import { faPencil } from '@fortawesome/pro-light-svg-icons';
import { faCircle as faCircleOutline } from '@fortawesome/pro-regular-svg-icons';
import { faCheck, faCircle, faHourglassStart, faPause, IconDefinition } from '@fortawesome/pro-solid-svg-icons';
import { differenceInMinutes } from 'date-fns';
import { find, get } from 'lodash';
import includes from 'lodash/includes';
import isEqual from 'lodash/isEqual';
import sortBy from 'lodash/sortBy';
import moment from 'moment';
import { pathToRegexp } from 'path-to-regexp';
import { ServerEnv } from '../env';
import { CompanyDepartment } from '../models/company';
import { Payload as HeaderPayload } from '../models/header.d';
import { CandidateProfile, CompanyProfile, UserProfile } from '../models/user';
import { Job, Jobs } from '../pages/Jobs/models/typed';
import { Message, Room } from '../pages/Messages/models/typed';
import { RouteConfig } from '../routes/config';
import { ChannelTypes, ChatColors, ProductId, RolesConstants } from './constants';

/**
 * Check the array or object if is empty
 * @param {array | object} obj
 */
export function isEmpty(obj: any): boolean {
  return [Object, Array].includes((obj || {}).constructor) && !Object.entries(obj || {}).length;
}

/**
 * Transfer url to url list
 * Example:
 *  '/userinfo/2019/id' => ['/userinfo', '/useinfo/2019, '/userindo/2019/id']
 *
 * @param {string} url
 * @return {string[]}
 */
export function urlToList(url: string): string[] {
  const urlList = url.split('/').filter((i: string) => i);
  return urlList.map((item: string, index) => `/${urlList.slice(0, index + 1).join('/')}`);
}

/**
 * Recursively flatten the data
 * Example:
 *  [{path: string}, {path: string}] => {path1, path2}
 *
 * @param {array} menu
 * @return {string[]}
 */
export function getFlatMenuKeys(menu: RouteConfig[]): string[] {
  let keys: any[] = [];
  menu.forEach((item: RouteConfig) => {
    keys.push(item.path);
    if (item.routes) {
      keys = keys.concat(getFlatMenuKeys(item.routes));
    }
  });
  return keys;
}

/**
 * Recursively replace the path
 * Example:
 *  [{path: string}, {path: string}] => {path1, path2}
 *
 * @param {array} menu
 * @return {string[]}
 */
export function replacePath(menu: RouteConfig[], match: string, value: string): RouteConfig[] {
  const formated = menu;
  formated.forEach((item: RouteConfig) => {
    item.path = item.path.replace(match, value);
    if (item.routes) {
      replacePath(item.routes, match, value);
    }
  });
  return formated;
}

/**
 * Get menu matches
 * @param {string[]} flatMenuKeys
 * @return {string[]}
 */
export function getMenuMatches(flatMenuKeys: string[], path: string): string[] {
  const menus = flatMenuKeys.filter((item: string) => {
    if (!item) {
      return [];
    }
    return pathToRegexp(item).test(path);
  });
  return menus;
}

/**
 * Get default collapsed sub menus
 *
 * @param {string} pathname
 * @param {string[]} flatMenuKeys
 * @return {string[]}
 */
export function getDefaultCollapsedSubMenus(pathname: string, flatMenuKeys: string[]): string[] {
  const subMenus = urlToList(pathname)
    .map((item: string) => getMenuMatches(flatMenuKeys, item)[0])
    .filter((item: string) => item)
    .reduce((acc: any, curr: any) => [...acc, curr], ['/']);

  return subMenus;
}

/**
 * Check members if exists in threads.
 *
 * @param {Thread[]} rooms
 * @param {number} selected
 */
export function memberExistsInThreads(rooms: Room[], selected: number[]) {
  const ths: Room[] = [];

  rooms.forEach((room) => {
    const users: string[] = get(room, 'members', []);

    if (isEqual(sortBy(selected), sortBy(users))) {
      ths.push(room);
    }
  });
  return ths.length ? ths[0].id : null;
}

/**
 * Get and concat the first character of user firstName and lastName
 * @param name
 */
export const getNameInitials = (name: string) => {
  if (name) {
    const arr = name.split(' ');

    if (arr.length >= 2) {
      const str1 = arr[0].length >= 1 ? arr[0][0] : '';
      const str2 = arr[1].length >= 1 ? arr[1][0] : '';
      return `${str1}${str2}`;
    }

    return arr.length >= 1 ? arr[0] : '';
  }

  return '';
};

export enum Status {
  paused = 'paused',
  draft = 'draft',
  inReview = 'in review',
  completed = 'completed',
}

export const getCurrentUser = (userProfile: UserProfile): string => {
  let currentUser: string = '';

  if (userProfile && userProfile.profile) {
    if ('firstname' in userProfile.profile && 'lastname' in userProfile.profile) {
      currentUser = `${userProfile.profile.firstname} ${userProfile.profile.lastname}`;
    } else if ('name' in userProfile.profile) {
      currentUser = userProfile.profile.name;
    }
  }

  return currentUser;
};

export const getIcon = (status: string): IconDefinition | null => {
  switch (status && status.toLowerCase()) {
    case Status.paused:
      return faPause;
    case Status.draft:
      return faPencil;
    case Status.inReview:
      return faHourglassStart;
    case Status.completed:
      return faCheck;
    default:
      return null;
  }
};
/**
 * @description return count if more than two people in chat, else return profile for the user
 * @param {UserProfile[]} members
 * @param {UserProfile} profile
 * @returns {UserProfile | number}
 */
export const dmUsers = (members: UserProfile[] = [], profile: UserProfile): any => {
  const dmUser = members
    .filter((member: any) => member.profileId !== profile.profileId)
    .map((member: UserProfile) => member);
  return dmUser.length > 1 ? dmUser.length : dmUser[0];
};

/**
 * @description return string of users in chat separated by comma and a count if more than 3
 * @param {UserProfile[]} members
 * @param {UserProfile} profile
 * @returns {string}
 */
export const setChatHeaderTitle = (members: UserProfile[] | undefined, profile: UserProfile): string => {
  const dmUser: UserProfile[] = members
    ? members.filter((member: UserProfile) => member.profileId !== profile.profileId)
    : [];
  const count: number = dmUser.length - 3;

  return dmUser.length > 3
    ? dmUser
        .map((user: UserProfile) => getCurrentUser(user))
        .slice(0, 3)
        .join(', ') + ` and +${count} more`
    : dmUser.map((user: UserProfile) => getCurrentUser(user)).join(', ');
};

/**
 * @description returns formated time
 * @param {string} timeString in this format 2019-10-08 09:07:54 (safari unsupported)
 * @returns {string} timeString in the format 2019-10-08T09:07:54Z
 */
export const toTimeString = (timeString: string): string => `${timeString.replace(/ /g, 'T')}Z`;

export const resolveRoleName = (role: string): string => {
  let roleName: string;
  switch (role) {
    case RolesConstants.CompanyMember:
      roleName = 'Team Member';
      break;
    default:
      roleName = role.split('-').slice(-1)[0];
      break;
  }
  return roleName;
};
/**
 * @description get name initials
 * @param {string} name string
 * @returns {string} first letter in capital letters
 */

/**
 * @description returns formated time
 * @param {string} timeString in this format 2019-10-08 09:07:54 (safari unsupported)
 * @returns {string} timeString in the format 2019-10-08T09:07:54Z
 */
export const utcToLocalTime = (timeString: string, utcOffset?: string): string => {
  const offset =
    utcOffset ||
    moment()
      .utcOffset()
      .toString();
  return moment
    .utc(timeString)
    .utcOffset(+offset)
    .format('YYYY-MM-DD HH:mm:ss');
};
export const getInitials = (name: string): string => name.split('')[0].toUpperCase();

/**
 * @description returns full name of a user
 * @param {CompanyProfile | CandidateProfile} profile Profile of a user
 */
export const getProfileFullName = (profile: CompanyProfile | CandidateProfile): string => {
  return `${profile.firstname} ${profile.lastname}`;
};

/**
 * @description returns string with all company profile's departments.
 * @param {CompanyProfile} profile
 */
export const getProfileDepartments = (profile: CompanyProfile): string => {
  let departmentNames: string[] = [];

  if (profile.departments) {
    departmentNames = profile.departments.map((department: CompanyDepartment) => department.name);
  }

  return departmentNames.join(', ');
};

/**
 * @description returns menu for message item.
 * @param {UserProfile} profile
 * @param  setEditable
 * @param {IconDefinition} faTrash
 * @param setRemovable
 * @param {IconDefinition} faLink
 * @param setShareable
 * @param item
 */
export const formatMsgMenu = (
  profile: UserProfile,
  setEditable: (message: Message) => void,
  faTrash: IconDefinition,
  setRemovable: (message: Message) => void,
  faLink: IconDefinition,
  faPencil: IconDefinition,
  setShareable: (message: Message) => void,
  item: any,
): any => {
  let menu: any = [
    {
      icon: faLink,
      text: 'Forward Message',
      handler: setShareable,
    },
  ];

  const editMsg = {
    icon: faPencil,
    text: 'Edit Message',
    handler: setEditable,
  };
  const deleteMsg = {
    icon: faTrash,
    text: 'Delete Message',
    isDanger: true,
    handler: setRemovable,
  };

  const expired: boolean | undefined =
    item && item.createdAt && differenceInMinutes(new Date(), new Date(item.createdAt)) > 60;
  const isAuthor = profile?.profileId === item.author.profileId;
  const isAdmin = profile?.role === RolesConstants.CompanyAdmin || profile?.role === RolesConstants.AuroraAdmin;
  const isAuroraAdmin = profile?.role === RolesConstants.AuroraAdmin;
  const isCandidateMessage = item.author?.role === RolesConstants.Candidate;
  const isDeleted = item.isDeleted;
  /* if not admin and not the message author or
   * time is expired and user is not an admin or
   * user is admin and current message is from candidate
   *show only forward message menu(return menu)
   */
  if ((!isAdmin && !isAuthor) || (expired && !isAdmin) || (isAdmin && isCandidateMessage) || isDeleted) {
    return menu;
  } else if ((isAuthor && !expired) || (isAuroraAdmin && !expired)) {
    menu = [...menu, deleteMsg, editMsg];
  } else {
    menu = [...menu, deleteMsg];
  }

  return menu;
};

/**
 * @description returns icon
 * @param {UserProfile[]} members
 * @param {UserProfile[]} profile
 * @returns {IconDefinition} such as faCircle
 */
export const setIconType = (members: UserProfile[], profile: UserProfile): IconDefinition => {
  const chatStatus: string = dmUsers(members, profile) && dmUsers(members, profile).chatStatus;
  return chatStatus === ChatStatus.online ? faCircle : faCircleOutline;
};

/**
 * @description returns icon
 * @param {UserProfile[]} members
 * @param {UserProfile[]} profile
 * @param {Room[]} thread
 * @returns {IconDefinition} such as faCircle
 */
export const getIconType = (members: UserProfile[], profile: UserProfile, threadType?: string): IconDefinition => {
  const selfOrBotRoom: boolean = threadType === ChannelTypes.SelfMessage || threadType === ChannelTypes.ChatBotMessage;
  return selfOrBotRoom ? faCircle : setIconType(members, profile);
};

/**
 * @description returns color string
 * @param {UserProfile[]} members
 * @param {UserProfile[]} profile
 * @returns {string} such as #39c049
 */
export const setColorValue = (members: UserProfile[], profile: UserProfile): string => {
  const chatStatus: string = dmUsers(members, profile) && dmUsers(members, profile).chatStatus;
  return chatStatus === ChatStatus.online ? ChatColors.OnlineGreen : ChatColors.OfflineGray;
};

/**
 * @description returns color string
 * @param {UserProfile[]} members
 * @param {UserProfile[]} profile
 * @param {Room[]} thread
 * @returns {string} such as #39c049
 */
export const getColorValue = (members: UserProfile[], profile: UserProfile, threadType?: string): string => {
  const selfRoom: boolean = threadType === ChannelTypes.SelfMessage;
  const botRoom: boolean = threadType === ChannelTypes.ChatBotMessage;

  if (selfRoom) {
    return ChatColors.OnlineGreen;
  } else if (botRoom) {
    return ChatColors.ChatBotBlue;
  } else {
    return setColorValue(members, profile);
  }
};

/**
 * @description returns number | undefined
 * @param {UserProfile[]} members
 * @param {UserProfile[]} profile
 * @returns {string} such as #39c049
 */
export const setCountValue = (members: UserProfile[], profile: UserProfile): number | undefined =>
  dmUsers(members, profile) && typeof dmUsers(members, profile) === 'number' ? dmUsers(members, profile) : undefined;

/**
 * @description returns boolean
 * @param {UserProfile[]} members
 * @returns {boolean} true if a chatroom has candidate user in it.
 */
export const hasCandidateUser = (members: UserProfile[]): boolean =>
  members.map((member: UserProfile) => member.productId === ProductId.candidate).includes(true);

/**
 * @description returns signed avatarUrl
 * * @param {UserProfile} profile
 * @returns {string} signed url
 */
export const getAvatarUrl = (profile: UserProfile | CompanyProfile): string | undefined =>
  profile?.signedAvatar?.thumbnails[0]?.signedUrl;

/**
 * @description Creates new cookie with specified name, value and expiration time.
 * @param {string} name
 * @param {string} value
 * @param {number} expires
 * @param {boolean} setDomain
 */
export const setCookie = (name: string, value: string | null, expires: number, setDomain: boolean = true): void => {
  const serverEnv = ServerEnv();
  const domain = serverEnv.cookieDomain;

  const newCookie = [name + '=' + (value && encodeURIComponent(value)), 'path=/', 'max-age=' + expires];
  if (setDomain) {
    newCookie.push('domain=' + domain);
  }

  document.cookie = newCookie.join(';');
};

/**
 * @description Returns cookie value by name
 * @param {string} name Cookie name
 * @returns {string} Cookie value
 */
export const getCookie = (name: string): string | undefined => {
  const matches = document.cookie.match(
    new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[]\\\/+^])/g, '\\$1') + '=([^;]*)'),
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
};

/**
 * @description Deletes specified cookie
 * @param {name} name Cookie name
 */
export const deleteCookie = (name: string, setDomain: boolean = true): void => {
  setCookie(name, null, -1, setDomain);
};

/**
 * @description Returns Ids of all unread messages in chatroom
 * @param {messages} messages messages in chatroom
 * @param {profile} profile current user profile
 * @returns {string[]} IDs of all unread messages from the list
 */
export const getUnreadMessageIds = (messages: Message[], profile?: UserProfile): string[] => {
  const allUnreadIds = messages.filter((message) => !includes(message.read, profile?.profileId)).map((msg) => msg.id);
  return allUnreadIds;
};

export const headerFormat = (room: Room, profile: UserProfile, jobs: Jobs): HeaderPayload => {
  const { members, type, status, jobId } = room;
  const icon: IconDefinition = getIconType(members, profile, type);
  const title: string = setChatHeaderTitle(members, profile);
  const iconColor: string = getColorValue(members, profile, type);
  const signature: string = dmUsers(members, profile) && dmUsers(members, profile).signature;
  const isManyUsers: boolean = members && members.length > 2;
  const roomStatus = type === ChannelTypes.SelfMessage || type === ChannelTypes.ChatBotMessage ? '' : status;
  const roomTitle =
    type === ChannelTypes.SelfMessage
      ? 'Notes'
      : type === ChannelTypes.JobChannelMessage
      ? find(jobs, (job: Job) => job.jobId === jobId)?.jobTitle
      : title;

  return {
    title: roomTitle,
    statusIcon: icon,
    iconColor,
    jobPosition: signature,
    chatRoomStatus: roomStatus,
    isManyUsers,
  };
};
