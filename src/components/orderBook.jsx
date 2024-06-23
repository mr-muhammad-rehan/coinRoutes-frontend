import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import LoadingBar from "./loadingBar";
import { aggregateOrderBook, calculateAggregationRange } from "../utils";
import "../styles/orderBook.css";

const DEFAULT_AGGREGATION_AMOUNT = 0.00001;

const OrderBook = () => {
  const { bids, asks, bestAsk, bestBid } = useSelector(
    (state) => state.orderBooks
  );
  const currencyPair = useSelector((state) => state.orderBooks.currencyPair);
  const [aggregation, setAggregation] = useState(DEFAULT_AGGREGATION_AMOUNT);
  const [aggregationAmount, setAggregationAmount] = useState(
    DEFAULT_AGGREGATION_AMOUNT
  );
  const [aggregatedBids, setAggregatedBids] = useState([]);
  const [aggregatedAsks, setAggregatedAsks] = useState([]);
  const [spread, setSpread] = useState(0);

  useEffect(() => {
    const newAggregationRange = calculateAggregationRange(bids, asks);
    if (newAggregationRange != 0) {
      setAggregationAmount(newAggregationRange);
    }

    const aggregatedOrderBids = aggregateOrderBook(bids, aggregation);
    const aggregatedOrderAsks = aggregateOrderBook(bids, aggregation);
    setAggregatedBids(aggregatedOrderBids.slice(0, 10));
    setAggregatedAsks(aggregatedOrderAsks.slice(0, 10));
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

          {aggregatedAsks.length <= 0 ? (
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

          {aggregatedBids.length <= 0 ? (
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

const OrderBookRow = ({ orders, priceColor = "black" }) => (
  <div>
    {orders.map((order, index) => (
      <div className="order-book-row" key={`order-${index}`}>
        <span className="order-book-size">
          {Number(order.marketSize).toFixed(6)}
        </span>
        <span className="order-book-price" style={{ color: priceColor }}>
          {Number(order.price).toFixed(4)}
        </span>
      </div>
    ))}
  </div>
);

export default OrderBook;
