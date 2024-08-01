
const mockUserFriendResponse = {
    friends: [
        {
            uid: 444,
            username: "friend1",
        },
        {
            uid: 555,
            username: "friend2",
        },
        {
            uid: 666,
            username: "server123",
        },
        {
            uid: 777,
            username: "jaycehhh",
        },
    ],
    groups: [
        {
            gid: 111,
            username: "group1",
        },
        {
            gid: 222,
            username: "server123",
        },
    ],
    success: true,
};

const mockSearchUserVO = {
    friends: [
        {
            uid: 444,
            username: "friend1",
        },
        {
            uid: 555,
            username: "friend2",
        },
        {
            uid: 666,
            username: "server123",
        },
    ],
    groups: [
        {
            gid: 111,
            username: "group1",
        },
        {
            gid: 222,
            username: "server123",
        },
    ],
    success: true,
}

module.exports = { 
    mockUserFriendResponse, 
    mockSearchUserVO,
};