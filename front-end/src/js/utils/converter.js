import {MESSAGE_TYPE, CHAT_TYPE} from 'utils/constant';

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
    convertedMessage.content = sendMessageInfo.msgContent;
    convertedMessage.from = sendMessageInfo.senderId;
    convertedMessage.to = sendMessageInfo.to;
    convertedMessage.timestamp = sendMessageInfo.msgCreateTime;
    convertedMessage.form = sendMessageInfo.form;
    return convertedMessage;
}   

export function recvMessageConverter(recvMessageInfo){
    const convertedMessage = {};
    convertedMessage.msgId = "3";
    convertedMessage.msgContent = recvMessageInfo.content;
    convertedMessage.senderId = recvMessageInfo.from;
    convertedMessage.msgCreateTime = recvMessageInfo.timestamp;
    convertedMessage.status = 0;
    convertedMessage.form = recvMessageInfo.form;

    return convertedMessage;
}