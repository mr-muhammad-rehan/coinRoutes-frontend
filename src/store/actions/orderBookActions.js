export const SET_CURRENCY_PAIR = 'SET_CURRENCY_PAIR';
export const SET_ORDER_BOOK = 'SET_ORDER_BOOK';
export const SET_BEST_ORDER_BOOK = 'SET_BEST_ORDER_BOOK';
export const RESET_ORDER_BOOK = 'RESET_ORDER_BOOK';
export const SET_ENVIRONMENT = 'SET_ENVIRONMENT';

export const setCurrencyPair = (currencyPair) => ({
  type: SET_CURRENCY_PAIR,
  payload: currencyPair,
});

export const setOrderBook = (orderBook) => ({
  type: SET_ORDER_BOOK,
  payload: orderBook,
});


export const setBestOrderBook = (bestOrderBook) => ({
  type: SET_BEST_ORDER_BOOK,
  payload: bestOrderBook,
});

export const resetOrderBook = () => ({
  type: RESET_ORDER_BOOK,
});

export const setEnvironment = () => ({
  type: SET_ENVIRONMENT,
});