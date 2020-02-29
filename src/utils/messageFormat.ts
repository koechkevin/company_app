import { isSameDay } from 'date-fns';
import { find, includes } from 'lodash';
import { UserProfile } from '../models/user';

import { initMessage } from '../pages/Messages/models/message';
import { FormattedMessage, Message } from '../pages/Messages/models/typed';

export default (messages?: Message[], profiles?: UserProfile[], profile?: UserProfile): FormattedMessage[] => {
  if (!messages || !messages.length) {
    return [];
  }

  return messages.map(
    (msg: Message, idx: number): FormattedMessage => {
      let divided = true;
      let unReadMessage = false;
      const msgAuthor = find(profiles, (profile) => profile.profileId === msg.author);
      const lastMsg: Message = idx > 0 ? messages[idx - 1] : initMessage;
      const lastMsgAuthor = lastMsg ? find(profiles, (profile) => profile.profileId === lastMsg.author) : null;
      const withTheSameAuthor = msgAuthor && lastMsgAuthor && msgAuthor.profileId === lastMsgAuthor.profileId;
      const isRepliesEmpty = !msg.threadInfo;
      const isLastMsgRepliesEmpty = !lastMsg.threadInfo;
      const isNotForwarded = !msg.forwarding;
      const isNotLastMsgForwarded = !lastMsg.forwarding;

      if (idx !== 0) {
        const createdAt = msg && msg.createdAt;
        const lastCreatedAt = lastMsg && lastMsg.createdAt;

        if (createdAt && lastCreatedAt) {
          const atSameDay = isSameDay(new Date(createdAt), new Date(lastCreatedAt));
          divided = !atSameDay;
        }
      }

      const repeated = (idx !== 0 &&
        withTheSameAuthor &&
        isRepliesEmpty &&
        isLastMsgRepliesEmpty &&
        isNotForwarded &&
        isNotLastMsgForwarded &&
        !divided) as boolean;

      // get the id of first unread message
      const unReadMessageId = find(messages, (message) => !includes(message.read, profile?.profileId))?.id;
      if (msg.id === unReadMessageId) {
        unReadMessage = true;
      }

      const threadInfo = msg.threadInfo && {
        ...msg.threadInfo,
      };
      if (threadInfo && threadInfo.authors && typeof threadInfo.authors[0] === 'string') {
        threadInfo.authors = threadInfo.authors.map((author) => {
          return find(profiles, (profile) => profile.profileId === author);
        });
      }

      return {
        ...msg,
        author: msgAuthor,
        repeated,
        divided,
        threadInfo,
        unReadMessage,
      };
    },
  );
};
