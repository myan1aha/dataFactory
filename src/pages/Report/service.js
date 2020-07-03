import request from '@/utils/request';
import { stringify } from 'qs';

// // 获取服务器实例
// export async function getServerDetail(params) {
//     // console.log(params);
//     const result = await request(`/meta/server/get${params ? `?${stringify(params)}` : ''}`);
//     // console.log(result);
//     return result;
// }

// 获取服务器实例
export async function getReport(params) {
  let pageDetail = '';
  const { col, page = 0, pageSize = 3 } = params;
  let result;
    if (col === 'company') {
      pageDetail = {
        start: (page - 1) * pageSize,
        count: pageSize,
      }
      console.log(pageDetail);
      result = await request(`/stat/${col}${pageDetail ? `?${stringify(pageDetail)}` : ''}`);
      return result;
    }
    result = await request(`/stat/${col}${pageDetail ? `?${stringify(pageDetail)}` : ''}`);
    // console.log('getReport', result);
    return { data: result };
}

// //添加实例
// export async function addServer(params) {
//     console.log('addServer', params)
//     const result = await request('meta/server/create', {
//       method: 'POST',
//       data: params,
//     });
//     return result;
// }

// export async function getTargetReport(params) {
//   const { name, page = 1, pageSize = 200 } = params;
//   const val = {
//     name,
//     start: (page - 1) * pageSize,
//     count: pageSize,
//   }
//   const result = await request(`/stat/company/search${val ? `?${stringify(val)}` : ''}`);
//   return result;
// }

export async function getTargetReport(params) {
  const { name, page = 1, pageSize = 3 } = params;
  const val = {
    name,
    start: (page - 1) * pageSize,
    count: pageSize,
  }
  console.log(val);
  const result = await request(`/stat/company/search${val ? `?${stringify(val)}` : ''}`);
  return result;
}
