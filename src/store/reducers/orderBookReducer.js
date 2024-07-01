import { SET_ORDER_BOOK, SET_CURRENCY_PAIR, RESET_ORDER_BOOK, SET_BEST_ORDER_BOOK, SET_ENVIRONMENT } from '../actions/orderBookActions';
import { DEFAULT_CURRENCY_PAIR, SYSTEM_ENVIRONMENT } from '../../config';

const MAX_ORDERS_LIST = 50;

const initialState = {
  bids: [],
  asks: [],
  bestAsk: {
    size: 0,
    amount: 0
  },
  bestBid: {
    size: 0,
    amount: 0
  },
  currencyPair: DEFAULT_CURRENCY_PAIR,
  isLoading: true,
  systemEnvironment: SYSTEM_ENVIRONMENT.TEST_NET
};

const orderBookReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ORDER_BOOK:
      const bids = action.payload.bids;
      const asks = action.payload.asks;
      if (bids.length > MAX_ORDERS_LIST) {
        bids.length = MAX_ORDERS_LIST;
      }
      if (asks.length > MAX_ORDERS_LIST) {
        asks.length = MAX_ORDERS_LIST;
      }
      return {
        ...state,
        isLoading: false,
        bids: bids,
        asks: asks,
      };
    case SET_CURRENCY_PAIR:
      return {
        ...state,
        isLoading: false,
        currencyPair: action.payload,
      };
    case RESET_ORDER_BOOK:
      const currency = state.currencyPair;
      return {
        ...initialState,
        isLoading: false,
        currencyPair: currency
      };
    case SET_BEST_ORDER_BOOK:
      const bestAsk = {
        size: action.payload.best_ask_size,
        amount: action.payload.best_ask
      }
      const bestBid = {
        size: action.payload.best_bid_size,
        amount: action.payload.best_bid
      }
      return { ...state, bestAsk, bestBid };
    case SET_ENVIRONMENT:
      return {
        ...state,
        systemEnvironment: action.payload
      }
    default:
      return state;
  }
};

export default orderBookReducer;
