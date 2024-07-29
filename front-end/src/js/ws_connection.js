import { Type } from "utils/constant";
import DefaultAvatar from "assets/images/default_avatar.jpg";

// 建立websocket通信
// 创建一个 WebSocket 连接

export function setupWebSocket() {

    try{
        const socket = new WebSocket('ws://localhost:3020');

        // 连接打开时的事件处理（上线时请求历史消息）
        socket.addEventListener('open', (event) => {
            console.log('WebSocket connection established');
            // 向服务器发送消息
            socket.send(JSON.stringify({'type': Type.online, 
                                        'userId': '12345', }));
        });
    
        // 连接关闭时的事件处理（下线）
        socket.addEventListener('close', (event) => {
            console.log(JSON.stringify({'type': Type.offline, 
                                        'userId': '12345'}));
        });
    
        // 发生错误时的事件处理
        socket.addEventListener('error', (error) => {
            console.error('WebSocket error:', error);
        });

        return {'socket': socket, 'error': null};
    }catch(error){
        console.error('WebSocket error:', error);
        return {'socket': null, 'error': error};
    }
};