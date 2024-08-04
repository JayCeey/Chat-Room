
const mockLoginData = require('./src/js/mock/login.js');
const mockChatData = require('./src/js/mock/chat.js');
const mockFriendData = require('./src/js/mock/friend.js');
const mockSuccessData = require('./src/js/mock/success.js');
const mockNoticeData = require('./src/js/mock/notice.js');
const mockDatabase = require('./src/js/mock/database.js');
// const http = require('http');
const cors = require('cors');
const path = require('path');
const express = require('express');
const { serverTokenStore } = require('./src/js/utils/token.js');
const cookieParser = require('cookie-parser');

// 端口号
const port = 3000;

// 后端tokenStore
const tokenStore = serverTokenStore;

// 模拟后端数据库
const database = mockDatabase.mockDatabase;

const app = express();

// 使用cookieParser中间件
app.use(cookieParser());

// 中间件，用于解析JSON请求体
app.use(express.json());

// 配置静态文件目录，生产环境下不配置这个静态文件，通常存储在OSS对象存储服务系统上
app.use('/images', express.static(path.join(__dirname, '/src/assets/images')));

// 允许跨域
const allowedOrigins = [/^http:\/\/localhost:\d+$/]; // 将允许的来源列入白名单
const corsOptions = {
    origin: function (origin, callback) {
        if (allowedOrigins.some(pattern => new RegExp(pattern).test(origin)) || !origin) {
            callback(null, true);
        } else {
            callback(new Error(`Not allowed by CORS, origin=${origin}`));
        }
    },
    credentials: true // 允许携带凭据
};
app.use(cors(corsOptions)); // 使用 cors 包代替手动设置头部
// app.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "*"); // 允许localhost
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//     next();
// })

// 定义一个POST 请求路由
app.post('/login', (req, res) => {
    const receivedData = req.body;
    console.log('Received data:', receivedData);
    const {username, password} = receivedData;

    if(!database.user_credential[username]){
        console.log("返回data: ", mockLoginData.mockLoginNoExistResponse);
        res.json(mockLoginData.mockLoginNoExistResponse);
        return;
    }

    console.log(database.user_credential);
    if(database.user_credential[username]['password'] == password){
        const userId = database.user_credential[username]['userId'];
        const userRole = database.user_role[userId];
        const payload = {
            "userId": userId,
            "username": username,
            "userRole": userRole,
        }
        const accessToken = tokenStore.generateAccessToken(payload);
        const refreshToken = tokenStore.generateRefreshToken();
        tokenStore.setAccessToken(accessToken, username);
        tokenStore.setRefreshToken(refreshToken, username);

        // 给客户端返回cookie认证信息
        res.cookie('accessToken', accessToken, { httpOnly: true, secure: true, sameSite: 'Strict' });
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'Strict' });
        
        const responseData = {
            userId: userId,
            username: username,
            userRole: userRole,
            success: true,
        }
        console.log("返回data: ", responseData);
        res.json(responseData); 
    }else{
        console.log("返回data: ", mockLoginData.mockLoginUnmatchPasswordResponse);
        res.json(mockLoginData.mockLoginUnmatchPasswordResponse);
    }
});

// 定义一个POST请求路由
app.post('/register', (req, res) => {
    const receivedData = req.body;
    console.log('Received data:', receivedData);
    // 响应模拟数据
    res.json(mockLoginData.mockRegisterResponse);
});

// logout清除用户在服务器的access token和refresh token
app.get('/logout', (req, res) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    tokenStore.deleteAccessToken(req.cookies.accessToken);
    tokenStore.deleteRefreshToken(req.cookies.refreshToken);
    res.json(mockLoginData.mockLogoutResponse);
});

// 获取用户信息
app.get('/user', (req, res) => {
    const receivedData = req.query;
    console.log('Received data:', receivedData);
    // 响应模拟数据
    const queryUserId = receivedData.userId;
    const userInfo = database.user_info[queryUserId];
    if(!userInfo){
        const mockFail = mockSuccessData.mockFail;
        mockFail.message = `查询用户userId=${queryUserId}失败`;
        res.json(mockFail);
    }else{
        const userInfoResponse = {
            "userId": queryUserId,
            "username": userInfo.username,
            "userAvatar": userInfo.userAvatar,
            "userDetails": userInfo.userDetails,
            "success": true,
        }
        res.json(userInfoResponse);
    }
});

// 获取朋友信息
app.post('/getUserFriendInfo', (req, res) => {
    const receivedData = req.body;
    console.log('Received data:', receivedData);
    
    const userId = receivedData.userId;
    const groupsId = database.user_group[userId];
    const groupsInfo = [];
    for(let i = 0; i < groupsId.length; i++){
        let groupInfo = database.group_info[groupsId[i]];
        groupInfo.groupId = groupsId[i];
        groupsInfo.push(groupInfo);
    }

    const friendsId = database.user_friend[userId];
    const friendsInfo = [];
    for(let i = 0; i < friendsId.length; i++){
        let friendInfo = database.user_info[friendsId[i]];
        friendInfo.userId = friendsId[i];
        friendsInfo.push(friendInfo);
    }
    // 响应模拟数据
    const responseData = {
        friends: friendsInfo,
        groups: groupsInfo,
        success: true,
    };
    res.json(responseData);
});

// 获取搜索用户列表
app.get('/search', (req, res) => {
    const receivedData = req.query;
    console.log('Received data:', receivedData);
    // 响应模拟数据
    const responseData = {
        friends: [],
        groups: [],
        success: true,
    }

    const queryName = receivedData.queryName;

    // 查找是否有符合名字前缀的用户和组别
    Object.keys(database.user_info).forEach(userId => {
        if (database.user_info[userId].username.startsWith(queryName)) {
            responseData.friends.push(database.user_info[userId]);
        }
    });

    Object.keys(database.group_info).forEach(groupId => {
        if (database.group_info[groupId].groupName.startsWith(queryName)) {
            responseData.groups.push(database.group_info[groupId]);
        }
    });

    res.json(responseData);
});

// 获取聊天信息
app.post('/getUserChatInfo', (req, res) => {
    const receivedData = req.body;
    console.log('Received data:', receivedData);
    // 响应模拟数据
    const responseData = {
        data: {
            groupChatsInfo: {},
            userChatsInfo: {},
        },
        success: true,
    }
    
    const userId = receivedData.userId;
    
    // 获取与用户的聊天
    const userChatsRel = database.user_chat[userId];
    for(let i = 0; i < userChatsRel.length; i++){
        let chatId = userChatsRel[i].chatId;
        let userId2 = userChatsRel[i].userId2;
        const userChatInfo = database.user_chat_info[chatId];
        responseData.data.userChatsInfo[userId2] = {
            chatId: chatId,
            history: userChatInfo,
        };
    }

    // 获取与群组的聊天
    const groupChatsId = database.user_group[userId];
    for(let i = 0; i < groupChatsId.length; i++){
        const groupChatInfo = database.group_chat_info[groupChatsId[i]];
        responseData.data.groupChatsInfo[groupChatsId[i]] = groupChatInfo;
    }
    res.json(responseData);
});

// 添加好友
app.post('/add', (req, res) => {
    const receivedData = req.body;
    console.log('Received data:', receivedData);
    // 响应模拟数据
    res.json(mockSuccessData.mockSuccess);
});

// 获取最新通知
app.post('/getLatestNotice', (req, res) => {
    const receivedData = req.body;
    console.log('Received data:', receivedData);
    // 响应模拟数据
    res.json(mockChatData.mockUserChatResponse);
});

// SSE系统推送通知服务
app.get('/notice', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
  
    setInterval(() => {
        res.write(`data: ${JSON.stringify(mockNoticeData.mockNoticeStreamResponse)}\n\n`);
    }, 10000);
});

// 启动服务器
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
