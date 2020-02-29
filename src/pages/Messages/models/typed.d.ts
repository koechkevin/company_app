import { IconDefinition } from '@fortawesome/pro-light-svg-icons';

import { FileModel } from '../../../models/file';
import { UserProfile } from '../../../models/user';

export interface Room {
  id: string;
  jobId?: string;
  name?: string;
  type?: string;
  currentUser?: string;
  messages?: Message[];
  members?: any;
  isHidden?: boolean;
  draft?: string;
  draftId?: string;
  isDrafted?: boolean;
  createdBy?: string; // user id
  createdAt?: Date;
  updatedAt?: Date;
  draftThreadId?: string;
  companyId?: string;
  isMyAccount?: boolean;
  lock?: boolean;
  iconHeight?: number;
  iconWidth?: number;
  icon?: IconDefinition;
  iconColor?: string | null;
  tooltip?: string;
  typing?: string[];
  status?: string;
  hasACandidate?: boolean;
}

export interface Draft {
  createdBy?: string;
  id?: string;
  message?: string;
  roomId?: string;
  threadId?: string; // the id of message being replied on (messageId)
}

export interface Channel extends Thread {
  // Thread
  desc: string;
  pipelines: any[];
  starred: boolean;
  locked: boolean;
  statistic: any;
  author: UserProfile;
}

export enum CandidateTag {
  draft = 'Draft',
  temp = 'Temp',
  new = 'New',
  topMatch = 'Top Match',
}

export interface Pipeline {
  name: string;
  count: number;
  candidates: UserProfile[];
}

export interface ThreadInfoProps {
  count: number;
  authors: any[];
  lastMessageAt: Date;
}

export interface Message {
  id: string;
  roomId?: string;
  fileId?: string;
  file?: FileModel;
  forwarding?: Message | null;
  type?: string;
  author?: string | UserProfile;
  text?: string;
  replies: Message[];
  editable?: boolean;
  threadInfo?: ThreadInfoProps | null;
  updatedAt: Date;
  createdAt: Date;
  isModified?: boolean;
  draftId?: string;
  draftText?: string;
  isDeleted?: boolean;
  read?: string[];
  unReadMessage?: boolean;
}

export interface FormattedMessage extends Message {
  author: any;
  divided: boolean;
  repeated: boolean;
}
