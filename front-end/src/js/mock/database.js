// 模拟后端数据库，这里只需要直接模拟要返回的数据即可，不用复杂的后端关系了

// 模拟用户数据，主键是uid
const mockUserInfo = {
    "001": {
        username: 'Server',
        userDetails: 'I am server',
        userAvatar: "",
    },
    "123": {
        username: 'Jayce',
        userDetails: 'hello, this is jayce',
        userAvatar: "",
    },
    "456": {
        username: 'Tom',
        userDetails: 'hello, this is Tom',
        userAvatar: "",
    },
    "789": {
        username: 'JayChou',
        userDetails: 'hello, this is Jaychou',
        userAvatar: "",
    },
}

// 模拟用户鉴权数据，主键是用户名
const mockUserCredential = {
    Jayce: {
        userId: "123",
        password: 'a6789e0ca9435ce7b0409336ccd5924b',
    },
    Tom: {
        userId: "456",
        password: 'a6789e0ca9435ce7b0409336ccd5924b',
    },
}

// 用户身份数据
const mockUserRole = {
    "123": 'user',
    "456": 'user',
}

// 模拟用户与好友的关系数据，
const mockUserFriend = {
    "123": ["456"],
    "456": ["123"],
}

// 模拟用户与群组的关系数据
const mockUserGroup = {
    "123": ["10001", "10002"],
    "456": ["10001"],
}

// 模拟群组数据，主键是group_id
const mockGroupInfo = {
    "10001": {
        groupName: 'JayCC的群',
        groupDetails: 'this is group1',
        groupAvatar: "",
    },
    "10002": {
        groupName: 'Jayce一家人',
        groupDetails: 'this is group2',
        groupAvatar: "",
    },
}

// 模拟群组成员
// 注：仅用于前端测试，后端不存储该表，该表在MYSQL仍存放在user_group数据库中
const mockGroupMember = {
    "10001": ["123", "456"],
    "10002": ["123", "789"],
}

// 用户的会话
const mockUserChat = {
    "123": [{chatId: "c123", userId2: "456"}],
    "456": [{chatId: "c123", userId2: "123"}]
}

// 用户聊天，chatId是主键
const mockUserChatInfo = {
    "c123": [{
                msgId: "1",
                msgContent: "hello",
                senderId: "123",
                msgCreateTime: "2021-11-11 12:00:00",
                status: 0,
                form: 0,
            },
            {
                msgId: "2",
                msgContent: "nice to meet you",
                senderId: "456",
                msgCreateTime: "2021-11-11 12:00:00",
                status: 0,
                form: 0,
            },
    ],
}

// 群组聊天，chatId是主键
const mockGroupChatInfo = {
    "10001": [{
                msgId: "1",
                msgContent: "你好",
                senderId: "123",
                msgCreateTime: "2021-11-11 12:00:00",
                status: 0,
                form: 0,
            },
            {
                msgId: "2",
                msgContent: "嗨",
                senderId: "456",
                msgCreateTime: "2021-11-11 12:00:00",
                status: 0,
                form: 0,
            },
        ],
    "10002": [

    ],
}

const mockNoticeInfo = [{
    noticeId: "1",
    noticeTitle: "系统通知",
    noticeContent: "这是一条系统通知",
    noticeSenderId: "100", // 100是整个系统的最大管理员
    createTime: "2021-11-11 12:00:00",
    expireTime: "2021-11-15 12:00:00",
    noticeType: 0,},]

const mockUserNotice = {
    "123": [{
        noticeId: "1",
        status: 0, // 0未读，1已读
    }],
    "456": [
        
    ],
}

const mockDatabase = {
    user_info: mockUserInfo,
    user_credential: mockUserCredential,
    user_role: mockUserRole,
    user_friend: mockUserFriend,
    user_group: mockUserGroup,
    user_notice: mockUserNotice,
    user_chat: mockUserChat,
    user_chat_info: mockUserChatInfo,
    group_info: mockGroupInfo,
    group_member: mockGroupMember,
    group_chat_info: mockGroupChatInfo,
    notice_info: mockNoticeInfo,
}

// 模拟数据库
module.exports = {
    mockDatabase,
}
