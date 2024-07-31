
// 弹窗显示用户信息
export function user_info(userInfo) {
    
    const page_modal = document.querySelector(".page-modal");
    const modal_content = page_modal.querySelector(".modal-content");
    modal_content.innerHTML = `
        <div id="user-info">
            <div class="avatar user-avatar"></div>
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

// 初始化用户profile
function init_user_profile(userInfo){
    const profile = document.getElementById('profile');
    const username = profile.querySelector(".username");
    username.textContent = userInfo.username;
    username.style.cursor = "pointer";
    username.setAttribute("data-username", userInfo.username);
    username.addEventListener("click", function(event){
        user_info(userInfo);
    });
    const avatar = profile.querySelector(".avatar");
    avatar.setAttribute("data-username", userInfo.username);
    avatar.addEventListener("click", function(event){
        user_info(userInfo);
    });
}

// 初始化用户信息
export function init_user_info(){
    const temp_userInfo = sessionStorage.getItem("userInfo");
    if(!temp_userInfo){
        console.log("用户未登录");
        alert("请先登录");
        window.location.href = "login.html";
    }
    const userInfo = JSON.parse(temp_userInfo);

    init_user_profile(userInfo); // 初始化用户信息
    return userInfo;
};