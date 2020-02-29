import { notification } from 'antd';
import humps from 'humps';
import { filter, find, findIndex, includes, reduce, reverse } from 'lodash';

import { Action, Effects } from '../../../models/dispatch';
import { Routes } from '../../../routes';
import { ChannelService, SocketEvents, SocketService } from '../../../services';
import { msgConverter } from '../../../utils/dataFormat';
import { PageHelper } from '../../../utils/pageHelper';
import { PageInfo } from '../../../utils/pageHelper/PageInfo';
import { Message, Room } from './typed';

const socketInstance = SocketService.Instance;

export interface MessageState {
  messages: Message[];
  message: Message; // selected message, need to be replied
  pageInfo: PageInfo;
  repliedMessageIdx: number;
  replyDeletedMessageIdx: number;
  editableMessageIdx: number;
  rowHeights: any[];
  vListHeight: number;
}

export const initMessage = {
  id: '',
  author: '',
  replies: [],
  updatedAt: new Date(),
  createdAt: new Date(),
  forwarding: null,
};

const initialState: MessageState = {
  messages: [],
  message: initMessage,
  pageInfo: PageHelper.create(),
  repliedMessageIdx: -1,
  replyDeletedMessageIdx: -1,
  editableMessageIdx: -1,
  rowHeights: [],
  vListHeight: 0,
};

export default {
  namespace: 'message',

  state: initialState,

  effects: {
    *subscribe({ payload }: Action, { put }: Effects) {
      yield put({ type: 'common/subscribeOnline' });
      yield put({ type: 'subscribeSendBroadcast' });
      yield put({ type: 'subscribeNewMessages' });
      yield put({ type: 'subscribeSendError' });
      yield put({ type: 'subscribeTypingBroadcast' });
      yield put({ type: 'subscribeUpdateBroadcast' });
      yield put({ type: 'subscribeUpdateError' });
      yield put({ type: 'subscribeDeleteMessage' });
      yield put({ type: 'subscribeDeleteMessageError' });
    },

    *unsubscribe({ payload }: Action, { call }: Effects) {
      yield call(socketInstance.onUnsubscribe, SocketEvents.SendRepSuccess);
      yield call(socketInstance.onUnsubscribe, SocketEvents.SendBroadcast);
      yield call(socketInstance.onUnsubscribe, SocketEvents.NewMessagesBroadCast);
      yield call(socketInstance.onUnsubscribe, SocketEvents.DeletedBroadCast);
      yield call(socketInstance.onUnsubscribe, SocketEvents.Online);
    },

    *fetchMessages({ payload }: Action, { call, put, select }: Effects) {
      const { id, pageInfo } = payload;

      /** load messages */
      const { data, pagination } = yield call(ChannelService.fetchMessages, 'todo-action-code', id, {
        pageInfo: PageHelper.requestFormat(pageInfo),
      });

      /** push messages */
      const messages = yield select((state: any) => state.message.messages);
      const messageIds = messages.map(({ id }: Message) => id);
      const temp: Message[] = [];

      if (data && Array.isArray(data.items)) {
        data.items = humps.camelizeKeys(data.items);
        data.items.map((item: any) => {
          const message = msgConverter(item);
          if (!includes(messageIds, message.id)) {
            temp.push(message);
          }
          return item;
        });

        yield put({ type: 'setPageInfo', payload: { pageInfo: Object.assign(pageInfo, pagination) } });
      }

      yield put({ type: 'setMessages', payload: { messages: reverse(temp).concat(messages) } });
    },

    *markMessagesAsRead({ payload }: Action, { call }: Effects) {
      yield call(ChannelService.markMessagesAsRead, payload, true);
    },

    *fetchReplies(action: Action, { put, call, select }: Effects) {
      try {
        const { message } = yield select((state: any) => state.message);

        if (!message) {
          return;
        }

        const { data } = yield call(ChannelService.fetchReplies, 'todo-action-code', message.id, { 'per-page': 300 });

        if (data && Array.isArray(data.items)) {
          data.items = humps.camelizeKeys(data.items);
          const replies = data.items.map((item: any) => msgConverter(item));

          yield put({ type: 'fetchRepliesSuccess', payload: { parentId: message.id, replies } });
        }
      } catch (error) {
        throw error;
      }
    },

    *sendMessageWithFile({ payload }: Action, { put, select, takeEvery }: any) {
      try {
        const { text, file: fileData } = payload;
        const uuid = socketInstance.getUuid();
        const { profileId } = yield select(({ global }: any) => global.profile);
        const message = {
          id: uuid,
          message: text,
          createdBy: profileId,
          read: [profileId],
          ...payload,
        };
        const composed = msgConverter(message);

        yield put({ type: 'appendMessage', payload: { message: composed } });
        yield put({ type: 'fileUpload/uploadFile', payload: fileData });
        yield takeEvery('fileUpload/uploadStatus', function* upload(action: Action) {
          const { payload: file } = action;
          const data = { ...composed, file };

          yield put({ type: 'updateMessageFile', payload: data });

          if (file.status === 'error') {
            yield put({ type: 'afterMessageDeleting', payload: data });
          }

          if (file.status !== 'done') {
            return;
          }

          yield put({ type: 'socketSendMessage', payload: { text, fileId: file.fileId } });
        });
      } catch (error) {
        throw error;
      }
    },

    *socketSendMessage({ payload }: Action, { put, call, select }: Effects) {
      try {
        const { text, fileId } = payload;
        const thread = yield select((state: any) => state.room.room);
        let data: any = {
          fileId,
          message: text,
          roomId: thread.id,
        };
        data = humps.decamelizeKeys(data);

        socketInstance.message(data);

        /** clear draft */
        yield put({
          type: 'room/setRoom',
          payload: { id: thread.id, draft: '', draftId: '', isDrafted: false },
        });

        yield put({ type: 'room/draftsGroup' });

        if (thread.draftId) {
          yield call(ChannelService.deleteDraftMessages, thread.id, thread.draftId);
        }
      } catch (error) {
        throw error;
      }
    },

    *subscribeTypingBroadcast(action: Action, { call, take, put }: Effects) {
      try {
        const socketChannel = yield call(socketInstance.onSubscribe, SocketEvents.TypingBroadCast);

        while (true) {
          const data = yield take(socketChannel);
          const { payload } = data;

          if (data) {
            yield put({ type: 'room/setTypingStatus', payload });
          }
        }
      } catch (error) {
        throw error;
      }
    },

    updateTypingStatus({ payload }: Action) {
      try {
        const { roomId, isTyping } = payload;
        socketInstance.typing({ room_id: roomId, is_typing: isTyping });
      } catch (error) {
        throw error;
      }
    },

    *sendReply({ payload }: Action, { put, call, select }: Effects) {
      try {
        const thread = yield select((state: any) => state.room.room);
        const message = yield select((state: any) => state.message.message);

        if (!message) {
          return;
        }

        let data: any = {
          roomId: thread.id,
          threadId: message.id,
          message: payload.text,
        };
        data = humps.decamelizeKeys(data);

        socketInstance.message(data);

        /** clear draft */
        yield put({
          type: 'updateMessageDraft',
          payload: { data: { ...message, draftText: '', draftId: '' } },
        });

        if (message.draftId) {
          yield call(ChannelService.deleteDraftMessages, message.roomId, message.draftId);
          yield put({ type: 'draft/updateDraftsAfterDelete', payload: message.draftId });
        }

        yield put({ type: 'room/draftsGroup' });
      } catch (error) {
        throw error;
      }
    },

    socketUpdateMessage({ payload }: Action) {
      try {
        socketInstance.updateMessage({ message_id: payload.id, message: payload.text });
      } catch (error) {
        throw error;
      }
    },

    socketDeleteMessage({ payload: { id } }: Action) {
      socketInstance.deleteMessage({ message_id: id });
    },

    *socketForwardMessage({ payload }: Action, { put, select }: Effects) {
      try {
        const { threadId, messageId, text } = payload;
        const thread = yield select((state: any) => state.room.room);

        socketInstance.forwardMessage({
          room_id: threadId,
          message_id: messageId,
          message: text,
        });

        if (thread.id === threadId) {
          return;
        }

        yield put({ type: 'gotoThread', payload: { id: threadId } });
      } catch (error) {
        throw error;
      }
    },

    *afterMessageSending({ payload }: Action, { put, select }: Effects) {
      try {
        const { roomId, threadId } = payload;
        const composed = msgConverter(payload);
        const room = yield select((state: any) => state.room.room);

        if (room.id !== roomId) {
          return;
        }

        if (!threadId) {
          yield put({ type: 'appendMessage', payload: { message: composed } });
        } else {
          yield put({
            type: 'appendReply',
            payload: { parentId: threadId, reply: composed },
          });
        }
      } catch (error) {
        throw error;
      }
    },

    *afterMessageUpdating({ payload }: Action, { put }: Effects) {
      try {
        const { id, updatedAt, message, threadId } = payload;

        if (threadId) {
          yield put({
            type: 'updateReply',
            payload: {
              messageId: id,
              updates: { text: message, updatedAt, isModified: true },
            },
          });
        } else {
          yield put({
            type: 'updateMessage',
            payload: {
              messageId: id,
              updates: { text: message, updatedAt, isModified: true },
            },
          });
        }
      } catch (error) {
        throw error;
      }
    },

    *addReply({ payload }: Action, { put }: Effects) {
      try {
        yield put({ type: 'appendReply', payload });
      } catch (error) {
        throw error;
      }
    },

    *inviteMembers(action: Action, { put, select }: Effects) {
      try {
        const room: Room = yield select((state: any) => state.room.room);
        let selected: string[] = [];

        if (room && room.members) {
          selected = room.members;
        }

        yield put({ type: 'setSelected', payload: { selected } });
        yield put({ type: 'showModal', payload: { type: 'add' } });
      } catch (error) {
        throw error;
      }
    },

    *subscribeRepSuccess({ payload }: Action, { call, take }: Effects) {
      try {
        const socketChannel = yield call(socketInstance.onSubscribe, SocketEvents.SendRepSuccess);

        while (true) {
          yield take(socketChannel);
        }
      } catch (error) {
        throw error;
      }
    },

    *subscribeSendBroadcast({ payload }: Action, { call, take, put }: Effects) {
      try {
        const socketChannel = yield call(socketInstance.onSubscribe, SocketEvents.SendBroadcast);

        while (true) {
          const { payload } = yield take(socketChannel);

          if (payload && !payload.file) {
            // if the payload has fileId, don't need to call `afterMessageSending` action
            yield put({ type: 'afterMessageSending', payload });
            yield call(ChannelService.MarkMessageAsReceived, payload.id, true);
          }
        }
      } catch (error) {
        throw error;
      }
    },

    *subscribeNewMessages({ payload }: Action, { call, take, put }: Effects) {
      try {
        const socketChannel = yield call(socketInstance.onSubscribe, SocketEvents.NewMessagesBroadCast);

        while (true) {
          const { payload } = yield take(socketChannel);

          if (payload) {
            yield put({
              type: 'room/setRooms',
              payload: { id: payload.roomId, newMessagesCount: payload.newMessagesCount },
            });
          }
        }
      } catch (error) {
        throw error;
      }
    },

    *subscribeUpdateBroadcast({ payload }: Action, { call, take, put }: Effects) {
      try {
        const socketChannel = yield call(socketInstance.onSubscribe, SocketEvents.UpdateBroadcast);

        while (true) {
          const data = yield take(socketChannel);

          if (data) {
            yield put({ type: 'afterMessageUpdating', payload: data.payload });
          }
        }
      } catch (error) {
        throw error;
      }
    },

    *subscribeUpdateError({ payload }: Action, { call, take, put }: Effects) {
      try {
        const socketChannel = yield call(socketInstance.onSubscribe, SocketEvents.updateError);

        while (true) {
          const data = yield take(socketChannel);
          notification.open({ message: data.error, type: 'error' });
        }
      } catch (error) {
        throw error;
      }
    },

    *subscribeSendError({ payload }: Action, { call, take, put }: Effects) {
      try {
        const socketChannel = yield call(socketInstance.onSubscribe, SocketEvents.sendError);

        while (true) {
          const data = yield take(socketChannel);
          notification.open({ message: data.error, type: 'error' });
        }
      } catch (error) {
        throw error;
      }
    },

    *subscribeDeleteMessage({ payload }: Action, { call, take, put }: Effects) {
      try {
        const socketChannel = yield call(socketInstance.onSubscribe, SocketEvents.DeletedBroadCast);

        while (true) {
          const data = yield take(socketChannel);

          if (data) {
            const { payload } = data;

            if (payload.threadId) {
              yield put({ type: 'afterReplyDeleting', payload });
            } else {
              if (!payload.threadInformation) {
                yield put({ type: 'afterMessageDeleting', payload });
              } else {
                yield put({
                  type: 'updateMessage',
                  payload: { messageId: payload.id, updates: { isDeleted: true } },
                });
              }
            }
          }
        }
      } catch (error) {
        throw error;
      }
    },

    *subscribeDeleteMessageError({ payload }: Action, { call, take, put }: Effects) {
      try {
        const socketChannel = yield call(socketInstance.onSubscribe, SocketEvents.DeleteError);

        while (true) {
          const data = yield take(socketChannel);
          notification.open({ message: data.error, type: 'error' });
        }
      } catch (error) {
        throw error;
      }
    },

    *setMessage({ payload: { messageId } }: Action, { put, select }: Effects) {
      try {
        const drafts = yield select((state: any) => state.draft.drafts);
        yield put({ type: 'setMessageSuccess', payload: { messageId, drafts } });
      } catch (error) {
        throw error;
      }
    },

    *cancelUpload({ payload }: Action, { put }: Effects) {
      try {
        yield put({ type: 'fileUpload/cancelUpload' });
      } catch (error) {
        throw error;
      }
    },
  },

  reducers: {
    resetMessage(state: MessageState, { payload }: Action): MessageState {
      return { ...state, message: initialState.message };
    },

    updateMessageDraft(state: MessageState, { payload: { data } }: Action): MessageState {
      return { ...state, message: { ...state.message, ...data } };
    },

    setMessageSuccess(state: MessageState, { payload: { messageId, drafts } }: Action): MessageState {
      let message;
      let draft;

      message = find(state.messages, (msg) => msg.id === messageId);

      if (message) {
        draft = find(drafts, (draft) => draft.threadId === messageId);
      }

      return {
        ...state,
        message: message
          ? {
              ...message,
              draftId: draft && draft.threadId && draft.id,
              draftText: draft && draft.threadId && draft.message,
            }
          : initialState.message,
      };
    },

    updateMessageFile(state: MessageState, { payload }: Action): MessageState {
      const messages = state.messages.map((item: Message) => (item.id === payload.id ? payload : item));
      return { ...state, messages };
    },

    appendMessage(state: MessageState, { payload: { message } }: Action): MessageState {
      return { ...state, messages: [...state.messages, message] };
    },

    updateMessage(state: MessageState, { payload: { messageId, updates } }: Action): MessageState {
      const updatedUpdates = { ...updates, editable: false };

      return {
        ...state,
        editableMessageIdx: -1,
        message: state.message
          ? state.message.id !== messageId
            ? state.message
            : { ...state.message, ...updatedUpdates }
          : null,
        messages: state.messages.map((message: Message) => {
          return message.id !== messageId ? message : { ...message, ...updatedUpdates };
        }),
      };
    },

    setMessageEditable(state: MessageState, { payload: { messageId } }: Action): MessageState {
      const idx = findIndex(state.messages, (message: Message) => message.id === messageId);
      return {
        ...state,
        editableMessageIdx: idx,
        message: state.message ? { ...state.message, editable: state.message.id === messageId } : initialState.message,
        messages: state.messages.map((message: Message) => ({ ...message, editable: message.id === messageId })),
      };
    },

    setReplyEditable(state: MessageState, { payload: { messageId } }: Action): MessageState {
      return {
        ...state,
        message: {
          ...state.message,
          replies: state.message?.replies
            ? state.message.replies.map((reply: Message) => ({ ...reply, editable: reply.id === messageId }))
            : [],
        },
      };
    },

    updateReply(state: MessageState, { payload: { messageId, updates } }: Action): MessageState {
      const updatedUpdates = { ...updates, editable: false };

      return {
        ...state,
        message: {
          ...state.message,
          replies:
            state.message && state.message.replies
              ? state.message.replies.map((reply: Message) => {
                  return reply.id !== messageId ? reply : { ...reply, ...updatedUpdates };
                })
              : [],
        },
      };
    },

    setMessages(state: MessageState, { payload: { messages } }: Action): MessageState {
      return { ...state, messages };
    },

    afterMessageDeleting(state: MessageState, { payload: { id } }: Action): MessageState {
      const rowHeights = state.rowHeights.filter((row: any) => row.id !== id);

      return {
        ...state,
        rowHeights,
        messages: filter(state.messages, (msg) => msg.id !== id),
        vListHeight: reduce(rowHeights, (sum, row: any) => sum + row.height, 0),
      };
    },

    afterReplyDeleting(state: MessageState, { payload: { id, threadId, createdBy } }: Action): MessageState {
      const authorMessagesCount: number | undefined = state.message?.replies
        ?.map((reply: any) => reply.author.id)
        .filter((id: string) => id === createdBy).length;

      const idx: number = findIndex(state.messages, (message) => message.id === threadId);

      return {
        ...state,
        replyDeletedMessageIdx: idx,
        message: {
          ...state.message,
          replies: state.message?.replies ? state.message.replies.filter((reply: Message) => reply.id !== id) : [],
        },
        messages: state.messages.map((message: any) => {
          return message.id !== threadId
            ? message
            : {
                ...message,
                replies: state.message?.replies
                  ? state.message.replies.filter((reply: Message) => reply.id !== id)
                  : [],
                threadInfo:
                  message.threadInfo?.count === 1
                    ? null
                    : {
                        ...message.threadInfo,
                        count: message.threadInfo.count - 1,
                        authors:
                          authorMessagesCount && authorMessagesCount < 2
                            ? message.threadInfo?.authors.filter((author: string) => author !== createdBy)
                            : message.threadInfo.authors,
                        lastMessageAt: message.threadInfo?.lastMessageAt,
                      },
              };
        }),
      };
    },

    appendReply(state: MessageState, { payload: { parentId, reply } }: any): MessageState {
      const message = (state.message && state.message) || null;
      const replies = (state.message && state.message.replies) || [];
      const updatedReply = { ...reply, parentId };
      const idx = findIndex(state.messages, (message: Message) => message.id === parentId);

      return {
        ...state,
        repliedMessageIdx: idx,
        message: !message
          ? initialState.message
          : message.id !== parentId
          ? message
          : {
              ...message,
              replies: [...replies, updatedReply],
              threadInfo: {
                count: message.threadInfo ? message.threadInfo.count + 1 : 1,
                authors: message.threadInfo ? [...message.threadInfo.authors, reply.author] : [reply.author],
                lastMessageAt: new Date(),
              },
            },
        messages: state.messages.map((message: Message) => {
          return message.id !== parentId
            ? message
            : {
                ...message,
                replies: [...replies, updatedReply],
                threadInfo: {
                  count: message.threadInfo ? message.threadInfo.count + 1 : 1,
                  authors: message.threadInfo ? [...message.threadInfo.authors, reply.author] : [reply.author],
                  lastMessageAt: new Date(),
                },
              };
        }),
      };
    },

    fetchRepliesSuccess(state: MessageState, { payload: { parentId, replies } }: Action): MessageState {
      const message = state.message || null;
      const updatedReplies = replies.map((reply: any) => ({ ...reply, parentId }));

      return {
        ...state,
        message: !message
          ? initialState.message
          : message.id !== parentId
          ? message
          : { ...message, replies: updatedReplies },
        messages: state.messages.map((message: Message) => {
          return message.id !== parentId ? message : { ...message, replies: updatedReplies };
        }),
      };
    },

    setPageInfo(state: MessageState, { payload }: Action): MessageState {
      const { pageInfo } = payload;
      return { ...state, pageInfo };
    },

    setRowHeights(state: MessageState, { payload: { rowHeights } }: Action): MessageState {
      return {
        ...state,
        rowHeights,
        vListHeight: reduce(rowHeights, (sum, row: any) => sum + row.height, 0),
      };
    },

    addRowHeight(state: MessageState, { payload: { id, height } }: Action): MessageState {
      const rowHeights = state.rowHeights;
      rowHeights.push({ id, height });

      return {
        ...state,
        rowHeights,
        vListHeight: reduce(rowHeights, (sum, row: any) => sum + row.height, 0),
      };
    },

    updateRowHeight(state: MessageState, { payload: { id, height, idx } }: Action): MessageState {
      const rowHeights = state.rowHeights;
      rowHeights[idx] = { id, height };

      return {
        ...state,
        rowHeights,
        vListHeight: reduce(rowHeights, (sum, row: any) => sum + row.height, 0),
      };
    },

    initState(state: MessageState, { payload }: Action): MessageState {
      return { ...initialState, ...payload };
    },
  },

  subscriptions: {
    setup({ dispatch, history }: any) {
      return history.listen(({ pathname }: Location) => {
        if (!(pathname.indexOf(Routes.Login) === -1)) {
          dispatch({ type: 'initState' });
        }
      });
    },
  },
  // tslint:disable-next-line:max-file-line-count
};
