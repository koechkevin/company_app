import { Icon, MessageInput, MessageItem } from '@aurora_app/ui-library';
import { faChevronLeft, faTimes } from '@fortawesome/pro-light-svg-icons';
import { faCircle } from '@fortawesome/pro-solid-svg-icons';
import { Layout, Row, Typography } from 'antd';
import { connect } from 'dva';
import { debounce, find } from 'lodash';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';

import { Dispatch } from '../../../models/dispatch';
import { UserProfile } from '../../../models/user';
import { ChatColors } from '../../../utils/constants';
import { getColorValue, getCurrentUser, getIconType } from '../../../utils/utils';
import { ReplyMessageList } from '../../Messages';
import { MessageState } from '../models/message';
import { Message, Room } from '../models/typed';

import styles from './Replies.module.scss';

let timeout: any;

interface Props {
  room: Room;
  profile: UserProfile;
  profiles: UserProfile[];
  messageAuthor: UserProfile;
  messageState: MessageState;
  resetMessage: () => void;
  fetchReplies: () => void;
  closeReply: () => void;
  send: (text: string) => void;
  setEditable: (message: Message) => void;
  unsetEditable: (messageId: string) => void;
  deleteMessage: (messageId: string) => void;
  updateTypingStatus: (isTyping: boolean, roomId: string) => void;
  updateReply: () => (messageId: string) => (text: string) => void;
  saveDraft: (threadId: string, text: string, draftThreadId: string) => void;
  deleteDraft: (threadId: string, text: string, draftId: string, draftThreadId: string) => void;
  updateDraft: (threadId: string, text: string, draftId: string, draftThreadId: string) => void;
}

const { Title } = Typography;

const Replies: FC<Props> = (props) => {
  const {
    send,
    room,
    profile,
    profiles,
    messageState,
    messageAuthor,
    fetchReplies,
    closeReply,
    saveDraft,
    updateDraft,
    deleteDraft,
    resetMessage,
    deleteMessage,
    setEditable,
    unsetEditable,
    updateReply,
    updateTypingStatus,
  } = props;

  const message = messageState.message;
  const mainMessageAuthor = messageAuthor;
  const users = room.members || [];

  const replies = message && message.replies ? message.replies : [];
  const lastUpdatedAt = replies.length ? replies[replies.length - 1].updatedAt : 0;
  const draftText = useRef(message && message.draftText);

  const messageThreadId = useRef(message && message.roomId);
  const messageDraftId = useRef(message && message.draftId);
  const messageId = useRef(message && message.id);
  const [clearId, setClearId] = useState(false);
  const checkSave = useRef(true);
  const myRef = useRef<HTMLDivElement | null>(null);

  const clearDraft = useCallback(() => {
    messageThreadId.current = '';
    messageDraftId.current = '';
    messageId.current = '';
    draftText.current = '';
  }, []);

  const saveDraftMsg = useCallback(
    (channelId: any, text: any, draftId: any, draftThreadId: any) => {
      if (text && !draftId && draftThreadId) {
        saveDraft(channelId, text, draftThreadId);
        clearDraft();
      } else if (text && draftId && channelId && draftThreadId) {
        updateDraft(channelId, text, draftId, draftThreadId);
        clearDraft();
      }
    },
    [saveDraft, updateDraft, clearDraft],
  );

  useEffect(() => {
    if (draftText.current) {
      saveDraftMsg(messageThreadId.current, draftText.current, messageDraftId.current, messageId.current);
    }
    messageThreadId.current = message && message.roomId;
    messageDraftId.current = message && message.draftId;
    messageId.current = message && message.id;
  }, [message, saveDraftMsg]);

  // save any draft message when unmount happens e.g clicking a job application
  useEffect(() => {
    return () => {
      if (checkSave.current) {
        saveDraftMsg(messageThreadId.current, draftText.current, messageDraftId.current, messageId.current);
        resetMessage();
      }
    };
  }, [resetMessage, saveDraftMsg]);

  const scrollToBottom = useCallback(() => {
    if (myRef && myRef.current) {
      myRef.current.scrollIntoView();
    }
  }, []);

  const sendMessage = (text: string) => {
    send(text);
    debouncer.cancel();
    clearDraft();
  };

  const debouncer = debounce(
    (text: string) => onChangeActions(messageThreadId.current, text, messageDraftId.current, messageId.current),
    100,
  );

  const isMessageChanged = message && message.id;

  useEffect(() => {
    if (replies.length) {
      setTimeout(scrollToBottom, 500);
    }
  }, [scrollToBottom, lastUpdatedAt, replies]);

  useEffect(() => {
    if (isMessageChanged) {
      fetchReplies();
    }
  }, [fetchReplies, isMessageChanged]);

  const onChangeActions = useCallback(
    (threadId: any, text: any, draftId: any, draftThreadId: any) => {
      if (threadId && !text && draftId && draftThreadId) {
        deleteDraft(threadId, text, draftId, draftThreadId);
        setClearId(true);
      }
      draftText.current = text;
      checkSave.current = true;

      // if not already typing, update to typing
      if (!room.typing || !room.typing.includes(profile.profileId)) {
        updateTypingStatus(true, threadId);
      }

      // when user stops typing for 1 second, update as not typing
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        updateTypingStatus(false, threadId);
      }, 1000);
    },
    [updateTypingStatus, room.typing, profile.profileId, deleteDraft],
  );

  useEffect(() => {
    if (clearId) {
      messageDraftId.current = '';
    }
  }, [deleteDraft, clearId]);

  const roomMembers =
    users &&
    users.map((member: any) => {
      if (member.profileId === profile.profileId) {
        return {
          ...member,
          name: getCurrentUser(member),
          icon: faCircle,
          iconColor: ChatColors.OnlineGreen,
        };
      }
      return {
        ...member,
        name: getCurrentUser(member),
        icon: getIconType([member], profile, room.type),
        iconColor: getColorValue([member], profile, room.type),
      };
    });

  return (
    <Layout.Content className={styles.root}>
      <Row type="flex" align="middle" className={styles.header}>
        <Icon icon={faChevronLeft} onClick={() => closeReply()} className={styles.back} />
        <Title level={4}>Thread</Title>
        <Icon icon={faTimes} hover onClick={() => closeReply()} className={styles.remove} />
      </Row>
      <Row className={styles.body}>
        {message && message.id && (
          <MessageItem
            id={message.id}
            threadInfo={null}
            text={message.text}
            parentId={message.id}
            startThread={() => null}
            author={mainMessageAuthor}
            updatedAt={message.updatedAt}
            isDeleted={message.isDeleted}
            createdAt={message.createdAt}
          />
        )}
        {message && message.id && (
          <ReplyMessageList
            profile={profile}
            profiles={profiles}
            messages={message.replies}
            setEditable={setEditable}
            unsetEditable={unsetEditable}
            updateMessage={updateReply}
            deleteMessage={deleteMessage}
          />
        )}
        <div ref={myRef} />
      </Row>
      {room && message && room.id && message.id && (
        <Row className={styles.footer}>
          <MessageInput
            key={message.id}
            hintShown={true}
            text={message.draftText}
            suggestions={roomMembers}
            onEnter={(text: string) => sendMessage(text)}
            onChange={(text: string) => debouncer(text)}
          />
        </Row>
      )}
    </Layout.Content>
  );
};

const mapStateToProps = ({ message, global, profile, room }: any) => ({
  room: room.room,
  messageState: message,
  profile: global.profile,
  profiles: profile.profiles,
  messageAuthor: find(profile.profiles, (profile) => profile.profileId === message.message.author),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchReplies() {
    dispatch({
      type: 'message/fetchReplies',
    });
  },

  saveDraft: (threadId: string, text: string, draftThreadId: string) => {
    dispatch({
      type: 'draft/createDraftMessages',
      payload: { id: threadId, message: text, draftThreadId },
    });
  },

  updateDraft: (threadId: string, text: string, draftId: string, draftThreadId: string) => {
    dispatch({
      type: 'draft/updateDraftMessages',
      payload: { id: threadId, draftId, message: text, draftThreadId },
    });
  },

  deleteDraft(threadId: string, text: string, draftId: string, draftThreadId: string) {
    dispatch({ type: 'room/draftsGroup' });
    dispatch({
      type: 'draft/deleteDraftMessages',
      payload: { id: threadId, draftId, draftThreadId },
    });
  },

  closeReply() {
    dispatch({
      type: 'message/setMessage',
      payload: { threadId: null, messageId: null },
    });
  },

  send(text: string) {
    dispatch({
      type: 'message/sendReply',
      payload: { text },
    });
  },

  resetMessage() {
    dispatch({ type: 'message/resetMessage', payload: {} });
  },

  updateTypingStatus: (isTyping: boolean, roomId: string) => {
    dispatch({
      type: 'message/updateTypingStatus',
      payload: { isTyping, roomId },
    });
  },

  deleteMessage: (messageId: string) => {
    dispatch({
      type: 'message/socketDeleteMessage',
      payload: { id: messageId },
    });
  },

  setEditable(message: Message) {
    dispatch({
      type: 'message/setReplyEditable',
      payload: { messageId: message.id },
    });
  },

  unsetEditable(messageId: string) {
    dispatch({
      type: 'message/updateReply',
      payload: { messageId, updates: { editable: false } },
    });
  },

  updateReply: (messageId: string) => {
    return (text: string) => {
      dispatch({
        type: 'message/socketUpdateMessage',
        payload: {
          id: messageId,
          text,
          isReply: true,
        },
      });
    };
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Replies);
