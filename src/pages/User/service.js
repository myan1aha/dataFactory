import request from '@/utils/request';
import { encrypt } from '@/utils/utils';

export async function changePassword(params) {
  const data = {
    passwordOld: encrypt(params.passwordOld),
    passwordNew: encrypt(params.passwordNew),
  };
  const result = await request('/api/project/changePassword', {
    method: 'POST',
    data,
  });
  return result;
}
