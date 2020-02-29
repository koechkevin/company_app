import { ApiUrl } from './ApiConfig';
import { GET_API } from './AxiosInstance';

export class CareerService {

  public static fetchJobs(params?: any): Promise<any> {
    return GET_API(ApiUrl.CAREER_JOBS, params);
  }

  public static fetchCompany(params?: any): Promise<any> {
    return GET_API(ApiUrl.COMPANY, params);
  }

}
