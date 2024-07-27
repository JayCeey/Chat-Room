import "../css/index.css";
import DefaultAvatar from "assets/images/default_avatar.jpg";
import { socket } from "./ws_connection";
import { Type } from "utils/constant";

function user_info(username) {
    document.getElementById('userName').innerText = username;
    document.getElementById('userDetails').innerText = "test123";
    document.getElementById('myModal').style.display = "block";
}

// 对所有user_info的class类添加addEventListener
document.querySelectorAll('.user_info').forEach((element)=>{
    element.addEventListener('click', function(event) {
        // 获取被点击的元素
        const clickedElement = event.target;

        console.log(clickedElement);

        // 获取该元素的属性
        const username = clickedElement.getAttribute('data-username');
        user_info(username);
    });
});

document.getElementById('closeModal').addEventListener('click', () => {
    document.getElementById('myModal').style.display = "none";
});

document.getElementById('add-button').addEventListener('click', () => {
    document.getElementById('userName').innerText = "test";
    document.getElementById('userDetails').innerText = "test123";
    document.getElementById('myModal').style.display = "block";
});

document.getElementById('logout-button').addEventListener('click', () => {
    window.location.href = 'login.html';
});

document.getElementById('send_message').addEventListener('click', () => {
    const input = document.getElementById('send_message_input');
    const messageText = input.value.trim();
    if (messageText) {
        const messages = document.querySelector('#messages');
        const message = document.createElement('div');
        message.classList.add('message');

        const message_right = document.createElement('div');
        message_right.classList.add('message-right');

        const text = document.createElement('p');
        text.classList.add('msg-right-text');
        text.textContent = messageText;

        const avatar = document.createElement('div');
        avatar.classList.add('avatar');

        messages.appendChild(message);
        message.appendChild(message_right);
        message_right.appendChild(text);
        message_right.appendChild(avatar);

        messages.scrollTop = messages.scrollHeight;

        input.value = '';

        socket.send(JSON.stringify({"type": Type.message, 
                                    "content": messageText, 
                                    "user": "jayce"}));
    }
});

document.querySelector('#send_message_input').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        document.getElementById('send_message').click();
    }
});


