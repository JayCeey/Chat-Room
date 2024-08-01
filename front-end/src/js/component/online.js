import { getCurrentState } from "component/message";
import { CHAT_TYPE } from "utils/constant";

// 客户端存储所有连接
const onlineUsers = {};

export function handleOnline(user){
    console.log(`用户${user}上线拉`);
    onlineUsers[user] = true;
    handleChangeState(user, true);
    console.log(`当前的online-users${JSON.stringify(onlineUsers)}`);
};

export function handleOffline(user){
    console.log(`用户${user}下线拉`);
    delete onlineUsers[user];
    handleChangeState(user, false);
    console.log(`当前的online-users${JSON.stringify(onlineUsers)}`)
};

function handleChangeState(user, state){
    const currentState = getCurrentState();
    console.log(`当前聊天对象${user}的状态${state}`);
    console.log(`当前聊天框用户${currentState.currentChatId}的状态${currentState.currentChatType}`);
    if(currentState.currentChatType == CHAT_TYPE.FRIEND && currentState.currentChatId == user){
        document.getElementById('chat-title-avatar').setAttribute('data-online', state);
        console.log("更新状态")
    }
}

export function getUserOnlineState(user){
    if(!onlineUsers[user]){
        console.log(`${user}不在线`);
        return false;
    }else{
        console.log(`${user}在线`);
        return true;
    }
}

export function handleRespondOnline(users){
    users.forEach(user => {
        handleOnline(user);
    });
}