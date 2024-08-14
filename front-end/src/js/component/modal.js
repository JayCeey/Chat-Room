import { ITEM_TYPE } from "utils/constant";
import { renderSearchResult } from "component/search";
import { searchUser } from "api/search";
import { friendResult } from "api/friend"
import { getUserInfo, handleUserInfo, isFriend, isMyGroup } from "stores/user";
import { getUserOnlineState } from "stores/online";
import { handleGroupItemClick, handleFriendItemClick } from "component/friend";

async function showGroupInfoModal(modal_content, groupInfo) {
    const groupDetails = groupInfo.groupDetails? groupInfo.groupDetails : '暂无简介'
    modal_content.innerHTML = `
        <div id="group-info">
            <div class="avatar modal-avatar">
                <img src="${groupInfo.groupAvatar}" alt="avatar">
            </div>
            <h2 class="group-name">${groupInfo.groupName}</h2>
            <div class="modal-operation-container">
                
            </div>
            </div>
        </div>
        <p class="modal-subtitle">群组简介</p>
        <div class="group-details">${groupDetails}</div>
        <p class="modal-subtitle">群组成员</p>
        <div id="group-members">
            
        </div>
            
    `;

    const operation_container = modal_content.querySelector(".modal-operation-container");
    // 如果这个人是自己，添加按钮：修改
    if(isMyGroup(groupInfo.groupId)){
        operation_container.innerHTML += `
            <button class="operation-button" id="send-user-msg-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="90%" height="90%" fill="currentColor" class="bi bi-chat-dots" viewBox="0 0 16 16">
                    <path d="M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
                    <path d="m2.165 15.803.02-.004c1.83-.363 2.948-.842 3.468-1.105A9.06 9.06 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.437 10.437 0 0 1-.524 2.318l-.003.011a10.722 10.722 0 0 1-.244.637c-.079.186.074.394.273.362a21.673 21.673 0 0 0 .693-.125zm.8-3.108a1 1 0 0 0-.287-.801C1.618 10.83 1 9.468 1 8c0-3.192 3.004-6 7-6s7 2.808 7 6c0 3.193-3.004 6-7 6a8.06 8.06 0 0 1-2.088-.272 1 1 0 0 0-.711.074c-.387.196-1.24.57-2.634.893a10.97 10.97 0 0 0 .398-2z"/>
                </svg>
            </button>
            <button class="operation-button" id="quit-group-btn">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-backspace-reverse" viewBox="0 0 16 16">
                    <path d="M9.854 5.146a.5.5 0 0 1 0 .708L7.707 8l2.147 2.146a.5.5 0 0 1-.708.708L7 8.707l-2.146 2.147a.5.5 0 0 1-.708-.708L6.293 8 4.146 5.854a.5.5 0 1 1 .708-.708L7 7.293l2.146-2.147a.5.5 0 0 1 .708 0z"/>
                    <path d="M2 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7.08a2 2 0 0 0 1.519-.698l4.843-5.651a1 1 0 0 0 0-1.302L10.6 1.7A2 2 0 0 0 9.08 1H2zm7.08 1a1 1 0 0 1 .76.35L14.682 8l-4.844 5.65a1 1 0 0 1-.759.35H2a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h7.08z"/>
                </svg>
            </button>
        `;
    }else{
        operation_container.innerHTML += `
            <button class="operation-button" id="add-group-btn">加入</button>
        `;
    }

    const group_members = modal_content.querySelector('#group-members');

    // 根据群成员id找到他们的详细信息
    const groupMembers = groupInfo.groupMembers;
    for (let i = 0; i < groupMembers.length; i++) {
        let memberUserInfo = groupMembers[i];
        handleUserInfo(memberUserInfo);
        let data_online = await getUserOnlineState(memberUserInfo);
        group_members.innerHTML += `
            <div class="group-member" data-online="${data_online}">
                <div class="avatar member-avatar">
                    <img src="${memberUserInfo.userAvatar}" alt="avatar">
                </div>
                <div class="username">${memberUserInfo.username}</div>
            </div>
        `
    }

    handleGroupInfoModalBtns(operation_container, groupInfo);
    
    return modal_content;
}

async function sendDeleteGroupRequest(groupInfo){
    const userInfo = await getUserInfo({userId: -1});
    const resultInfo = {
        'from': userInfo.userId,
        'to': groupInfo.userId,
        'type': 3, // 删除
    }
    return await friendResult(resultInfo).then(response =>
        response.json()
    ).then(data => {
        if(data.success){
            return {success: true, msg: null};
        }
    }).catch(error => {
        return {success: false, msg: error};
    });
}

async function sendAddGroupRequest(groupInfo){
    const userInfo = await getUserInfo({userId: -1});
    const resultInfo = {
        'from': userInfo.userId,
        'to': groupInfo.groupId,
        'type': 0, // 添加
    }
    return await friendResult(resultInfo).then(response =>
        response.json()
    ).then(data => {
        if(data.success){
            return {success: true, msg: null};
        }
    }).catch(error => {
        return {success: false, msg: error};
    });
}


async function handleGroupInfoModalBtns(operation_container, groupInfo){
    const send_user_msg_btn = operation_container.querySelector("#send-user-msg-btn");
    if(send_user_msg_btn){
        send_user_msg_btn.addEventListener("click", async () => {
            handleGroupItemClick(groupInfo);
            operation_container.closest(".page-modal").querySelector(".close-modal").click();
        })
    }
    const quit_group_btn = operation_container.querySelector("#quit-group-btn");
    if(quit_group_btn){
        quit_group_btn.addEventListener("click", async () => {
            // 先发送删除请求
            let {success, msg} = await sendDeleteGroupRequest(groupInfo);
            if(success){
                alert("删除成功");
                // 将其从列表中移除
                let group_id = groupInfo.groupId;

                const groupItems = document.querySelectorAll('.group-item');

                // 遍历这些元素
                groupItems.forEach(item => {
                    // 检查元素的 data-id 属性是否为 1
                    if (item.getAttribute('data-id') == group_id) {
                        // 如果是，则删除该元素
                        item.remove();
                    }
                });
            }else{
                alert("删除失败：", msg);
            }
        });
    }
    const add_group_btn = operation_container.querySelector("#add-group-btn");
    if(add_group_btn){
        add_group_btn.addEventListener("click", async () => {
            // 先发送添加请求
            let {success, msg} = await sendAddGroupRequest(groupInfo);
            if(success){
                alert("请求成功");
            }else{
                alert("添加失败：", msg);
            }
        })
    }
} 

// 弹窗显示用户信息
async function showUserInfoModal(modal_content, userInfo) {
    const userDetails = userInfo.userDetails? userInfo.userDetails : '暂无简介';
    modal_content.innerHTML = `
        <div id="user-info">
            <div class="avatar modal-avatar">
                <img src="${userInfo.userAvatar}" alt="avatar">
            </div>
            <h2 class="username">${userInfo.username}</h2>
            <div class="modal-operation-container">
                
            </div>
        </div>
        <p class="modal-subtitle">用户简介</p>
        <div class="user-details">${userDetails}</div>
    `;

    const operation_container = modal_content.querySelector(".modal-operation-container");
    // 如果这个人是自己，添加按钮：修改
    console.log("userInfo.userId", userInfo.userId)
    if(userInfo.userId == (await getUserInfo({userId: -1})).userId){
        operation_container.innerHTML += `
            <button class="operation-button" id="edit-user-info-btn">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-person-badge" viewBox="0 0 16 16">
                    <path d="M6.5 2a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zM11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                    <path d="M4.5 0A2.5 2.5 0 0 0 2 2.5V14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2.5A2.5 2.5 0 0 0 11.5 0h-7zM3 2.5A1.5 1.5 0 0 1 4.5 1h7A1.5 1.5 0 0 1 13 2.5v10.795a4.2 4.2 0 0 0-.776-.492C11.392 12.387 10.063 12 8 12s-3.392.387-4.224.803a4.2 4.2 0 0 0-.776.492V2.5z"/>
                </svg>
            </button>
        `;
    }else if(isFriend(userInfo.userId)){
        operation_container.innerHTML += `
            <button class="operation-button" id="send-msg-btn">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-chat-dots" viewBox="0 0 16 16">
                    <path d="M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
                    <path d="m2.165 15.803.02-.004c1.83-.363 2.948-.842 3.468-1.105A9.06 9.06 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.437 10.437 0 0 1-.524 2.318l-.003.011a10.722 10.722 0 0 1-.244.637c-.079.186.074.394.273.362a21.673 21.673 0 0 0 .693-.125zm.8-3.108a1 1 0 0 0-.287-.801C1.618 10.83 1 9.468 1 8c0-3.192 3.004-6 7-6s7 2.808 7 6c0 3.193-3.004 6-7 6a8.06 8.06 0 0 1-2.088-.272 1 1 0 0 0-.711.074c-.387.196-1.24.57-2.634.893a10.97 10.97 0 0 0 .398-2z"/>
                </svg>
            </button>
            <button class="operation-button" id="delete-friend-btn">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-person-dash" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM11 12a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3Zm0-7a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/>
                    <path d="M8.256 14a4.474 4.474 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10c.26 0 .507.009.74.025.226-.341.496-.65.804-.918C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4s1 1 1 1h5.256Z"/>
                </svg>
            </button>
        `;
    }else{
        operation_container.innerHTML += `
            <button class="operation-button" id="add-friend-btn">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-person-add" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm.5-5a.5.5 0 0 0-1 0v1h-1a.5.5 0 0 0 0 1h1v1a.5.5 0 0 0 1 0v-1h1a.5.5 0 0 0 0-1h-1v-1Zm-2-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/>
                    <path d="M8.256 14a4.474 4.474 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10c.26 0 .507.009.74.025.226-.341.496-.65.804-.918C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4s1 1 1 1h5.256Z"/>
                </svg>
            </button>
        `;
    }

    handleUserInfoModalBtns(operation_container, userInfo);
}

async function sendDeleteFriendRequest(friendInfo){
    const userInfo = await getUserInfo({userId: -1});
    const resultInfo = {
        'from': userInfo.userId,
        'to': friendInfo.userId,
        'type': 3, // 删除
    }
    return await friendResult(resultInfo).then(response =>
        response.json()
    ).then(data => {
        if(data.success){
            return {success: true, msg: null};
        }
    }).catch(error => {
        return {success: false, msg: error};
    });
}

async function sendAddFriendRequest(friendInfo){
    const userInfo = await getUserInfo({userId: -1});
    const resultInfo = {
        'from': userInfo.userId,
        'to': friendInfo.userId,
        'type': 0, // 添加
    }
    return await friendResult(resultInfo).then(response =>
        response.json()
    ).then(data => {
        if(data.success){
            return {success: true, msg: null};
        }
    }).catch(error => {
        return {success: false, msg: error};
    });
}

async function handleUserInfoModalBtns(operation_container, userInfo){
    const edit_user_info_btn = operation_container.querySelector("#edit-user-info-btn");
    if(edit_user_info_btn){
        edit_user_info_btn.addEventListener("click", async () => {
            // 跳转到个人肖像页面/profile，并传入用户信息
            window.location.href = `/profile.html`;
        });
    }
    const send_msg_btn = operation_container.querySelector("#send-msg-btn");
    if(send_msg_btn){
        send_msg_btn.addEventListener("click", async () => {
            handleFriendItemClick(userInfo);
            operation_container.closest(".page-modal").querySelector(".close-modal").click();
        })
    }
    const delete_friend_btn = operation_container.querySelector("#delete-friend-btn");
    if(delete_friend_btn){
        delete_friend_btn.addEventListener("click", async () => {
            // 先发送删除请求
            let {success, msg} = await sendDeleteFriendRequest(userInfo);
            if(success){
                alert("删除成功");

                // 将其从列表中移除
                let friend_id = userInfo.userId;

                const friendItems = document.querySelectorAll('.friend-item');

                // 遍历这些元素
                friendItems.forEach(item => {
                    // 检查元素的 data-id 属性是否为 1
                    if (item.getAttribute('data-id') == friend_id) {
                        // 如果是，则删除该元素
                        item.remove();
                    }
                });
            }else{
                alert("删除失败：", msg);
            }
        });
    }
    const add_friend_btn = operation_container.querySelector("#add-friend-btn");
    if(add_friend_btn){
        add_friend_btn.addEventListener("click", async () => {
            // 先发送添加请求
            let {success, msg} = await sendAddFriendRequest(userInfo);
            if(success){
                alert("请求成功");
            }else{
                alert("请求失败：", msg);
            }
        })
    }
}

export function showInfoModal(info, itemType){
    const page_modal = document.querySelector(".page-modal");
    const modal_content = page_modal.querySelector(".modal-content");

    if(itemType == ITEM_TYPE.USER){
        showUserInfoModal(modal_content, info);
    }
    else if(itemType == ITEM_TYPE.GROUP){
        showGroupInfoModal(modal_content, info);
    }
    page_modal.style.display = "block";
    const close_btn = page_modal.querySelector('.close-modal');
    close_btn.addEventListener('click', () => {
        modal_content.innerHTML = ``;
        page_modal.style.display = "none";
    });
}

function listenInput(input_friend_name){
    input_friend_name.addEventListener('input', (event) => {
        const queryName = input_friend_name.value.trim();
        if (queryName.length > 0) {
            const searchVO = {
                queryName: queryName,
                userId: -1,
            };
            searchUser(searchVO)
            .then(response => response.json())
            .then(data => {
                renderSearchResult(data);
            })
        }
    });
}

// 初始化找好友弹窗
export function showFindFriendModal(){
    const page_modal = document.querySelector(".page-modal");
    const modal_content = page_modal.querySelector(".modal-content");
    modal_content.innerHTML = `
        <div id="find-modal-content" class="modal-content">
            <div id="find-friend-input">
                <input type="text" id="input-friend-name" placeholder="请输入好友昵称">
                <button id="find-friend-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                    </svg>
                </button>
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

    const input_friend_name = modal_content.querySelector("#input-friend-name");
    listenInput(input_friend_name);
}