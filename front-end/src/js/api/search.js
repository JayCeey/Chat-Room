import CONFIG from '../config.js';
import request from 'utils/request';

export async function searchUser(searchVO){
    console.log("搜索用户：", searchVO);
    const queryParams = new URLSearchParams(searchVO).toString();
    return request.get(`${CONFIG.USER_URL}/user/search?${queryParams}`, {
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json',
        },
    })
};