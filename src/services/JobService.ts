import { ApiUrl } from './ApiConfig';
import { GET_API } from './AxiosInstance';

export class JobService {
  public static fetchJobs(actionCode: string, params?: object): Promise<any> {
    return GET_API(ApiUrl.JOBS_ALL, params, {
      headers: { 'Action-Code': actionCode },
    });
  }

  public static fetchJob(id: string, params: any): Promise<any> {
    return GET_API(`${ApiUrl.JOBS_ALL}/${id}`, params);
  }
}
