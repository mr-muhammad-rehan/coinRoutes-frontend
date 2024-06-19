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

export const aggregateOrderBook = (orders, increment) => {
    return orders.filter((order) => order[1] >= increment);
};

// export const aggregateOrderBook = (orders, increment) => {
//     const result = [];
//     const map = new Map();
  
//     orders.forEach(([price, size]) => {
//       const aggregatedPrice = Math.floor(price / increment) * increment;
//       if (!map.has(aggregatedPrice)) {
//         map.set(aggregatedPrice, { price: aggregatedPrice, size: 0 });
//       }
//       map.get(aggregatedPrice).size += parseFloat(size);
//     });
  
//     map.forEach((value) => result.push([value.price, value.size]));
//     return result.sort((a, b) => a[0] - b[0]);
//   };