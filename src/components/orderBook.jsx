import "../styles/orderBook.css";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import LoadingBar from "./loadingBar";
import { aggregateOrderBook, calculateAggregationRange } from "../utils";
import OrderBookRow from './orderBookRow';

const DEFAULT_AGGREGATION_AMOUNT = 0.0;

const OrderBook = () => {
  const { bids, asks, bestAsk, bestBid, currencyPair, isLoading } = useSelector(
    (state) => state.orderBooks
  );
  const [aggregation, setAggregation] = useState(DEFAULT_AGGREGATION_AMOUNT);
  const [aggregationAmount, setAggregationAmount] = useState(
    DEFAULT_AGGREGATION_AMOUNT
  );
  const [aggregatedBids, setAggregatedBids] = useState([]);
  const [aggregatedAsks, setAggregatedAsks] = useState([]);
  const [spread, setSpread] = useState(0);

  useEffect(() => {
    const newAggregationRange = calculateAggregationRange(bids, asks);
    if (parseFloat(newAggregationRange) != 0) {
      setAggregationAmount(newAggregationRange);
    } else {
      setAggregationAmount(0);
    }
  }, [bids, asks]);

  useEffect(() => {
    //check if aggregation amount is not zero
    if (aggregation > 0) {
      const aggregatedOrderBids = aggregateOrderBook(bids, aggregation);
      const aggregatedOrderAsks = aggregateOrderBook(asks, aggregation);
      setAggregatedBids(aggregatedOrderBids.slice(0, 14));
      setAggregatedAsks(aggregatedOrderAsks.slice(0, 14));
    } else {
      //if aggregation is zero no need to calculate
      setAggregatedBids(bids.slice(0, 14));
      setAggregatedAsks(asks.slice(0, 14));
    }
    calculateSpread();
  }, [bids, asks, aggregation]);

  const handleIncrement = () =>
    setAggregation((prev) => prev + aggregationAmount);
  const handleDecrement = () =>
    setAggregation((prev) =>
      Math.max(DEFAULT_AGGREGATION_AMOUNT, prev - aggregationAmount)
    );

  const calculateSpread = () => {
    if (bestAsk && bestBid) {
      const highestBid = bestBid.amount;
      const lowestAsk = bestAsk.amount;
      setSpread((lowestAsk - highestBid).toFixed(4));
    }
  };

  return (
    <div className="order-book">
      <div className="order-book-container">
        <h3>Order Book</h3>
        <hr />
        <div className="order-book-content">
          <div className="order-book-header">
            <h5>Market Size</h5>
            <h5>Price ({currencyPair.split("-")[1]})</h5>
          </div>

          {isLoading ? (
            <div className="order-book-loading">
              <LoadingBar />
            </div>
          ) : (
            <div className="order-book-asks">
              <OrderBookRow orders={aggregatedAsks} priceColor={"#f0616d"} />
            </div>
          )}

          <p className="order-book-spread">
            {currencyPair.split("-")[1]} Spread {spread}
          </p>

          {isLoading ? (
            <div className="order-book-loading">
              <LoadingBar />
            </div>
          ) : (
            <div className="order-book-bids">
              <OrderBookRow orders={aggregatedBids} priceColor={"#27ad75"} />
            </div>
          )}
        </div>
      </div>
      <div className="aggregation-controls">
        <p>Aggregation</p>
        <span>{aggregation.toFixed(5)}</span>
        <div>
          <button onClick={handleDecrement}>-</button>
          <button onClick={handleIncrement}>+</button>
        </div>
      </div>
    </div>
  );
};

 
export default OrderBook;
