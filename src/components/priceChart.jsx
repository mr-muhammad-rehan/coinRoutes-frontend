import React, { useEffect, useState, useMemo } from "react";
import Plot from "react-plotly.js";
import { useSelector } from "react-redux";
import BestOrder from "./bestOrder";
import { formatDate } from "../utils";
import "../styles/priceChart.css";

const PriceChart = () => {
  const { bestAsk, bestBid } = useSelector(
    (state) => state.orderBooks
  );
  const [data, setData] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newData = {
        time: formatDate(new Date()),
        bids: bestBid.amount,
        asks: bestAsk.amount,
      };
      setData((prevData) => [...prevData.slice(-50), newData]);
    }, 500);

    return () => clearInterval(interval);
  }, [bestAsk.amount, bestBid.amount]);



  const times = useMemo(() => data.map((item) => item.time), [data]);
  const _bids = useMemo(() => data.map((item) => item.bids), [data]);
  const _asks = useMemo(() => data.map((item) => item.asks), [data]);

  const plotData = useMemo(
    () => [
      {
        x: times,
        y: _bids,
        type: "scatter",
        mode: "lines+markers",
        name: "Bids",
        line: { color: "#41BBFF" },
      },
      {
        x: times,
        y: _asks,
        type: "scatter",
        mode: "lines+markers",
        name: "Asks",
        line: { color: "#ffb703" },
      },
    ],
    [times, _bids, _asks]
  );

  const plotLayout = useMemo(() => {
    const minY = Math.min(..._bids, ..._asks);
    const maxY = Math.max(..._bids, ..._asks);
    const rangePadding = 0.1 * (maxY - minY); // Adjust padding as needed

    return {
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
        tickformat: ".4f",
        range: [minY - rangePadding, maxY + rangePadding],
      },
      legend: {
        font: {
          color: "white",
        },
      },
    };
  }, [_bids, _asks]);

  return (
    <div className="price-chart">
      <div className="best-orders">
        <BestOrder amount={bestAsk.amount} size={bestAsk.size} type={"Ask"} />
        <BestOrder amount={bestBid.amount} size={bestBid.size} type={"Bid"} />
      </div>
      <MemoizedPlot data={plotData} layout={plotLayout} />
    </div>
  );
};

const MemoizedPlot = React.memo(({ data, layout }) => (
  <Plot data={data} layout={layout} />
));

export default PriceChart;
