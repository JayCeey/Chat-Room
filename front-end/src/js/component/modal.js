import { ITEM_TYPE } from "utils/constant";
import { renderSearchResult } from "component/search";
import { searchUser } from "api/search";
import { getUserInfo, handleUserInfo } from "component/user";
import { getUserOnlineState } from "component/online";

async function showGroupInfoModal(modal_content, groupInfo) {
    const groupDetails = groupInfo.groupDetails? groupInfo.groupDetails : '暂无简介'
    modal_content.innerHTML = `
        <div id="group-info">
            <div class="avatar modal-avatar">
                <img src="${groupInfo.groupAvatar}" alt="avatar">
            </div>
            <h2 class="username">${groupInfo.groupName}</h2>
        </div>
        <p class="modal-subtitle">群组简介</p>
        <div class="group-details">${groupDetails}</div>
        <p class="modal-subtitle">群组成员</p>
        <div id="group-members">
            
        </div>
            
    `;

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
    
    return modal_content;
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
        </div>
        <p class="modal-subtitle">用户简介</p>
        <div class="user-details">${userDetails}</div>
    `
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
            searchUser(searchVO).then(response => {
                if(response.ok) return response.json();
            }).then(data => {
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

    const input_friend_name = modal_content.querySelector("#input-friend-name");
    listenInput(input_friend_name);
}