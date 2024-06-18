// actions.js
export const SUBSCRIBE_CURRENCY_PAIR = 'SUBSCRIBE_CURRENCY_PAIR';
export const SET_ORDER_BOOK = 'SET_ORDER_BOOK';
export const UPDATE_ORDER_BOOK = 'UPDATE_ORDER_BOOK';
export const SAVE_CURRENCY_PAIR = 'SAVE_CURRENCY_PAIR';

export const subscribeCurrencyPair = (currencyPair) => ({
  type: SUBSCRIBE_CURRENCY_PAIR,
  payload: currencyPair,
});

export const setOrderBook = (orderBook) => ({
  type: SET_ORDER_BOOK,
  payload: orderBook,
});

export const updateOrderBook = (orderBookUpdate) => ({
  type: UPDATE_ORDER_BOOK,
  payload: orderBookUpdate,
});

export const saveCurrencyPair = (currencyPair) => ({
  type: SAVE_CURRENCY_PAIR,
  payload: currencyPair,
});