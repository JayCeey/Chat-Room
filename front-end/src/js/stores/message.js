import { history } from 'api/chat';
import { CHAT_TYPE, SEND_TYPE } from 'utils/constant';
import { getUserInfo, handleUserInfo } from 'stores/user';
import { addMessage, addUnreadMessage, loadMessages, clearUnreadMessage } from 'component/message';
import { recvMessageConverter } from 'utils/converter';

// 使用到的变量
let currentChatType = CHAT_TYPE.NONE; // 当前的聊天类型
let currentChatId = ''; // 当前的聊天对象id

 // 好友消息列表
const chatMessages = {
    'friend': {},
    'group': {},
    'admin': {},
}; 

export function getCurrentChatType(){
    return currentChatType;
}

export function getCurrentChatId(){
    return currentChatId;
}

export function getCurrentState(){
    return {
        currentChatId,
        currentChatType,
    }
}

export function clearUnreadMsg(chatType, chatId){
    chatMessages[chatType][chatId]['num_unread_msg'] = 0;
}

export function addUnreadMsg(chatType, chatId){
    chatMessages[chatType][chatId]['num_unread_msg'] += 1;
}

export function getUnreadMsg(chatType, chatId){
    return chatMessages[chatType][chatId]['num_unread_msg'];   
}

function checkChatInfo(chatType, chatId){
    if(!chatMessages[chatType][chatId]){
        return false;
    }else{
        return true;
    }
}


export function initChatInfo(chatType, chatId){
    if(!checkChatInfo(chatType, chatId)){
        // 初始化聊天信息
        chatMessages[chatType][chatId] = {
            'history': [],
            'num_unread_msg': 0,
            'latest_msg': '', // 用于主动向服务器发送获取最新消息请求，一般websocket在线时服务器主动推送最新消息。
            'latest_timestamp': '',
        };
    }
}

// 添加到消息列表中
export async function addMessage2ChatMessages(chatType, chatId, messageInfo){

    if(!checkChatInfo(chatType, chatId)){
        initChatInfo(chatType, chatId);
    }

    chatMessages[chatType][chatId]['history'].push(messageInfo);

    console.log("打印chatMessages: ", chatMessages);
}

// 添加新的消息
export function addNewChat(chatType, chatId){
    initChatInfo(chatType, chatId);
}

// 设置当前状态
export function setCurrentState(state){
    currentChatId = state.currentChatId;
    currentChatType = state.currentChatType;
}

// 获取历史的消息
export async function getHistoryMessages() { 
    const userInfo = await getUserInfo({userId: -1});
    const userQuery = {userId: userInfo.userId}
    history(userQuery)
    .then(response => response.json())
    .then(response => {
        if(!response.success){
            throw new Error('获取历史消息失败');
        }

        let data = response.data;

        // 群组消息
        const groupChatsInfo = data.groupChatsInfo;
        Object.keys(groupChatsInfo).forEach(groupId => {
            initChatInfo(CHAT_TYPE.GROUP, groupId);
            chatMessages[CHAT_TYPE.GROUP][groupId].history = groupChatsInfo[groupId];
        })

        // 好友消息
        const friendChatsInfo = data.userChatsInfo;
        Object.keys(friendChatsInfo).forEach(friendUserId => {
            let chatInfo = friendChatsInfo[friendUserId];
            let chatHistory = chatInfo.history;
            initChatInfo(CHAT_TYPE.FRIEND, friendUserId);
            chatMessages[CHAT_TYPE.FRIEND][friendUserId].history = chatHistory;
        })

        console.log("当前的chat messages", chatMessages)
    })
    .catch(error => {
        console.error('错误:' + error);
    });
};


export function changeChatView(chatType, chatId){
    setCurrentState({
        currentChatId: chatId,
        currentChatType: chatType,
    })
    const messageInfoList = chatMessages[chatType][currentChatId]['history'];
    loadMessages(messageInfoList); 
    clearUnreadMessage(chatType, currentChatId);
}

export async function handleGroupMessage(data){
    console.log("这是", data)
    const messageInfo = recvMessageConverter(data);
    const messageText = messageInfo.msgContent; //  挂载到左侧用户发送的消息栏上
    if (messageText) {
        addMessage2ChatMessages(CHAT_TYPE.GROUP, data.group, messageInfo);
        if(currentChatType == CHAT_TYPE.GROUP && currentChatId == data.group){
            // 如果是当前窗口的，那么就直接显示，不需要添加到未读消息中
            const fromUserInfo = await getUserInfo({userId: data.from})

            handleUserInfo(fromUserInfo);

            addMessage(SEND_TYPE.OTHER, fromUserInfo, messageInfo);
        }else{
            // 不是当前窗口的，那么就添加到未读消息中，其中已经保证了chat_info的初始化
            addUnreadMessage(CHAT_TYPE.GROUP, data.group);
        }
    }
}

export async function handleFriendMessage(data){
    const messageInfo = recvMessageConverter(data);
    const messageText = messageInfo.msgContent; //  挂载到左侧用户发送的消息栏上
    if (messageText) {
        addMessage2ChatMessages(CHAT_TYPE.FRIEND, data.from, messageInfo);
        if(currentChatType == CHAT_TYPE.FRIEND && currentChatId == data.from){
            // 如果是当前窗口的，那么就直接显示，不需要添加到未读消息中
            const fromUserInfo = await getUserInfo({userId: data.from})

            handleUserInfo(fromUserInfo);

            addMessage(SEND_TYPE.OTHER, fromUserInfo, messageInfo);
        }else{
            // 不是当前窗口的，那么就添加到未读消息中，其中已经保证了chat_info的初始化
            addUnreadMessage(CHAT_TYPE.FRIEND, data.from);
        }
    }
}