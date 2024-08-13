import { SEND_TYPE, CHAT_TYPE, ITEM_TYPE, MESSAGE_TYPE, MESSAGE_FORM } from "utils/constant";
import { sendMessage } from "component/websocket";
import { getUserInfo, handleUserInfo } from "stores/user";
import { showInfoModal } from "component/modal";
import { Buffer } from 'buffer';
import { getCurrentChatType, getCurrentChatId, clearUnreadMsg, addMessage2ChatMessages, addUnreadMsg, getUnreadMsg } from "stores/message";
import { arrayBufferToBase64, sendMessageConverter } from "utils/converter";

async function initSendPic(){
    let pic_btn = document.getElementById("pic-btn");
    pic_btn.addEventListener("click", ()=>{
        const pic_input = document.querySelector("#pic-input");
        pic_input.click();
    });

    document.getElementById('pic-input').addEventListener('change', async function() {
        let file = this.files[0];
        if (file) {
            let currentChatType = getCurrentChatType();
            let currentChatId = getCurrentChatId();
            if(currentChatType == CHAT_TYPE.NONE){
                alert("你需要选择一个聊天对象发送图片");
                this.value = ''; // 清空值
                return;
            }
            const userInfo = await getUserInfo({userId: -1});
            let reader = new FileReader();
                reader.onload = function(e) {
                    let arrayBuffer = e.target.result;
                    // 将 ArrayBuffer 转换为 Base64
                    let base64String = arrayBufferToBase64(arrayBuffer);
                    const timestamp = new Date().toISOString();
                    const sendMessageInfo = {
                        msgType: currentChatType,
                        msgContent: base64String,
                        senderId: userInfo.userId,
                        to: currentChatId,
                        msgCreateTime: timestamp,
                        form: MESSAGE_FORM.IMAGE,
                    };

                    console.log("发送消息: ", sendMessageInfo)
                    
                    addMessage(SEND_TYPE.SELF, userInfo, sendMessageInfo);

                    addMessage2ChatMessages(currentChatType, currentChatId, sendMessageInfo);

                    const data = sendMessageConverter(sendMessageInfo);

                    sendMessage(data);
                };
            reader.readAsArrayBuffer(file);
            this.value = ''; // 清空值
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
        let currentChatType = getCurrentChatType();
        let currentChatId = getCurrentChatId();
        if(currentChatType == CHAT_TYPE.NONE){
            alert("请选择一名聊天对象！");
            return;
        }
        const input = document.getElementById('send-message-input');
        const messageText = input.value.trim();
        const userInfo = await getUserInfo({userId: -1});
        if (messageText) {

            const timestamp = new Date().toISOString();
            
            const sendMessageInfo = {
                msgId: "-1",
                msgContent: messageText,
                senderId: userInfo.userId,
                msgCreateTime: timestamp,
                status: 0,
                form: MESSAGE_FORM.TEXT,
            }

            addMessage(SEND_TYPE.SELF, userInfo, sendMessageInfo);

            addMessage2ChatMessages(currentChatType, currentChatId, sendMessageInfo);

            sendMessageInfo.msgType = currentChatType;
            sendMessageInfo.to = currentChatId;

            const data = sendMessageConverter(sendMessageInfo);

            sendMessage(data);

            input.value = '';
        }
    });

    initSendMessageInput();

    initSendPic();
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
                addMessage(SEND_TYPE.SELF, userInfo, messageInfo);
            }else{
                // 如果是别人发送的
                const fromUserInfo = await getUserInfo({userId: messageInfo.senderId});
                handleUserInfo(fromUserInfo);
                addMessage(SEND_TYPE.OTHER, fromUserInfo, messageInfo);
            }
        }
    }
}

function handleAddMessageType(messageContent, messageInfo){
    if(!messageInfo || messageInfo.form == MESSAGE_FORM.TEXT){
        messageContent.innerHTML = messageInfo.msgContent;
    }
    else if(messageInfo.form == MESSAGE_FORM.IMAGE){
        // 创建一个 Blob 对象，并生成图片 URL
        let arrayBuffer = Buffer.from(messageInfo.msgContent, 'base64');
        
        let blob = new Blob([arrayBuffer], { type: 'png' });
        let imageUrl = URL.createObjectURL(blob);
        messageContent.innerHTML = `<img src=${imageUrl} alt="图片" class="msg-img">`;
    }
}

async function addRightMessage(userInfo, messageInfo){
    const messages = document.querySelector('#messages');
    const message = document.createElement('div');
    message.className = 'message';
    message.setAttribute('data-userId', userInfo.userId);
    message.innerHTML += `
        <div class="message-right">
            <div class="message-container">
                <p class="username">${userInfo.username}</p>
                <p class="message-content"></p>
            </div>
            <div class="avatar">
                <img src=${userInfo.userAvatar}>
            </div>
        </div>
    `;
    const messageContent = message.querySelector('.message-content');
    handleAddMessageType(messageContent, messageInfo);
    message.querySelector('.avatar').addEventListener('click', () => {
        showInfoModal(userInfo, ITEM_TYPE.USER);
    });
    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
}

async function addLeftMessage(userInfo, messageInfo){
    const messages = document.querySelector('#messages');
    const message = document.createElement('div');
    message.className = 'message';
    message.setAttribute('data-userId', userInfo.userId);
    message.innerHTML += `
        <div class="message-left">
            <div class="avatar">
                <img src=${userInfo.userAvatar}>
            </div>
            <div class="message-container">
                <p class="username">${userInfo.username}</p>
                <p class="message-content"></p>
            </div>
        </div>
    `;
    const messageContent = message.querySelector('.message-content');
    handleAddMessageType(messageContent, messageInfo);

    message.querySelector('.avatar').addEventListener('click', () => {
        showInfoModal(userInfo, ITEM_TYPE.USER);
    });
    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
}

export async function addMessage(sendType, fromUserInfo, messageInfo){
    if(sendType == SEND_TYPE.SELF){
        // 表示自己发送的
        addRightMessage(fromUserInfo, messageInfo);
    }else if(sendType == SEND_TYPE.OTHER){
        // 表示别人发送的
        addLeftMessage(fromUserInfo, messageInfo);
    }
}

export function clearUnreadMessage(chatType, chatId){
    
    clearUnreadMsg(chatType, chatId);
    
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

export function addUnreadMessage(chatType, chatId){
    addUnreadMsg(chatType, chatId);
    
    let num_unread_msg = getUnreadMsg(chatType, chatId);
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