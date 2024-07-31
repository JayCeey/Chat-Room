import { logout } from 'api/login';

// 点击注销按钮，首先向服务器发送注销消息，服务器返回success注销成功
export function init_logout_btn(){
    document.getElementById('logout-button').addEventListener('click', () => {
    
        logout().then(response => {
            if (!response.ok) {
                throw new Error('网络错误：' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log("返回data: ", data);
            if(data.success){
                // 登录成功应该设置一个token来验证身份，包含用户的身份信息，存储在sessionStorage里
                alert("登出成功！");
                sessionStorage.clear(); // 清除登录状态
                window.location.href = 'login.html';
                return;
            }else{
                alert("登出失败：" + data.message);
            }
        })
        .catch(error => {
            console.error('错误:' + error);
            alert("登出失败：", error);
        });
    });
}