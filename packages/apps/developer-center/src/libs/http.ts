import axios, { AxiosRequestConfig } from 'axios';
import { mapValues } from 'lodash';
import { stringify } from 'query-string';

const instance = axios.create({
  baseURL: '',
  maxRedirects: 10,
  timeout: 10 * 1000,
  withCredentials: true,
});

export interface Response<T> {
  errorCode: number;
  errorMessage: string;
  payload: T;
}

const createHttp = (method: Required<AxiosRequestConfig>['method']) => {
  return async <T>(url: string, config: AxiosRequestConfig = {}) => {
    config = {
      paramsSerializer: function (params) {
        return stringify(params, { arrayFormat: 'none' });
      },
      ...config,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
      url,
      method,
    };

    return instance.request<T>(config).then((res) => {
      return Promise.resolve(res);
    });
  };
};

/**
 * 对于不返回json数据的请求，可以使用verboseHttp
 */
export const verboseHttp = {
  get: createHttp('get'),
  head: createHttp('head'),
  patch: createHttp('patch'),
  post: createHttp('post'),
  put: createHttp('put'),
  delete: createHttp('delete'),
};

/**
 * 对于返回json数据的请求，直接使用http
 */
export const http = mapValues(
  verboseHttp,
  (fn) =>
    <T>(...args: Parameters<typeof fn>) =>
      fn<Response<T>>(...args).then((res) => {
        if (res.data.errorCode !== 0) {
          return Promise.reject(res);
        }
        return Promise.resolve(res.data.payload);
      })
);
