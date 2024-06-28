import CryptoJS from 'crypto-js';

export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
};

export function getWebSocketAuth(timestamp) {
  const apiSecret = import.meta.env.VITE_COINBASE_API_SECRET;
  const method = 'GET';
  const requestPath = '/users/self/verify';
  const body = '';

  const prehash = timestamp + method + requestPath + body;
  const key = CryptoJS.enc.Base64.parse(apiSecret);
  const hmac = CryptoJS.HmacSHA256(prehash, key);
  return CryptoJS.enc.Base64.stringify(hmac);
};


export function throttle(func, limit) {
  let inThrottle = false;
  return function(...args) {
      if (!inThrottle) {
          func(...args);
          inThrottle = true;
          setTimeout(() => (inThrottle = false), limit);
      }
  };
}
