import { searchUser } from "api/search";
import { sendFriendRequest } from "api/friend";
import { ADD_FRIEND_TYPE, ADD_GROUP_TYPE } from "utils/constant";

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
                        
                    </div>
                    <span class="find-result-title">群组</span>
                    <div id="find-group-result-list" class="find-result-list">
                    </div>
                </div>
            </div>
        `;
        page_modal.style.display = "block";
        const close_btn = page_modal.querySelector('.close-modal');
        close_btn.addEventListener('click', () => {
            page_modal.style.display = "none";
        });

        document.getElementById("find-friend-btn").addEventListener('click', () => {
            search_user();
        })
    });
};

function addFriend(userItem) {
    const userInfo = window.sessionStorage.getItem("userInfo");
    console.log(userInfo);
    const addFriendVO = {
        "fromUserId": userInfo.username,
        "toUserId": userItem.username,
        "type": ADD_FRIEND_TYPE.REQUEST,
    };
    const isSuccess = sendFriendRequest(addFriendVO).then(response => {
        if (!response.ok) {
            throw new Error('网络错误：' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log("返回data: ", data);
        if(data.success){
            // 这里要查询这个好友或群组的详细信息
            return true; 
        }else{
            throw new Error("查询失败");
        }
    }).catch(error => {
        console.error('错误:' + error);
        return false;
    });
    return isSuccess;
}

function renderSearchUserResult(userList){
    const findUserResultList = document.getElementById("find-user-result-list");
    for(let i = 0; i < userList.length; i++) {
        let userItem = userList[i];
        const findResultItem = document.createElement("div");
        findResultItem.className = "find-result-item";
        findResultItem.innerHTML = `
            <div class="avatar friend-avatar"></div>
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
    for(let i = 0; i < groupList.length; i++) {
        let groupItem = groupList[i];
        const findResultItem = document.createElement("div");
        findResultItem.className = "find-result-item";
        findResultItem.innerHTML = `
            <div class="avatar group-avatar"></div>
            <span class="username">${groupItem.username}</span>
            <button class="add-friend-btn" data-click="true">添加</button>
        `
        // 添加键监听
        const addFriendBtn = findResultItem.querySelector('.add-friend-btn');
        addFriendBtn.addEventListener('click', () => {
            const isSuccess = addFriend(groupItem);
            if(isSuccess){
                addFriendBtn.setAttribute('data-click', 'false');
                alert(`已给${groupItem.username}发送添加请求`);
                addFriendBtn.innerHTML = '已发送';
            }else{
                alert(`发送请求失败`);
            }
        });

        findGroupResultList.appendChild(findResultItem);
    }
};

function search_user() {
   let input_value = document.querySelector('#input-friend-name').value;
   if(input_value == '') {
      alert('请输入用户名');
   } else {
      // TODO: 查询用户
      console.log('查询用户：', input_value);
      const searchVO = {
         username: input_value,
         userId: -1,
      }

    searchUser(searchVO).then(response => {
        if (!response.ok) {
            throw new Error('网络错误：' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log("返回data: ", data);
        if(data.success){
            renderSearchUserResult(data.friends);
            renderSearchGroupResult(data.groups);
        }else{
            throw new Error("查询失败");
        }
    })
    .catch(error => {
        console.error('错误:' + error);
    });
    }
};