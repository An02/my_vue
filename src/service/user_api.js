import service from '../util/request'

export const userApi = {
  getUserInfo: (query) => service.post('user/getUserInfo', query)
}
