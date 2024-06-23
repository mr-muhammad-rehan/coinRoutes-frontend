import { call, put, cancelled, take, cancel, fork } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { SUBSCRIBE_CURRENCY_PAIR, setOrderBook, updateOrderBook, saveCurrencyPair, resetOrderBook, setBestOrderBook } from '../actions/orderBookActions';
import { COINBASE_SOCKET_URL } from '../../config';

function createWebSocketChannel(currencyPair) {
  return eventChannel((emit) => { 

    const subscribeMessage = JSON.stringify({
      type: 'subscribe',
      product_ids: [currencyPair],
      channels: ['level2_batch', 'ticker']
    });

    const socket = new WebSocket(COINBASE_SOCKET_URL);

    socket.onopen = () => {
      socket.send(subscribeMessage);
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data); 

      if (data.type === 'snapshot') {
        emit(setOrderBook(data));
      } else if (data.type === 'l2update') {
        emit(updateOrderBook(data));
      } else if (data.type === 'ticker') {
        emit(setBestOrderBook(data));
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
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(unsubscribeMessage);
        socket.close();
      }
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
    yield put(resetOrderBook());
    currentTask = yield fork(handleCurrencyPairSubscription, action);
  }
}

export default subscribeCurrencyPairSaga;
