import CONFIG from '../config.js';

export function history(userInfo){
    return fetch(`${CONFIG.BASE_URL}/getUserChatInfo`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userInfo),
        credentials: 'include',
    });
};