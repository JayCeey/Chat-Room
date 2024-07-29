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
    ],
    success: true,
};

const mockUserChatResponse = {
    chats: [
        {
            uid: 444,
            history: [
                { content: "hello", from: 123, to: 444, time: "2022-01-01 12:00:00" },
                { content: "how are you", from: 444, to: 123, time: "2022-01-01 12:01:00" },
            ],
        },
        {
            uid: 555,
            history: [
                { content: "this is ", from: 123, to: 555, time: "2022-01-01 12:00:00" },
                { content: "how are you", from: 555, to: 123, time: "2022-01-01 12:01:00" },
            ],
        },
    ]
};

module.exports = { 
    mockLoginResponse,
    mockUserFriendResponse, 
    mockUserChatResponse 
};