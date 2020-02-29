import { ApiUrl } from './ApiConfig';
import { GET_API, PUT_API } from './AxiosInstance';

export class UserService {
  public static fetchUserProfiles(params?: string): Promise<any> {
    return GET_API(ApiUrl.USER_PROFILE, params);
  }

  public static fetchUserMyProfiles(token: string, params?: string): Promise<any> {
    return GET_API(ApiUrl.USER_MY_PROFILE, params, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  public static fetchCompanyProfiles(params?: string): Promise<any> {
    return GET_API(ApiUrl.USER_COMPANY_PROFILES, params);
  }

  public static fetchCompanyUserProfile(profileId: string, params?: string): Promise<any> {
    return GET_API(`${ApiUrl.USER_COMPANY_PROFILES}/${profileId}`, params);
  }

  public static updateCompanyUserProfile(profileId: any, data: any, config?: any): Promise<any> {
    return PUT_API(`${ApiUrl.USER_COMPANY_PROFILES}/${profileId}?expand=timezone`, data, config);
  }

  public static fetchCandidateProfiles(params?: string): Promise<any> {
    return GET_API(ApiUrl.USER_CANDIDATE_PROFILES, params);
  }

  public static fetchUserProfile(id: string, params: string): Promise<any> {
    return GET_API(`${ApiUrl.USER_PROFILE}/${id}`, params);
  }

  public static fetchActivityLog(params?: string): Promise<any> {
    return GET_API(`${ApiUrl.USER_ACTIVITY_LOG}`, params);
  }

  public static updateMyProfile(id: string, data: any): Promise<any> {
    return PUT_API(`${ApiUrl.USER_COMPANY_PROFILES}/${id}`, data);
  }

  public static changeMyPassword = (id: string, data: any): Promise<any> =>
    PUT_API(`${ApiUrl.USER_PROFILE}/${id}/change-password`, data);

  public static checkUserExistence = (data: any): Promise<any> => GET_API(ApiUrl.USER_EXISTS, data);
}
