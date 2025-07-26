import endpoints from '@utils/endpoints';
import {ApiService} from './api.service';
import {createQueryParams} from '@utils/functions';

export const HomeService = {
  async getCoursesList(payload: any): Promise<any> {
    const response = await ApiService.get(endpoints.COURSES+'?'+createQueryParams(payload));
    return response?.data;
  },
  async getCoursesDetails(payload: any): Promise<any> {
    const response = await ApiService.get(endpoints.COURSES+'/'+payload.courseId);
    return response?.data;
  },
};
