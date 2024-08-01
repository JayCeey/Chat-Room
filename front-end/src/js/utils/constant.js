const MESSAGE_TYPE = {
    MESSAGE_FRIEND: 0,
    MESSAGE_GROUP: 1,
    ONLINE: 2,
    OFFLINE: 3,
};

const CHAT_TYPE = {
    NONE: -1,
    FRIEND: 0,
    GROUP: 1,
};

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

module.exports = {    
    MESSAGE_TYPE,
    CHAT_TYPE,
    ADD_FRIEND_TYPE,
    ADD_GROUP_TYPE,
    NOTICE_TYPE,
    USER_TYPE,
};