// Global product id
export enum ProductId {
  company = 'company-portal',
  candidate = 'candidate-portal',
}

// Possible profiles types
export enum ProfileType {
  candidate = 'candidate',
  company = 'company',
  chatbot = 'chatbot',
  admin = 'admin',
}

export interface Pagination {
  totalCount: number;
  pageCount: number;
  currentPage: number;
  perPage: number;
}

export interface JobParams {
  page?: number;
  'per-page'?: number;
  expand: string;
}

export const localStorageKey = {
  PROFILE_MODEL: 'AURORA-COMPANY-APP-PROFILE-MODEL',
};

export const cookieKeys = {
  USER_TOKEN_KEY: 'AURORA-COMPANY-APP-USER-KEY',
  PROFILE_TOKEN_KEY: 'AURORA-COMPANY-APP-PROFILE-KEY',
  SELECTED_PROFILE_ID: 'AURORA-COMPANY-APP-PROFILE-ID',
};

export const exceptionRoutes: string[] = ['/app/exception/403', '/app/exception/404', '/app/exception/500'];

// API request error code message
export const codeMessage = {
  200: 'Request succeeded',
  201: 'Resource created.',
  202: 'A request has entered the background queue (asynchronous task)',
  204: 'No Content - Request succeeded, but no response body',
  400: 'Bad Request - Could not parse request',
  401: 'Unauthorized - No authentication credentials provided or authentication failed',
  403: 'Forbidden - Authenticated user does not have access',
  404: 'Not Found - Resource not found',
  406: 'The format of the request is not available',
  410: 'The requested resource is permanently deleted and will not be retrieved',
  415: 'Unsupported Media Type - POST/PUT/PATCH request occurred without a "application/json" content type',
  422: 'Data validation failed',
  500: 'An internal server error occurred',
  502: 'Gateway error',
  503: 'Service is unavailable, server is temporarily overloaded or maintained',
  504: 'Gateway timeout',
};

export const ModalType = {
  CHAT_ADD_DIRECT_MESSAGE_CHANNEL: 'CHAT_ADD_DIRECT_MESSAGE_CHANNEL',
  CHAT_LIST_DIRECT_MESSAGES: 'CHAT_LIST_DIRECT_MESSAGES',
  CHAT_MESSAGE_DELETE: 'CHAT_MESSAGE_DELETE',
  REPLY_CHAT_MESSAGE_DELETE: 'REPLY_CHAT_MESSAGE_DELETE',
  CHAT_MESSAGE_FORWARD: 'CHAT_MESSAGE_FORWARD',
};

export enum ErrorType {
  MAX_LENGTH = 'max',
  REQUIRED = 'required',
  REGEX = 'regex',
  DATE = 'date',
  EQUAL = 'compareEqual',
  NOT_EQUAL = 'compareNotEqual',
  GREATER_THAN = 'compareGreaterThan',
  GREATER_THAN_OR_EQUAL_TO = 'greaterThanOrEqual',
  LESS_THAN = 'lessThan',
  LESS_THAN_OR_EQUAL_TO = 'lessThanOrEqualTo',
  INVALID = 'invalid',
  BOOLEAN = 'boolean',
}

export enum RolesConstants {
  AuroraAdmin = 'aurora-admin',
  Candidate = 'candidate',
  CompanyAdmin = 'company-admin',
  CompanyRecruiter = 'company-recruiter',
  CompanyMember = 'company-member',
  CompanyGuest = 'company-guest',
  Chatbot = 'chatbot',
  CompanyOwner = 'company-owner',
  CompanyBilling = 'company-billing',
}

export enum ChannelTypes {
  JobChannelMessage = 'job-channel',
  DirectMessage = 'direct-message',
  SelfMessage = 'self-message',
  ChatBotMessage = 'chatbot-direct-message',
}

export enum ChatColors {
  OnlineGreen = '#39c049',
  OfflineGray = '#d2d2d2',
  ChatBotBlue = '#0050c8',
}
