import { searchUser } from "api/search";
import { sendAddRequest } from "api/friend";
import { showFindFriendModal } from "component/modal";
import { ADD_FRIEND_TYPE, ADD_GROUP_TYPE } from "utils/constant";
import { handleUserInfo, getUserInfo } from "stores/user";
import { handleGroupInfo } from "stores/group";

// 打开添加好友窗口
export async function initAddButton(){
    document.getElementById('add-button').addEventListener('click', () => {
        
        showFindFriendModal();

        document.getElementById("find-friend-btn").addEventListener('click', () => {
            clickSearchUserBtn();
        })
    });
};

function clickSearchUserBtn() {
    let input_value = document.querySelector('#input-friend-name').value;
    if(input_value == '') {
        alert('请输入用户名');
    } else {
        const searchVO = {
            key: input_value,
            userId: -1,
        };
 
        searchUser(searchVO)
        .then(response => response.data)
        .then(res => {
            const data = res.data;
            console.log(data);
            renderSearchResult(data);
        })
    }
 };

 export function renderSearchResult(data){
    renderSearchUserResult(data);
    // renderSearchUserResult(data.friends);
    // renderSearchGroupResult(data.groups);
 }

async function addGroup(groupItem) {
    const userInfo = await getUserInfo({userId: -1});
    const addFriendVO = {
        "fromUserId": userInfo.userId,
        "toGroupId": groupItem.groupId,
        "type": ADD_GROUP_TYPE.REQUEST,
    };
    const isSuccess = await sendAddRequest(addFriendVO)
        .then(response => response.json())
        .then(data => {
            console.log("返回data: ", data);
            if(data.success){
                // 这里要查询这个好友或群组的详细信息
                return true; 
            }else{
                throw new Error("添加失败");
            }
        }).catch(error => {
            console.error('错误:' + error);
            return false;
        });
    return isSuccess;
}

async function addFriend(userItem) {
    const userInfo = await getUserInfo({userId: -1});
    const addFriendVO = {
        "fromUserId": userInfo.userId,
        "toUserId": userItem.userId,
        "type": ADD_FRIEND_TYPE.REQUEST,
    };
    const isSuccess = await sendAddRequest(addFriendVO)
        .then(response => response.json())
        .then(data => {
            console.log("返回data: ", data);
            if(data.success){
                // 这里要查询这个好友或群组的详细信息
                return true; 
            }else{
                throw new Error("添加失败：", data.message);
            }
        }).catch(error => {
            console.error('错误:' + error);
            return false;
        });
    return isSuccess;
}

function renderSearchUserResult(userList){
    const findUserResultList = document.getElementById("find-user-result-list");
    findUserResultList.innerHTML = "";
    for(let i = 0; i < userList.length; i++) {
        let userItem = userList[i];
        handleUserInfo(userItem);
        const findResultItem = document.createElement("div");
        findResultItem.className = "find-result-item";
        findResultItem.innerHTML = `
            <div class="avatar friend-avatar">
                <img src="${userItem.userAvatar}" alt="头像">
            </div>
            <span class="username">${userItem.username}</span>
            <button class="add-friend-btn" data-click="true">添加</button>
        `;
        
        // 添加键监听
        const addFriendBtn = findResultItem.querySelector('.add-friend-btn');
        addFriendBtn.addEventListener('click', () => {
            const isSuccess = addFriend(userItem);
            if(isSuccess){
                addFriendBtn.setAttribute('data-click', 'false');
                alert(`已给${userItem.username}发送添加请求`);
                addFriendBtn.innerHTML = '已发送';
            }else{
                alert(`发送请求失败`);
            }
        });

        findUserResultList.appendChild(findResultItem);
    }
};

function renderSearchGroupResult(groupList){
    const findGroupResultList = document.getElementById("find-group-result-list");
    findGroupResultList.innerHTML = "";
    for(let i = 0; i < groupList.length; i++) {
        let groupItem = groupList[i];
        handleGroupInfo(groupItem);
        const findResultItem = document.createElement("div");
        findResultItem.className = "find-result-item";
        findResultItem.innerHTML = `
            <div class="avatar group-avatar">
                <img src="${groupItem.groupAvatar}" alt="头像">
            </div>
            <span class="username">${groupItem.groupName}</span>
            <button class="add-friend-btn" data-click="true">添加</button>
        `
        // 添加键监听
        const addFriendBtn = findResultItem.querySelector('.add-friend-btn');
        addFriendBtn.addEventListener('click', () => {
            const isSuccess = addGroup(groupItem);
            if(isSuccess){
                addFriendBtn.setAttribute('data-click', 'false');
                alert(`已给${groupItem.groupName}发送添加请求`);
                addFriendBtn.innerHTML = '已发送';
            }else{
                alert(`发送请求失败`);
            }
        });

        findGroupResultList.appendChild(findResultItem);
    }
};