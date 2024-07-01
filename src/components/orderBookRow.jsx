import React from "react";

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

export default OrderBookRow;