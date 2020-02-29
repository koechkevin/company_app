// API url config

const API_VERSION = 'v1';

export const ApiUrl = {
  DRAFTS: `${API_VERSION}/drafts`,
  CHANNEL: `${API_VERSION}/rooms`,
  MESSAGE: `${API_VERSION}/messages`,
  CAREER_JOBS: `${API_VERSION}/career`,
  THREAD: `${API_VERSION}/threads`,

  AUTH_LOGIN: `${API_VERSION}/auth/login`,
  AUTH_SELECT_PROFILE: `${API_VERSION}/auth/select-profile`,

  USER: `${API_VERSION}/users`,
  USER_EXISTS: `${API_VERSION}/users/exist`,
  USER_PROFILE: `${API_VERSION}/users/profiles`,
  USER_MY_PROFILE: `${API_VERSION}/users/my-profiles`,
  USER_ACTIVITY_LOG: `${API_VERSION}/users/activity-log`,
  USER_COMPANY_PROFILES: `${API_VERSION}/users/company-profiles`,
  USER_CANDIDATE_PROFILES: `${API_VERSION}/users/candidate-profiles`,

  AUTH_FORGOT_PASSWORD: `${API_VERSION}/users/users/forgot-password`,
  AUTH_FILL_PASSWORD: `${API_VERSION}/users/users/fill-new-password`,

  JOBS_ALL: `${API_VERSION}/jobs/jobs`,
  JOBS_CURRENCY: `${API_VERSION}/jobs/currencies`,
  JOBS_LENGTH_TYPE: `${API_VERSION}/jobs/job-length-types`,
  JOBS_EDUCATION_LEVELS: `${API_VERSION}/jobs/education-levels`,

  FILE_UPLOAD: `${API_VERSION}/files`,

  COMPANY: `${API_VERSION}/company`,
  COMPANY_DETAILS: `${API_VERSION}/companies/companies`,
  COMPANY_DEPARTMENTS: `${API_VERSION}/companies/departments`,
  COMPANY_LOCATIONS: `${API_VERSION}/companies/locations`,

  TIMEZONES: `${API_VERSION}/timezones/timezones`,
};
