import {
  DateDivisionLine,
  MessageEditableItem,
  MessageItem,
  MessageTextualItem,
  NewMessageDivider,
} from '@aurora_app/ui-library';
import { uniq } from 'lodash';
import React, { FC } from 'react';

import { FileModel } from '../../../../models/file';
import { UserProfile } from '../../../../models/user';
import { getCurrentUser } from '../../../../utils/utils';
import { FormattedMessage, Message } from '../../models/typed';

import hoverMenuRender from './HoverMenuRender';
import PrivateMessageItem from './PrivateMessageItem';

interface Props {
  profile: UserProfile;
  message: FormattedMessage;
  onDownload: (file: FileModel) => void;
  startThread: (messageId: string) => void;
  setEditable: (message: Message) => void;
  unsetEditable: (messageId: string) => void;
  setRemovable: (message: Message) => void;
  setShareable: (message: Message) => void;
  onCancel: (message: Message, file: FileModel) => void;
  updateMessage: (messageId: string) => (text: string) => void;
}

const MessageItemRender: FC<Props> = (props) => {
  const {
    profile,
    message,
    onCancel,
    onDownload,
    startThread,
    setEditable,
    unsetEditable,
    setRemovable,
    setShareable,
    updateMessage,
  } = props;
  const { threadInfo, repeated, divided, createdAt, type, editable, unReadMessage } = message;
  const author = message.author;

  author.name = getCurrentUser(author);

  if (threadInfo && threadInfo.authors) {
    threadInfo.authors = uniq(threadInfo.authors);
  }

  let timeLine = <span />;
  let unreadLine = <span />;

  if (divided) {
    timeLine = <DateDivisionLine dateTime={new Date(createdAt)} />;
  }
  if (unReadMessage) {
    unreadLine = <NewMessageDivider />;
  }

  let component = null;

  if (type === 'PRIVATE') {
    component = <PrivateMessageItem {...message} />;
  }

  if (editable) {
    component = <MessageEditableItem cancel={unsetEditable} save={updateMessage(message.id)} {...message} />;
  } else {
    if (repeated) {
      component = (
        <MessageTextualItem
          author={author}
          menuShown={true}
          onDownload={onDownload}
          onCancel={(file: FileModel) => onCancel(message, file)}
          poppedMenu={hoverMenuRender(message, profile, startThread, setEditable, setRemovable, setShareable)}
          {...message}
        />
      );
    } else {
      component = (
        <MessageItem
          author={author}
          menuShown={true}
          onDownload={onDownload}
          startThread={startThread}
          onCancel={(file: FileModel) => onCancel(message, file)}
          poppedMenu={hoverMenuRender(message, profile, startThread, setEditable, setRemovable, setShareable)}
          {...message}
        />
      );
    }
  }

  return (
    <>
      {unreadLine}
      {timeLine}
      {component}
    </>
  );
};

export default MessageItemRender;
