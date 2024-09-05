import DefaultAvatar from "assets/images/default_avatar.jpg";
import { queryUserInfo } from "api/user";
import { ITEM_TYPE } from "utils/constant";

// 存储用户的上下文信息
let userContext = {
    currentUserInfo: {},
    groupsInfo: {},
    friendsInfo: {},
}

export function setUserContext(type, info){
    if(type == ITEM_TYPE.GROUP){
        userContext.groupsInfo[info.groupId] = info;
    } else if(type == ITEM_TYPE.USER){
        userContext.friendsInfo[info.userId] = info;
    }
}

// 对所有没有设置avatar的class类添加DefaultAvatar
export function handleUserInfo(userInfo){
    setUserDefaultAvatar(userInfo);
}

export function isFriend(friendUserId){
    console.log(userContext)
    if(userContext.friendsInfo[friendUserId]) return true;
    return false;
}

export function isMyGroup(groupId){
    if(userContext.groupsInfo[groupId]) return true;
    return false;
}

function setUserDefaultAvatar(userInfo){
    if(!userInfo.userAvatar || userInfo.userAvatar == ""){
        // console.log(`设置默认头像${DefaultAvatar}`)
        userInfo.userAvatar = DefaultAvatar;
    }
};

async function getUserInfoById(userId){ 
    if(!userId) throw new Error("userId不能为空");
    return queryUserInfo(userId)
        .then(response => response.data)
        .then(res => {
            console.log(res)
            if(res.success){
                const data = res.data;
                const userInfo = {
                    "userId": data.userId, 
                    "username": data.username,
                    "userAvatar": data.userAvatar,
                    "userDetails": data.userDetails,
                };
                return userInfo;
            }else{
                throw new Error(res.msg);
            }
        })
        .catch(error => {
            console.error('错误:' + error);
        });
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
    const flag = await checkAvailable();
    if(!flag) return; // 如果用户未登录，则直接返回
    const userInfo = await getUserInfoById(-1);
    console.log("当前用户：", userInfo);
    handleUserInfo(userInfo);
    userContext.currentUserInfo = userInfo; // 设置当前用户信息
}

async function checkAvailable(){
    const accessToken = sessionStorage.getItem("accessToken");
    if(!accessToken){
        // 首先刷新refreshToken
        // 如果refreshToken不存在，则说明用户未登录，直接跳转到用户登录页面；
        // 如果成功刷新，那么重新初始化用户信息
        console.log("用户未登录");
        alert("请先登录");
        window.location.href = "login.html";
        return false;
    }
    return true;
}