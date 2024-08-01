
const mockLoginData = require('./src/js/mock/login.js');
const mockChatData = require('./src/js/mock/chat.js');
const mockFriendData = require('./src/js/mock/friend.js');
const mockSuccessData = require('./src/js/mock/success.js');
const http = require('http');
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');

// 端口号
const port = 3000;

const app = express();
const server = http.createServer(app);

// 使用cookieParser中间件
app.use(cookieParser());

// 中间件，用于解析JSON请求体
app.use(express.json());

// 允许跨域
const allowedOrigins = [/^http:\/\/localhost:\d+$/]; // 将允许的来源列入白名单
const corsOptions = {
    origin: function (origin, callback) {
        if (allowedOrigins.some(pattern => new RegExp(pattern).test(origin)) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
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

// 配置静态文件目录
app.use('/images', express.static(path.join(__dirname, '/src/assets/images')));

// 模拟数据库/redis存储
let accessTokenStore = {};
let refreshTokenStore = {};
let chat_messages = {};

// 定义一个POST 请求路由
app.post('/login', (req, res) => {
    const receivedData = req.body;
    console.log('Received data:', receivedData);

    console.log('request cookies: ', req.cookies);

    const {username, password} = receivedData;
    
    if(password == "487f7b22f68312d2c1bbc93b1aea445b"){
        // 设置token和refresh token
        accessToken = "user: jayce";
        refreshToken = "time: 1000";
        accessTokenStore[accessToken] = {
            'username': username,
            'expire': '2024-01-01',
        };
        refreshTokenStore[refreshToken] = {
            'username': username,
            'expire': '2024-01-01',
            'accessToken': accessToken,
        }
        res.cookie('accessToken', accessToken, { httpOnly: true, secure: true, sameSite: 'Strict' });
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'Strict' });
        console.log("当前accessTokenStore: ", accessTokenStore);
        console.log("当前refreshTokenStore: ", refreshTokenStore);

        res.json(mockLoginData.mockLoginResponse);
    }else{
        res.json({
            userInfo: {
                uid: 123,
                username: "friend1",
                avatar: "",
                userDetails: "hello, this is jayce",
            },
            success: true,
        });
        // res.json(mockLoginData.mockLoginUnmatchPasswordResponse);
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
    delete accessTokenStore[req.cookies.accessToken];
    delete refreshTokenStore[req.cookies.refreshToken];
    res.json(mockLoginData.mockLogoutResponse);
});

// 获取朋友信息
app.post('/getUserFriendInfo', (req, res) => {
    const receivedData = req.body;
    console.log('Received data:', receivedData);
    // 响应模拟数据
    res.json(mockFriendData.mockUserFriendResponse);
});

// 获取搜索用户列表
app.get('/searchUser', (req, res) => {
    const receivedData = req.body;
    console.log('Received data:', receivedData);
    // 响应模拟数据
    res.json(mockFriendData.mockSearchUserVO);
});

// 获取聊天信息
app.post('/getUserChatInfo', (req, res) => {
    const receivedData = req.body;
    console.log('Received data:', receivedData);
    // 响应模拟数据
    res.json(mockChatData.mockUserChatResponse);
});

// 添加好友
app.post('/addFriend', (req, res) => {
    const receivedData = req.body;
    console.log('Received data:', receivedData);
    // 响应模拟数据
    res.json(mockSuccessData.mockSuccess);
});

// 获取最新消息
app.post('/getLatestNotice', (req, res) => {
    const receivedData = req.body;
    console.log('Received data:', receivedData);
    // 响应模拟数据
    res.json(mockChatData.mockUserChatResponse);
});

app.get('/notice', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
  
    setInterval(() => {
      const notification = {
        "notice_title": "新消息",
        "notice_content": "你有新的消息",
        "notice_sender": "服务器",
        "timestamp": new Date(),
      };
      res.write(`data: ${JSON.stringify(notification)}\n\n`);},
      10000);
  });


// 启动服务器
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
