import { SET_ORDER_BOOK, UPDATE_ORDER_BOOK, SAVE_CURRENCY_PAIR } from '../actions/orderBookActions';
import { DEFAULT_CURRENCY_PAIR } from '../../config';

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
      // Logic to update the order book based on the changes
      const newBids = [...state.bids];
      const newAsks = [...state.asks];
      action.payload.changes.forEach(([side, price, size]) => {
        if (side === 'buy') {
          const index = newBids.findIndex((bid) => bid[0] === price);
          if (index !== -1) {
            if (size === '0') {
              newBids.splice(index, 1);
            } else {
              newBids[index] = [price, size];
            }
          } else {
            newBids.push([price, size]);
          }
        } else if (side === 'sell') {
          const index = newAsks.findIndex((ask) => ask[0] === price);
          if (index !== -1) {
            if (size === '0') {
              newAsks.splice(index, 1);
            } else {
              newAsks[index] = [price, size];
            }
          } else {
            newAsks.push([price, size]);
          }
        }
      });

      newBids.sort((a, b) => parseFloat(b[0]) - parseFloat(a[0]));
      newAsks.sort((a, b) => parseFloat(a[0]) - parseFloat(b[0]));

      return { ...state, bids: newBids, asks: newAsks };
    case SAVE_CURRENCY_PAIR:
      return {
        ...state,
        currencyPair: action.payload,
      };
    default:
      return state;
  }
};

export default orderBookReducer;
