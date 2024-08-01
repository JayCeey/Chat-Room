import CONFIG from '../config.js';

export function login(loginRequest){
    return fetch(`${CONFIG.BASE_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginRequest),
        credentials: 'include',
    })
};

export function logout(){
    return fetch(`${CONFIG.BASE_URL}/logout`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    })
};