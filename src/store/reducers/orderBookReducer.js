import { SET_ORDER_BOOK, UPDATE_ORDER_BOOK, SAVE_CURRENCY_PAIR, RESET_ORDER_BOOK, SET_BEST_ORDER_BOOK } from '../actions/orderBookActions';
import { DEFAULT_CURRENCY_PAIR } from '../../config';
import { filterNewBooks } from '../../utils';

function createBookObject(book, timestamp) {
  return { price: book[1], marketSize: book[2], timestamp: timestamp }
}

const BOOKS_MAX_LENGTH = 10;

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
};

const orderBookReducer = (state = initialState, action) => {
  const timestamp = new Date(action.payload?.time).getTime();
  switch (action.type) {
    case SET_ORDER_BOOK:
      const bids = action.payload.bids.map((bid) => { return { price: bid[0], marketSize: bid[1], timestamp: timestamp } });
      const asks = action.payload.asks.map((ask) => { return { price: ask[0], marketSize: ask[1], timestamp: timestamp } });
      return {
        ...state,
        bids: bids,
        asks: asks.reverse(),
      };
    case UPDATE_ORDER_BOOK:
      let _newBids = action.payload.changes.filter((order) => order[0] == 'buy');
      let _newAsks = action.payload.changes.filter((order) => order[0] == 'sell');
      let newBids = _newBids.map((bid) => createBookObject(bid, timestamp));
      let newAsks = _newAsks.map((ask) => createBookObject(ask, timestamp));
      const { updatedBids, updatedAsks } = filterNewBooks(
        state.asks,
        state.bids,
        newAsks,
        newBids,
        BOOKS_MAX_LENGTH
      );

      return { ...state, bids: updatedBids, asks: updatedAsks };
    case SAVE_CURRENCY_PAIR:
      return {
        ...state,
        currencyPair: action.payload,
      };
    case RESET_ORDER_BOOK:
      return {
        ...state,
        bids: [],
        asks: [],
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
