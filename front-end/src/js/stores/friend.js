import { getFriends } from 'api/friend';
import { handleGroupInfo } from "stores/group";
import { askUsersOnlineState } from "component/websocket";
import { getUserInfo, handleUserInfo } from "stores/user";
import { addNewChat } from "stores/message";
import { getUserOnlineState } from "stores/online";
import { initFriendList, initGroupList } from 'component/friend';
import { CHAT_TYPE } from 'utils/constant';


export async function getOnlineNum(groupMembers){
    let online_num = 0;
    for(let i = 0; i < groupMembers.length; i++){
        const isOnline = await getUserOnlineState(groupMembers[i]);
        if(isOnline) online_num++;
    }
    return online_num;
}

export async function getUserFriendsList(){
    const userInfo = await getUserInfo({userId: -1});
    const friendQuery = {
        userId: userInfo.userId,
    }
    return getFriends(friendQuery)
            .then(response => response.json())
            .then(data => {
                if(!data.success){
                    throw new Error('获取好友列表失败');
                }
                const friendList = data.friends;
                
                // 向websocket服务器询问这些好友是否上线
                let usersQuery = {users: []};
                let askUsersIdSet = new Set();
                
                for (let i = 0; i < friendList.length; i++) {
                    let friendInfo = friendList[i];
                    askUsersIdSet.add(friendList[i].userId);
                    handleUserInfo(friendInfo);
                    // 获取在线状态并设置对应的在线状态
                    initFriendList(friendInfo);
                    addNewChat(CHAT_TYPE.FRIEND, friendInfo.userId);
                }

                const groupList = data.groups;

                for (let i = 0; i < groupList.length; i++) {
                    let groupInfo = groupList[i];
                    groupInfo.groupMembers.forEach(memberInfo => {
                        askUsersIdSet.add(memberInfo.userId);
                    });
                    handleGroupInfo(groupInfo);
                    initGroupList(groupInfo);
                    addNewChat(CHAT_TYPE.GROUP, groupInfo.groupId);
                }

                usersQuery.users = Array.from(askUsersIdSet);
                askUsersOnlineState(usersQuery);
            })
            .catch(error => {
                console.error('错误:' + error);
            }); 
}

