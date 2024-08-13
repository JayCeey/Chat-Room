
import { ITEM_TYPE } from "utils/constant";
import { showInfoModal } from "component/modal";
import { getUserInfo } from "stores/user";

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