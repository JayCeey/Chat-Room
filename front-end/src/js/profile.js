import 'css/profile.scss';
import { initCurrentUserInfo, getUserInfo } from 'stores/user';
import { updateUserInfo } from 'api/user';
import { Buffer } from 'buffer';

let userInfo;

let avatarBase64 = '';

document.addEventListener('DOMContentLoaded', async function() {
    await initCurrentUserInfo();
    userInfo = await getUserInfo({userId: -1});
    renderUserInfoOnPage();
})

async function renderUserInfoOnPage(){
    const avatar = userInfo.userAvatar;
    document.querySelectorAll('.user-avatar').forEach(img => {
        console.log(avatar);
        img.src = avatar;
    });
    document.getElementById('username-text').innerText = userInfo.username;
    document.getElementById('user-details-text').innerText = userInfo.userDetails;
}

document.getElementById('edit-button').addEventListener('click', function() {
    document.getElementById('user-profile').style.display = 'none';
    document.getElementById('edit-form').style.display = 'flex';
    document.getElementById('username-input').setAttribute("placeholder", userInfo.username);
    document.getElementById('user-details-input').setAttribute("placeholder", userInfo.userDetails);
});

document.getElementById("avatar-img").addEventListener("click", function(event){
    document.getElementById("avatar-input").click();
})

document.getElementById("avatar-input").addEventListener("change", async function(event){
    const file = event.target.files[0];
    if(file){
        // document.querySelectorAll('.user-avatar').forEach(img => {
        //     img.src = file.name;
        // });

        let reader = new FileReader();

        reader.onload = function(e) {
            // 获取文件的字节流
            const arrayBuffer = e.target.result;

            console.log("这是字节流：", arrayBuffer)

            avatarBase64 = Buffer.from(arrayBuffer).toString('base64');
        }
        reader.readAsArrayBuffer(file);
    }
})

document.getElementById('edit-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Update avatar
    const avatarInput = document.getElementById('avatar-input').value;
    
    // Update username and details
    const usernameInput = document.getElementById('username-input').value;
    const detailsInput = document.getElementById('user-details-input').value;
    
    const updateRequest = {userId: userInfo.userId};

    if (avatarInput) {
        updateRequest.userAvatar = avatarBase64;
    }
    if (usernameInput) {
        updateRequest.username = usernameInput;
    }
    if (detailsInput) {
        updateRequest.userDetails = detailsInput;
    }

    // Send update request to server
    updateUserInfo(updateRequest)
    .then(res => {
        const data = res.data;
        if (data.success) {
            alert("更新成功");
            
            userInfo.userAvatar = updateRequest.userAvatar != '' ? updateRequest.userAvatar : userInfo.userAvatar;
            userInfo.username = updateRequest.username != undefined ? updateRequest.username : userInfo.username;
            userInfo.userDetails = updateRequest.userDetails != undefined ? updateRequest.userDetails : userInfo.userDetails;
            console.log(userInfo)
            renderUserInfoOnPage()
        }
    })
    .catch(error => {
        alert("更新失败: ", error);
    });

    // Hide the form after saving
    document.getElementById('edit-form').style.display = 'none';
    document.getElementById('user-profile').style.display = 'flex';
    document.getElementById('avatar-input').value = '';
});

document.getElementById('back-button').addEventListener('click', function(event) {
    location.href = 'index.html';
})
