import React, { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import "chartjs-adapter-date-fns";
import {
  CandlestickController,
  CandlestickElement,
  OhlcController,
  OhlcElement,
} from "chartjs-chart-financial";
import streamingPlugin from "chartjs-plugin-streaming";
import { Chart as ReactChart } from "react-chartjs-2";
import { COINBASE_SOCKET_URL } from "../config";
import { getWebSocketAuth } from "../utils";
import { useSelector } from "react-redux";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Mock data
const mockData = [
  { time: '22:50:00', bids: 9400, asks: 9200 },
  { time: '22:50:15', bids: 9400, asks: 9250 },
  { time: '22:50:30', bids: 9400, asks: 9250 },
  { time: '22:50:45', bids: 9400, asks: 9250 },
  { time: '22:51:00', bids: 9450, asks: 9300 },
  { time: '22:51:15', bids: 9500, asks: 9350 },
  { time: '22:51:30', bids: 9600, asks: 9400 },
  { time: '22:51:45', bids: 9550, asks: 9300 },
];
Chart.register(
  ...registerables,
  CandlestickController,
  CandlestickElement,
  OhlcController,
  OhlcElement,
  streamingPlugin
);

const apiKey = import.meta.env.VITE_COINBASE_API_KEY;
const passphrase = import.meta.env.VITE_COINBASE_PASSPHRASE;

const PriceChart = () => {
  const chartRef = useRef(null);
  const currencyPair = useSelector((state) => state.orderBooks.currencyPair);

  // useEffect(() => {
  //   const chart = chartRef.current;

  //   const socket = new WebSocket(COINBASE_SOCKET_URL);
  //   const timestamp = Math.floor(Date.now() / 1000).toString();
  //   const signature = getWebSocketAuth(timestamp);

  //   const subscribeMessage = JSON.stringify({
  //     type: "subscribe",
  //     product_ids: [currencyPair],
  //     channels: ["level2"],
  //     signature: signature,
  //     key: apiKey,
  //     passphrase: passphrase,
  //     timestamp: timestamp,
  //   });

  //   socket.onopen = () => {
  //     console.log("WebSocket connection opened");
  //     socket.send(subscribeMessage);
  //   };
  //   // {"type":"l2update","product_id":"BTC-USD","changes":[["sell","0.01","3153.33333334"]],"time":"2024-06-19T10:34:56.969556Z"}
  //   socket.onmessage = (event) => {
  //     const data = JSON.parse(event.data);
  //     // console.log(data);
  //     if (data.type === "l2update" && chart) {
  //       const newTime = Date.now();
  //       const newPrice = parseFloat(data.changes[0][1]);

  //       const dataEntry = {
  //         x: newTime,
  //         o: newPrice,
  //       };

  //       if (data.changes[0][0].toUpperCase() === "BUY") {
  //         chart.data.datasets[0].data.push(dataEntry);
  //       } else if (data.changes[0][0] === "SELL") {
  //         chart.data.datasets[1].data.push(dataEntry);
  //       }
  //       chart.update("quiet");
  //     }
  //   };

  //   socket.onclose = () => {
  //     console.log("WebSocket connection closed");
  //   };

  //   socket.onerror = (error) => {
  //     console.error("WebSocket error:", error);
  //   };

  //   return () => {
  //     socket.close();
  //   };
  // }, [currencyPair]);

  const data = {
    datasets: [
      {
        label: "Buy",
        data: [],
        type: "line",
      },
      {
        label: "Sell",
        data: [],
        type: "line",
        borderColor: "red",
        borderWidth: 2,
        pointRadius: 0,
        fill: false,
        spanGaps: true,
      },
    ],
  };

  const options = {
    plugins: {
      streaming: {
        duration: 60000,
        refresh: 1000,
        delay: 1000,
      },
      legend: {
        display: true,
      },
    },
    scales: {
      x: {
        type: "realtime",
        realtime: {
          duration: 60000,
          refresh: 1000,
          delay: 1000,
        },
        title: {
          display: true,
          text: "Time",
        },
      },
      y: {
        title: {
          display: true,
          text: "Price",
        },
      },
    },
  };

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={mockData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="bids" stroke="#8884d8" />
          <Line type="monotone" dataKey="asks" stroke="#ff7300" />
        </LineChart>
      </ResponsiveContainer>
      {/* <h3>Real-time Price Chart</h3>
      <ReactChart
        ref={chartRef}
        type="candlestick"
        data={data}
        options={options}
      /> */}
    </div>
  );
};

export default PriceChart;
