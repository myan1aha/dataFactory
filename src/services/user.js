import request from '@/utils/request';
import { encrypt } from '@/utils/utils';

export async function query() {
  return request('/api/users');
}
export async function queryCurrent() {
  return request('/api/currentUser');
}
export async function queryNotices() {
  return request('/api/notices');
}
export async function accountLogin(params) {
  const data = {
    ...params,
    password: encrypt(params.password),
  };
  const result = await request('/api/project/login', { method: 'post', data });
  return result;
}
