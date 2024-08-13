import { getCurrentState } from "stores/message";
import { getUserInfo } from "stores/user";
import { CHAT_TYPE } from "utils/constant";

// 客户端存储所有连接
const onlineUsers = {};

export async function handleOnline(userId){
    const userInfo = await getUserInfo({userId: userId});
    console.log(`用户${userInfo.username}上线拉, 当前的online-users${JSON.stringify(onlineUsers)}`);
    onlineUsers[userInfo.userId] = true;
    handleChangeState(userInfo, true);
};

export async function handleOffline(userId){
    const userInfo = await getUserInfo({userId: userId});
    console.log(`用户${userInfo.username}下线拉, 当前的online-users${JSON.stringify(onlineUsers)}`);
    delete onlineUsers[userInfo.userId];
    handleChangeState(userInfo, false);
};

async function handleChangeState(userInfo, state){
    const currentState = getCurrentState();
    const friend_items = document.querySelectorAll("#friend .friend-item");
    for(let i = 0; i < friend_items.length; i++){
        let friend_item = friend_items[i];
        if(friend_item.getAttribute("data-id") == userInfo.userId){
            friend_item.setAttribute('data-online', state)
        }
    }
    if(currentState.currentChatType == CHAT_TYPE.FRIEND && currentState.currentChatId == userInfo.userId){
        document.getElementById('chat-title-avatar').setAttribute('data-online', state);
    }
}

export async function getUserOnlineState(userInfo){
    if(!onlineUsers[userInfo.userId]){
        console.log(`${userInfo.username}不在线`);
        return false;
    }else{
        console.log(`${userInfo.username}在线`);
        return true;
    }
}

export function handleRespondOnline(usersId){
    usersId.forEach(userId => {
        handleOnline(userId);
    });
}