import CONFIG from '../config.js';

export function getFriends(userInfo){
    return fetch(`${CONFIG.BASE_URL}/getUserFriendInfo`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userInfo),
        credentials: 'include',
    });
}

export function sendFriendRequest(addFriendVO){
    return fetch(`${CONFIG.BASE_URL}/addFriend`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(addFriendVO),
        credentials: 'include',
    });
}