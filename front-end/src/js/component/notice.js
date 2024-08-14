
import { NOTICE_TYPE, CHAT_TYPE } from 'utils/constant.js';
import { addUnreadCnt, clearUnreadCnt, getNoticeList, sendRejectFriendRequest, sendAcceptFriendNotice, deleteNotice } from 'stores/notice.js';
import { handleUserInfo } from 'stores/user.js';
import { handleGroupInfo } from 'stores/group.js';
import { initFriendList, initGroupList } from 'component/friend.js';
import { addNewChat } from 'stores/message.js';

async function addNoticeButtons(notice, operation_buttons){
    const notice_type = notice.type;
    if(notice.notice_content.length >= 16){
        let read_btn = document.createElement('button');
        read_btn.className = 'read-btn';
        read_btn.textContent = '查看';
        read_btn.addEventListener('click', () => {
            clickReadNoticeBtn(read_btn);
        });
        operation_buttons.appendChild(read_btn);
    }
    if(notice_type == NOTICE_TYPE.REQUEST_FRIEND || notice_type == NOTICE_TYPE.REQUEST_GROUP){
        let add_btn = document.createElement('button');
        add_btn.textContent = '添加';
        add_btn.addEventListener('click', async () => {
            clickAcceptFriendBtn(notice);
            deleteNoticeItem(add_btn);
        });
        operation_buttons.appendChild(add_btn);
    }
    if(notice_type == NOTICE_TYPE.REQUEST_FRIEND || notice_type == NOTICE_TYPE.REQUEST_GROUP){
        let reject_btn = document.createElement('button');
        reject_btn.textContent = '拒绝';
        reject_btn.addEventListener('click', () => {
            clickRejectFriendBtn(notice);
            deleteNoticeItem(reject_btn);
        });
        operation_buttons.appendChild(reject_btn);
    }
    let delete_btn = document.createElement('button');
    delete_btn.className = 'delete-btn';
    delete_btn.textContent = '删除';
    delete_btn.addEventListener('click', () => {
        console.log("删除");
        clickDeleteNoticeBtn(delete_btn);
    });
    operation_buttons.appendChild(delete_btn);
}

async function clickAcceptFriendBtn(notice){
    console.log("添加好友")

    let {success, msg} = await sendAcceptFriendNotice(notice);
    if(!success){
        alert("错误：", msg);
        return;
    }

    if(notice.type == NOTICE_TYPE.REQUEST_FRIEND){
        let userInfo = notice.data; // 获取好友信息

        handleUserInfo(userInfo);
        // 获取在线状态并设置对应的在线状态
        initFriendList(userInfo);
        addNewChat(CHAT_TYPE.FRIEND, userInfo.userId);   
    }
    
    alert("添加成功！");
}

async function deleteNoticeItem(btn){
    let notice_item = btn.closest('.notice-item');
    notice_item.remove();
}

async function clickRejectFriendBtn(notice){
    console.log("拒绝好友")
    let {success, msg} = await sendRejectFriendRequest(notice);
    if(success){
        alert("发送成功！");
        deleteNotice(notice.noticeId);
    }else{
        alert("错误：", msg);
        return;
    }
}

async function clickDeleteNoticeBtn(delete_btn){
    let notice_item = delete_btn.closest('.notice-item');
    notice_item.remove();
    if(deleteNotice(notice_item.getAttribute("data-notice-id"))){
        alert("删除成功！");
    }
}

async function clickReadNoticeBtn(read_btn){
    let notice_item = read_btn.closest('.notice-item');
    let notice_content = notice_item.querySelector('.notice-content');
    if (notice_content.classList.contains('expanded')) {
        notice_content.classList.remove('expanded');
        read_btn.textContent = '查看';
    }else{
        notice_content.classList.add('expanded');
        read_btn.textContent = '收回';
    }
}

async function loadNoticeList(notice_list){
    const noticeList = getNoticeList();
    for(let i = 0; i < noticeList.length; i++){
        let notice = noticeList[i];
        let notice_item = document.createElement('div');
        notice_item.className= 'notice-item';
        notice_item.setAttribute("data-notice-id", notice.notice_id);
        notice_item.innerHTML = `
            <div class="avatar notice-avatar"></div>
            <div class="notice-title-container">
                <span class="notice-title">${notice.notice_title}</span>
                <div class="notice-timestamp">${notice.timestamp}</div>
            </div>
            <div class="notice-content">
                ${notice.notice_content}    
            </div>
            <div class="operation-buttons">
            </div>
            <div class="notice-sender">发送人：${notice.notice_sender}</div>
        `;
        const operation_buttons = notice_item.querySelector('.operation-buttons');
        await addNoticeButtons(notice, operation_buttons);
        notice_list.appendChild(notice_item);
    }
}

// 打开添加好友窗口
export async function initNotice(){
    document.getElementById('notice-button').addEventListener('click', async () => {
        const page_modal = document.querySelector(".page-modal");
        const modal_content = page_modal.querySelector(".modal-content");
        modal_content.innerHTML = `
            <div id="notice-modal-content" class="modal-content">
                <div id="notice-list">
                </div>
            </div>
        `;
        const notice_list = modal_content.querySelector('#notice-list');
        page_modal.style.display = "block";
        const close_btn = page_modal.querySelector('.close-modal');
        close_btn.addEventListener('click', () => {
            page_modal.style.display = "none";
        });

        loadNoticeList(notice_list);
        
        clearUnreadNotice();
    });
};

export function addUnreadNotice(){
    addUnreadCnt();
    document.querySelector('#notice-button').setAttribute("data-newMsg", true);
}

export function clearUnreadNotice(){
    clearUnreadCnt();
    document.querySelector('#notice-button').setAttribute("data-newMsg", false);
}