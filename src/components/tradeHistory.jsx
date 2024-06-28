import { useDispatch, useSelector } from "react-redux"; 
import { formatDate } from "../utils";
import "../styles/tradeHistory.css";
import LoadingBar from "./loadingBar";

const TradeHistory = () => {
  const dispatch = useDispatch();
  const tradeHistory = useSelector((state) => state.tradeHistory.tradeHistory);
  const currencyPair = useSelector((state) => state.orderBooks.currencyPair);

 
  return (
    <div className="trade-history">
      <h3>Trade History</h3>
      <hr />
      <div className="trade-history-header">
        <h5 className="trade-history-header-element">Trade Size</h5>
        <h5 className="trade-history-header-title-element trade-history-price">
          Price ({currencyPair.split("-")[1]})
        </h5>
        <h5 className="trade-history-header-title-element">Time</h5>
      </div>

      {tradeHistory.length <= 0 ? (
        <div className="trade-history-loading">
          <LoadingBar />
        </div>
      ) : (
        tradeHistory.map((trade, index) => (
          <TradeHistoryRow key={`trade-${index}`} trade={trade} />
        ))
      )}
    </div>
  );
};

const TradeHistoryRow = ({ trade }) => (
  <div className="trade-history-row">
    <span className="trade-history-size">{Number(trade.size).toFixed(4)}</span>
    <span
      className="trade-history-price"
      style={{
        color: trade.side.toUpperCase() === "SELL" ? "#f0616d" : "#27ad75",
      }}
    >
      {Number(trade.price).toFixed(2)}{" "}
      {trade.side.toUpperCase() === "SELL" ? "↘" : "↗"}
    </span>
    <span className="trade-history-time">{formatDate(trade.time)}</span>
  </div>
);

export default TradeHistory;
