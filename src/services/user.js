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
  const data = { ...params }
  // const data = {
  //   ...params,
  //   password: encrypt(params.password),
  // };
  const formData = new FormData();
  formData.append('phoneNumber', data.phoneNumber);
  formData.append('password', data.password);
  const result = await request('/user/login', { method: 'POST', data: formData });
  return result;
}
