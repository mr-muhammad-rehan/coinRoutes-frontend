import { call, put, cancelled, take, cancel, fork } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { SUBSCRIBE_CURRENCY_PAIR, setOrderBook, updateOrderBook, saveCurrencyPair } from '../actions/orderBookActions';
import { getWebSocketAuth } from '../../utils';
import { COINBASE_SOCKET_URL } from '../../config';

const apiKey = import.meta.env.VITE_COINBASE_API_KEY;
const passphrase = import.meta.env.VITE_COINBASE_PASSPHRASE;


function createWebSocketChannel(currencyPair) {
  return eventChannel((emit) => {
    const timestamp = Math.floor(Date.now() / 1000).toString();

    const signature = getWebSocketAuth(timestamp);

    const subscribeMessage = JSON.stringify({
      type: 'subscribe',
      product_ids: [currencyPair],
      channels: ['level2'],
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
      if (data.type === 'snapshot') {
        emit(setOrderBook(data));
      } else if (data.type === 'l2update') {
        emit(updateOrderBook(data));
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
        channels: ['level2'],
      });
      socket.send(unsubscribeMessage);
      socket.close();
    };

    return unsubscribe;
  });
}

function* handleCurrencyPairSubscription(action) {
  const channel = yield call(createWebSocketChannel, action.payload);

  try {
    yield put(saveCurrencyPair(action.payload));
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

function* subscribeCurrencyPairSaga() {
  let currentTask;
  while (true) {
    const action = yield take(SUBSCRIBE_CURRENCY_PAIR);
    if (currentTask) {
      yield cancel(currentTask);
    }
    currentTask = yield fork(handleCurrencyPairSubscription, action);
  }
}

export default subscribeCurrencyPairSaga;
