import CryptoJS from 'crypto-js';

export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  export const filterNewBooks = (currentBids, currentAsks, changes, timestamp) =>{
    const newBids = [...currentBids];
    const newAsks = [...currentAsks];
    
    changes.forEach(([side, price, size]) => { 
      if (side === 'buy') {
        const index = newBids.findIndex((bid) => bid[0] === price);
        if (index !== -1) {
          if (size === '0') {
            newBids.splice(index, 1);
          } else {
            newBids[index] = [price, size, timestamp];
          }
        } else {
          newBids.push([price, size, timestamp]);
        }
      } else if (side === 'sell') {
        const index = newAsks.findIndex((ask) => ask[0] === price);
        if (index !== -1) {
          if (size === '0') {
            newAsks.splice(index, 1);
          } else {
            newAsks[index] = [price, size, timestamp];
          }
        } else {
          newAsks.push([price, size, timestamp]);
        }
      }
    });

    newBids.sort((a, b) => parseFloat(b[0]) - parseFloat(a[0]));
    newAsks.sort((a, b) => parseFloat(a[0]) - parseFloat(b[0]));

    return {newBids, newAsks};
  }


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


export const calculateBestBid = (bids) => {
  if (bids.length === 0) {
    return "--";
  }
  const bestBid = Math.max(...bids.map((bid) => parseFloat(bid[0])));
  return bestBid.toFixed(2);
};

export const calculateBestAsk = (asks) => {
  if (asks.length === 0) {
    return "--";
  }
  const bestAsk = Math.min(...asks.map((ask) => parseFloat(ask[0])));
  return bestAsk.toFixed(2);
};