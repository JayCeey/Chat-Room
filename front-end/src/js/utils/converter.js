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
