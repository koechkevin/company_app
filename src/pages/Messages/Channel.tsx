import { FileUploadModal, MessageInput } from '@aurora_app/ui-library';
import { faCircle } from '@fortawesome/pro-solid-svg-icons';
import { RcFile } from 'antd/lib/upload';
import { connect } from 'dva';
import { debounce, isEmpty } from 'lodash';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useMeasure } from 'react-use';

import { Dispatch } from '../../models/dispatch';
import { Payload as HeaderPayload } from '../../models/header.d';
import { Auth, UserProfile } from '../../models/user';
import { ChatColors } from '../../utils/constants';
import { formatRoomMembers } from '../../utils/dataFormat';
import { getUnreadMessageIds } from '../../utils/utils';
import { getColorValue, getCurrentUser, getIconType, headerFormat } from '../../utils/utils';
import { Jobs } from '../Jobs/models/typed';

import styles from './Channel.module.scss';
import MessageList from './containers/MessageList';
import Replies from './containers/Replies';
import { Message, Room } from './models/typed';

let timeout: any;

interface Props {
  match: any;
  query: any;
  auth: Auth;
  room: Room;
  message: Message;
  messages: Message[];
  profile: UserProfile;
  profiles: UserProfile[];
  jobs: Jobs;
  showFileUploadModal: boolean;
  subscribe: () => void;
  unsubscribe: () => void;
  resetRoom: () => void;
  send: (text: string) => void;
  selectRoom: (threadId: string) => void;
  markMessagesAsRead: (messageIds: string[]) => void;
  sendMessage: (text: string, cb: () => void) => void;
  saveDraft: (threadId: string, text: string) => void;
  toShowModal: (modal: string, visible: boolean) => void;
  updateTypingStatus: (isTyping: boolean, roomId: string) => void;
  updateDraft: (threadId: string, text: string, draftId: string) => void;
  deleteDraft: (threadId: string, text: string, draftId: string) => void;
  sendMessageWithFile: (roomId: string, file: RcFile, text: string) => void;
  handlePageTitle: (params: HeaderPayload) => void;
}

const Channel: FC<Props> = (props) => {
  const {
    query,
    auth,
    room,
    match,
    profile,
    message,
    messages,
    jobs,
    subscribe,
    unsubscribe,
    resetRoom,
    profiles,
    selectRoom,
    sendMessage,
    saveDraft,
    updateDraft,
    deleteDraft,
    toShowModal,
    handlePageTitle,
    markMessagesAsRead,
    updateTypingStatus,
    showFileUploadModal,
    sendMessageWithFile,
  } = props;

  const { anchor } = query;
  const { id: roomId } = match.params;
  const { draftId, members, type } = room;
  const isAuthenticated = auth && auth.isAuthenticated;

  const [ref, { width, height }] = useMeasure();
  const [newText, setNewText] = useState('');
  const [file, setFile] = useState<RcFile>();

  let typingUsers: string[] = [];

  if (!isEmpty(room) && profiles) {
    typingUsers = profiles
      .filter((userProfile) => {
        return room.typing?.includes(userProfile.profileId) && userProfile.profileId !== profile.profileId;
      })
      .map((userProfile) => getCurrentUser(userProfile));
  }

  const draftText = useRef(newText);
  const existingDraftId = useRef(draftId);
  const currentRoomId = useRef(room.id);

  const clearDraft = useCallback(() => {
    setNewText('');
    draftText.current = '';
    existingDraftId.current = '';
    currentRoomId.current = '';
  }, [setNewText]);

  const saveDraftMsg = useCallback(
    (roomId: string, text: string, draftId?: string) => {
      if (text && roomId && !draftId) {
        saveDraft(roomId, text);
        clearDraft();
      } else if (text && roomId && draftId) {
        updateDraft(roomId, text, draftId);
        clearDraft();
      }
    },
    [saveDraft, updateDraft, clearDraft],
  );

  useEffect(() => {
    existingDraftId.current = room.draftId;
    currentRoomId.current = room.id;
  }, [room.id, room.draftId]);

  const onChangeActions = useCallback(
    (text: string) => {
      if (currentRoomId.current) {
        if (currentRoomId.current && !text && existingDraftId.current) {
          deleteDraft(currentRoomId.current, text, existingDraftId.current);
          existingDraftId.current = '';
        }
        setNewText(text);
        draftText.current = text;

        // if not already typing, update to typing
        if (!room.typing || !room.typing.includes(profile.profileId)) {
          updateTypingStatus(true, currentRoomId.current);
        }

        // when user stops typing for 1 second, update as not typing
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          updateTypingStatus(false, currentRoomId.current);
        }, 1000);
      }
    },
    [room.typing, profile.profileId, deleteDraft, updateTypingStatus],
  );

  const debouncer = debounce((text: string) => onChangeActions(text), 100);

  useEffect(() => {
    if (roomId && isAuthenticated) {
      subscribe();
      selectRoom(roomId);
    }
    return () => {
      if (isAuthenticated) {
        unsubscribe();
      }
    };
  }, [selectRoom, subscribe, unsubscribe, roomId, isAuthenticated]);

  useEffect(() => {
    if (draftText.current && currentRoomId.current) {
      saveDraftMsg(currentRoomId.current, draftText.current, existingDraftId.current);
      clearDraft();
    }
  }, [saveDraftMsg, clearDraft, roomId]);

  useEffect(() => {
    const allUnread = getUnreadMessageIds(messages, profile);

    if (roomId && allUnread.length) {
      markMessagesAsRead(allUnread);
    }
  }, [messages, roomId, markMessagesAsRead, profile]);

  // save any draft message when unmount happens e.g clicking a job application
  useEffect(() => {
    return () => {
      if (currentRoomId.current && draftText.current) {
        saveDraftMsg(currentRoomId.current, draftText.current, existingDraftId.current);
        resetRoom();
      }
    };
  }, [saveDraftMsg, resetRoom, roomId, draftId]);

  useEffect(() => {
    const payload = headerFormat(room, profile, jobs);
    handlePageTitle(payload);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handlePageTitle, room.id, room.name]);

  const roomMembers =
    members &&
    members.map((member: any) => {
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
        icon: getIconType([member], profile, type),
        iconColor: getColorValue([member], profile, type),
      };
    });

  const handleUpload = (file: RcFile) => {
    setFile(file);
    toShowModal('showFileUploadModal', true);
  };

  const handleSubmit = (text: any) => {
    if (file) {
      sendMessageWithFile(roomId, file, text);
    }
    toShowModal('showFileUploadModal', false);
  };

  return (
    <div className={styles.root}>
      <div className={styles.chat}>
        <div className={styles.chatContent} ref={ref}>
          <MessageList anchor={anchor} listHeight={height} listWidth={width} />
        </div>
        <div className={styles.messageInputWrapper}>
          {!isEmpty(room) && (
            <MessageInput
              key={room.id}
              hintShown={true}
              text={room.draft}
              onUpload={handleUpload}
              typingUsers={typingUsers}
              suggestions={roomMembers}
              onChange={(text: string) => debouncer(text)}
              onEnter={(text: string) =>
                sendMessage(text, () => {
                  debouncer.cancel();
                  clearDraft();
                })
              }
            />
          )}
        </div>
      </div>
      {message && message.id && <Replies thread={room as Room} />}
      <FileUploadModal
        file={file}
        onOk={handleSubmit}
        visible={showFileUploadModal}
        onCancel={() => toShowModal('showFileUploadModal', false)}
      />
    </div>
  );
};

const mapStateToProps = ({ global, room, common, message, profile, jobs }: any) => {
  return {
    auth: global.auth,
    profile: global.profile,
    profiles: profile.profiles,
    room: formatRoomMembers(room.room, profile.profiles),
    showFileUploadModal: common.showFileUploadModal,
    jobs: jobs.jobs,
    ...message,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  subscribe() {
    dispatch({ type: 'message/subscribe' });
  },

  unsubscribe() {
    dispatch({ type: 'message/unsubscribe' });
  },

  selectRoom(id: string) {
    dispatch({ type: 'room/selectRoom', payload: { id } });
  },

  updateTypingStatus(isTyping: boolean, roomId: string) {
    dispatch({ type: 'message/updateTypingStatus', payload: { isTyping, roomId } });
  },

  sendMessage(text: string, cb: () => void) {
    dispatch({ type: 'message/socketSendMessage', payload: { text } }).then(cb);
  },

  sendMessageWithFile(roomId: string, file: RcFile, text: string) {
    dispatch({
      type: 'message/sendMessageWithFile',
      payload: { roomId, file, text },
    });
  },

  saveDraft(threadId: string, text: string) {
    dispatch({
      type: 'draft/createDraftMessages',
      payload: { id: threadId, message: text },
    });
  },

  toShowModal(modal: string, visible: boolean) {
    dispatch({ type: 'common/showOrHideModal', modal, payload: visible });
  },

  updateDraft(threadId: string, text: string, draftId: string) {
    dispatch({
      type: 'draft/updateDraftMessages',
      payload: { id: threadId, draftId, message: text },
    });
  },

  deleteDraft(threadId: string, text: string, draftId: string) {
    dispatch({ type: 'room/draftsGroup' });
    dispatch({ type: 'draft/deleteDraftMessages', payload: { id: threadId, draftId } });
  },

  markMessagesAsRead(messageIds: string[]) {
    dispatch({ type: 'message/markMessagesAsRead', payload: messageIds });
  },

  resetRoom() {
    dispatch({ type: 'room/resetRoom', payload: {} });
  },

  handlePageTitle({ title, statusIcon, iconColor, jobPosition, chatRoomStatus, isManyUsers }: HeaderPayload) {
    dispatch({
      type: 'global/changeHeaderTitle',
      payload: {
        title,
        statusIcon,
        iconColor,
        jobPosition,
        chatRoomStatus,
        isManyUsers,
      },
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Channel);
