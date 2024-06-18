import { combineReducers } from "@reduxjs/toolkit";
import orderBookReducer from './orderBookReducer';
import tradeHistoryReducer from "./tradeHistoryReducer";

const rootReducer = combineReducers({
  orderBooks: orderBookReducer,
  tradeHistory: tradeHistoryReducer
  // other reducers go here
});

export default rootReducer;
