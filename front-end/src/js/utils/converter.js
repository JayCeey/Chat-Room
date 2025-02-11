import {MESSAGE_TYPE, CHAT_TYPE} from 'utils/constant';

export function arrayBufferToBase64(buffer) {
    let binary = '';
    let bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

export function messageType2chatType(messageType){
    let chatType;
    if(messageType == MESSAGE_TYPE.MESSAGE_FRIEND){
        chatType = CHAT_TYPE.FRIEND;
    }else if(messageType == MESSAGE_TYPE.MESSAGE_GROUP){
        chatType = CHAT_TYPE.GROUP;
    }
    return chatType;
}

export function chatType2messageType(chatType){
    let messageType;
    if(chatType == CHAT_TYPE.FRIEND){
        messageType = MESSAGE_TYPE.MESSAGE_FRIEND;
    }else if(chatType == CHAT_TYPE.GROUP){
        messageType = MESSAGE_TYPE.MESSAGE_GROUP;
    }
    return messageType;
}

// 只是例子，具体根据业务逻辑来
export function sendMessageConverter(sendMessageInfo){
    const convertedMessage = {};
    convertedMessage.type = chatType2messageType(sendMessageInfo.msgType);
    convertedMessage.message = sendMessageInfo.msgContent;
    convertedMessage.from = sendMessageInfo.senderId;
    convertedMessage.to = sendMessageInfo.to;
    convertedMessage.timestamp = sendMessageInfo.msgCreateTime;
    convertedMessage.form = sendMessageInfo.form;
    return convertedMessage;
}   

export function recvMessageConverter(recvMessageInfo){
    const convertedMessage = {};
    convertedMessage.msgId = recvMessageInfo.msgId;
    convertedMessage.msgContent = recvMessageInfo.msgContent;
    convertedMessage.senderId = recvMessageInfo.senderId;
    convertedMessage.msgCreateTime = recvMessageInfo.msgCreateTime;
    convertedMessage.status = 0;
    convertedMessage.form = recvMessageInfo.form;

    return convertedMessage;
}