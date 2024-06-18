// components/OrderBook.js
import React from 'react';
import { useSelector } from 'react-redux';

const OrderBook = () => {
  const { bids, asks } = useSelector((state) => state.orderBooks);
  const currencyPair = useSelector((state) => state.orderBooks.currencyPair);

  return (
    <div>
      <h3>Order Book</h3>
      <table>
        <thead>
          <tr>
            <th>Market Size</th>
            <th>Price ({currencyPair.split("-")[1]})</th>
            <th>My Size</th>
          </tr>
        </thead>
        <tbody>
          {bids?.slice(0, 10).map(([price, size], index) => (
            <tr key={`bid-${index}`}>
              <td>{Number(size).toFixed(4)}</td>
              <td>{price}</td>
              <td>-</td>
            </tr>
          ))}
          <tr>
            <td colSpan="3" style={{ textAlign: "center" }}>
              EUR Spread
            </td>
          </tr>
          {asks.slice(0, 10).map(([price, size], index) => (
            <tr key={`ask-${index}`}>
              <td>{Number(size).toFixed(4)}</td>
              <td>{price}</td>
              <td>-</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderBook;
