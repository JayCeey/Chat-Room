import { SEND_TYPE, CHAT_TYPE, MESSAGE_TYPE } from "utils/constant";
import { sendMessage } from "component/websocket";
import { getUserInfo, showUserModal } from "component/user";
import { chatType2messageType} from "utils/converter";
import { history } from 'api/chat';
import DefaultAvatar from "assets/images/default_avatar.jpg";
import { handleUserInfo } from "./user";

// 使用到的变量
let currentChatType = CHAT_TYPE.NONE; // 当前的聊天类型
let currentChatId = ''; // 当前的聊天对象id

 // 好友消息列表
 const chatMessages = {
    'friend': {},
    'group': {},
    'admin': {},
}; 

function initSendPic(){
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

function initSendMessageInput(){
    document.querySelector('#send-message-input').addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            document.getElementById('send-message').click();
        }
    });
}

// 监听消息发送按钮的点击事件
export function initSendMessage(){
    document.getElementById('send-message').addEventListener('click', () => {
        if(currentChatType == CHAT_TYPE.NONE){
            alert("请选择一名聊天对象！");
            return;
        }
        const input = document.getElementById('send-message-input');
        const messageText = input.value.trim();
        const userInfo = getUserInfo();
        if (messageText) {

            const timestamp = new Date().toLocaleTimeString();
            
            const messageType = chatType2messageType(currentChatType);

            const data = {"type": messageType, 
                          "content": messageText, 
                          "from": userInfo.username,
                          "to": currentChatId,
                          "timestamp": timestamp,}

            sendMessage(data);

            addMessage(SEND_TYPE.SELF, userInfo, messageText);
 
            addMessage2ChatMessages(currentChatType, userInfo.username, currentChatId, messageText, timestamp);

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

export function loadMessages(messageInfoList){
    const userInfo = getUserInfo();
    const messages = document.querySelector("#messages");
    messages.innerHTML = ``;
    if(messageInfoList){
        for(let i = 0; i < messageInfoList.length; i++){
            let messageInfo = messageInfoList[i];
            if(messageInfo.from == userInfo.username){
                // 如果是自己发送的
                addMessage(SEND_TYPE.SELF, userInfo, messageInfo.content);
            }else if(messageInfo.to == userInfo.username){
                // 如果是别人发送的
                const from = {
                    'username': messageInfo.from,
                    'avatar': ''
                }
                handleUserInfo(from);
                addMessage(SEND_TYPE.OTHER, from, messageInfo.content);
            }
        }
    }
}

// 添加到消息列表中
function addMessage2ChatMessages(chatType, from, to, messageText, timestamp){
    const userInfo = getUserInfo();

    let chatId;
    if(from == userInfo.username){
        chatId = to;
    }else{
        chatId = from;
    }

    if(!checkChatInfo(chatType, chatId)){
        initChatInfo(chatType, chatId);
    }

    chatMessages[chatType][chatId]['history'].push({
        content: messageText,
        from: from,
        to: to,
        time: timestamp,
    });

    console.log("打印chatMessages: ", chatMessages);
}

function addMessage(sendType, from, messageText){
    const messages = document.querySelector('#messages');
    const message = document.createElement('div');
    message.classList.add('message');
    message.setAttribute("data-username", from.username);
    
    // 表示自己发送的
    if(sendType == SEND_TYPE.SELF){
        const userInfo = getUserInfo();

        const message_right = document.createElement('div');
        message_right.classList.add('message-right');

        const text = document.createElement('p');
        text.classList.add('msg-right-text');
        text.textContent = messageText;

        const avatar = document.createElement('div');
        avatar.classList.add('avatar');
        avatar.addEventListener('click', () => {
            showUserModal(userInfo);
        })

        const img = document.createElement('img');
        img.src = userInfo.avatar;

        messages.appendChild(message);
        message.appendChild(message_right);
        message_right.appendChild(text);
        avatar.appendChild(img);
        message_right.appendChild(avatar);
    }
    // 表示别人发送的
    else if(sendType == SEND_TYPE.OTHER){
        const message_left = document.createElement('div');
        message_left.classList.add('message-left');
    
        const text = document.createElement('p');
        text.classList.add('msg-left-text');
        text.textContent = messageText;
    
        const avatar = document.createElement('div');
        avatar.classList.add('avatar');
        avatar.addEventListener('click', () => {
            showUserModal(from);
        })

        const img = document.createElement('img');
        img.src = from.avatar;
    
        messages.appendChild(message);
        message.appendChild(message_left);
        avatar.appendChild(img);
        message_left.appendChild(avatar);
        message_left.appendChild(text);
    }
    messages.scrollTop = messages.scrollHeight;
};

export function handleMessage(chatType, data){
    const messageText = data.content; //  挂载到左侧用户发送的消息栏上
    if (messageText) {
        // 如果不在
        if(!chatMessages[chatType][data.from]){
            return;
        }
        const userInfo = getUserInfo();

        addMessage2ChatMessages(chatType, data.from, userInfo.username, messageText, data.timestamp);
        if(currentChatType == chatType && currentChatId == data.from){
            // 如果是当前窗口的，那么就直接显示，不需要添加到未读消息中
            const from = {
                'username': data.from,
                'avatar': ''
            }

            handleUserInfo(from);

            addMessage(SEND_TYPE.OTHER, from, messageText);
        }else{
            // 不是当前窗口的，那么就添加到未读消息中，其中已经保证了chat_info的初始化
            addUnreadMessage(chatType, data.from);
        }
    }
}

function addUnreadMessage(chatType, chatId){
    chatMessages[chatType][chatId]['num_unread_msg'] += 1;
    let num_unread_msg = chatMessages[chatType][chatId]['num_unread_msg'];
    // 在当前的用户列表中找到具有该属性的元素，并且添加未读消息
    let item;
    if(chatType == CHAT_TYPE.FRIEND){
        item = document.querySelector(`.friend-item[data-name="${chatId}"]`);
    }else if(chatType == CHAT_TYPE.GROUP){
        item = document.querySelector(`.group-item[data-name="${chatId}"]`);
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
        item = document.querySelector(`.friend-item[data-name="${chatId}"]`);
    }else if(chatType == CHAT_TYPE.GROUP){
        item = document.querySelector(`.group-item[data-name="${chatId}"]`);
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
    const chatInfo = chatMessages[chatType][currentChatId]['history'];
    loadMessages(chatInfo); 
    clearUnreadMessage(chatType, currentChatId);
}

// 获取历史的消息
export function getHistoryMessages(userInfo) { 
    history(userInfo).then(response => {
        if (!response.ok) {
            throw new Error('网络错误：' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        if(!data.success){
            throw new Error('获取历史消息失败');
        }

        console.log("返回chat history: ", data);

        let chats = data.chats;

        for(let i = 0; i < chats.length; i++) {
            let chat = chats[i];
            if(chat.type == MESSAGE_TYPE.MESSAGE_FRIEND){
                initChatInfo('friend', chat['name']);
                chatMessages['friend'][chat['name']]['history'] = chat.history;
            }else if(chat.type == MESSAGE_TYPE.MESSAGE_GROUP){
                initChatInfo('group', chat['name']);
                chatMessages['group'][chat['name']]['history'] = chat.history;
            }
        }
    })
    .catch(error => {
        console.error('错误:' + error);
    });
};
