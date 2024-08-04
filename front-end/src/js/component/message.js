import { SEND_TYPE, CHAT_TYPE, ITEM_TYPE, MESSAGE_TYPE } from "utils/constant";
import { sendMessage } from "component/websocket";
import { getUserInfo, handleUserInfo } from "component/user";
import { showInfoModal } from "component/modal";
import { chatType2messageType} from "utils/converter";
import { history } from 'api/chat';

// 使用到的变量
let currentChatType = CHAT_TYPE.NONE; // 当前的聊天类型
let currentChatId = ''; // 当前的聊天对象id

 // 好友消息列表
 const chatMessages = {
    'friend': {},
    'group': {},
    'admin': {},
}; 

async function initSendPic(){
    let pic_btn = document.getElementById("pic-btn");
    pic_btn.addEventListener("click", ()=>{
        const pic_input = document.querySelector("#pic-input");
        pic_input.click();
    });

    document.getElementById('pic-input').addEventListener('change', function() {
        let file = this.files[0];
        if (file) {
            // 在这里可以进一步处理文件，比如上传到服务器
            console.log(file);
        }
    });
}

async function initSendMessageInput(){
    document.querySelector('#send-message-input').addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            document.getElementById('send-message').click();
        }
    });
}

// 监听消息发送按钮的点击事件
export async function initSendMessage(){
    document.getElementById('send-message').addEventListener('click', async () => {
        if(currentChatType == CHAT_TYPE.NONE){
            alert("请选择一名聊天对象！");
            return;
        }
        const input = document.getElementById('send-message-input');
        const messageText = input.value.trim();
        const userInfo = await getUserInfo({userId: -1});
        if (messageText) {

            const timestamp = new Date().toISOString();
            
            const messageType = chatType2messageType(currentChatType);

            const data = {"type": messageType, 
                          "content": messageText, 
                          "from": userInfo.userId,
                          "to": currentChatId,
                          "timestamp": timestamp,}

            sendMessage(data);

            addMessage(SEND_TYPE.SELF, userInfo, messageText);

            addMessage2ChatMessages(currentChatType, data);

            input.value = '';
        }
    });

    initSendMessageInput();

    initSendPic();
}

function checkChatInfo(chatType, chatId){
    if(!chatMessages[chatType][chatId]){
        return false;
    }else{
        return true;
    }
}

function initChatInfo(chatType, chatId){
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

export async function loadMessages(messageInfoList){
    const userInfo = await getUserInfo({userId: -1});
    const messages = document.querySelector("#messages");
    messages.innerHTML = ``;
    if(messageInfoList){
        for(let i = 0; i < messageInfoList.length; i++){
            let messageInfo = messageInfoList[i];
            
            if(messageInfo.senderId == userInfo.userId){
                // 如果是自己发送的
                addMessage(SEND_TYPE.SELF, userInfo, messageInfo.msgContent);
            }else{
                // 如果是别人发送的
                const fromUserInfo = await getUserInfo({userId: messageInfo.senderId});
                handleUserInfo(fromUserInfo);
                addMessage(SEND_TYPE.OTHER, fromUserInfo, messageInfo.msgContent);
            }
        }
    }
}

// 添加到消息列表中
async function addMessage2ChatMessages(chatType, data){
    const userInfo = await getUserInfo({userId: -1});

    let chatId;
    if(data.from == userInfo.userId){
        chatId = data.to;
    }else{
        if(chatType == CHAT_TYPE.GROUP){
            chatId = data.group;
        }else if(chatType == CHAT_TYPE.FRIEND){
            chatId = data.from;
        }
    }

    if(!checkChatInfo(chatType, chatId)){
        initChatInfo(chatType, chatId);
    }

    chatMessages[chatType][chatId]['history'].push({
        msgId: -1,
        msgContent: data.content,
        senderId: data.from,
        msgCreateTime: data.timestamp,
        status: 0,
    });

    console.log("打印chatMessages: ", chatMessages);
}

async function addRightMessage(userInfo, messageText){
    const messages = document.querySelector('#messages');
    const message = document.createElement('div');
    message.className = 'message';
    message.setAttribute('data-userId', userInfo.userId);
    message.innerHTML += `
        <div class="message-right">
            <p class="msg-right-text">
                ${messageText}
            </p>
            <div class="avatar">
                <img src=${userInfo.userAvatar}>
            </div>
        </div>
    `;
    message.querySelector('.avatar').addEventListener('click', () => {
        showInfoModal(userInfo, ITEM_TYPE.USER);
    });
    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
}

async function addLeftMessage(userInfo, messageText){
    const messages = document.querySelector('#messages');
    const message = document.createElement('div');
    message.className = 'message';
    message.setAttribute('data-userId', userInfo.userId);
    message.innerHTML += `
        <div class="message-left">
            <div class="avatar">
                <img src=${userInfo.userAvatar}>
            </div>
            <p class="msg-left-text">
                ${messageText}
            </p>
        </div>
    `;
    message.querySelector('.avatar').addEventListener('click', () => {
        showInfoModal(userInfo, ITEM_TYPE.USER);
    });
    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
}

async function addMessage(sendType, fromUserInfo, messageText){
    if(sendType == SEND_TYPE.SELF){
        // 表示自己发送的
        addRightMessage(fromUserInfo, messageText);
    }else if(sendType == SEND_TYPE.OTHER){
        // 表示别人发送的
        addLeftMessage(fromUserInfo, messageText);
    }
};

export async function handleGroupMessage(data){
    const messageText = data.content; //  挂载到左侧用户发送的消息栏上
    if (messageText) {
        addMessage2ChatMessages(CHAT_TYPE.GROUP, data);
        if(currentChatType == CHAT_TYPE.GROUP && currentChatId == data.group){
            // 如果是当前窗口的，那么就直接显示，不需要添加到未读消息中
            const fromUserInfo = await getUserInfo({userId: data.from})

            handleUserInfo(fromUserInfo);

            addMessage(SEND_TYPE.OTHER, fromUserInfo, messageText);
        }else{
            // 不是当前窗口的，那么就添加到未读消息中，其中已经保证了chat_info的初始化
            addUnreadMessage(CHAT_TYPE.GROUP, data.group);
        }
    }
}

export async function handleFriendMessage(data){
    const messageText = data.content; //  挂载到左侧用户发送的消息栏上
    if (messageText) {
        addMessage2ChatMessages(CHAT_TYPE.FRIEND, data);
        if(currentChatType == CHAT_TYPE.FRIEND && currentChatId == data.from){
            // 如果是当前窗口的，那么就直接显示，不需要添加到未读消息中
            const fromUserInfo = await getUserInfo({userId: data.from})

            handleUserInfo(fromUserInfo);

            addMessage(SEND_TYPE.OTHER, fromUserInfo, messageText);
        }else{
            // 不是当前窗口的，那么就添加到未读消息中，其中已经保证了chat_info的初始化
            addUnreadMessage(CHAT_TYPE.FRIEND, data.from);
        }
    }
}

function addUnreadMessage(chatType, chatId){
    console.log("当前chatM", chatMessages)
    console.log("当前chatType", chatType)
    console.log("当前chatId", chatId)
    chatMessages[chatType][chatId]['num_unread_msg'] += 1;
    let num_unread_msg = chatMessages[chatType][chatId]['num_unread_msg'];
    // 在当前的用户列表中找到具有该属性的元素，并且添加未读消息
    let item;
    if(chatType == CHAT_TYPE.FRIEND){
        item = document.querySelector(`.friend-item[data-id="${chatId}"]`);
    }else if(chatType == CHAT_TYPE.GROUP){
        item = document.querySelector(`.group-item[data-id="${chatId}"]`);
    }
    const unread_msg = item.querySelector('.unread-msg');
    if(!unread_msg){
        item.innerHTML += `
            <div class="unread-msg" data-num="${num_unread_msg}">${num_unread_msg}</div>
        `;
    }else{
        unread_msg.setAttribute('data-num', num_unread_msg);
        if(num_unread_msg >= 100){
            unread_msg.innerText = "99+";
        }else{
            unread_msg.innerText = num_unread_msg;
        }
    }
}

export function clearUnreadMessage(chatType, chatId){
    
    chatMessages[chatType][chatId]['num_unread_msg'] = 0;
    let item;
    if(chatType == CHAT_TYPE.FRIEND){
        item = document.querySelector(`.friend-item[data-id="${chatId}"]`);
    }else if(chatType == CHAT_TYPE.GROUP){
        item = document.querySelector(`.group-item[data-id="${chatId}"]`);
    }
    const unread_msg = item.querySelector('.unread-msg');
    if(unread_msg){
        unread_msg.remove();
    }
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

// 获得当前状态
export function getCurrentState(){
    return {
        currentChatId,
        currentChatType,
    }
}

export function changeChatView(chatType, chatId){
    currentChatType = chatType; // 改变当前聊天类型
    currentChatId = chatId;
    const messageInfoList = chatMessages[chatType][currentChatId]['history'];
    loadMessages(messageInfoList); 
    clearUnreadMessage(chatType, currentChatId);
}

// 获取历史的消息
export async function getHistoryMessages() { 
    const userInfo = await getUserInfo({userId: -1});
    const userQuery = {userId: userInfo.userId}
    history(userQuery).then(response => {
        if (!response.ok) {
            throw new Error('网络错误：' + response.statusText);
        }
        return response.json();
    })
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
