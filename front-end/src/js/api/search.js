import config from '../config.js';

export function searchUser(searchVO){
    const queryParams = new URLSearchParams(searchVO).toString();
    return fetch(`${config.BASE_URL}/searchUser?${queryParams}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
};