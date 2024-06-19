import { call, put, take, cancel, fork, cancelled } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { SUBSCRIBE_TRADE_HISTORY, updateTradeHistory, resetTradeHistory } from '../actions/tradeHistoryActions';
import { COINBASE_SOCKET_URL } from '../../config';
import { getWebSocketAuth } from '../../utils';

const apiKey = import.meta.env.VITE_COINBASE_API_KEY;
const passphrase = import.meta.env.VITE_COINBASE_PASSPHRASE;

function createWebSocketChannel(currencyPair) {
    return eventChannel((emit) => {
        const timestamp = Math.floor(Date.now() / 1000).toString();


        const signature = getWebSocketAuth(timestamp);

        const subscribeMessage = JSON.stringify({
            type: 'subscribe',
            product_ids: [currencyPair],
            channels: ['matches'],
            signature: signature,
            key: apiKey,
            passphrase: passphrase,
            timestamp: timestamp,
        });

        const socket = new WebSocket(COINBASE_SOCKET_URL);

        socket.onopen = () => {
            socket.send(subscribeMessage);
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            // console.log(data);
            if (data.type === 'match') {
                emit(updateTradeHistory(data));
            }
        };

        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        socket.onclose = () => {
            console.log('WebSocket connection closed');
        };

        const unsubscribe = () => {
            const unsubscribeMessage = JSON.stringify({
                type: 'unsubscribe',
                product_ids: [currencyPair],
                channels: ['matches'],
            });
            socket.send(unsubscribeMessage);
            socket.close();
        };

        return unsubscribe;
    });
}

function* handleTradeHistorySubscription(action) {
    const channel = yield call(createWebSocketChannel, action.payload);

    try {
        while (true) {
            const message = yield take(channel);
            yield put(message);
        }
    } finally {
        if (yield cancelled()) {
            channel.close();
        }
    }
}

function* subscribeTradeHistorySaga() {
    let currentTask;
    while (true) {
        const action = yield take(SUBSCRIBE_TRADE_HISTORY);
        if (currentTask) {
            yield cancel(currentTask);
        }
        yield put(resetTradeHistory());
        currentTask = yield fork(handleTradeHistorySubscription, action);
    }
}

export default subscribeTradeHistorySaga;
