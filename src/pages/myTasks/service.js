/*
 * @Author: your name
 * @Date: 2020-06-18 22:18:16
 * @LastEditTime: 2020-06-18 22:47:06
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /dataFactory/src/pages/Tasks/service.js
 */
import request from '@/utils/request';
import { stringify } from 'qs';

export async function getTaskDetail(params) {
  const result = await request(`/node${params ? `?${stringify(params)}` : ''}`);
  // console.log('getTaskDetail', result);
  return result;
}

export async function getTableDetail(params) {
  console.log(params);
  const result = await request(`/meta/server/get${params ? `?type=${params}` : ''}`);
  console.log('getTableDetail', result);
  return result || {};
}

//获取实例详情
export async function getEntityDetail(params) {
  console.log(params);
  const result = await request(`/meta/get/subs${params ? `?entityId=${params}` : ''}`);
  console.log('getTableDetail', result);
  return result || {};
}

export async function getList() {
  console.log('getList');
  const result = await request('/node/list');
  // console.log(result);
  const list = [...result];

  return { list };
}

export async function getProJson(params) {
  console.log('getProJson', params);
  // const result = await request(`/node/projectjson${params ? `?projectName=${params}` : ''}`);
  const result = await request(`/node/projectjson${params ? `?projectName=test4` : ''}`);
  console.log(result);
  return result;
}


export async function addTask(params) {
  console.log('addTask', params);
  const result = await request('/node/create', {
    method: 'POST',
    data: params,
  });
  console.log('addTask', result);
  return result;
}

export async function editTask(params) {
  console.log('send edit', params);
  const result = await request('/node/update', {
    method: 'POST',
    data: params,
  });
  console.log('edit', result);
  return result;
}

export async function postPro(params) {
  const result = await request('/node/update', {
    method: 'POST',
    data: params,
  });
  return result;
}

export async function portTask(params) {
  const result = await request('/node/upload', {
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
