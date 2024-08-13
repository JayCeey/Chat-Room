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

export async function friendResult(resultInfo){
    return fetch(`${CONFIG.BASE_URL}/friend/result`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(resultInfo),
        credentials: 'include',
    });
}

export async function groupResult(resultInfo){
    return fetch(`${CONFIG.BASE_URL}/group/result`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(resultInfo),
        credentials: 'include',
    });
}


export async function sendAddRequest(addFriendVO){
    return fetch(`${CONFIG.BASE_URL}/friend/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(addFriendVO),
        credentials: 'include',
    });
}