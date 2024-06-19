import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { useSelector } from "react-redux";
import { formatDate, calculateBestBid, calculateBestAsk } from "../utils";
import "../styles/priceChart.css";

const PriceChart = () => {
  const orderBooks = useSelector((state) => state.orderBooks);
  const currencyPair = useSelector((state) => state.orderBooks.currencyPair);

  const [data, setData] = useState([]);
  const [bestAsk, setBestAsk] = useState(0);
  const [bestBid, setBestBid] = useState(0);

  useEffect(() => {
    const bestAsk = calculateBestAsk(orderBooks.asks);
    const bestBid = calculateBestBid(orderBooks.bids);
    setBestAsk(bestAsk);
    setBestBid(bestBid);
  }, [currencyPair, orderBooks]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (orderBooks.bids.length > 0 && orderBooks.asks.length > 0) {
        const newData = {
          time: formatDate(new Date()),
          bids: parseFloat(orderBooks.bids[0][0]),
          asks: parseFloat(orderBooks.asks[0][0]),
        };
        setData((prevData) => [...prevData.slice(-10), newData]);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [orderBooks]);

  const times = data.map((item) => item.time);
  const bids = data.map((item) => item.bids);
  const asks = data.map((item) => item.asks);

  return (
    <div className="price-chart">
      <div className="best-prices">
        <div className="best-prices-item bg-orange">
          <span className="best-ask">Best Ask: {bestAsk}</span>
        </div>
        <div className="best-prices-item bg-blue">
          <span className="best-bid">Best Bid: {bestBid}</span>
        </div>
      </div>
      <Plot
        data={[
          {
            x: times,
            y: bids,
            type: "scatter",
            mode: "lines",
            name: "Bids",
            line: { color: "blue" },
          },
          {
            x: times,
            y: asks,
            type: "scatter",
            mode: "lines",
            name: "Asks",
            line: { color: "orange" },
          },
        ]}
        layout={{
          width: 800,
          height: 400,
          title: "Real-time Bids and Asks",
          xaxis: { title: "Time" },
          yaxis: { title: "Price", dtick: 0.9, nticks: 1, tickmode: "array" },
        }}
      />
    </div>
  );
};

export default PriceChart;
