import { request } from '../util/request'

export const userApi = {
  getUserInfo: (query) => request('user/testEvent', query, 'post'),
  exportMethod: (query) => request('user/export', query, 'post')
}
