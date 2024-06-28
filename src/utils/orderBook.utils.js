import { getWebSocketAuth } from './general.utils';

const apiKey = import.meta.env.VITE_COINBASE_API_KEY;
const passphrase = import.meta.env.VITE_COINBASE_PASSPHRASE;

export function getOrderBookSubMessage({ currencyPair, channels = ['level2_batch', 'ticker'] }) {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const signature = getWebSocketAuth(timestamp);

    return JSON.stringify({
        type: 'subscribe',
        product_ids: [currencyPair],
        channels: ['full'],
        signature: signature,
        key: apiKey,
        passphrase: passphrase,
        timestamp: timestamp,
    });
}

export function getOrderBookUnSubMessage({ currencyPair, channels = ['level2_batch', 'ticker'] }) {
    return JSON.stringify({
        type: "unsubscribe",
        product_ids: [currencyPair],
        channels: channels
    });
}

export function filterNewBooks({ currentAsks, currentBids, newAsks, newBids }) {
    let updatedAsks = [...newAsks, ...currentAsks];
    let updatedBids = [...newBids, ...currentBids];

    updatedBids.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    updatedAsks.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));

    return { updatedBids, updatedAsks };
}

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

