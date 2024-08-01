import { searchUser } from "api/search";
import { sendFriendRequest } from "api/friend";
import { ADD_FRIEND_TYPE, ADD_GROUP_TYPE, CHAT_TYPE } from "utils/constant";
import { showUserModal, getUserInfo, handleUserInfo } from "component/user";
import { getFriends } from 'api/friend';
import { addNewChat } from "component/message";
import { changeChatView } from "component/message";
import { getFriendsOnlineState } from "component/websocket";
import { getUserOnlineState } from "component/online";

function clickSearchUserBtn() {
    let input_value = document.querySelector('#input-friend-name').value;
    if(input_value == '') {
        alert('请输入用户名');
    } else {
        // TODO: 查询用户
        console.log('查询用户：', input_value);
        const searchVO = {
            username: input_value,
            userId: -1,
        }
 
        searchUser(searchVO).then(response => {
            if (!response.ok) {
                throw new Error('网络错误：' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log("返回data: ", data);
            if(data.success){
                renderSearchUserResult(data.friends);
                renderSearchGroupResult(data.groups);
            }else{
                throw new Error("查询失败");
            }
        })
        .catch(error => {
            console.error('错误:' + error);
        });
        }
 };

function addFriend(userItem) {
    const userInfo = sessionStorage.getItem("userInfo");
    console.log(userInfo);
    const addFriendVO = {
        "fromUserId": userInfo.username,
        "toUserId": userItem.username,
        "type": ADD_FRIEND_TYPE.REQUEST,
    };
    const isSuccess = sendFriendRequest(addFriendVO).then(response => {
        if (!response.ok) {
            throw new Error('网络错误：' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log("返回data: ", data);
        if(data.success){
            // 这里要查询这个好友或群组的详细信息
            return true; 
        }else{
            throw new Error("查询失败");
        }
    }).catch(error => {
        console.error('错误:' + error);
        return false;
    });
    return isSuccess;
}

function renderSearchUserResult(userList){
    const findUserResultList = document.getElementById("find-user-result-list");
    for(let i = 0; i < userList.length; i++) {
        let userItem = userList[i];
        handleUserInfo(userItem);
        const findResultItem = document.createElement("div");
        findResultItem.className = "find-result-item";
        findResultItem.innerHTML = `
            <div class="avatar friend-avatar">
                <img src="${userItem.avatar}" alt="头像">
            </div>
            <span class="username">${userItem.username}</span>
            <button class="add-friend-btn" data-click="true">添加</button>
        `;
        
        // 添加键监听
        const addFriendBtn = findResultItem.querySelector('.add-friend-btn');
        addFriendBtn.addEventListener('click', () => {
            const isSuccess = addFriend(userItem);
            if(isSuccess){
                addFriendBtn.setAttribute('data-click', 'false');
                alert(`已给${userItem.username}发送添加请求`);
                addFriendBtn.innerHTML = '已发送';
            }else{
                alert(`发送请求失败`);
            }
        });

        findUserResultList.appendChild(findResultItem);
    }
};

function renderSearchGroupResult(groupList){
    const findGroupResultList = document.getElementById("find-group-result-list");
    for(let i = 0; i < groupList.length; i++) {
        let groupItem = groupList[i];
        handleUserInfo(groupItem);
        const findResultItem = document.createElement("div");
        findResultItem.className = "find-result-item";
        findResultItem.innerHTML = `
            <div class="avatar group-avatar">
                <img src="${groupItem.avatar}" alt="头像">
            </div>
            <span class="username">${groupItem.username}</span>
            <button class="add-friend-btn" data-click="true">添加</button>
        `
        // 添加键监听
        const addFriendBtn = findResultItem.querySelector('.add-friend-btn');
        addFriendBtn.addEventListener('click', () => {
            const isSuccess = addFriend(groupItem);
            if(isSuccess){
                addFriendBtn.setAttribute('data-click', 'false');
                alert(`已给${groupItem.username}发送添加请求`);
                addFriendBtn.innerHTML = '已发送';
            }else{
                alert(`发送请求失败`);
            }
        });

        findGroupResultList.appendChild(findResultItem);
    }
};

function handleGroupItemClick(groupItem) {
    const online_num = 10;

    const chatTitle = document.querySelector("#chat-title");
    chatTitle.setAttribute("data-name", groupItem.username);
    chatTitle.setAttribute("data-type", "group");
    chatTitle.innerHTML = `
        <div id="chat-title-avatar" class="avatar">
            <img src="${groupItem.avatar}">
        </div>
        <span id="chat-title-name">${groupItem.username}（当前在线人数：${online_num}）</span>
    `; 

    // 添加userinfo点击事件
    chatTitle.addEventListener("click", function() {
        showUserModal(groupItem);
    });

    changeChatView(CHAT_TYPE.GROUP, groupItem.username);
}

function handleFriendItemClick(friendItem) {
    
    // 更新标题
    let data_online = getUserOnlineState(friendItem.username);
    const chat_title = document.querySelector("#chat-title");
    chat_title.setAttribute("data-name", friendItem.username);
    chat_title.setAttribute("data-type", "friend");
    chat_title.innerHTML = `
        <div id="chat-title-avatar" class="avatar" data-online="${data_online}">
            <img src="${friendItem.avatar}">
        </div>
        <span id="chat-title-name">${friendItem.username}</span>
    `;

    // 添加userinfo点击事件
    chat_title.addEventListener("click", function() {
        showUserModal(friendItem);
    });
    
    changeChatView(CHAT_TYPE.FRIEND, friendItem.username);
}


// 打开添加好友窗口
export function initAddButton(){
    document.getElementById('add-button').addEventListener('click', () => {
        const page_modal = document.querySelector(".page-modal");
        const modal_content = page_modal.querySelector(".modal-content");
        modal_content.innerHTML = `
            <div id="find-modal-content" class="modal-content">
                <div id="find-friend-input">
                    <input type="text" id="input-friend-name" placeholder="请输入好友昵称">
                    <button id="find-friend-btn">查找</button>
                </div>
                <div id="find-friend-result">
                    <span class="find-result-title">用户</span>
                    <div id="find-user-result-list" class="find-result-list">
                        
                    </div>
                    <span class="find-result-title">群组</span>
                    <div id="find-group-result-list" class="find-result-list">
                    </div>
                </div>
            </div>
        `;
        page_modal.style.display = "block";
        const close_btn = page_modal.querySelector('.close-modal');
        close_btn.addEventListener('click', () => {
            page_modal.style.display = "none";
        });

        document.getElementById("find-friend-btn").addEventListener('click', () => {
            clickSearchUserBtn();
        })
    });
};

// 初始化朋友或群组列表
export function initFriendList(type, friendInfo){
    if(type == CHAT_TYPE.FRIEND){
        const friend_item = document.createElement('div');
        const friendName = friendInfo.username;
        friend_item.classList.add('friend-item');
        friend_item.setAttribute('data-name', friendName);
        console.log("当前消息：", friendInfo)
        friend_item.innerHTML = `
            <div class="avatar friend-avatar">
                <img src="${friendInfo.avatar}" alt="头像">
            </div>
            <div class="friend-name">${friendInfo.username}</div>
        `;
        friend_item.addEventListener('click', () => {
            handleFriendItemClick(friendInfo);
        });
        document.getElementById('friend').appendChild(friend_item);
    }else if(type == CHAT_TYPE.GROUP){
        const group_item = document.createElement('div');
        const groupName = friendInfo.username;
        group_item.classList.add('group-item');
        group_item.setAttribute('data-name', groupName);
        group_item.innerHTML = `
            <div class="avatar friend-avatar">
                <img src="${friendInfo.avatar}" alt="头像">
            </div>
            <div class="friend-name">${friendInfo.username}</div>
        `;
        group_item.addEventListener('click', () => {
            handleGroupItemClick(friendInfo);
        });
        document.getElementById('group').appendChild(group_item);
    }
};

export function getUserFriendsList(){
    const userInfo = getUserInfo();
    console.log(userInfo);
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

        // 向websocket服务器询问这些好友是否上线
        let friends = [];
        for(let i = 0; i < friendList.length; i++){
            friends.push(friendList[i].username);
        }
        getFriendsOnlineState(friends);
        
        for (let i = 0; i < friendList.length; i++) {
            let friendInfo = friendList[i];
            handleUserInfo(friendInfo);
            initFriendList(CHAT_TYPE.FRIEND, friendInfo);
            addNewChat(CHAT_TYPE.FRIEND, friendInfo.username);
        }

        const groupList = data.groups;
        for (let i = 0; i < groupList.length; i++) {
            let groupInfo = groupList[i];
            handleUserInfo(groupInfo);
            initFriendList(CHAT_TYPE.GROUP, groupInfo);
            addNewChat(CHAT_TYPE.GROUP, groupInfo.username);
        }
    })
    .catch(error => {
        console.error('错误:' + error);
    }); 
}


