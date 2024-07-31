import CryptoJS from 'crypto-js';

// const CryptoJS = require("crypto-js");

export default function md5(password){
    return CryptoJS.MD5(password).toString();
}