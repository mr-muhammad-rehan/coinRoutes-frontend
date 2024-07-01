import { SET_TRADE_HISTORY, UPDATE_TRADE_HISTORY, RESET_TRADE_HISTORY } from '../actions/tradeHistoryActions';

const MAX_TRADE_HISTORY_LENGTH = 32;

const initialState = {
  tradeHistory: [],
  isLoading: true,
};

const tradeHistoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_TRADE_HISTORY:
      return {
        ...state,
        isLoading: false,
        tradeHistory: action.payload,
      };
    case UPDATE_TRADE_HISTORY:
      return {
        ...state,
        isLoading: false,
        tradeHistory: [action.payload, ...state.tradeHistory].slice(0, MAX_TRADE_HISTORY_LENGTH),  //keep the recent history with length of [MAX_TRADE_HISTORY_LENGTH] 
      };
    case RESET_TRADE_HISTORY:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

export default tradeHistoryReducer;
