export enum EnvType {
  Local = 'local',
  Development = 'development',
  Production = 'production',
  Staging = 'staging',
  Qa = 'qa',
}

interface ServerConfig {
  host: string;
  apiUrl: string; // for accessing actual API host
  mockApiUrl: string; // for accessing mocked API host
  chatApiUrl: string;
  chatSocketApiUrl: string;
  fileServerApiUrl: string;
  cookieDomain: string;
}

const serverEnvironments: {
  local: ServerConfig;
  qa: ServerConfig;
  staging: ServerConfig;
  development: ServerConfig;
  production: ServerConfig;
} = {
  [EnvType.Local]: {
    host: 'http://development.aurora.app',
    apiUrl: 'https://api.dev.aurora.app',
    mockApiUrl: 'http://localhost:3031',
    chatApiUrl: 'https://chat-api.dev.aurora.app',
    chatSocketApiUrl: 'https://chat-api.dev.aurora.app',
    fileServerApiUrl: 'https://file-api.dev.aurora.app',
    cookieDomain: 'localhost',
  },
  [EnvType.Development]: {
    host: 'http://development.aurora.app',
    apiUrl: 'https://api.dev.aurora.app',
    mockApiUrl: 'https://mock-candidate-api.aurora.app',
    chatApiUrl: 'https://chat-api.dev.aurora.app',
    chatSocketApiUrl: 'https://chat-api.dev.aurora.app',
    fileServerApiUrl: 'https://file-api.dev.aurora.app',
    cookieDomain: '.dev.aurora.app',
  },
  [EnvType.Qa]: {
    host: 'https://qa.aurora.app',
    apiUrl: 'https://api.qa.aurora.app',
    mockApiUrl: 'https://api.qa.aurora.app', // no mock API for QA env, use apiUrl instead
    chatApiUrl: 'https://chat-api.qa.aurora.app',
    chatSocketApiUrl: 'https://chat-api.qa.aurora.app',
    fileServerApiUrl: 'https://file-api.qa.aurora.app',
    cookieDomain: '.qa.aurora.app',
  },
  [EnvType.Staging]: {
    host: 'https://staging.aurora.app',
    apiUrl: 'https://stg-api.aurora.app',
    mockApiUrl: 'https://stg-api.aurora.app', // no mock API for Staging env, use apiUrl instead
    chatApiUrl: 'https://stg-chat-api.aurora.app',
    chatSocketApiUrl: 'https://dev-chat-api.aurora.app',
    fileServerApiUrl: 'https://stg-file-api.aurora.app',
    cookieDomain: '.aurora.app',
  },
  [EnvType.Production]: {
    host: 'https://aurora.app',
    apiUrl: 'https://api.aurora.app',
    mockApiUrl: 'https://api.aurora.app', // no mock API for Production env, use apiUrl instead
    chatApiUrl: 'https://chat-api.aurora.app',
    chatSocketApiUrl: 'https://chat-api.aurora.app',
    fileServerApiUrl: 'https://file-api.aurora.app',
    cookieDomain: '.aurora.app',
  },
};

// Node process env variable
export const Env: EnvType = process.env.NODE_ENV as EnvType;

// Node process.env.REACT_APP_BUILD
export const BuildEnv = process.env.REACT_APP_BUILD;

// Env is development
export const __DEV__: boolean = Env === EnvType.Development || BuildEnv === EnvType.Development;

// Env is staging
export const __STAG__: boolean = BuildEnv === EnvType.Staging;

// Env is production
export const __PROD__: boolean = Env === EnvType.Production;

// Server env variables function
export const ServerEnv = () => {
  if (BuildEnv === EnvType.Production) {
    // For production build
    return serverEnvironments[EnvType.Production];
  }

  if (BuildEnv === EnvType.Qa) {
    // For qa build
    return serverEnvironments[EnvType.Qa];
  }

  if (BuildEnv === EnvType.Staging) {
    // For staging build
    return serverEnvironments[EnvType.Staging];
  }

  if (BuildEnv === EnvType.Development) {
    // For development build
    return serverEnvironments[EnvType.Development];
  }

  // In all other cases return local environment config
  return serverEnvironments[EnvType.Local];
};
