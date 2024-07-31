

// 打开添加好友窗口
export function init_find_friend(){
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
                        <div class="find-result-item">
                            <div class="avatar friend-avatar"></div>
                            <span class="username">user1</span>
                            <button class="add-friend-btn">添加</button>
                        </div>
                    </div>
                    <span class="find-result-title">群组</span>
                    <div id="find-group-result-list" class="find-result-list">
                        <div class="find-result-item">
                            <div class="avatar friend-avatar"></div>
                            <span class="username">user1</span>
                            <button class="add-friend-btn">添加</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        page_modal.style.display = "block";
        const close_btn = page_modal.querySelector('.close-modal');
        close_btn.addEventListener('click', () => {
            page_modal.style.display = "none";
        });
    });
}