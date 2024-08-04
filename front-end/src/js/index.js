import "css/index.scss";
import { MESSAGE_TYPE, CHAT_TYPE } from "utils/constant";
import { initNotice, initNoticeListner } from "component/notice";
import { initMoreBtn } from "component/more";
import { initUserProfile, initCurrentUserInfo } from "component/user";
import { initLogoutBtn } from "component/logout";
import { initSendMessage, getHistoryMessages } from "component/message";
import { getUserFriendsList } from "component/friend";
import { initAddButton } from "./component/search";
import { initWebsocket } from "component/websocket";

// 初始化
document.addEventListener("DOMContentLoaded", async () => {
    await initCurrentUserInfo()// 初始化用户信息
    initUserProfile(); // 初始化用户肖像
    initLogoutBtn(); // 初始化退出登录按钮
    initNotice(); // 初始化通知
    initMoreBtn(); // 初始化更多按钮
    initAddButton(); // 初始化添加好友按钮
    initSendMessage(); // 初始化发送消息按钮
    initWebsocket(); // 初始化websocket，最后才初始化

    // 获取数据了，此时就可以渲染初始信息了
    getUserFriendsList(); // 获取好友列表
    getHistoryMessages(); // 获取历史消息
    // initNoticeListner(); // 获取通知
})

