
const {Type} = require("../utils/constant.js");


const mockLoginResponse = {
    userInfo: {
        uid: 123,
        username: "jaycehhh",
        avatar: "",
        userDetails: "hello, this is jayce",
    },
    success: true,
};

const mockUserFriendResponse = {
    friends: [
        {
            uid: 444,
            username: "friend1",
            avatar: "123",
        },
        {
            uid: 555,
            username: "friend2",
            avatar: "123",
        },
        {
            uid: 666,
            username: "server123",
            avatar: "123",
        },
    ],
    groups: [
        {
            gid: 111,
            username: "group1",
            avatar: "123",
        },
        {
            gid: 222,
            username: "server123",
            avatar: "123",
        },
    ],
    success: true,
};

const mockUserChatResponse = {
    chats: [
        {
            name: "group1",
            type: Type.message_group,
            history: [
                { content: "hello", from: "group1", to: "jaycehhh", time: "2022-01-01 12:00:00" },
                { content: "how are you", from: "jaycehhh", to: "group1", time: "2022-01-01 12:01:00" },
            ],
            latestMsg: 3, // 最新的msg_id，给客户端获取消息用的
        },
        {
            name: "friend1",
            type: Type.message_friend,
            history: [
                { content: "this is ", from: "friend1", to: "jaycehhh", time: "2022-01-01 12:00:00" },
                { content: "fuck you", from: "jaycehhh", to: "friend1", time: "2022-01-01 12:01:00" },
            ],
            latestMsg: 3,
        },
    ],
    success: true,
};

module.exports = { 
    mockLoginResponse,
    mockUserFriendResponse, 
    mockUserChatResponse 
};