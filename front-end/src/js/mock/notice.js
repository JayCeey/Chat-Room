
const { NOTICE_TYPE, USER_TYPE } = require("../utils/constant");

const mockNoticeStreamResponse = {
    notice_title: "新消息",
    notice_content: "你有新的消息",
    notice_sender: "服务器",
    timestamp: new Date(),
    success: true,
}

const mockNoticeResponse = {
    notices: [
        {
            'noticeId': 1,
            'type': NOTICE_TYPE.REQUEST_FRIEND, // 如果是2表示可被接受的消息
            'title': 'Notice 1',
            'content': 'Notice 1 content',
            'createTime': '2020-01-01 00:00:00',
            'senderInfo': {
                'userType': USER_TYPE.NORMAL_USER,
                'userId': 1,
                'username': 'friend1',
                'avatar': "",
            },
            'receiver': "jayce",
            'receiverType': USER_TYPE.NORMAL_USER,
        },
        {
            'noticeId': 1,
            'type': NOTICE_TYPE.REQUEST_GROUP, // 如果是2表示可被接受的消息
            'title': 'Notice 2',
            'content': 'Notice 2 content',
            'createTime': '2020-01-01 00:00:00',
            'senderInfo': {
                'userType': USER_TYPE.NORMAL_USER,
                'userId': 1,
                'username': 'friend1',
                'avatar': "",
            }
        },
    ],
    success: true,
};

module.exports = {
    mockNoticeResponse,
    mockNoticeStreamResponse,
}