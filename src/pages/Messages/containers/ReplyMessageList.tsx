import {
  HoverMenu,
  MessageDeleteModal,
  MessageEditableItem,
  MessageItem,
  MoreActionsMenu,
} from '@aurora_app/ui-library';
import { faLink, faPencil, faTrash } from '@fortawesome/pro-regular-svg-icons';
import { List } from 'antd';
import React, { createRef, FC, useEffect, useState } from 'react';

import { WithModalConnect } from '../../../components';
import { messageFormat } from '../../../utils';
import { formatMsgMenu } from '../../../utils/utils';

import { UserProfile } from '../../../models/user';
import { FormattedMessage, Message, Room } from '../models/typed';

import styles from './MessageList.module.scss';

interface Props {
  loading: boolean;
  anchor?: any;
  threads?: Room[];
  messages?: Message[];
  profile: UserProfile;
  profiles: UserProfile[];
  showMessageForwardModal: boolean;
  showReplyMessageDeleteModal: boolean;
  hideModal: (modal: string) => void;
  showModal: (modal: string) => void;
  setEditable: (message: Message) => void;
  unsetEditable: (messageId: string) => void;
  deleteMessage: (messageId: string) => void;
  updateMessage: (messageId?: string) => (text: string) => void;
  forwardMessage: (threadId: string, messageId: string, text: string) => void;
}

interface HoverMenuProps {
  item: Message;
  profile: UserProfile;
  setEditable: (message: Message) => void;
  setRemovable: (message: Message) => void;
  setShareable: (message: Message) => void;
}

const hoverMenuRender = ({
  item,
  profile,
  setEditable,
  setShareable,
  setRemovable,
}: HoverMenuProps): React.ReactNode => {
  const menu = formatMsgMenu(profile, setEditable, faTrash, setRemovable, faLink, faPencil, setShareable, item);

  return <HoverMenu actionMenu={<MoreActionsMenu message={item} menu={menu} isResponsive={true} />} />;
};

const MessageItemRender = (
  item: any,
  profile: UserProfile,
  setEditable: (message: Message) => void,
  unsetEditable: (messageId: string) => void,
  setRemovable: (message: Message) => void,
  setShareable: (message: Message) => void,
  updateMessage: (messageId?: string) => (text: string) => void,
) => {
  const { editable } = item;
  let message = null;

  if (editable) {
    message = <MessageEditableItem cancel={unsetEditable} save={updateMessage(item.id)} {...item} />;
  } else {
    message = (
      <div className={styles.normal}>
        <MessageItem
          menuShown={true}
          poppedMenu={hoverMenuRender({
            item,
            profile,
            setEditable,
            setRemovable,
            setShareable,
          })}
          {...item}
        />
      </div>
    );
  }
  return <>{message}</>;
};

export const ReplyMessageList: FC<Props> = (props) => {
  const {
    anchor,
    loading,
    messages,
    profile,
    profiles,
    hideModal,
    showModal,
    setEditable,
    unsetEditable,
    updateMessage,
    deleteMessage,
    showReplyMessageDeleteModal,
  } = props;

  const [id, setId] = useState('');
  const [message, setMessage] = useState<any>();
  const setRemovable = (message: Message) => {
    message && message.id && setId(message.id);
    message && setMessage(message);
    showModal('showReplyMessageDeleteModal');
  };

  const setShareable = (message: Message) => {
    message && message.id && setId(message.id);
    showModal('showMessageForwardModal');
  };

  const refs = messages
    ? messages.reduce((acc, { id }) => {
        id && (acc[id] = createRef());
        return acc;
      }, {})
    : {};

  useEffect(() => {
    if (anchor && refs[anchor]) {
      const el = refs[anchor].current;
      el.scrollIntoView({
        block: 'center',
        behavior: 'instant',
      });
    }
  }, [refs, anchor]);

  return (
    <>
      <List
        loading={loading}
        split={false}
        dataSource={messageFormat(messages, profiles, profile)}
        className={styles.messageList}
        renderItem={(item: FormattedMessage) => {
          return (
            <div
              key={item.id}
              className={item.id === anchor ? styles.highlighted : ''}
              ref={item && refs && item.id ? refs[item.id] : ''}
            >
              {MessageItemRender(item, profile, setEditable, unsetEditable, setRemovable, setShareable, updateMessage)}
            </div>
          );
        }}
      />
      <MessageDeleteModal
        message={message}
        visible={showReplyMessageDeleteModal}
        onOk={() => {
          deleteMessage(id);
          hideModal('showReplyMessageDeleteModal');
        }}
        onCancel={() => hideModal('showReplyMessageDeleteModal')}
      />
    </>
  );
};

export default WithModalConnect(ReplyMessageList);
