import DefaultAvatar from "assets/images/default_avatar.jpg";

// 初始化用户profile
export function initUserProfile(){
    const userInfo = getUserInfo();
    const profile = document.getElementById('profile');
    const username = profile.querySelector(".username");
    username.textContent = userInfo.username;
    username.style.cursor = "pointer";
    username.setAttribute("data-username", userInfo.username);
    username.addEventListener("click", function(event){
        showUserModal(userInfo);
    });
    const avatar = profile.querySelector(".avatar");
    avatar.setAttribute("data-username", userInfo.username);
    avatar.innerHTML = `
        <img src="${userInfo.avatar}" alt="avatar">
    `;
    avatar.addEventListener("click", function(event){
        showUserModal(userInfo);
    });
}

// 对所有没有设置avatar的class类添加DefaultAvatar
export function handleUserInfo(userInfo){
    if(!userInfo.avatar || userInfo.avatar == ""){
        console.log(`设置默认头像${DefaultAvatar}`)
        userInfo['avatar'] = DefaultAvatar;
    }
    if(!userInfo.userDetails){
        userInfo.userDetails = "无简介";
    }
}

// 初始化用户信息
export function getUserInfo(){
    const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    if(!userInfo){
        console.log("用户未登录");
        alert("请先登录");
        window.location.href = "login.html";
    }
    handleUserInfo(userInfo);
    return userInfo;
};

// 弹窗显示用户信息
export function showUserModal(userInfo) {
    const page_modal = document.querySelector(".page-modal");
    const modal_content = page_modal.querySelector(".modal-content");
    modal_content.innerHTML = `
        <div id="user-info">
            <div class="avatar user-avatar">
                <img src="${userInfo.avatar}" alt="avatar">
            </div>
            <h2 class="username">${userInfo.username}</h2>
        </div>
        <p class="modal-subtitle">用户简介</p>
        <div class="user-details">${userInfo.userDetails}</div>
    `
    page_modal.style.display = "block";
    const close_btn = page_modal.querySelector('.close-modal');
    close_btn.addEventListener('click', () => {
        modal_content.innerHTML = ``;
        page_modal.style.display = "none";
    });
}