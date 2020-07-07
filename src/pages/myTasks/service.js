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
  return result;
}

export async function getTableDetail(params) {
  const result = await request(`/meta/server/get${params ? `?type=${params}` : ''}`);
  return result || {};
}

// 获取实例详情
export async function getEntityDetail(params) {
  const result = await request(`/meta/get/subs${params ? `?entityId=${params}` : ''}`);
  return result || {};
}

// 获取任务列表
export async function getList() {
  const result = await request('/node/list');
  const list = [...result];
  return { list };
}

// 获取部分任务列表
export async function getTargetList(params) {
  const { taskName = '', projectName = '' } = params;
  const val = {
    taskName,
    projectName,
  }
  console.log(val);
  const result = await request(`/node/search${val ? `?${stringify(val)}` : ''}`);
  const list = [...result];
  return { list };
}

// 搜索列表
export async function getSearchList(params) {
  const result = await request(`/node/list${params ? `?entityId=${params}` : ''}`);
  const list = [...result];
  return { list };
}

// 获取项目详情
export async function getProList() {
  const result = await request('/node/projectNames');
  // console.log(result);
  const proList = [...result];
  return proList;
}

export async function getProJson(params) {
  // const result = await request(`/node/projectjson${params ? `?projectName=${params}` : ''}`);
  const result = await request(`/node/projectjson${params ? `?projectName=test4` : ''}`);
  return result;
}

//添加任务
export async function addTask(params) {
  console.log('addTask', params)
  const result = await request('/node/create', {
    method: 'POST',
    data: params,
  });
  return result;
}

//解析任务依赖
export async function taskDependency(params) {
  const result = await request('/node/dependency', {
    method: 'POST',
    data: params,
  });
  return result;
}

//编辑任务
export async function editTask(params) {
  const result = await request('/node/update', {
    method: 'POST',
    data: params,
  });
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
  // console.log(result);
  return result;
}

// export async function exportProject(params) {
//   const result = await request(`/api/project/export${params ? `?${stringify(params)}` : ''}`,{
//     responseType:'arraybuffer',
//   });
//   // return result;
// }
