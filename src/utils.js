import CryptoJS from 'crypto-js';

export const getWebSocketAuth = (timestamp) => {
    const apiSecret = import.meta.env.VITE_COINBASE_API_SECRET;
    const method = 'GET';
    const requestPath = '/users/self/verify';
    const body = '';

    const prehash = timestamp + method + requestPath + body;
    const key = CryptoJS.enc.Base64.parse(apiSecret);
    const hmac = CryptoJS.HmacSHA256(prehash, key);
    return CryptoJS.enc.Base64.stringify(hmac);
};