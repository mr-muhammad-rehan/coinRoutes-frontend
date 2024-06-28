import { SET_ORDER_BOOK, SET_CURRENCY_PAIR, RESET_ORDER_BOOK, SET_BEST_ORDER_BOOK } from '../actions/orderBookActions';
import { DEFAULT_CURRENCY_PAIR } from '../../config';

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
  isLoading: true
};

const orderBookReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ORDER_BOOK:
      console.log('action.payload>>>  ',action.payload)
      return {
        ...state,
        isLoading: false,
        bids: action.payload.bids,
        asks: action.payload.asks,
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
      return { ...state, bestAsk, bestBid }
    default:
      return state;
  }
};

export default orderBookReducer;
