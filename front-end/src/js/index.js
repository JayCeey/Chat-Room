import "css/index.scss";
import "static/css/bootstrap.min.css";
import "static/js/bootstrap.min.js";
import { initNotice } from "component/notice";
import { initNoticeListner } from "stores/notice";
import { initMoreBtn } from "component/more";
import { initUserProfile } from "component/user";
import { initCurrentUserInfo } from "stores/user";
import { initLogoutBtn } from "component/logout";
import { initSendMessage } from "component/message";
import { getHistoryMessages } from "stores/message";
import { getUserFriendsList } from "stores/friend";
import { initAddButton } from "component/search";
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
    initNoticeListner(); // 获取通知

    // 获取数据了，此时就可以渲染初始信息了
    getUserFriendsList(); // 获取好友列表
    getHistoryMessages(); // 获取历史消息
    
})

