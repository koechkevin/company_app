import { BasicAuth } from '../models/user';
import { ApiUrl } from './ApiConfig';
import { POST_API, PUT_API } from './AxiosInstance';

export class AuthService {
  public static loginAccount(params: BasicAuth): Promise<any> {
    return POST_API(ApiUrl.AUTH_LOGIN, params, { timeout: 0 });
  }

  public static selectProfile(id: string, token: string): Promise<any> {
    return POST_API(
      ApiUrl.AUTH_SELECT_PROFILE,
      { profile_id: id },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
  }

  public static forgotPassword(email: string): Promise<any> {
    return POST_API(ApiUrl.AUTH_FORGOT_PASSWORD, { email });
  }

  public static fillNewPassword(data: any, authKey: string): Promise<any> {
    return PUT_API(`${ApiUrl.AUTH_FILL_PASSWORD}${authKey}`, data);
  }
}
