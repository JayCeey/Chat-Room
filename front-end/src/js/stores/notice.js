import CONFIG from '../config.js';
import { getUserInfo } from 'stores/user.js';
import { friendResult, groupResult } from 'api/friend.js';
import { addUnreadNotice } from 'component/notice.js';

let noticeList = [];
let unreadCnt = 0;

export function addUnreadCnt() {
    unreadCnt++;
}

export function clearUnreadCnt() {
    unreadCnt = 0;
}

export function pushNotice(noticeInfo){
    noticeList.push(noticeInfo);
}

export function getNoticeList(){
    return noticeList;
}

function findNoticeIndex(notice_id){
    return noticeList.findIndex((notice) => notice.notice_id == notice_id);
}

export function deleteNotice(notice_id){
    let notice_idx = findNoticeIndex(notice_id);
    if(notice_idx != -1){
        noticeList.splice(notice_idx, 1);
        return true;
    }else{
        return false;
    }
}

// 监听服务器是否发送消息回来
export async function initNoticeListner(){
    const eventSource = new EventSource(`${CONFIG.BASE_URL}/notice`);
    eventSource.onmessage = (event) => {
        console.log(`收到服务器通知: ${event.data}`);
        const data = JSON.parse(event.data)
        for(let i = 0; i < data.notices.length; i++){
            noticeList.push(data.notices[i]);
            addUnreadNotice();
        }
    };
}

export async function sendRejectFriendRequest(notice){
    const userInfo = await getUserInfo({userId: -1});
    const resultInfo = {
        'from': userInfo.userId,
        'to': notice.data.senderId,
        'type': 1, // 同意
    }
    return await friendResult(resultInfo).then(response =>
        response.data
    ).then(res => {
        const data = res.data;
        if(data.success){
            return {success: true, msg: null};
        }
    }).catch(error => {
        return {success: false, msg: error};
    });
}

export async function sendAcceptFriendNotice(notice){
    const userInfo = await getUserInfo({userId: -1});
    const resultInfo = {
        'from': userInfo.userId,
        'to': notice.data.senderId,
        'type': 0, // 不同意
    }
    return await friendResult(resultInfo).then(response =>
        response.data
    ).then(res => {
        const data = res.data;
        if(data.success){
            return {success: true, msg: null};
        }
    }).catch(error => {
        return {success: false, msg: error};
    });
}

export async function sendDeleteFriendNotice(notice){
    const userInfo = await getUserInfo({userId: -1});
    const resultInfo = {
        'from': userInfo.userId,
        'to': notice.data.senderId,
        'type': 2, // 删除
    }
    return await friendResult(resultInfo).then(response =>
        response.data
    ).then(res => {
        const data = res.data;
        if(data.success){
            return {success: true, msg: null};
        }
    }).catch(error => {
        return {success: false, msg: error};
    });
}