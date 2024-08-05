const MESSAGE_TYPE = {
    MESSAGE_FRIEND: 0,
    MESSAGE_GROUP: 1,
    ONLINE: 2,
    OFFLINE: 3,
    ASK_ONLINE: 4,
    RESPOND_ONLINE: 5,
};

const MESSAGE_FORM = {
    TEXT: 0,
    IMAGE: 1,
    FILE: 2,
    VIDEO: 3,
    AUDIO: 4,
}

const CHAT_TYPE = {
    NONE: 'none',
    FRIEND: 'friend',
    GROUP: 'group',
    ADMIN: 'admin',
};

const ITEM_TYPE = {
    USER: 'user',
    GROUP: 'group',
}

const USER_STATE = {
    ONLINE: 'online',
    OFFLINE: 'offline',
}

const ADD_FRIEND_TYPE = {
    REQUEST: 0,
    ACCEPT: 1,
    REJECT: 2,
    DELETE: 3,
}

const ADD_GROUP_TYPE = {
    REQUEST: 0,
    ACCEPT: 1,
    REJECT: 2,
    DELETE: 3,
}

const NOTICE_TYPE = {
    NORMAL: 0,
    REQUEST_FRIEND: 1,
    REQUEST_GROUP: 2,
    ACCEPT_FRIEND: 3,
    ACCEPT_GROUP: 4,
    DELETE_FRIEND: 5,
    DELETE_GROUP: 6,
}

const USER_TYPE = {
    ADMIN: 0,
    GROUP: 1,
    NORMAL_USER: 2,
    ADMIN: 3,
}

const SEND_TYPE = {
    SELF: 0,
    OTHER: 1,
}

module.exports = {    
    MESSAGE_TYPE,
    CHAT_TYPE,
    ITEM_TYPE,
    ADD_FRIEND_TYPE,
    ADD_GROUP_TYPE,
    NOTICE_TYPE,
    USER_TYPE,
    SEND_TYPE,
    USER_STATE,
    MESSAGE_FORM,
};