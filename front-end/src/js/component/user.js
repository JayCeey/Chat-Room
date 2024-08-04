import DefaultAvatar from "assets/images/default_avatar.jpg";
import { queryUserInfo } from "api/user";
import { CHAT_TYPE, ITEM_TYPE } from "utils/constant";
import { showInfoModal } from "component/modal";

// 存储用户的上下文信息
let userContext = {
    currentUserInfo: {},
    groupsInfo: {},
    friendsInfo: {},
}

function setUserDefaultAvatar(userInfo){
    if(!userInfo.userAvatar || userInfo.userAvatar == ""){
        // console.log(`设置默认头像${DefaultAvatar}`)
        userInfo.userAvatar = DefaultAvatar;
    }
};

async function getUserInfoById(userId){ 
    if(!userId) throw new Error("userId不能为空");
    return queryUserInfo(userId).then(response => {
        if (!response.ok) {
            throw new Error('网络错误：' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        if(data.success){
            const userInfo = {
                "userId": userId, 
                "username": data.username,
                "userAvatar": data.userAvatar,
                "userDetails": data.userDetails,
            };
            return userInfo;
        }else{
            throw new Error(data.message);
        }
    })
    .catch(error => {
        console.error('错误:' + error);
    });
}

// 只是获取简单的存储在本地的用户基本信息如uid, 用户名等
function getUserSessionInfo(){
    const userSessionInfo = JSON.parse(sessionStorage.getItem("userSessionInfo"));
    if(!userSessionInfo){
        console.log("用户未登录");
        alert("请先登录");
        window.location.href = "login.html";
    }
    return userSessionInfo;
}

// 初始化用户profile
export async function initUserProfile(){
    const userInfo = await getUserInfo({userId: -1});
    const profile = document.getElementById('profile');
    const username = profile.querySelector(".username");
    username.textContent = userInfo.username;
    username.style.cursor = "pointer";
    username.setAttribute("data-username", userInfo.username);
    username.addEventListener("click", function(event){
        showInfoModal(userInfo, ITEM_TYPE.USER);
    });
    const avatar = profile.querySelector(".avatar");
    avatar.setAttribute("data-username", userInfo.username);
    avatar.innerHTML = `
        <img src="${userInfo.userAvatar}" alt="avatar">
    `;
    avatar.addEventListener("click", function(event){
        showInfoModal(userInfo, ITEM_TYPE.USER);
    });
}

// 对所有没有设置avatar的class类添加DefaultAvatar
export function handleUserInfo(userInfo){
    setUserDefaultAvatar(userInfo);
}

// 初始化用户信息
export async function getUserInfo(userQuery){
    const userId = userQuery.userId;
    // 获取当前用户
    if(userId == -1 || userId == userContext.currentUserInfo.userId){   
        return userContext.currentUserInfo;
    }else if(userContext.friendsInfo[userId]){
        return userContext.friendsInfo[userId];
    }

    const userInfo = await getUserInfoById(userId);
    handleUserInfo(userInfo);
    return userInfo;
};

export async function initCurrentUserInfo(){
    const userSessionInfo = getUserSessionInfo();
    const userQuery = {userId: userSessionInfo.userId};
    const userInfo = await getUserInfo(userQuery);
    handleUserInfo(userInfo);
    userContext.currentUserInfo = userInfo; // 设置当前用户信息
}