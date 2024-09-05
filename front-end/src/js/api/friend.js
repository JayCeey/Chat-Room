import CONFIG from '../config.js';
import request from 'utils/request';

export function getFriends(friendQuery){
    console.log("获取好友列表", friendQuery)
    return request.post(`${CONFIG.FRIEND_URL}/getUserFriendInfo`, JSON.stringify(friendQuery), {
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json',
        },
    })
}

export async function friendResult(resultInfo){
    console.log("好友请求结果发送", resultInfo)
    return request.post(`${CONFIG.FRIEND_URL}/friend/result`, JSON.stringify(resultInfo), {
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json',
        },
    })
}

export async function groupResult(resultInfo){
    return fetch(`${CONFIG.BASE_URL}/group/result`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': sessionStorage.getItem('accessToken')
        },
        body: JSON.stringify(resultInfo),
        credentials: 'include',
    });
}


export async function sendAddRequest(addFriendVO){
    console.log("发送好友请求", addFriendVO)
    return request.post(`${CONFIG.FRIEND_URL}/friend/add`, JSON.stringify(addFriendVO), {
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json',
        },
    })
}