
import { CHAT_TYPE, ITEM_TYPE } from "utils/constant";
import { getUserInfo, handleUserInfo } from "component/user";
import { getFriends } from 'api/friend';
import { addNewChat, changeChatView } from "component/message";
import { askUsersOnlineState } from "component/websocket";
import { getUserOnlineState } from "component/online";
import { showInfoModal } from "component/modal";
import { handleGroupInfo } from "component/group";

async function getOnlineNum(groupMembers){
    let online_num = 0;
    for(let i = 0; i < groupMembers.length; i++){
        const isOnline = await getUserOnlineState(groupMembers[i]);
        if(isOnline) online_num++;
    }
    return online_num;
}

async function handleGroupItemClick(groupItem) {
    const groupMembers = groupItem.groupMembers;
    const online_num = await getOnlineNum(groupMembers);
    const chatTitle = document.querySelector("#chat-title");
    chatTitle.setAttribute("data-id", groupItem.groupId);
    chatTitle.setAttribute("data-type", "group");
    chatTitle.innerHTML = `
        <div id="chat-title-avatar" class="avatar">
            <img src="${groupItem.groupAvatar}">
        </div>
        <span id="chat-title-name">${groupItem.groupName}(${online_num}/${groupMembers.length})</span>
    `; 

    // 添加userinfo点击事件
    chatTitle.addEventListener("click", function() {
        showInfoModal(groupItem, ITEM_TYPE.GROUP);
    });

    changeChatView(CHAT_TYPE.GROUP, groupItem.groupId);
}

async function handleFriendItemClick(friendItem) {
    // 更新标题
    let data_online = await getUserOnlineState(friendItem);
    const chat_title = document.querySelector("#chat-title");
    chat_title.setAttribute("data-id", friendItem.userId);
    chat_title.setAttribute("data-type", "friend");
    chat_title.innerHTML = `
        <div id="chat-title-avatar" class="avatar" data-online="${data_online}">
            <img src="${friendItem.userAvatar}">
        </div>
        <span id="chat-title-name">${friendItem.username}</span>
    `;

    // 添加userinfo点击事件
    chat_title.addEventListener("click", function() {
        showInfoModal(friendItem, ITEM_TYPE.USER);
    });
    
    changeChatView(CHAT_TYPE.FRIEND, friendItem.userId);
}

export async function initGroupList(groupInfo){
    const group_item = document.createElement('div');
    const groupId = groupInfo.groupId;
    const groupName = groupInfo.groupName;
    group_item.classList.add('group-item');
    group_item.setAttribute('data-id', groupId);
    group_item.innerHTML = `
        <div class="avatar group-avatar">
            <img src="${groupInfo.groupAvatar}" alt="头像">
        </div>
        <div class="group-name">${groupName}</div>
    `;
    group_item.addEventListener('click', () => {
        handleGroupItemClick(groupInfo);
    });
    document.getElementById('group').appendChild(group_item);
}

// 初始化朋友或群组列表
export async function initFriendList(friendInfo){
    const friend_item = document.createElement('div');
    const friendId = friendInfo.userId;
    friend_item.classList.add('friend-item');
    friend_item.setAttribute('data-id', friendId);
    friend_item.setAttribute('data-online', false);
    friend_item.innerHTML = `
        <div class="avatar friend-avatar">
            <img src="${friendInfo.userAvatar}" alt="头像">
        </div>
        <div class="friend-name">${friendInfo.username}</div>
    `;
    friend_item.addEventListener('click', () => {
        handleFriendItemClick(friendInfo);
    });
    document.getElementById('friend').appendChild(friend_item);
};

export async function getUserFriendsList(){
    const userInfo = await getUserInfo({userId: -1});
    const friendQuery = {
        userId: userInfo.userId,
    }
    return getFriends(friendQuery).then(response => {
        if (!response.ok) {
            throw new Error('网络错误：' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        if(!data.success){
            throw new Error('获取好友列表失败');
        }
        const friendList = data.friends;
        
        // 向websocket服务器询问这些好友是否上线
        let usersQuery = {users: []};
        let askUsersIdSet = new Set();
        
        for (let i = 0; i < friendList.length; i++) {
            let friendInfo = friendList[i];
            askUsersIdSet.add(friendList[i].userId);
            handleUserInfo(friendInfo);
            // 获取在线状态并设置对应的在线状态
            initFriendList(friendInfo);
            addNewChat(CHAT_TYPE.FRIEND, friendInfo.userId);
        }

        const groupList = data.groups;

        for (let i = 0; i < groupList.length; i++) {
            let groupInfo = groupList[i];
            groupInfo.groupMembers.forEach(memberInfo => {
                askUsersIdSet.add(memberInfo.userId);
            });
            handleGroupInfo(groupInfo);
            initGroupList(groupInfo);
            addNewChat(CHAT_TYPE.GROUP, groupInfo.groupId);
        }

        usersQuery.users = Array.from(askUsersIdSet);
        askUsersOnlineState(usersQuery);
    })
    .catch(error => {
        console.error('错误:' + error);
    }); 
}


