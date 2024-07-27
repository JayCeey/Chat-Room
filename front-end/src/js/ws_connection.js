import { Type } from "utils/constant";

// 建立websocket通信
// 创建一个 WebSocket 连接
const socket = new WebSocket('ws://localhost:3020');

// 连接打开时的事件处理（上线时请求历史消息）
socket.addEventListener('open', (event) => {
    console.log('WebSocket connection established');
    // 向服务器发送消息
    socket.send(JSON.stringify({'type': Type.online, 'userId': '12345'}));
});

// 接收到消息时的事件处理
socket.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);
    console.log('Message from server:', data);
    // 挂载到左侧用户发送的消息栏上
    const messageText = data.content;
    
    if (messageText) {
        const messages = document.querySelector('#messages');
        const message = document.createElement('div');
        message.classList.add('message');

        const message_left = document.createElement('div');
        message_left.classList.add('message-left');

        const text = document.createElement('p');
        text.classList.add('msg-left-text');
        text.textContent = messageText;

        const avatar = document.createElement('div');
        avatar.classList.add('avatar');

        messages.appendChild(message);
        message.appendChild(message_left);
        message_left.appendChild(avatar);
        message_left.appendChild(text);
        
        messages.scrollTop = messages.scrollHeight;
    }
});

// 连接关闭时的事件处理（下线）
socket.addEventListener('close', (event) => {
    console.log(JSON.stringify({'type': Type.offline, 'userId': '12345'}));
});

// 发生错误时的事件处理
socket.addEventListener('error', (error) => {
    console.error('WebSocket error:', error);
});

export {socket};