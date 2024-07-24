document.querySelector('button').addEventListener('click', () => {
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
        document.querySelector('button').click();
    }
});


function user_info(name, details) {
    document.getElementById('userName').innerText = name;
    document.getElementById('userDetails').innerText = details;
    document.getElementById('myModal').style.display = "block";
}

function closeModal() {
    document.getElementById('myModal').style.display = "none";
}