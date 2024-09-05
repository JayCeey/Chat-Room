import CONFIG from '../config.js';
import request from 'utils/request';

export function queryUserInfo(userId){
    const userQuery = {"userId": userId};
    const queryParams = new URLSearchParams(userQuery).toString();
    return request.get(`${CONFIG.USER_URL}/user/simple_info?${queryParams}`, {
        headers: {
            'Content-Type': 'application/json',
        },
        withCredentials: true,
    });
};

export function updateUserInfo(updateRequest){
    console.log(JSON.stringify(updateRequest))
    return request.post(`${CONFIG.USER_URL}/user/update`, JSON.stringify(updateRequest), {
        headers: {
            'Content-Type': 'application/json',
        },
        withCredentials: true,
    });
}