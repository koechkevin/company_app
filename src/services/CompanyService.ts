import { ApiUrl } from './ApiConfig';
import { GET_API, PUT_API } from './AxiosInstance';

export class CompanyService {
  public static fetchCompany(id: string, params?: object): Promise<any> {
    return GET_API(`${ApiUrl.COMPANY_DETAILS}/${id}`, params);
  }

  public static updateCompany(id: string, params?: object): Promise<any> {
    return PUT_API(`${ApiUrl.COMPANY_DETAILS}/${id}`, params);
  }

  public static fetchDepartments(params?: object): Promise<any> {
    return GET_API(ApiUrl.COMPANY_DEPARTMENTS, params);
  }

  public static fetchCompanySettings = (id: string, params?: object): Promise<any> => {
    return GET_API(`${ApiUrl.COMPANY_DETAILS}/${id}/settings`, params);
  };

  public static updateCompanySettings = (id: string, params?: object): Promise<any> => {
    return PUT_API(`${ApiUrl.COMPANY_DETAILS}/${id}/settings`, params);
  };

  public static fetchTimezones = (params?: object): Promise<any> => {
    return GET_API(`${ApiUrl.TIMEZONES}`, params);
  };

  public static fetchLocations = (params?: object): Promise<any> => {
    return GET_API(`${ApiUrl.COMPANY_LOCATIONS}`, params);
  };
}
