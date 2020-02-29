/**
 * Web Socket event names enum
 */
export enum SocketEvents {
  // System events
  ReconnectAttempt = 'reconnect_attempt',
  Error = 'error',
  // Other
  Online = 'online',
  Typing = 'typing',
  Send = 'message_send',
  sendError = 'message_send_response_error',
  Update = 'message_update',
  Delete = 'message_delete_response_success',
  SendRepSuccess = 'message_send_response_success',
  SendBroadcast = 'message_send_broadcast',
  NewMessagesBroadCast = 'room_new_messages',
  UpdateBroadcast = 'message_update_broadcast',
  updateError = 'message_update_response_error',
  DeletedBroadCast = 'message_delete_broadcast',
  DeleteError = 'message_delete_response_error',
  TypingBroadCast = 'typing_broadcast',
}

export enum SocketErrors {
  InvalidToken = 'invalid_token',
}

export default SocketEvents;
