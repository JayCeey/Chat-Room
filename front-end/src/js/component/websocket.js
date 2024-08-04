import { getUserInfo } from "component/user";
import { handleFriendMessage, handleGroupMessage } from "component/message";
import { handleOnline, handleOffline, handleRespondOnline } from "component/online";
import { MESSAGE_TYPE, CHAT_TYPE } from "utils/constant";

let socket;
const messageQueue = [];

// 建立websocket通信
export async function initWebsocket() {

    try{
        socket = new WebSocket('ws://localhost:3020');

        // 连接打开时的事件处理（上线时请求历史消息）
        socket.addEventListener('open', async (event) => {
            console.log('WebSocket connection established');

            const userInfo = await getUserInfo({userId: -1});
            // 向服务器发送上线消息
            sendMessage({'type': MESSAGE_TYPE.ONLINE, 
                         'from': userInfo.userId,});

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
    if(data.type == MESSAGE_TYPE.MESSAGE_FRIEND){
        handleFriendMessage(data);
    }else if(data.type == MESSAGE_TYPE.MESSAGE_GROUP){
        handleGroupMessage(data);
    }else if(data.type == MESSAGE_TYPE.ONLINE){
        handleOnline(data.user);
    }else if(data.type == MESSAGE_TYPE.OFFLINE){
        handleOffline(data.user);
    }else if(data.type == MESSAGE_TYPE.RESPOND_ONLINE){
        handleRespondOnline(data.online_users);
    }
}

export function sendMessage(data){
    if(!socket){
        console.error('WebSocket is not initialized');
        return;
    }

    if(socket.readyState == WebSocket.OPEN){
        socket.send(JSON.stringify(data));
    }else{
        console.error('WebSocket is not open. ReadyState: ' + socket.readyState);
        messageQueue.push(data);
    }
}

export async function getFriendsOnlineState(usersQuery){
    sendMessage({
        type: MESSAGE_TYPE.ASK_ONLINE,
        users: usersQuery.users,
    });
}