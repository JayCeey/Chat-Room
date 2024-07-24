const express = require('express');
const app = express();
const port = 3000;

// 中间件，用于解析JSON请求体
app.use(express.json());

// 允许跨域
app.all("*", (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "localhost");
    
})

// 定义一个POST 请求路由
app.post('/login', (req, res) => {

    const receivedData = req.body;
    console.log('Received data:', receivedData);

    const mockData = {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com'
    };
    res.json(mockData);
});

// 定义一个POST请求路由
app.post('/register', (req, res) => {
    const receivedData = req.body;
    console.log('Received data:', receivedData);

    // 响应模拟数据
    const mockResponse = {
        success: true,
        message: 'Data received successfully',
        receivedData: receivedData
    };
    res.json(mockResponse);
});

// 启动服务器
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
