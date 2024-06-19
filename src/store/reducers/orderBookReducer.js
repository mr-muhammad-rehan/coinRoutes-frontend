import { SET_ORDER_BOOK, UPDATE_ORDER_BOOK, SAVE_CURRENCY_PAIR, RESET_ORDER_BOOK } from '../actions/orderBookActions';
import { DEFAULT_CURRENCY_PAIR } from '../../config';
import { filterNewBooks } from '../../utils';

const initialState = {
  bids: [],
  asks: [],
  currencyPair: DEFAULT_CURRENCY_PAIR, // Default value
};

const orderBookReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ORDER_BOOK:
      return {
        ...state,
        bids: action.payload.bids,
        asks: action.payload.asks,
      };
    case UPDATE_ORDER_BOOK:
      const { newBids, newAsks } = filterNewBooks(
        state.bids,
        state.asks,
        action.payload.changes,
        action.payload.time
      );
      return { ...state, bids: newBids, asks: newAsks };
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
    default:
      return state;
  }
};

export default orderBookReducer;
