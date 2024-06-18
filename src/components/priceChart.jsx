import React from 'react';
import { Line } from 'react-chartjs-2';

const PriceChart = () => {
  const chartData = {
    labels: [
      '2024-06-01', '2024-06-02', '2024-06-03', '2024-06-04', '2024-06-05',
      '2024-06-06', '2024-06-07', '2024-06-08', '2024-06-09', '2024-06-10',
    ],
    datasets: [{
      label: 'Price',
      data: [45000, 45500, 45200, 46000, 47000, 46800, 47200, 47500, 48000, 48500],
      borderColor: 'rgba(75,192,192,1)',
      fill: false,
    }]
  };

  return (
    <div>
      <h3>Price Chart</h3>
      <Line data={chartData} />
    </div>
  );
};

export default PriceChart;
