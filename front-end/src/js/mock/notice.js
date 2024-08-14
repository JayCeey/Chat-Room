
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
            notice_id: 1,
            notice_title: "新消息1",
            notice_content: "这是一条普通消息",
            notice_sender: "服务器",
            timestamp: new Date(),
            success: true,
            type: NOTICE_TYPE.NORMAL,
            data: {

            }
        },
        {
            notice_id: 2,
            notice_title: "新消息2",
            notice_content: "你收到一条好友请求",
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
            notice_id: 3,
            notice_title: "新消息3",
            notice_content: "用户456申请加入Jayce一家人群聊",
            notice_sender: "服务器",
            timestamp: new Date(),
            success: true,
            type: NOTICE_TYPE.REQUEST_GROUP,
            data: {
                userId: 456,
                groupId: 10002,
                groupName: 'Jayce一家人',
                groupDetails: 'this is group2',
                groupAvatar: "",
            }
        },
        {
            notice_id: 4,
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
            notice_id: 5,
            notice_title: "新消息5",
            notice_content: "你有新的消息",
            notice_sender: "服务器",
            timestamp: new Date(),
            success: true,
            type: NOTICE_TYPE.ACCEPT_GROUP,
            data: {
                groupId: 10002,
                groupName: 'Jayce一家人',
                groupDetails: 'this is group2',
                groupAvatar: "",
                groupMembers: [
                    {
                        userId: 456,
                        username: 'Tom',
                        userDetails: 'hello, this is Tom',
                        userAvatar: "",
                    },
                    {
                        userId: 789,
                        username: 'JayChou',
                        userDetails: 'hello, this is Jaychou',
                        userAvatar: "",
                    },
                ],
            }
        },
        {
            notice_id: 6,
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
            notice_id: 7,
            notice_title: "新消息7",
            notice_content: "你有新的消息",
            notice_sender: "服务器",
            timestamp: new Date(),
            success: true,
            type: NOTICE_TYPE.DELETE_GROUP,
            data: {
                groupId: 10002,
                groupName: 'Jayce一家人',
                groupDetails: 'this is group2',
                groupAvatar: "",
            }
        },
    ],
};

module.exports = {
    mockNoticeResponse,
    mockNoticeStreamResponse,
}