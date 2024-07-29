import "../css/index.css";
import DefaultAvatar from "assets/images/default_avatar.jpg";
import { setupWebSocket } from "./ws_connection";
import { Type } from "utils/constant";
import { logout } from 'api/login.js';



// 使用到的变量
let currentChatType = -1; // 当前的聊天类型
let currentChatId = ''; // 当前的聊天对象id
const chat_friend_messages = {
    'friend1': 'haha',
}; // 好友消息列表
const chat_group_messages = {}; // 群组消息列表

init();

function init(){
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

    // 接收到消息时的事件处理
    socket.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);
        console.log(`Message from server:`, data);
        
        const messageText = data.content; //  挂载到左侧用户发送的消息栏上
        
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

            const img = document.createElement('img');
            img.src = DefaultAvatar;
        
            messages.appendChild(message);
            message.appendChild(message_left);
            avatar.appendChild(img);
            message_left.appendChild(avatar);
            message_left.appendChild(text);
            
            messages.scrollTop = messages.scrollHeight;
        }
    });

    return socket;
}

function init_send_message(socket){
    // 监听消息发送按钮的点击事件
    document.getElementById('send-message').addEventListener('click', () => {
        if(currentChatType == -1){
            alert("请选择一名聊天对象！");
            return;
        }
        const input = document.getElementById('send-message-input');
        const messageText = input.value.trim();
        if (messageText) {
            const messages = document.querySelector('#messages');
            const message = document.createElement('div');
            message.classList.add('message');

            const message_right = document.createElement('div');
            message_right.classList.add('message-right');

            const text = document.createElement('p');
            text.classList.add('msg-right-text');
            text.textContent = messageText;

            const avatar = document.createElement('div');
            avatar.classList.add('avatar');

            const img = document.createElement('img');
            img.src = DefaultAvatar;

            messages.appendChild(message);
            message.appendChild(message_right);
            message_right.appendChild(text);
            avatar.appendChild(img);
            message_right.appendChild(avatar);
            
            messages.scrollTop = messages.scrollHeight;

            input.value = '';
            
            socket.send(JSON.stringify({"type": Type.message, 
                                         "content": messageText, 
                                        "user": "jayce"}));
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
    if(chatInfo){
        messages.innerHTML = `
            <div class="message" data-username="friend1">
                    <div class="message-left">
                        <div class="avatar">
                            <img src=${DefaultAvatar}>
                        </div>
                        <p class="msg-left-text">Hello, how are you?</p>
                    </div>
                </div>
                <div class="message" data-username="jayce">
                    <div class="message-right">
                        <p class="msg-right-text">I'm fine, thank you!</p>
                        <div class="avatar">
                            <img src=${DefaultAvatar}>
                        </div>
                    </div>
            </div>
        `
        messages.scrollTop = messages.scrollHeight;
    }else{
        messages.innerHTML = ``;
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

            currentChatType = 1; // 当前聊天类型为群组聊天
            currentChatId = groupName;
            const chatInfo = chat_group_messages[currentChatId];
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
            
            currentChatType = 0; // 当前聊天类型为好友聊天
            currentChatId = friendName;
            const chatInfo = chat_friend_messages[currentChatId];
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






