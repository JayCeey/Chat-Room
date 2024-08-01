import "css/index.scss";
import DefaultAvatar from "assets/images/default_avatar.jpg";
import { MESSAGE_TYPE, CHAT_TYPE } from "utils/constant";
import { history } from 'api/chat';
import { getFriends } from 'api/friend';
import { setupWebSocket } from "component/websocket";
import { user_info, init_user_info } from "component/user";
import { init_logout_btn } from "component/logout";
import { init_find_friend } from "component/friend";
import { init_notice, noticeListner } from "component/notice";
import { init_more_btn } from "component/more";
import { init_send_pic } from "component/send";

// 使用到的变量
let currentChatType = CHAT_TYPE.NONE; // 当前的聊天类型
let currentChatId = ''; // 当前的聊天对象id
const online_users = {};
 
 // 好友消息列表
const chat_messages = {
    friend: {

    },
    group: {

    }
}; 

// 初始化
const userInfo = init_user_info();
init_avatars();
init_find_friend();
init_notice();
init_logout_btn();
const socket = init_socket();
init_send_message(socket);
init_send_message_input();
init_more_btn();
noticeListner();
init_send_pic();

// 获取好友列表
get_user_friends_list();
// 根据userInfo获取消息
get_history_messages(userInfo);

function get_user_friends_list(){
    getFriends(userInfo).then(response => {
        if (!response.ok) {
            throw new Error('网络错误：' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        if(!data.success){
            throw new Error('获取好友列表失败');
        }
        console.log("返回friends_list: ", data);
        const friendList = data.friends;
        for (let i = 0; i < friendList.length; i++) {
            let friendInfo = friendList[i];
            init_friend_section('friend', friendInfo);
            init_chat_info('friend', friendInfo.username);
        }
        const groupList = data.groups;
        for (let i = 0; i < groupList.length; i++) {
            let groupInfo = groupList[i];
            init_friend_section('group', groupInfo);
            init_chat_info('group', groupInfo.username);
        }
    })
    .catch(error => {
        console.error('错误:' + error);
    }); 
}

// 初始化朋友或群组列表
function init_friend_section(type, friendInfo){
    if(type == 'friend'){
        const friend_item = document.createElement('div');
        const friendName = friendInfo.username;
        friend_item.classList.add('friend-item');
        friend_item.setAttribute('data-name', friendName);
        friend_item.innerHTML = `
            <div class="avatar friend-avatar">
                <img src="${DefaultAvatar}" alt="头像">
            </div>
            <div class="friend-name">${friendInfo.username}</div>
        `;
        friend_item.addEventListener('click', () => {
            handle_friend_item_click(friendName);
        });
        document.getElementById('friend').appendChild(friend_item);
    }else if(type == 'group'){
        const group_item = document.createElement('div');
        const groupName = friendInfo.username;
        group_item.classList.add('group-item');
        group_item.setAttribute('data-name', groupName);
        group_item.innerHTML = `
            <div class="avatar friend-avatar">
                <img src="${DefaultAvatar}" alt="头像">
            </div>
            <div class="friend-name">${friendInfo.username}</div>
        `;
        group_item.addEventListener('click', () => {
            handle_group_item_click(groupName);
        });
        document.getElementById('group').appendChild(group_item);
    }
}

// 获取历史的消息
function get_history_messages(userInfo) { 
    history(userInfo).then(response => {
        if (!response.ok) {
            throw new Error('网络错误：' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        if(!data.success){
            throw new Error('获取历史消息失败');
        }

        console.log("返回chat history: ", data);

        let chats = data.chats;

        for(let i = 0; i < chats.length; i++) {
            let chat = chats[i];
            if(chat.type == MESSAGE_TYPE.MESSAGE_FRIEND){
                init_chat_info('friend', chat['name']);
                chat_messages['friend'][chat['name']]['history'] = chat.history;
            }else if(chat.type == MESSAGE_TYPE.MESSAGE_GROUP){
                init_chat_info('group', chat['name']);
                chat_messages['group'][chat['name']]['history'] = chat.history;
            }
        }
    })
    .catch(error => {
        console.error('错误:' + error);
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
        socket.send(JSON.stringify({'type': MESSAGE_TYPE.ONLINE, 
                                    'from': userInfo.username,
                                    }));
    });

    // 连接关闭时的事件处理（下线）
    socket.addEventListener('close', (event) => {
        console.log("WebSocket connection close");
    });

    // 接收到消息时的事件处理
    socket.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);
        console.log(`Message from server:`, data);

        if(data.type == MESSAGE_TYPE.MESSAGE_FRIEND){
            const messageText = data.content; //  挂载到左侧用户发送的消息栏上
            if (messageText) {
                if(!chat_messages['friend'][data.from]){
                    return;
                }

                add_message_to_chatlist('friend', data.from, messageText, data.timestamp);
                if(currentChatType == CHAT_TYPE.FRIEND && currentChatId == data.from){
                    // 如果是当前窗口的，那么就直接显示，不需要添加到未读消息中
                    add_message(1, data.from, messageText);
                }else{
                    // 不是当前窗口的，那么就添加到未读消息中，其中已经保证了chat_info的初始化
                    add_unread_message('friend', data.from);
                }
            }
        }else if(data.type == MESSAGE_TYPE.MESSAGE_GROUP){
            const messageText = data.content; //  挂载到左侧用户发送的消息栏上
            if (messageText) {
                if(!chat_messages['group'][data.from]){
                    return;
                }

                add_message_to_chatlist('group', data.from, messageText, data.timestamp);
                if(currentChatType == CHAT_TYPE.GROUP && currentChatId == data.from){
                    add_message(1, data.from, messageText);
                }else{
                    // 不是当前窗口的，那么就添加到未读消息中
                    add_unread_message('group', data.from);
                }
            }
        }else if(data.type == MESSAGE_TYPE.ONLINE){
            console.log(`${data.user}上线拉`)
            online_users[data.user] = true;
        }else if(data.type == MESSAGE_TYPE.OFFLINE){
            console.log(`${data.user}下线拉`)
            delete online_users[data.user];
        }
    });

    return socket;
}

function add_unread_message(type, chatId){
    chat_messages[type][chatId]['num_unread_msg'] += 1;
    let num_unread_msg = chat_messages[type][chatId]['num_unread_msg'];
    // 在当前的用户列表中找到具有该属性的元素，并且添加未读消息
    let item;
    if(type == 'friend'){
        item = document.querySelector(`.friend-item[data-name="${chatId}"]`);
    }else if(type == 'group'){
        item = document.querySelector(`.group-item[data-name="${chatId}"]`);
    }
    const unread_msg = item.querySelector('.unread-msg');
    if(!unread_msg){
        item.innerHTML += `
                <div class="unread-msg" data-num="${num_unread_msg}">${num_unread_msg}</div>
            `;
    }else{
        unread_msg.setAttribute('data-num', num_unread_msg);
        if(num_unread_msg >= 100){
            unread_msg.innerText = "99+";
        }else{
            unread_msg.innerText = num_unread_msg;
        }
    }
}

function clear_unread_message(type, chatId){
    chat_messages[type][chatId]['num_unread_msg'] = 0;
    let item;
    if(type == 'friend'){
        item = document.querySelector(`.friend-item[data-name="${chatId}"]`);
    }else if(type == 'group'){
        item = document.querySelector(`.group-item[data-name="${chatId}"]`);
    }
    const unread_msg = item.querySelector('.unread-msg');
    if(unread_msg){
        unread_msg.remove();
    }
}

function init_chat_info(type, chatId){
    if(!chat_messages[type][chatId]){
        // 初始化聊天信息
        chat_messages[type][chatId] = {
            'history': [],
            'num_unread_msg': 0,
            'latest_msg': '', // 用于主动向服务器发送获取最新消息请求，一般websocket在线时服务器主动推送最新消息。
            'latest_timestamp': '',
        };
    }
}

// 添加到消息列表中
function add_message_to_chatlist(type, sendId, messageText, timestamp){
    let from, to, chatId;

    if(sendId == userInfo.username){
        from = userInfo.username;
        to = currentChatId;
        chatId = to;
    }else{
        from = sendId;
        to = userInfo.username;
        chatId = from;
    }

    if(!chat_messages[type][chatId]){
        init_chat_info(type, chatId);
    }

    chat_messages[type][chatId]['history'].push({
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
        if(currentChatType == CHAT_TYPE.NONE){
            alert("请选择一名聊天对象！");
            return;
        }
        const input = document.getElementById('send-message-input');
        const messageText = input.value.trim();
        if (messageText) {

            const timestamp = new Date().toLocaleTimeString();

            socket.send(JSON.stringify({"type": currentChatType, 
                                        "content": messageText, 
                                        "from": userInfo.username,
                                        "to": currentChatId,
                                        "timestamp": timestamp,
                                    }));

            add_message(0, userInfo.username, messageText);

            let type;
            if(currentChatType == CHAT_TYPE.FRIEND){
                type = "friend";
            }else if(currentChatType == CHAT_TYPE.GROUP){
                type = "group";   
            }
 
            add_message_to_chatlist(type, userInfo.username, messageText, timestamp);

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
    const online_num = 10;

    const chatTitle = document.querySelector("#chat-title");
    chatTitle.setAttribute("data-name", groupName);
    chatTitle.setAttribute("data-type", "group");
    chatTitle.innerHTML = `
        <div id="chat-title-avatar" class="avatar">
            <img src="${DefaultAvatar}">
        </div>
        <span id="chat-title-name">${groupName}（当前在线人数：${online_num}）</span>
    `; 

    // 添加userinfo点击事件
    chatTitle.addEventListener("click", function() {
        const userInfo = {
            'username': groupName,
        }
        user_info(userInfo);
    });

    currentChatType = CHAT_TYPE.GROUP; // 当前聊天类型为群组聊天
    currentChatId = groupName;
    const chatInfo = chat_messages['group'][currentChatId]['history'];
    load_messages(chatInfo);

    clear_unread_message('group', currentChatId);
}



function handle_friend_item_click(friendName) {
    // 更新标题
    let data_online;
    if(!online_users[friendName]){
        data_online = false;
    }else{
        data_online = true
    }
    const chatTitle = document.querySelector("#chat-title");
    chatTitle.setAttribute("data-name", friendName);
    chatTitle.setAttribute("data-type", "friend");
    chatTitle.innerHTML = `
        <div id="chat-title-avatar" class="avatar" data-online="${data_online}">
            <img src="${DefaultAvatar}">
        </div>
        <span id="chat-title-name">${friendName}</span>
    `;

    // 添加userinfo点击事件
    chatTitle.addEventListener("click", function() {
        const userInfo = {
            'username': friendName,
        }
        user_info(userInfo);
    });
    
    currentChatType = CHAT_TYPE.FRIEND; // 当前聊天类型为好友聊天
    currentChatId = friendName;
    const chatInfo = chat_messages['friend'][currentChatId]['history'];
    load_messages(chatInfo);

    clear_unread_message('friend', currentChatId);
}




