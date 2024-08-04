import CONFIG from '../config.js';

export function getFriends(friendQuery){
    return fetch(`${CONFIG.BASE_URL}/getUserFriendInfo`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(friendQuery),
        credentials: 'include',
    });
}

export async function sendAddRequest(addFriendVO){
    return fetch(`${CONFIG.BASE_URL}/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(addFriendVO),
        credentials: 'include',
    });
}