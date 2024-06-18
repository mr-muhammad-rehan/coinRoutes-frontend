import { all } from "redux-saga/effects";
import subscribeCurrencyPairSaga from './orderBookSaga';
import subscribeTradeHistorySaga from './tradeHistorySagas';


export default function* rootSaga() {
  yield all([
    subscribeCurrencyPairSaga(),

    subscribeTradeHistorySaga()
  ]);
}
