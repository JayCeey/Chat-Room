
const mockData = require('./src/js/mock/login.js');
const http = require('http');
const express = require('express');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(express);
const wss = new WebSocket.Server({ server });

const port = 3000;

// 中间件，用于解析JSON请求体
app.use(express.json());

// 允许跨域
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // 允许localhost
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
})

// 定义一个POST 请求路由
app.post('/login', (req, res) => {
    const receivedData = req.body;
    console.log('Received data:', receivedData);

    const {username, password} = receivedData;
    
    if(password == "121212a"){
        res.json(mockData.mockLoginResponse);
    }else{
        res.json(mockData.mockLoginUnmatchPasswordResponse);
    }
});

// 定义一个POST请求路由
app.post('/register', (req, res) => {
    const receivedData = req.body;
    console.log('Received data:', receivedData);
    // 响应模拟数据
    res.json(mockData.mockRegisterResponse);
});

// 处理 WebSocket 连接
wss.on('connection', ws => {
    console.log('A new client connected');
  
    ws.on('message', message => {
      console.log(`Received message: ${message}`);
      ws.send(`Server received: ${message}`);
    });
  
    ws.on('close', () => {
      console.log('Client disconnected');
    });
});

// 启动服务器
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
