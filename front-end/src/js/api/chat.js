import config from '../config.js';

export function history(userInfo){
    return fetch(`${config.BASE_URL}/getUserChatInfo`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userInfo),
        credentials: 'include',
    });
};

export function getFriends(userInfo){
    return fetch(`${config.BASE_URL}/getUserFriendInfo`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userInfo),
        credentials: 'include',
    });
}