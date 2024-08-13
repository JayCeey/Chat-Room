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
    friendResult(resultInfo).then(response =>
        response.json()
    ).then(data => {
        if(data.success){
            alert("发送成功");
        }
    }).catch(error => {
        alert("错误：", error);
    });
}

export async function sendAcceptFriendNotice(notice){
    const userInfo = await getUserInfo({userId: -1});
    const resultInfo = {
        'from': userInfo.userId,
        'to': notice.data.senderId,
        'type': 0, // 同意
    }
    friendResult(resultInfo).then(response =>
        response.json()
    ).then(data => {
        if(data.success){
            alert("添加成功");
        }
    }).catch(error => { 
        alert("错误：", error);
    });
}

