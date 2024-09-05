import { getUserInfo } from "stores/user";
import { handleFriendMessage, handleGroupMessage } from "stores/message";
import { handleOnline, handleOffline, handleRespondOnline } from "stores/online";
import { MESSAGE_TYPE } from "utils/constant";
import CONFIG from '../config.js';

let socket;
const messageQueue = [];

// 建立websocket通信
export async function initWebsocket() {

    try{
        socket = new WebSocket(CONFIG.WEBSOCKET_URL);

        // 连接打开时的事件处理（上线时请求历史消息）
        socket.addEventListener('open', async (event) => {
            console.log('WebSocket connection established');

            // 向服务器发送上线消息
            sendMessage({'type': MESSAGE_TYPE.ONLINE, 
                         'message': '用户上线',
                         'data': JSON.stringify({
                            'accessToken': sessionStorage.getItem("accessToken")
                         }),});

            while(messageQueue.length > 0){
                sendMessage(messageQueue.shift());
            }
        });

        // 连接关闭时的事件处理（下线）
        socket.addEventListener('close', (event) => {
            console.log("WebSocket connection close");
        });

        // 接收到消息时的事件处理
        socket.addEventListener('message', (event) => {
            const data = JSON.parse(event.data);
            console.log(`Message from server:`, data);
            onMessage(data);
        });

        // 发生错误时的事件处理
        socket.addEventListener('error', (error) => {
            console.error('WebSocket error:', error);
        });
    }catch(error){
        console.error('WebSocket error:', error);
    }
};

function onMessage(data){
    console.log("收到data: ", data)
    if(data.type == MESSAGE_TYPE.MESSAGE_FRIEND){
        handleFriendMessage(data);
    }else if(data.type == MESSAGE_TYPE.MESSAGE_GROUP){
        handleGroupMessage(data);
    }else if(data.type == MESSAGE_TYPE.ONLINE){
        handleOnline(data.user);
    }else if(data.type == MESSAGE_TYPE.OFFLINE){
        handleOffline(data.user);
    }else if(data.type == MESSAGE_TYPE.RESPOND_ONLINE){
        handleRespondOnline(data.onlineUsers);
    }
}

export function sendMessage(data){
    if(!socket){
        console.error('WebSocket is not initialized');
        return;
    }

    console.log("将要发送data", data)

    if(socket.readyState == WebSocket.OPEN){
        socket.send(JSON.stringify(data));
    }else{
        console.error('WebSocket is not open. ReadyState: ' + socket.readyState);
        messageQueue.push(data);
    }
}

export async function askUsersOnlineState(usersQuery){
    const data = {
        type: MESSAGE_TYPE.ASK_ONLINE,
        data: JSON.stringify({
            users: usersQuery.users,
        }),
    }
    console.log("询问这些用户是否上线", data)
    sendMessage(data);
}