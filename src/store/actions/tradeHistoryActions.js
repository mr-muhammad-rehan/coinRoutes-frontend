export const SUBSCRIBE_TRADE_HISTORY = 'SUBSCRIBE_TRADE_HISTORY';
export const SET_TRADE_HISTORY = 'SET_TRADE_HISTORY';
export const UPDATE_TRADE_HISTORY = 'UPDATE_TRADE_HISTORY';
export const RESET_TRADE_HISTORY = 'RESET_TRADE_HISTORY';

export const subscribeTradeHistory = (currencyPair) => ({
  type: SUBSCRIBE_TRADE_HISTORY,
  payload: currencyPair,
});

export const setTradeHistory = (tradeHistory) => ({
  type: SET_TRADE_HISTORY,
  payload: tradeHistory,
});

export const updateTradeHistory = (trade) => ({
  type: UPDATE_TRADE_HISTORY,
  payload: trade,
});


export const resetTradeHistory = () => ({
  type: RESET_TRADE_HISTORY,
});