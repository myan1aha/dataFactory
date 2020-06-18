import request from '@/utils/request';
import { stringify } from 'qs';

export async function getTaskDetail(params) {
  const result = await request(
    `/task/get/entity${params ? `?taskId=${params.id}` : ''}`,
  );
  // console.log('getTaskDetail', result);
  return result || {};
}

export async function getList(params) {
  console.log('getList');
  const result = await request(
    '/node/list',
  );
  // console.log(result);
  const list = [...result];

  return { list };
}

// export async function listIndustry() {
//   const result = await request('/api/project/listIndustries');
//   return result || [];
// }

// export async function listInvestmentScale() {
//   const result = await request('/api/project/listInvestmentScale');
//   return result || [];
// }

export async function addTask(params) {
  const result = await request('/node/create', {
    method: 'POST',
    data: params,
  });
  return result;
}

export async function editTask(params) {
  const result = await request('/node/update', {
    method: 'POST',
    data: params,
  });
  return result;
}

export async function portTask(params) {
  const result = await request('/node/update', {
    method: 'POST',
    data: params,
  });
  return result;
}

export async function deleteTask(params) {
  console.log('dddddelete');
  const result = await request('/node/delete', {
    method: 'POST',
    data: params,
  });
  return result;
}

// export async function exportProject(params) {
//   const result = await request(`/api/project/export${params ? `?${stringify(params)}` : ''}`,{
//     responseType:'arraybuffer',
//   });
//   // return result;
// }
