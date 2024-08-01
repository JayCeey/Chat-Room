port = 3020;

const WebSocket = require('ws');
const server = new WebSocket.Server({ 'port': port });
const { MESSAGE_TYPE } = require('./src/js/utils/constant.js');
const { userOnline, userOffline} = require('./src/js/component/online.js');

// 存储所有连接
const online_users = {
    
}

function informUsers(user, type){
    console.log(`在线users: ${online_users}`)
    Object.keys(online_users).forEach(key => {
        let ws_ = online_users[key];
        ws_.send(JSON.stringify({
            'type': type,
            'user': user,
        }))
    });
}

server.on('connection', (ws) => {
    console.log('Client connected');

    let user;

    // 处理客户端发送的消息
    ws.on('message', (message) => {
        const data = JSON.parse(message);
        
        console.log('Received:',data);
        
        data_type = parseInt(data.type);

        if(data_type == MESSAGE_TYPE.MESSAGE_FRIEND){
            console.log("message friend");
            let ws_ = online_users[data.to];
            if(ws_){
                console.log(`${data.to}在线！发送消息`)
                ws_.send(
                    JSON.stringify({
                        'type': MESSAGE_TYPE.MESSAGE_FRIEND,
                        'from': data.from,
                        'to': data.to,
                        'content': data.content,
                        'timestamp': new Date().toISOString(),
                        'latestMsg': 3, // 最新的版本
                    })
                );
            }else{
                console.log(`${data.to}不在线！`)
            }
            /* 
            ws.send(
                JSON.stringify({
                    'type': MESSAGE_TYPE.MESSAGE_FRIEND,
                    'from': data.to,
                    'to': data.from,
                    'content': 'received: ' + data.content,
                    'timestamp': new Date().toISOString(),
                    'latestMsg': 3, // 最新的版本
                })
            );
            ws.send(
                JSON.stringify({
                    'type': MESSAGE_TYPE.MESSAGE_GROUP,
                    'from': "server123",
                    'to': data.from,
                    'content': 'this is server annoncement!!!',
                    'timestamp': new Date().toISOString(),
                    'latestMsg': 3, // 最新的版本
                })
            );
            */
        }else if(data_type == MESSAGE_TYPE.MESSAGE_GROUP){
            console.log("message group");
            ws.send(
                JSON.stringify({
                    'type': MESSAGE_TYPE.MESSAGE_GROUP,
                    'from': data.to,
                    'to': data.from,
                    'content': 'received: ' + data.content,
                    'timestamp': new Date().toISOString(),
                    'version': data.version+1,
                })
            );
            ws.send(
                JSON.stringify({
                    'type': MESSAGE_TYPE.MESSAGE_FRIEND,
                    'from': "server123",
                    'to': data.from,
                    'content': 'this is server annoncement!!!',
                    'timestamp': new Date().toISOString(),
                    'latestMsg': 3, // 最新的版本
                })
            );
        }else if(data_type == MESSAGE_TYPE.ONLINE){
            console.log("user online: ", data.from);
            user = data.from;
            online_users[user] = ws;
            // 向客户端发送消息
            ws.send(
                JSON.stringify({
                    'type': MESSAGE_TYPE.MESSAGE_FRIEND,
                    'from': 'jayce',
                    'content': 'hello!!',
                    'timestamp': new Date().toISOString(),
                })
            );
            informUsers(user, MESSAGE_TYPE.ONLINE);
        }
    });

    // 处理连接关闭事件
    ws.on('close', () => {
        console.log('Client disconnected');
        delete online_users[user];
        informUsers(user, MESSAGE_TYPE.OFFLINE);
    });

    // 处理错误事件
    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

console.log(`WebSocket server is listening on ws://localhost:${port}`);
