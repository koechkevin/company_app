import { IconDefinition } from '@fortawesome/pro-light-svg-icons';

export interface Payload {
  title?: string;
  statusIcon: IconDefinition;
  iconColor: string;
  jobPosition: string;
  chatRoomStatus?: string;
  isManyUsers: boolean;
}
