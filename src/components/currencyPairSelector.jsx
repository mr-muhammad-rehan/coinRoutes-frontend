import "../styles/currencyPair.css";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCurrencyPair } from "../store/actions/orderBookActions";
import { DEFAULT_CURRENCY_PAIR } from "../config";

const AVAILABLE_CURRENCY = [
  "ETH-USD",
  "ETH-BTC",
  "BTC-USD",
  "LTC-USD",
  "BCH-USD",
];

const CurrencyPairSelector = () => {
  const [selectedPair, setSelectedPair] = useState(DEFAULT_CURRENCY_PAIR);
  const dispatch = useDispatch();

  const handleChange = (event) => {
    setCurrencyPair(event.target.value); 
    setSelectedPair(event.target.value);
  };

  useEffect(() => {
    dispatch(setCurrencyPair(selectedPair));
  }, [selectedPair, dispatch]);

  return (
    <select value={selectedPair} onChange={handleChange}>
      {AVAILABLE_CURRENCY.map((currency, key) => (
        <option key={key} value={currency}>
          {currency}
        </option>
      ))}
    </select>
  );
};

export default CurrencyPairSelector;
