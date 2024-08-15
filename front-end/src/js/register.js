import 'css/register.scss'
import 'static/css/bootstrap.min.css'

import { register } from 'api/login';

const form = document.getElementById('register-form');
const message = document.getElementById('message');

form.addEventListener('submit', function(event) {
    event.preventDefault(); // 阻止表单默认提交行为

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // 发送网络请求到后端
    register({ username, password })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                message.textContent = '注册成功';
                message.style.color = 'green';
                alert('注册成功');
                window.location.href = '/login.html';
            } else {
                message.textContent = '注册失败: ' + data.message;
                message.style.color = 'red';
            }
        })
        .catch(error => {
            message.textContent = '错误: ' + error.message;
            message.style.color = 'red';
        });
});