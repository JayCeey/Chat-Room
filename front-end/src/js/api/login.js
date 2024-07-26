import config from '../config.js';

export default function login(loginRequest){
    return fetch(`${config.BASE_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginRequest)
    })
}