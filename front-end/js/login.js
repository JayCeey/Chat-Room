// 定义数据结构
class LoginRequest {
    constructor(username, password) {
      this.username = username;
      this.password = password;
    }
}

// 定义数据结构
class LoginResponse {
    constructor(username, password) {
      this.username = username;
      this.password = password;
    }
}


document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // 阻止默认表单提交行为

    // 获取用户名和密码
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // 简单的密码校验（演示用，实际使用中请改为更复杂的校验）
    if (password.length < 6) {
        document.getElementById('message').textContent = '密码长度必须至少为 6 位';
        return;
    }

    const loginRequest = new LoginRequest(username, password);

    console.log(JSON.stringify(loginRequest))

    // 在这里进行信息上传操作
    // 例如，使用 fetch 发送请求到服务器
    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginRequest)
        
    })
    .then(response => response.json())
    .then(data => {
        // 登录成功应该设置一个token来验证身份，包含用户的uid、用户名
        console.log('成功:', data);
        alert("登陆成功，正在跳转...")
    })
    .catch(error => {
        console.error('错误:', error);
        document.getElementById('message').textContent = error;
    });
});
