import "../css/login.css";
import {login} from 'api/login.js';
import md5 from 'utils/encrypt.js';



document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault(); // 阻止默认表单提交行为

    // 获取用户名和密码
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // 简单的密码校验（演示用，实际使用中请改为更复杂的校验）
    if (password.length < 6) {
        document.getElementById('message').textContent = '密码长度必须至少为 6 位';
        return;
    }

    // 密码使用md5加密
    const encrypted_pwd = md5(password);
    console.log(encrypted_pwd);

    const loginRequest = { 
        'username': username, 
        'password': encrypted_pwd,
    };

    console.log(JSON.stringify(loginRequest))

    // 在这里进行信息上传操作
    // 例如，使用 fetch 发送请求到服务器
    login(loginRequest).then(response => {
        if (!response.ok) {
            throw new Error('网络错误：' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log("返回data: ", data);
        if(data.success){
            // 登录成功应该设置一个token来验证身份，包含用户的身份信息，存储在sessionStorage里
            alert("登陆成功，正在跳转...");
            
            sessionStorage.setItem('userInfo', JSON.stringify(data.userInfo));

            window.location.href = "index.html"; // 跳转到/index.html
            return;
        }else{
            alert("登陆失败：" + data.message);
        }
    })
    .catch(error => {
        console.error('错误:' + error);
        document.getElementById('message').textContent = error;
    });
});
