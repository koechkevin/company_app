import { HoverMenu, MoreActionsMenu, StartThreadMenu } from '@aurora_app/ui-library';
import { faLink, faPencil, faTrash } from '@fortawesome/pro-regular-svg-icons';
import React from 'react';

import { formatMsgMenu } from '../../../../utils/utils';

import { UserProfile } from '../../../../models/user';
import { Message } from '../../models/typed';

export default (
  item: Message,
  profile: UserProfile,
  startThread: (messageId: string) => void,
  setEditable: (message: Message) => void,
  setRemovable: (message: Message) => void,
  setShareable: (message: Message) => void,
): React.ReactNode => {
  const menu = formatMsgMenu(profile, setEditable, faTrash, setRemovable, faLink, faPencil, setShareable, item);

  return (
    <HoverMenu
      startThreadMenu={<StartThreadMenu messageId={item.id} startThread={startThread} />}
      actionMenu={<MoreActionsMenu message={item} menu={menu} isResponsive={true} />}
    />
  );
};
