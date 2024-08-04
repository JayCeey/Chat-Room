import CONFIG from '../config.js';

export async function searchUser(searchVO){
    const queryParams = new URLSearchParams(searchVO).toString();
    return fetch(`${CONFIG.BASE_URL}/search?${queryParams}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
};