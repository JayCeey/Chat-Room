import "../css/index.css";
import DefaultAvatar from "assets/images/default_avatar.jpg";
import { setupWebSocket } from "./ws_connection";
import { Type } from "utils/constant";
import { logout } from 'api/login.js';
import { history } from 'api/chat.js';



// 使用到的变量
let currentChatType = -1; // 当前的聊天类型
let currentChatId = ''; // 当前的聊天对象id
 
 // 好友消息列表
const chat_messages = {
    friend: {

    },
    group: {

    }
}; 


const userInfo = init_user_info();
init_user_profile(userInfo); // 初始化用户信息
init_avatars();
init_add_button();
init_logout_button();
const socket = init_socket();
init_send_message(socket);
init_send_message_input();
init_group_item();
init_friend_item();

get_history_messages(userInfo);

// 获取历史的消息
function get_history_messages(userInfo) { 
    history(userInfo).then(response => {
        if (!response.ok) {
            throw new Error('网络错误：' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log("返回chat history: ", data);

        let chats = data.chats;

        for(let i = 0; i < chats.length; i++) {
            let chat = chats[i];
            if(chat.type == Type.message_friend){
                chat_messages['friend'][chat['name']] = chat.history;
            }else if(chat.type == Type.message_group){
                chat_messages['group'][chat['name']] = chat.history;
            }
        }
    })
    .catch(error => {
        console.error('错误:' + error);
    });
}

// 初始化用户信息
function init_user_info(){
    const temp_userInfo = sessionStorage.getItem("userInfo");
    if(!temp_userInfo){
        console.log("用户未登录");
        alert("请先登录");
        window.location.href = "login.html";
    }
    const userInfo = JSON.parse(temp_userInfo);
    return userInfo;
};

// 初始化用户profile
function init_user_profile(userInfo){
    const profile = document.getElementById('profile');
    const username = profile.querySelector(".username");
    username.textContent = userInfo.username;
    username.style.cursor = "pointer";
    username.setAttribute("data-username", userInfo.username);
    username.addEventListener("click", function(event){
        user_info(userInfo);
    });
    const avatar = profile.querySelector(".avatar");
    avatar.setAttribute("data-username", userInfo.username);
    avatar.addEventListener("click", function(event){
        user_info(userInfo);
    });
}

// 弹窗显示用户信息
function user_info(userInfo) {
    const user_modal = document.getElementById("user-modal");
    user_modal.querySelector('.username').innerText = userInfo.username;
    user_modal.querySelector('#user-details').innerText = userInfo.userDetails;
    user_modal.style.display = "block";
    const close_btn = user_modal.querySelector('.close-modal');
    close_btn.addEventListener('click', () => {
        user_modal.style.display = "none";
    });
}

// 对所有avatar的class类添加DefaultAvatar
function init_avatars(){
    document.querySelectorAll('.avatar').forEach((element)=>{
        const img = document.createElement('img');
        img.src = DefaultAvatar;
        element.appendChild(img);
    });
}

// 打开添加好友窗口
function init_add_button(){
    document.getElementById('add-button').addEventListener('click', () => {
        const add_modal = document.getElementById('add-modal')
        add_modal.style.display = "block";
        const close_btn = add_modal.querySelector('.close-modal');
        close_btn.addEventListener('click', () => {
            add_modal.style.display = "none";
        });
    });
}

// 点击注销按钮，首先向服务器发送注销消息，服务器返回success注销成功
function init_logout_button(){
    document.getElementById('logout-button').addEventListener('click', () => {
    
        logout().then(response => {
            if (!response.ok) {
                throw new Error('网络错误：' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log("返回data: ", data);
            if(data.success){
                // 登录成功应该设置一个token来验证身份，包含用户的身份信息，存储在sessionStorage里
                alert("登出成功！");
                sessionStorage.clear(); // 清除登录状态
                window.location.href = 'login.html';
                return;
            }else{
                alert("登出失败：" + data.message);
            }
        })
        .catch(error => {
            console.error('错误:' + error);
            alert("登出失败：", error);
        });
    });
}

function init_socket(){
    // 初始化websocket
    const {socket, error} = setupWebSocket();

    if(!socket){
        alert(`与websocket服务器连接失败！错误信息：${error}`);
        return;
    }

    // 连接打开时的事件处理（上线时请求历史消息）
    socket.addEventListener('open', (event) => {
        console.log('WebSocket connection established');
        // 向服务器发送消息
        socket.send(JSON.stringify({'type': Type.online, 
                                    'from': userInfo.username,
                                    }));
    });

    // 连接关闭时的事件处理（下线）
    socket.addEventListener('close', (event) => {
        console.log(JSON.stringify({'type': Type.offline, 
                                    'from': userInfo.username,
                                   }));
    });

    // 接收到消息时的事件处理
    socket.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);
        console.log(`Message from server:`, data);

        if(data.type == Type.message_friend){
            const messageText = data.content; //  挂载到左侧用户发送的消息栏上
            if (messageText) {
                add_message(1, data.from, messageText);
                add_message_to_chatlist(1, messageText, data.timestamp);
            }
        }else if(data.type == Type.message_group){
            const messageText = data.content; //  挂载到左侧用户发送的消息栏上
            if (messageText) {
                add_message(1, data.from, messageText);
                add_message_to_chatlist(1, messageText, data.timestamp);
            }
        }
    });

    return socket;
}

// 添加到消息列表中
function add_message_to_chatlist(send, messageText, timestamp){
    let from, to, type;
    
    if(currentChatType == Type.message_friend){
        type = 'friend';
    }else if(currentChatType == Type.message_group){
        type = 'group';
    }

    if(!chat_messages[type][currentChatId]){
        chat_messages[type][currentChatId] = [];
    }

    if(send == 0){
        from = userInfo.username;
        to = currentChatId;
    }else if(send == 1){
        from = currentChatId;
        to = userInfo.username;
    }

    chat_messages[type][currentChatId].push({
        content: messageText,
        from: from,
        to: to,
        time: timestamp,
    });

    console.log("打印chat_messages: ", chat_messages);
}

function add_message(type, from, messageText){
    const messages = document.querySelector('#messages');
    const message = document.createElement('div');
    message.classList.add('message');
    message.setAttribute("data-username", from);
    
    // 表示自己发送的
    if(type == 0){
        const message_right = document.createElement('div');
        message_right.classList.add('message-right');

        const text = document.createElement('p');
        text.classList.add('msg-right-text');
        text.textContent = messageText;

        const avatar = document.createElement('div');
        avatar.classList.add('avatar');
        avatar.addEventListener('click', () => {
            user_info(userInfo);
        })

        const img = document.createElement('img');
        img.src = DefaultAvatar;

        messages.appendChild(message);
        message.appendChild(message_right);
        message_right.appendChild(text);
        avatar.appendChild(img);
        message_right.appendChild(avatar);
    }
    // 表示别人发送的
    else if(type == 1){
        const message_left = document.createElement('div');
        message_left.classList.add('message-left');
    
        const text = document.createElement('p');
        text.classList.add('msg-left-text');
        text.textContent = messageText;
    
        const avatar = document.createElement('div');
        avatar.classList.add('avatar');
        avatar.addEventListener('click', () => {
            const userInfo = {
                username: from,
            }
            
            user_info(userInfo);
        })

        const img = document.createElement('img');
        img.src = DefaultAvatar;
    
        messages.appendChild(message);
        message.appendChild(message_left);
        avatar.appendChild(img);
        message_left.appendChild(avatar);
        message_left.appendChild(text);
    }
    messages.scrollTop = messages.scrollHeight;
}

// 监听消息发送按钮的点击事件
function init_send_message(socket){
    document.getElementById('send-message').addEventListener('click', () => {
        if(currentChatType == -1){
            alert("请选择一名聊天对象！");
            return;
        }
        const input = document.getElementById('send-message-input');
        const messageText = input.value.trim();
        if (messageText) {
            
            socket.send(JSON.stringify({"type": currentChatType, 
                                        "content": messageText, 
                                        "from": userInfo.username,
                                        "to": "friend1",
                                    }));


            const timestamp = new Date().toLocaleTimeString();

            add_message(0, userInfo.username, messageText);

            add_message_to_chatlist(0, messageText, timestamp);

            input.value = '';
        }
    });
}

function init_send_message_input(){
    document.querySelector('#send-message-input').addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            document.getElementById('send-message').click();
        }
    });
}

function load_messages(chatInfo){
    const messages = document.querySelector("#messages");
    messages.innerHTML = ``;
    if(chatInfo){
        for(let i = 0; i < chatInfo.length; i++){
            let chat = chatInfo[i];
            if(chat.from == userInfo.username){
                // 如果是自己发送的
                add_message(0, userInfo.username, chat.content);
            }else if(chat.to == userInfo.username){
                // 如果是别人发送的
                add_message(1, chat.from, chat.content);
            }
        }
    }
}

function handle_group_item_click(groupName) {
    const chatTitle = document.querySelector("#chat-title");
    chatTitle.setAttribute("data-name", groupName);
    chatTitle.setAttribute("data-type", "group");
    chatTitle.innerHTML = `
        <div id="chat-title-avatar" class="avatar">
            <img src="${DefaultAvatar}">
        </div>
        <span id="chat-title-name">${groupName}</span>
        <span id="online-state">（在线）</span>
    `; 

    // 添加userinfo点击事件
    chatTitle.addEventListener("click", function() {
        const userInfo = {
            'username': groupName,
        }
        user_info(userInfo);
    });

    currentChatType = Type.message_group;; // 当前聊天类型为群组聊天
    currentChatId = groupName;
    const chatInfo = chat_messages['group'][currentChatId];
    load_messages(chatInfo);
}

// 点击group弹出对应的chat_message消息记录
function init_group_item(){
    document.querySelectorAll('.group-item').forEach((item) => {
        const groupName = item.getAttribute('data-name');
        item.querySelector('.group-name').textContent = groupName;
        item.addEventListener('click', () => {
            handle_group_item_click(groupName);
        });
    })
}

function handle_friend_item_click(friendName) {
    const chatTitle = document.querySelector("#chat-title");
    chatTitle.setAttribute("data-name", friendName);
    chatTitle.setAttribute("data-type", "friend");
    chatTitle.innerHTML = `
        <div id="chat-title-avatar" class="avatar">
            <img src="${DefaultAvatar}">
        </div>
        <span id="chat-title-name">${friendName}</span>
        <span id="online-state">（在线）</span>
    `;

    // 添加userinfo点击事件
    chatTitle.addEventListener("click", function() {
        const userInfo = {
            'username': friendName,
        }
        user_info(userInfo);
    });
    
    currentChatType = Type.message_friend; // 当前聊天类型为好友聊天
    currentChatId = friendName;
    const chatInfo = chat_messages['friend'][currentChatId];
    load_messages(chatInfo);
}

// 点击friend弹出对应的chat_message消息记录
function init_friend_item(){
    document.querySelectorAll('.friend-item').forEach((item) => {
        const friendName = item.getAttribute('data-name');
        item.querySelector('.friend-name').textContent = friendName;
        item.addEventListener('click', () => {
            handle_friend_item_click(friendName);
        });
    })
}






