
const { NOTICE_TYPE, USER_TYPE } = require("../utils/constant");

const mockNoticeStreamResponse = {
    notices: [{
        notice_title: "新消息",
        notice_content: "你有新的消息",
        notice_sender: "服务器",
        type: NOTICE_TYPE.NORMAL,
        timestamp: new Date(),
        success: true,
    },]
}

const mockNoticeResponse = {
    notices: [
        {
            notice_title: "新消息1",
            notice_content: "你有新的消息",
            notice_sender: "服务器",
            timestamp: new Date(),
            success: true,
            type: NOTICE_TYPE.NORMAL,
            data: {

            }
        },
        {
            notice_title: "新消息2",
            notice_content: "你有新的消息",
            notice_sender: "服务器",
            timestamp: new Date(),
            success: true,
            type: NOTICE_TYPE.REQUEST_FRIEND,
            data: {
                userId: 456,
                username: 789,
                userAvatar: '', 
            }
        },
        {
            notice_title: "新消息3",
            notice_content: "你有新的消息",
            notice_sender: "服务器",
            timestamp: new Date(),
            success: true,
            type: NOTICE_TYPE.REQUEST_GROUP,
            data: {
                groupId: 10001,
                groupName: 'jayce群组',
                groupAvatar: '',
            }
        },
        {
            notice_title: "新消息4",
            notice_content: "你有新的消息",
            notice_sender: "服务器",
            timestamp: new Date(),
            success: true,
            type: NOTICE_TYPE.ACCEPT_FRIEND,
            data: {
                userId: 456,
                username: 789,
                userAvatar: '', 
            }
        },
        {
            notice_title: "新消息5",
            notice_content: "你有新的消息",
            notice_sender: "服务器",
            timestamp: new Date(),
            success: true,
            type: NOTICE_TYPE.ACCEPT_GROUP,
            data: {
                groupId: 10001,
                groupName: 'jayce群组',
                groupAvatar: '',
            }
        },
        {
            notice_title: "新消息6",
            notice_content: "你有新的消息",
            notice_sender: "服务器",
            timestamp: new Date(),
            success: true,
            type: NOTICE_TYPE.DELETE_FRIEND,
            data: {
                userId: 123,
                username: 'jayce',
                userAvatar: '',
            }
        },
        {
            notice_title: "新消息7",
            notice_content: "你有新的消息",
            notice_sender: "服务器",
            timestamp: new Date(),
            success: true,
            type: NOTICE_TYPE.DELETE_GROUP,
            data: {
                groupId: 10001,
                groupName: 'jayce群组',
                groupAvatar: '',
            }
        },
    ],
};

module.exports = {
    mockNoticeResponse,
    mockNoticeStreamResponse,
}