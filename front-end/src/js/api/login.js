import CONFIG from '../config.js';
import request from 'utils/request';

export function refresh(){
    return fetch(`${CONFIG.AUTH_URL}/ua/token/refresh`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    })
}

export function login(loginRequest){
    return fetch(`${CONFIG.AUTH_URL}/ua/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginRequest),
        credentials: 'include',
    })
};

export function logout(){
    return request.post(`${CONFIG.AUTH_URL}/logout`, {}, {
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json',
        },
    })
};

export function register(userInfo){
    return fetch(`${CONFIG.USER_URL}/user/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userInfo),
    }) 
}