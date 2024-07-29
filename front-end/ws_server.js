port = 3020;

const WebSocket = require('ws');
const server = new WebSocket.Server({ 'port': port });
const {Type} = require('./src/js/utils/constant.js');

const users = {}; // 用户列表，用于存储用户ID和对应的WebSocket连接

server.on('connection', (ws) => {
    console.log('Client connected');

    // 处理客户端发送的消息
    ws.on('message', (message) => {
        const data = JSON.parse(message);
        
        console.log('Received:',data);
        
        data_type = parseInt(data.type);

        if(data_type == Type.message_friend){
            console.log("message friend");
            ws.send(
                JSON.stringify({
                    'type': Type.message_friend,
                    'from': 'server123',
                    'to': data.from,
                    'content': 'received: ' + data.content,
                    'timestamp': new Date().toISOString(),
                })
            ); 
        }else if(data_type == Type.message_group){
            console.log("message group");
            ws.send(
                JSON.stringify({
                    'type': Type.message_group,
                    'from': 'server123',
                    'to': data.from,
                    'content': 'received: ' + data.content,
                    'timestamp': new Date().toISOString(),
                })
            ); 
        }else if(data_type == Type.online){
            console.log("user online: ", data.from);
            // 向客户端发送消息
            ws.send(
                JSON.stringify({
                    'type': Type.message,
                    'from': 'jayce',
                    'content': 'hello!!',
                    'timestamp': new Date().toISOString(),
                })
            ); 
        }else if(data_type == Type.offline){
            console.log("user offline: ", data.from);
        }
    });

    // 处理连接关闭事件
    ws.on('close', () => {
        console.log('Client disconnected');
    });

    // 处理错误事件
    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

console.log(`WebSocket server is listening on ws://localhost:${port}`);
