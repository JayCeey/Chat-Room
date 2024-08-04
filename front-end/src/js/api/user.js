import CONFIG from '../config.js';

export function queryUserInfo(userId){
    const userQuery = {"userId": userId};
    const queryParams = new URLSearchParams(userQuery).toString();
    return fetch(`${CONFIG.BASE_URL}/user?${queryParams}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
};