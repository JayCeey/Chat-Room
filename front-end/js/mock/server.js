const express = require('express');
const app = express();
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
        const mockData = {
            id: 123,
            user: "haha",
            token: "123456",
            success: true
        };
        res.json(mockData);
    }else{
        res.json({success: false, message: "密码错误"});
    }
});


// 定义一个POST请求路由
app.post('/register', (req, res) => {
    const receivedData = req.body;
    console.log('Received data:', receivedData);

    // 响应模拟数据
    const mockResponse = {
        success: true,
        message: 'register successfully',
    };
    res.json(mockResponse);
});

// 启动服务器
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
