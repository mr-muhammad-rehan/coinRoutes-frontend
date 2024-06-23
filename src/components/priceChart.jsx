import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { useSelector } from "react-redux";
import BestOrder from "./bestOrder";
import { formatDate } from "../utils";
import "../styles/priceChart.css";

const PriceChart = () => {
  const orderBooks = useSelector((state) => state.orderBooks);
  const { bestAsk, bestBid } = useSelector((state) => state.orderBooks);

  const [data, setData] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newData = {
        time: formatDate(new Date()),
        bids: bestBid.amount,
        asks: bestAsk.amount,
      };
      setData((prevData) => [...prevData.slice(-20), newData]);
    }, 500);

    return () => clearInterval(interval);
  }, [orderBooks]);

  const times = data.map((item) => item.time);
  const bids = data.map((item) => item.bids);
  const asks = data.map((item) => item.asks);

  return (
    <div className="price-chart">
      <div className="best-orders">
        <BestOrder amount={bestAsk.amount} size={bestAsk.size} type={"Ask"} />
        <BestOrder amount={bestBid.amount} size={bestBid.size} type={"Bid"} />
      </div>
      <Plot
        data={[
          {
            x: times,
            y: bids,
            type: "scatter",
             mode: "lines+markers",
            name: "Bids",
            line: { color: "#41BBFF" },
          },
          {
            x: times,
            y: asks,
            type: "scatter",
             mode: "lines+markers",
            name: "Asks",
            line: { color: "#ffb703" },
          },
        ]}
        layout={{
          width: 800,
          height: 570,
          title: {
            text: "Real-time Bids and Asks",
            font: {
              color: "white",
            },
          },
          paper_bgcolor: "#151518",
          plot_bgcolor: "#151518",
          xaxis: {
            title: {
              text: "Time",
              font: {
                color: "white",
              },
            },
            color: "white",
            gridcolor: "gray",
          },
          yaxis: {
            title: {
              text: "Price",
              font: {
                color: "white",
              },
            },
            color: "white",
            gridcolor: "gray",
            dtick: 0.9,
            nticks: 1,
            tickmode: "array",
          },
          legend: {
            font: {
              color: "white",
            },
          },
        }}
      />
    </div>
  );
};

export default PriceChart;
