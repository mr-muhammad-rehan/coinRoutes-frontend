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

export function filterNewBooks(currentAsks, currentBids, newAsks, newBids, booksMaxLength = 50) {
  let updatedAsks = [...currentAsks];
  let updatedBids = [...currentBids];

  const updateOrders = (orders, changes, isBid) => {
    changes.forEach(change => {
      const { price, marketSize, timestamp } = change;
      const index = orders.findIndex(order => order.price === price);
      if (index !== -1) {
        if (marketSize === '0' || marketSize === 0) {
          orders.splice(index, 1);
        } else {
          orders[index] = { price, marketSize, timestamp };
        }
      } else {
        if (marketSize !== '0' && marketSize !== 0) {
          orders.push({ price, marketSize, timestamp });
        }
      }
    });

    orders.sort((a, b) => isBid ? parseFloat(b.price) - parseFloat(a.price) : parseFloat(a.price) - parseFloat(b.price));
  };

  updateOrders(updatedBids, newBids, true);
  updateOrders(updatedAsks, newAsks, false);

  return { updatedBids, updatedAsks };
}


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


export function aggregateOrderBook(orders, increment) {
  let result = [];
  orders.forEach((order) => {
    const aggregatedPrice = Math.floor(order.price / increment) * increment;
    let updatedOrder = {
      ...order,
      price: aggregatedPrice
    }
    result.push(updatedOrder);
  });

  return result;
};

export function calculateAggregationRange(bids, asks) {
  const prices = [
    ...bids.map((bid) => bid.price),
    ...asks.map((ask) => ask.price),
  ];
  if (prices.length > 0) {
    const maxPrice = Math.max(...prices);
    const minPrice = Math.min(...prices);

    const range = (maxPrice + minPrice) / 2;

    let newAggregationRange = 0;
    if (range > 1) newAggregationRange = 0.001;
    if (range > 10) newAggregationRange = 0.01;
    if (range > 100) newAggregationRange = 0.1;
    if (range > 1000) newAggregationRange = 1;

    return newAggregationRange;
  } else {
    return 0;
  }
}
