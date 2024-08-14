port = 3020;

const WebSocket = require('ws');
const server = new WebSocket.Server({ 'port': port });
const { MESSAGE_TYPE } = require('./src/js/utils/constant.js');

// 存储所有连接
const online_users = {
}

// 或者这里可以将新的聊天信息插入database中更新

function informUsers(user, type){
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
                        'latestMsg': 3, // 返回的最新的消息id号，对于QQ来说，用户登录时拿着这个值请求最新的消息
                        'form': data.form,
                    })
                );
            }else{
                // 这里之后应该推送消息
                console.log(`${data.to}不在线！`)
            }
        }else if(data_type == MESSAGE_TYPE.MESSAGE_GROUP){
            console.log("message group");
            ws.send(
                JSON.stringify({
                    'type': MESSAGE_TYPE.MESSAGE_GROUP,
                    'group': data.to, // 返回
                    'from': "001", // 这里假设是456发送的返回消息
                    'to': data.from,
                    'content': data.content,
                    'timestamp': new Date().toISOString(),
                    'form': data.form,
                })
            );
            // 告知所有该群组中 在线的用户
            
        }else if(data_type == MESSAGE_TYPE.ONLINE){
            console.log("user online: ", data.from);
            user = data.from;
            online_users[user] = ws;
            // 向客户端发送消息
            // ws.send(
            //     JSON.stringify({
            //         'type': MESSAGE_TYPE.MESSAGE_FRIEND,
            //         'from': 'jayce',
            //         'content': 'hello!!',
            //         'timestamp': new Date().toISOString(),
            //     })
            // );
            informUsers(user, MESSAGE_TYPE.ONLINE);
        }else if(data_type == MESSAGE_TYPE.ASK_ONLINE){
            // 客户端询问服务端这些用户是否在线
            const ask_online_users = data.users;
            let online_users_list = [];
            for(let i = 0; i < ask_online_users.length; i++){
                let userId = ask_online_users[i];
                if(online_users[userId]){
                    online_users_list.push(userId);
                }
            }
            
            ws.send(
                JSON.stringify({
                    'type': MESSAGE_TYPE.RESPOND_ONLINE,
                    'online_users': online_users_list,
                })
            )
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
