import { getWebSocketAuth } from './general.utils';
import { SYSTEM_ENVIRONMENT } from '../config';

const apiKey = import.meta.env.VITE_COINBASE_API_KEY;
const passphrase = import.meta.env.VITE_COINBASE_PASSPHRASE;

export function getOrderBookSubMessage({ currencyPair, channels = ['level2_batch', 'ticker'], environment = SYSTEM_ENVIRONMENT.TEST_NET }) {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const signature = getWebSocketAuth(timestamp);
    let subscription = {
        type: 'subscribe',
        product_ids: [currencyPair],
        channels: [...channels],
    };

    if (environment === SYSTEM_ENVIRONMENT.MAIN_NET) {
        return JSON.stringify(subscription);
    }

    return JSON.stringify({
        type: 'subscribe',
        product_ids: [currencyPair],
        channels: [...channels, 'full'],
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

export function filterNewBooks(currentAsks, currentBids, newAsks, newBids) {
    let updatedAsks = [...currentAsks];
    let updatedBids = [...currentBids];

    const updateOrders = (orders, changes, isBid) => {
        changes.forEach(change => {
            const { price, marketSize, timestamp } = change;
            const index = orders.findIndex(order => order.price === price);
            if (index !== -1) {
                if (parseFloat(marketSize) === 0.0) {
                    orders.splice(index, 1);
                } else {
                    orders[index] = { price, marketSize, timestamp };
                }
            } else if (parseFloat(marketSize) !== 0.0) {
                orders.push({ price, marketSize, timestamp });
            }
        });

        orders.sort((a, b) => isBid ? parseFloat(b.price) - parseFloat(a.price) : parseFloat(a.price) - parseFloat(b.price));
    };

    updateOrders(updatedBids, newBids, true);
    updateOrders(updatedAsks, newAsks, false);

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

export function createOrderBooksFromList(orders, timestamp, isAsk) {
    //create key value object
    const createBookObject = (book, timestamp) => {
        return { price: book[1], marketSize: book[0], timestamp: timestamp }
    }
    const data = orders.map(order => createBookObject(order, timestamp));
    data.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    return data;
}