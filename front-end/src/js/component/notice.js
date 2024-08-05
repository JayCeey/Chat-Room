import CONFIG from '../config.js';
 
let noticeList = [];
let unreadCnt = 0;

// 打开添加好友窗口
export function initNotice(){
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
        for(let i = 0; i < noticeList.length; i++){
            let notice = noticeList[i];
            console.log(noticeList);
            notice_list.innerHTML += `
                <div class="notice-item">
                    <div class="avatar notice-avatar"></div>
                    <div class="notice-title-container">
                        <span class="notice-title">${notice.notice_title}</span>
                        <div class="notice-timestamp">${notice.timestamp}</div>
                    </div>
                    <div class="notice-content">
                        ${notice.notice_content}
                        <div class="operation-buttons">
                            <button>查看</button>
                            <button>添加</button>
                            <button>拒绝</button>
                            <button>删除</button>
                        </div>
                    </div>
                    <div class="notice-sender">发送人：${notice.notice_sender}</div>
                </div>
            `
        }
        
        clearUnreadNotice()
    });
};

// 监听服务器是否发送消息回来
export async function initNoticeListner(){
    const eventSource = new EventSource(`${CONFIG.BASE_URL}/notice`);
    eventSource.onmessage = (event) => {
        console.log(`收到服务器通知: ${event.data}`);
        const data = JSON.parse(event.data)
        noticeList.push(data);
        addUnreadNotice();
    };
}

function addUnreadNotice(){
    unreadCnt += 1;
    document.querySelector('#notice-button').setAttribute("data-newMsg", true);
}

function clearUnreadNotice(){
    unreadCnt = 0;
    document.querySelector('#notice-button').setAttribute("data-newMsg", false);
}