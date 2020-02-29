import { ApiUrl } from './ApiConfig';
import { DELETE_CHAT_API, GET_CHAT_API, POST_CHAT_API, PUT_CHAT_API } from './AxiosInstance';

import { PageInfo } from '../utils/pageHelper/PageInfo';

export class ChannelService {
  public static fetchChannels(actionCode: string, params: object): Promise<any> {
    return GET_CHAT_API(`${ApiUrl.CHANNEL}`, params, {
      headers: {
        'Action-Code': actionCode,
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  public static fetchChannel(actionCode: string, id: string): Promise<any> {
    return GET_CHAT_API(`${ApiUrl.CHANNEL}/${id}`, null, {
      headers: {
        'Action-Code': actionCode,
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  public static postChannel(actionCode: string, params: any): Promise<any> {
    return POST_CHAT_API(`${ApiUrl.CHANNEL}`, params, {
      headers: {
        'Action-Code': actionCode,
      },
    });
  }

  public static patchChannel(actionCode: string, id: string, params: any): Promise<any> {
    return PUT_CHAT_API(`${ApiUrl.CHANNEL}/${id}`, params, {
      headers: {
        'Action-Code': actionCode,
      },
    });
  }

  public static deleteChannel(actionCode: string, id: string): Promise<any> {
    return DELETE_CHAT_API(`${ApiUrl.CHANNEL}/${id}`, {
      headers: {
        'Action-Code': actionCode,
      },
    });
  }

  public static fetchMessages(actionCode: string, id: string, params: { pageInfo: PageInfo }): Promise<any> {
    const { pageInfo } = params;

    return GET_CHAT_API(`${ApiUrl.CHANNEL}/${id}/messages`, pageInfo, {
      headers: {
        'Action-Code': actionCode,
      },
    });
  }

  public static MarkMessageAsReceived(messageId: string, receipt: boolean): Promise<any> {
    return POST_CHAT_API(`${ApiUrl.MESSAGE}/receipt`, { receipt, messages: [messageId] });
  }

  public static markMessagesAsRead(messageIds: string[], read: boolean): Promise<any> {
    return POST_CHAT_API(`${ApiUrl.MESSAGE}/read`, { read, messages: messageIds });
  }

  public static fetchDraftMessages(params?: object): Promise<any> {
    return GET_CHAT_API(ApiUrl.DRAFTS, params);
  }

  public static createDraftMessages(id: string, params: object): Promise<any> {
    return POST_CHAT_API(`${ApiUrl.CHANNEL}/${id}/drafts`, params, {});
  }

  public static hideChatRoom(params: object): Promise<any> {
    return POST_CHAT_API(`${ApiUrl.CHANNEL}/hide`, params, {});
  }

  public static updateDraftMessages(roomId: string, draftId: string, params: object): Promise<any> {
    return PUT_CHAT_API(`${ApiUrl.CHANNEL}/${roomId}/drafts/${draftId}`, params, {});
  }

  public static deleteDraftMessages(roomId: string, draftId: string): Promise<any> {
    return DELETE_CHAT_API(`${ApiUrl.CHANNEL}/${roomId}/drafts/${draftId}`, {});
  }

  public static fetchReplies(actionCode: string, parentId: string, params?: object): Promise<any> {
    return GET_CHAT_API(`${ApiUrl.THREAD}/${parentId}/messages`, params, {
      headers: {
        'Action-code': actionCode,
      },
    });
  }
}
