import { MessageDeleteModal } from '@aurora_app/ui-library';
import { connect } from 'dva';
import { findIndex, min, range } from 'lodash';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useOrientation } from 'react-use';
import { AutoSizer, CellMeasurer, CellMeasurerCache, List as VList } from 'react-virtualized';

import { WithModalConnect } from '../../../components';
import { Dispatch } from '../../../models/dispatch';
import { FileModel } from '../../../models/file';
import { UserProfile } from '../../../models/user';
import { messageFormat } from '../../../utils';
import { formatRoomMembers } from '../../../utils/dataFormat';
import { PageInfo } from '../../../utils/pageHelper/PageInfo';
import { MessageItemRender } from '../components';
import { initMessage } from '../models/message';
import { FormattedMessage, Message, Room } from '../models/typed';

import styles from './MessageList.module.scss';

interface Props {
  anchor?: any;
  room: Room;
  rooms?: Room[];
  loading: boolean;
  listHeight: number;
  listWidth: number;
  rowHeights: any[];
  pageInfo: PageInfo;
  vListHeight: number;
  profile: UserProfile;
  activeMessage: Message;
  messages: FormattedMessage[];
  repliedMessageIdx: number;
  editableMessageIdx: number;
  replyDeletedMessageIdx: number;
  showMessageDeleteModal: boolean;
  resetRowHeights: () => void;
  hideModal: (modal: string) => void;
  showModal: (modal: string) => void;
  downloadFile: (file: FileModel) => void;
  startThread: (messageId: string) => void;
  setEditable: (message: Message) => void;
  unsetEditable: (messageId: string) => void;
  deleteMessage: (messageId: string) => void;
  addRowHeight: (id: string, height: number) => void;
  cancelUpload: (message: Message, file: FileModel) => void;
  updateMessage: (messageId: string) => (text: string) => void;
  fetchMessages: (threadId: string, pageInfo: PageInfo) => void;
  updateRowHeight: (id: string, height: number, idx: number) => void;
  forwardMessage: (threadId: string, messageId: string, text: string) => void;
}

const cache = new CellMeasurerCache({
  fixedWidth: true,
  minHeight: 0,
});

export const MessageList: FC<Props> = (props) => {
  const {
    room,
    loading,
    anchor,
    pageInfo,
    messages,
    profile,
    vListHeight,
    rowHeights,
    listHeight,
    listWidth,
    showModal,
    hideModal,
    activeMessage,
    fetchMessages,
    startThread,
    setEditable,
    unsetEditable,
    updateMessage,
    deleteMessage,
    addRowHeight,
    cancelUpload,
    downloadFile,
    resetRowHeights,
    repliedMessageIdx,
    editableMessageIdx,
    replyDeletedMessageIdx,
    showMessageDeleteModal,
  } = props;

  const roomId = room.id;
  const [id, setId] = useState('');
  const orientation = useOrientation();
  const listRef = useRef<VList | null>(null);
  const currentPage = pageInfo.getCurrentPage();

  const scrollTo = useCallback((rowIndex: number) => {
    if (listRef && listRef.current) {
      listRef.current.scrollToRow(rowIndex);

      const scrollToRowTimer = setTimeout(() => {
        if (listRef && listRef.current) {
          listRef.current.scrollToRow(rowIndex);
        }
      }, 10);

      clearTimeout(scrollToRowTimer);
    }
  }, []);

  const recomputeRowHeight = (rowIdx: number) => {
    listRef.current?.recomputeRowHeights(rowIdx);
  };

  const scrollToBottom = () => {
    scrollTo(messages.length);
  };

  const setRemovable = (message: Message) => {
    const idx: number = findIndex(messages, (m: Message) => m.id === message.id);
    setLastFocusedMessageIdx(idx);
    setId(message.id);
    showModal('showMessageDeleteModal');
  };

  const setShareable = (message: Message) => {
    message && message.id && setId(message.id);
    showModal('showMessageForwardModal');
  };

  const clearCache = useCallback(
    ({ start = -1, end = messages.length, scrollToPos = -1, recomputeFromPos = -1 }) => {
      if (start > -1 && end) {
        for (const i of range(start, end)) {
          cache.clear(i, 0);
        }
      } else {
        cache.clearAll();
      }

      if (scrollToPos > -1) {
        setTimeout(() => scrollTo(scrollToPos), 100);
      }

      if (recomputeFromPos > -1) {
        recomputeRowHeight(recomputeFromPos);
      }
    },
    [messages.length],
  );

  // const refs = messages
  //   ? messages.reduce((acc, { id }) => {
  //       id && (acc[id] = createRef());
  //       return acc;
  //     }, {})
  //   : {};

  // useEffect(() => {
  //   if (anchor && refs[anchor]) {
  //     const el = refs[anchor].current;

  //     el.scrollIntoView({
  //       block: 'center',
  //       behavior: 'instant',
  //     });
  //   }
  // }, [refs, anchor]);

  const renderRow = ({ key, index, parent, style }: any): React.ReactNode => {
    const message: FormattedMessage = messages[index] || { ...initMessage, divided: false, repeated: false };
    const { height } = style;
    const idx = findIndex(rowHeights, (row) => row.id === message.id);

    if (!isNaN(height)) {
      if (idx === -1) {
        addRowHeight(message.id, height);
      } else if (height !== rowHeights[idx].length) {
        // We don't need to update the row height right now,
        // but may need in the future
        // updateRowHeight(message.id, height, idx);
      }
    }

    return (
      <CellMeasurer cache={cache} columnIndex={0} key={key} parent={parent} rowIndex={index}>
        <div
          key={key}
          style={style}
          className={message.id === anchor ? styles.highlighted : ''}
          // ref={item && refs && item.id ? refs[item.id] : ''}
        >
          <MessageItemRender
            message={message}
            profile={profile}
            onDownload={downloadFile}
            startThread={startThread}
            setEditable={setEditable}
            onCancel={cancelUpload}
            unsetEditable={unsetEditable}
            updateMessage={updateMessage}
            setRemovable={setRemovable}
            setShareable={setShareable}
          />
        </div>
      </CellMeasurer>
    );
  };

  /** scroll to bottom:
   * 1.receive the latest message
   * 2.orientation of mobile devices
   */
  const lastMessage: Message | null = messages.length ? messages[messages.length - 1] : null;
  const lastUpdated: string | undefined = lastMessage?.updatedAt.toString();

  useEffect(() => {
    setTimeout(scrollToBottom, 100);
  }, [lastUpdated, orientation]);

  /** recompute vList height:
   * 1. switch chat room
   * 2. load previous data
   */
  useEffect(() => {
    clearCache({});
    /** If add clearCache into dependencies, will cause
     *  scrolling to the list top after deleting one message
     * cause clearCache has the dependency of messages.length
     */
  }, [roomId, currentPage]);

  /**
   * recompute vList height:
   * 1.change window width
   */
  useEffect(() => {
    const pos: number = findIndex(messages, (message: Message) => message.id === activeMessage.id);
    const idx: number = pos > -1 ? pos : lastFocusedMessageIdx;
    clearCache({ scrollToPos: idx, recomputeFromPos: idx });
  }, [clearCache, listWidth]);

  /** set last focused message idx
   * 1.open / close thread conversation
   * 3.change active message
   */
  const [lastFocusedMessageIdx, setLastFocusedMessageIdx] = useState(-1);

  useEffect(() => {
    const idx: number = findIndex(messages, (message: Message) => message.id === activeMessage.id);
    if (idx > -1) {
      setLastFocusedMessageIdx(idx);
    }
  }, [clearCache, activeMessage]);

  /** recompute vList height:
   * 1.edit message
   * 2.cancel the editable status
   */
  useEffect(() => {
    const idx: number = editableMessageIdx > -1 ? editableMessageIdx : lastFocusedMessageIdx;
    setLastFocusedMessageIdx(idx);
    clearCache({
      start: idx,
      scrollToPos: idx,
      recomputeFromPos: idx,
    });
  }, [clearCache, editableMessageIdx]);

  /** recompute vList height:
   * 1.reply a message
   */
  useEffect(() => {
    const idx: number = repliedMessageIdx > -1 ? repliedMessageIdx : lastFocusedMessageIdx;
    setLastFocusedMessageIdx(repliedMessageIdx);
    clearCache({
      start: idx,
      scrollToPos: idx,
      recomputeFromPos: idx,
    });
  }, [clearCache, repliedMessageIdx]);

  /**
   * recompute vList height:
   * 1.delete a reply
   */
  useEffect(() => {
    const idx: number = replyDeletedMessageIdx > -1 ? replyDeletedMessageIdx : lastFocusedMessageIdx;
    setLastFocusedMessageIdx(replyDeletedMessageIdx);
    clearCache({
      start: idx,
      scrollTo: idx,
      recomputeFromPos: idx,
    });
  }, [clearCache, replyDeletedMessageIdx]);

  /** To match with the UI design
   * if the current chat messages list can't fill the viewport,
   * the messages chat list should be aligned at the bottom
   */
  const [virtualListHeight, setVirtualListHeight] = useState(0);
  const [virtualListMarginTop, setVirtualListMarginTop] = useState(0);

  const computeListHeight = useCallback(() => {
    const height = min([listHeight, vListHeight]) || 0;

    setVirtualListHeight(height);
    if (vListHeight < listHeight) {
      setVirtualListMarginTop(listHeight - vListHeight);
    } else {
      setVirtualListMarginTop(0);
    }
  }, [listHeight, vListHeight]);

  /**
   * recompute vList height
   * 1.delete current selected message
   * 2.change virtual list height
   * 3.reply a message
   */
  useEffect(() => {
    computeListHeight();
  }, [computeListHeight, repliedMessageIdx, vListHeight]);

  /** scroll back after loading previous data */
  const firstMessage: Message | null = messages[0] || null;
  const firstUpdated: string | undefined = firstMessage?.updatedAt.toString();

  useEffect(() => {
    const page: number = pageInfo.getPage();
    const perPage: number = pageInfo.getPerPage();

    if (messages.length && page > 1) {
      const rowIndex: number = messages.length - (page - 1) * perPage;
      setTimeout(() => scrollTo(rowIndex), 100);
    }
    /**
     * do not put messages.length into the dependencies
     * or it will scroll when sending new messages
     */
  }, [scrollTo, pageInfo, firstUpdated]);

  /** scroll to load previous data */
  const onScroll = ({ scrollTop }: any) => {
    const page: number = pageInfo.getPage();
    const pageCount: number = pageInfo.getPageCount();

    if (scrollTop === 0 && !loading) {
      if (roomId && page < pageCount) {
        fetchMessages(roomId, pageInfo.jumpPage(page + 1));
      }
    }
  };

  useEffect(() => {
    resetRowHeights();
  }, [resetRowHeights, roomId]);

  const handleSubmit = () => {
    deleteMessage(id);
    hideModal('showMessageDeleteModal');
  };

  return (
    <>
      <AutoSizer>
        {({ width, height }: any) => {
          return (
            <VList
              ref={listRef}
              width={width}
              height={height}
              onScroll={onScroll}
              rowRenderer={renderRow}
              className={styles.messages}
              rowHeight={cache.rowHeight}
              scrollToAlignment="center"
              deferredMeasurementCache={cache}
              rowCount={messages ? messages.length : 0}
              style={{ height: virtualListHeight, marginTop: virtualListMarginTop }}
            />
          );
        }}
      </AutoSizer>
      <MessageDeleteModal
        onOk={handleSubmit}
        visible={showMessageDeleteModal}
        onCancel={() => hideModal('showMessageDeleteModal')}
        message={messages.find((message: Message) => message.id === id)}
      />
    </>
  );
};

const mapStateToProps = ({ loading, room, message, global, profile }: any) => {
  return {
    ...message,
    rooms: room.rooms,
    profile: global.profile,
    activeMessage: message.message,
    loading: loading.effects['message/fetchMessages'],
    room: formatRoomMembers(room.room, profile.profiles),
    messages: messageFormat(message.messages, profile.profiles, global.profile),
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchMessages(id: string, pageInfo: PageInfo) {
    dispatch({ type: 'message/fetchMessages', payload: { id, pageInfo } });
  },

  startThread: (messageId: string) => {
    dispatch({ type: 'message/setMessage', payload: { messageId } });
  },

  updateMessage: (messageId: string) => {
    return (text: string) => {
      dispatch({ type: 'message/socketUpdateMessage', payload: { id: messageId, text } });
    };
  },

  deleteMessage: (messageId: string) => {
    dispatch({ type: 'message/socketDeleteMessage', payload: { id: messageId } });
  },

  forwardMessage: (threadId: string, messageId: string, text: string) => {
    dispatch({
      type: 'message/socketForwardMessage',
      payload: { threadId, messageId, text },
    });
  },

  setEditable(message: Message) {
    dispatch({ type: 'message/setMessageEditable', payload: { messageId: message.id } });
  },

  unsetEditable(messageId: string) {
    dispatch({
      type: 'message/updateMessage',
      payload: { messageId, updates: { editable: false } },
    });
  },

  addRowHeight(id: string, height: number) {
    dispatch({ type: 'message/addRowHeight', payload: { id, height } });
  },

  updateRowHeight(id: string, height: number, idx: number) {
    dispatch({ type: 'message/updateRowHeight', payload: { id, height, idx } });
  },

  resetRowHeights() {
    dispatch({ type: 'message/setRowHeights', payload: { rowHeights: [] } });
  },

  downloadFile(file: FileModel) {
    dispatch({ type: 'fileUpload/downloadFile', payload: file });
  },

  cancelUpload(message: Message, file: FileModel) {
    dispatch({ type: 'message/cancelUpload', payload: { message, file } });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(WithModalConnect(MessageList));
