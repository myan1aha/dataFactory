import request from '@/utils/request';
import { stringify } from 'qs';

// 获取服务器实例
export async function getServerDetail(params) {
    // console.log(params);
    const result = await request(`/meta/server/get${params ? `?${stringify(params)}` : ''}`);
    // console.log(result);
    return result;
}

// 获取服务器实例
export async function getOnlineList() {
    const result = await request("/meta/onlineTable/list");
    console.log(result);
    return result;
}

//添加实例
export async function addServer(params) {
    console.log('addServer', params)
    const result = await request('meta/server/create', {
      method: 'POST',
      data: params,
    });
    return result;
}

//导入指定子实例元数据
export async function importEntityChildren(params) {
    console.log(params);
    const result = await request('/meta/import', {
        method: 'POST',
        data: params,
    });
    return result;
}

//删除实例
export async function deleteEntity(param) {
    console.log(params);
    const result = await request('/meta/delete', {
        method: 'POST',
        data: params,
    });
    return result;
}