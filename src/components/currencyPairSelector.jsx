import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { subscribeCurrencyPair } from "../store/actions/orderBookActions";
import { subscribeTradeHistory } from "../store/actions/tradeHistoryActions";
import { DEFAULT_CURRENCY_PAIR } from "../config";

const CurrencyPairSelector = () => {
  const [selectedPair, setSelectedPair] = useState(DEFAULT_CURRENCY_PAIR);
  const dispatch = useDispatch();

  const handleChange = (event) => {
    setSelectedPair(event.target.value);
    dispatch(subscribeCurrencyPair(event.target.value));
  };

  useEffect(() => {
    dispatch(subscribeCurrencyPair(selectedPair));
    dispatch(subscribeTradeHistory(selectedPair));
  }, []);
  return (
    <select value={selectedPair} onChange={handleChange}>
      <option value="ETH-USD">ETH-USD</option>
      <option value="ETH-BTC">ETH-BTC</option>
      <option value="BTC-USD">BTC-USD</option>
      <option value="LTC-USD">LTC-USD</option>
      <option value="BCH-USD">BCH-USD</option>
    </select>
  );
};

export default CurrencyPairSelector;
