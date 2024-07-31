
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

const mockSearchUserVO = {
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
}

module.exports = { 
    mockUserFriendResponse, 
    mockSearchUserVO,
};