import { showToast } from '@ui/constants/Toaster.service';
import axios from 'axios';


const axiosInstance = axios.create({
  baseURL: 'https://learn-api.kodekloud.com/api/',
  headers: {
    Accept: 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  async config => {
    try {
      config.headers['Authorization'] = ``;
      console.log('config->', config);
      return config;
    } catch (error) {
      console.log('error->', error);
    }
    return config;
  },
)


axiosInstance.interceptors.response.use(
  response => {
    return response;
  },

  error => {
    console.log('interceptors.response',JSON.parse(JSON.stringify(error)))
    if (error?.code == "ERR_NETWORK") {
      showToast('error','No Internet Connection','')
      throw {
        message: 'No Internet',
        type: 'ERR_NETWORK',
      };
    }
    if (error?.response?.status === 400) {
      throw {
        message: error?.response?.data?.message,
        type: '400',
      };
    } else if (error?.response?.status === 409) {
      throw {
        message: error?.response?.data?.message,
        type: '409',
      };
    } else if (error?.response?.status === 401) {
      if (
        error?.response?.data?.message === 'User does not exist.' ||
        error?.response?.data?.message ===
          'Your session has been expired. Please log in again.'
      ) {
        throw {
          message: error?.response?.data?.message,
          type: '401',
        };
      } else {
        throw {
          message: error?.response?.data?.message,
          type: '401',
        };
      }
    } else if (error?.response?.status === 500) {
      throw {
        message: error?.response?.data?.message,
        type: '500',
      };
    } else if (error?.response?.status === 404) {
      throw {
        message: error?.response?.data?.message,
        type: '404',
      };
    } else if (error?.response?.status === 423) {
      if (
        error?.response?.data?.message ===
        'You have been blocked by admin. Kindly contact to admin.'
      ) {
        throw {
          message: error?.response?.data?.message,
          type: '423',
        };
      } else {
        throw {
          message: error?.response?.data?.message,
          type: '423',
        };
      }
    }
    throw {
      message: error?.request?.response,
      type: '502',
    };
  },
);

export const ApiService = {
  async get(url: string, params?: any) {
    return await axiosInstance.get(url, {params});
  },

  async post(url: string, data: any, params?: any) {
    return await axiosInstance.post(url, data, {params});
  },

  async put(url: string, data: any, params?: any) {
    return await axiosInstance.put(url, data, {params});
  },

  async patch(url: string, data: any, params?: any) {
    return await axiosInstance.patch(url, data, {params});
  },

  async delete(url: string, params?: any) {
    return await axiosInstance.delete(url, {params});
  },
};