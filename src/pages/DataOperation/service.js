import request from '@/utils/request';
import { stringify } from 'qs';

// 获取子实例
export async function getSubsDetail(params) {
    const result = await request(`/meta/get/subs${params ? `?entityId=${params}` : ''}`);
    return result;
}

// 获取在线表
export async function getOnlineList() {
    const result = await request('/meta/onlineTable/list');
    return result;
}


// 删除在线表
export async function deleteOnlineList(params) {
    const result = await request('/meta/onlineTable/delete', {
        method: 'POST',
        data: params,
    })
    return result;
}

//获取实例详情
export async function getOnlineListDetail(params) {
    const result = await request(`/meta/get/entity${params ? `?${stringify(params)}` : ''}`)
    return result;
}