import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { aggregateOrderBook } from "../utils";
import "../styles/orderBook.css";

const DEFAULT_AGGREGATION_AMOUNT = 0.00001;

const OrderBook = () => {
  const { bids, asks } = useSelector((state) => state.orderBooks);
  const currencyPair = useSelector((state) => state.orderBooks.currencyPair);
  const [aggregation, setAggregation] = useState(DEFAULT_AGGREGATION_AMOUNT);
  const [aggregationAmount, setAggregationAmount] = useState(
    DEFAULT_AGGREGATION_AMOUNT
  );
  const [aggregatedBids, setAggregatedBids] = useState([]);
  const [aggregatedAsks, setAggregatedAsks] = useState([]);

  useEffect(() => {
    const calculateAggregationIncrement = () => {
      const prices = [
        ...bids.map(([price]) => price),
        ...asks.map(([price]) => price),
      ];
      if (prices.length > 0) {
        const maxPrice = Math.max(...prices);
        const minPrice = Math.min(...prices);
        const range = (maxPrice + minPrice) / 2;

        let newAggregation = DEFAULT_AGGREGATION_AMOUNT;
        if (range > 1) newAggregation = 0.001;
        if (range > 10) newAggregation = 0.01;
        if (range > 100) newAggregation = 0.1;
        if (range > 1000) newAggregation = 1;

        setAggregationAmount(newAggregation);
      }
    };

    setAggregatedBids(aggregateOrderBook(bids, aggregation));
    const aggregatedAsk = aggregateOrderBook(asks, aggregation).reverse();
    setAggregatedAsks(aggregatedAsk);
    calculateAggregationIncrement();
  }, [bids, asks, aggregation]);

  const handleIncrement = () =>
    setAggregation((prev) => prev + aggregationAmount);
  const handleDecrement = () =>
    setAggregation((prev) =>
      Math.max(DEFAULT_AGGREGATION_AMOUNT, prev - aggregationAmount)
    );

  const calculateSpread = () => {
    if (aggregatedBids.length > 0 && aggregatedAsks.length > 0) {
      const highestBid = aggregatedBids[0][0];
      const lowestAsk = aggregatedAsks[0][0];
      return (lowestAsk - highestBid).toFixed(4);
    }
    return "-";
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
            <h5>My Size</h5>
          </div>

          <div className="order-book-list">
            <div className="order-book-asks">
              <OrderBookRow orders={aggregatedAsks} priceColor={"#f0616d"} />
            </div>
            <p className="order-book-spread">
              {currencyPair.split("-")[1]} Spread {calculateSpread()}
            </p>
            <div className="order-book-bids">
              <OrderBookRow orders={aggregatedBids} priceColor={"#27ad75"} />
            </div>
          </div>
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
    {orders.map(([price, size], index) => (
      <div className="order-book-row" key={`order-${index}`}>
        <span className="order-book-size">{Number(size).toFixed(6)}</span>
        <span className="order-book-price" style={{ color: priceColor }}>
          {Number(price).toFixed(6)}
        </span>
        <span className="order-book-my-size">-</span>
      </div>
    ))}
  </div>
);

export default OrderBook;
