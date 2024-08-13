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

export function updateUserInfo(updateRequest){
    return fetch(`${CONFIG.BASE_URL}/user/update`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateRequest),
    });
}