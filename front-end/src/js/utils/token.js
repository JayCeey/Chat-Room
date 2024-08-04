const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// node.js作为后端服务器时用到的方法
const serverTokenStore = {
    accessTokens: {},
    refreshTokens: {},
    secretKey: "jayce",
    expiresIn: '15m',

    generateAccessToken(payload){
        const token = this.generateJWT(payload);
        return token;
    },
    generateJWT(payload){
        const token = jwt.sign(payload, this.secretKey, { expiresIn: this.expiresIn });
        return token;
    },
    generateRandomToken(){
        return crypto.randomBytes(32).toString('hex');
    },
    generateRefreshToken(){
        const token = this.generateRandomToken();
        return token;
    },
    setAccessToken(token, accessTokenData){
        this.accessTokens[token] = accessTokenData;
    },
    setRefreshToken(token, refreshTokenData){
        this.refreshTokens[token] = refreshTokenData;
    },
    verifyAccessToken(accessToken){
        if(!serverTokenStore.accessTokens[accessToken]) return false;
        else return serverTokenStore.accessTokens[accessToken];
    },
    verifyRefreshToken(refreshToken){
        if(!serverTokenStore.refreshTokens[refreshToken]) return false;
        else return serverTokenStore.refreshTokens[refreshToken];
    },
    deleteAccessToken(accessToken){
        delete this.accessTokens[accessToken];
    },
    deleteRefreshToken(refreshToken){
        delete this.refreshTokens[refreshToken];
    },
};

// 前端用到的tokenStore
const tokenStore = {
    setAccessToken(token) {
        sessionStorage.setItem('accessToken', token);
    },
    getAccessToken() {
        return sessionStorage.getItem('accessToken');
    },
    setRefreshToken(token) {
        sessionStorage.setItem('refreshToken', token);
    },
    getRefreshToken() {
        return sessionStorage.getItem('refreshToken');
    },
    clearTokens() {
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('refreshToken');
    },
    // 根据refreshToken获取新的accessToken
    async refreshAccessToken() {
        const refreshToken = this.getRefreshToken();
        if (!refreshToken) throw new Error('No refresh token available');
  
        const response = await fetch('/api/refresh-token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
        });
  
        if (!response.ok) throw new Error('Failed to refresh access token');
    
        const data = await response.json();
        this.setAccessToken(data.accessToken);
    }
};

module.exports = {
    serverTokenStore,
    tokenStore,
}