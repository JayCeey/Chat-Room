
import { CHAT_TYPE, ITEM_TYPE } from "utils/constant";
import { setUserContext } from "stores/user";
import { changeChatView } from "stores/message";
import { getUserOnlineState } from "stores/online";
import { getOnlineNum } from "stores/friend";
import { showInfoModal } from "component/modal";

export async function handleGroupItemClick(groupItem) {
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

export async function handleFriendItemClick(friendItem) {
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
    // 设置到userContext中
    setUserContext(ITEM_TYPE.GROUP, groupInfo);

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
    // 设置到userContext中
    setUserContext(ITEM_TYPE.USER, friendInfo);

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
