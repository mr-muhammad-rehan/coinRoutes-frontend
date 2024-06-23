import "../styles/bestOrder.css";

const BestOrder = ({ amount, size, type = "Bid" }) => {
  return (
    <div className="container">
      <div
        className={`header ${
          type.toUpperCase() === "BID" ? "bg-blue" : "bg-orange"
        }`}
      >
        <span>Best {type}:</span>
      </div>
      <div className="content">
        <div className="box">
          <span>{amount}</span>
          <span>{type} Price</span>
        </div>
        <div className="box">
          <span>{size}</span>
          <span>{type} Quantity</span>
        </div>
      </div>
    </div>
  );
};

export default BestOrder;
