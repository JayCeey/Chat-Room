import CONFIG from '../config.js';
import request from 'utils/request';

export function history(){
    return request.post(`${CONFIG.MESSAGE_URL}/history`, {}, {
        headers: {
            'Content-Type': 'application/json',
        },
        withCredentials: true,
    });
};