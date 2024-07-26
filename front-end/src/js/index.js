import "../css/index.css";
import DefaultAvatar from "assets/images/default_avatar.jpg";

function user_info() {
    document.getElementById('userName').innerText = "test";
    document.getElementById('userDetails').innerText = "test123";
    document.getElementById('myModal').style.display = "block";
}
window.user_info = user_info;

function closeModal() {
    document.getElementById('myModal').style.display = "none";
}
window.closeModal = closeModal;

document.getElementById('add-button').addEventListener('click', () => {
    document.getElementById('userName').innerText = "test";
    document.getElementById('userDetails').innerText = "test123";
    document.getElementById('myModal').style.display = "block";
});

document.getElementById('logout-button').addEventListener('click', () => {
    window.location.href = 'login.html';
});

document.getElementById('send_message').addEventListener('click', () => {
    const input = document.querySelector('input');
    const messageText = input.value.trim();
    if (messageText) {
        const messages = document.querySelector('.messages');
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
    }
});



document.querySelector('input').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        document.getElementById('send_message').click();
    }
});


