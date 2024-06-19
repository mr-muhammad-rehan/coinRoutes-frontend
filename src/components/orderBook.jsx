import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { aggregateOrderBook } from "../utils";

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

  function calculateSpread() {
    if (aggregatedBids.length > 0 && aggregatedAsks.length > 0) {
      const highestBid = aggregatedBids[0][0];
      const lowestAsk = aggregatedAsks[0][0];
      return (lowestAsk - highestBid).toFixed(4);
    }
    return "-";
  }

  function calculateAggregationIncrement() {
    const prices = [
      ...bids.map(([price]) => price),
      ...asks.map(([price]) => price),
    ];
    if (prices.length > 0) {
      const maxPrice = Math.max(...prices);
      const minPrice = Math.min(...prices);
      const range = (maxPrice + minPrice) / 2;

      // Adjust aggregation increment based on price range
      let newAggregation = DEFAULT_AGGREGATION_AMOUNT;
      if (range > 1) newAggregation = 0.001;
      if (range > 10) newAggregation = 0.01;
      if (range > 100) newAggregation = 0.1;
      if (range > 1000) newAggregation = 1;

      setAggregationAmount(newAggregation);
    }
  }

  const handleIncrement = () =>
    setAggregation((prev) => prev + aggregationAmount);
  const handleDecrement = () => {
    if (aggregation - aggregationAmount <= 0) {
      setAggregation(DEFAULT_AGGREGATION_AMOUNT);
    }

    setAggregation((prev) => prev - aggregationAmount);
  };

  useEffect(() => {
    setAggregatedBids(aggregateOrderBook(bids, aggregation));
    setAggregatedAsks(aggregateOrderBook(asks, aggregation));
    calculateAggregationIncrement();
  }, [bids, asks, aggregation]);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div
        style={{
          border: "1px solid #ccc",
          width: "300px",
          height: "800px",
          padding: "6px",
        }}
      >
        <h3>Order Book</h3>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <h5>Market Size</h5>
            <h5>Price ({currencyPair.split("-")[1]})</h5>
            <h5>My Size</h5>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "end",
              flexDirection: "column",
              height: "300px",
            }}
          >
            <OrderBookRow orders={aggregatedBids} />
          </div>

          <p style={{ textAlign: "center", border: "1px solid #ccc" }}>
            {currencyPair.split("-")[1]} Spread {calculateSpread()}
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "start",
              flexDirection: "column",
              height: "300px",
            }}
          >
            <OrderBookRow orders={aggregatedAsks} />
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px",
          border: "1px solid #ccc",
        }}
      >
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

function OrderBookRow({ orders }) {
  return (
    <div>
      {orders?.map(([price, size], index) => (
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "end",
          }}
          key={`bid-${index}`}
        >
          <span style={{ fontSize: "14px", width: "80px" }}>
            {Number(size).toFixed(6)}
          </span>
          <span style={{ fontSize: "14px", width: "80px" }}>
            {Number(price).toFixed(6)}
          </span>
          <span style={{ fontSize: "14px" }}>-</span>
        </div>
      ))}
    </div>
  );
}
