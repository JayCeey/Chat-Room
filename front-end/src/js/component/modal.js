import { ITEM_TYPE } from "utils/constant";

function showGroupInfoModal(groupInfo) {
    const groupDetails = groupInfo.groupDetails? groupInfo.groupDetails : '暂无简介'
    return `
        <div id="group-info">
            <div class="avatar modal-avatar">
                <img src="${groupInfo.groupAvatar}" alt="avatar">
            </div>
            <h2 class="username">${groupInfo.groupName}</h2>
        </div>
        <p class="modal-subtitle">群组简介</p>
        <div class="group-details">${groupDetails}</div>
    `
}

// 弹窗显示用户信息
function showUserInfoModal(userInfo) {
    const userDetails = userInfo.userDetails? userInfo.userDetails : '暂无简介';
    return `
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
        modal_content.innerHTML = showUserInfoModal(info);
    }
    else if(itemType == ITEM_TYPE.GROUP){
        modal_content.innerHTML = showGroupInfoModal(info);
    }
    page_modal.style.display = "block";
    const close_btn = page_modal.querySelector('.close-modal');
    close_btn.addEventListener('click', () => {
        modal_content.innerHTML = ``;
        page_modal.style.display = "none";
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
}