import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { subscribeTradeHistory } from "../store/actions/tradeHistoryActions";
import { formatDate } from "../utils";
import "../styles/tradeHistory.css";

const TradeHistory = () => {
  const dispatch = useDispatch();
  const tradeHistory = useSelector((state) => state.tradeHistory.tradeHistory);
  const currencyPair = useSelector((state) => state.orderBooks.currencyPair);

  useEffect(() => {
    dispatch(subscribeTradeHistory(currencyPair));
  }, [currencyPair, dispatch]);

  return (
    <div className="trade-history">
      <h3>Trade History</h3>
      <hr />
      <div className="trade-history-header">
        <h5 className="trade-history-header-title-element" >Trade Size</h5>
        <h5 className="trade-history-header-title-element">Price ({currencyPair.split("-")[1]})</h5>
        <h5 className="trade-history-header-title-element">Time</h5>
      </div>

      {tradeHistory.map((trade, index) => (
        <TradeHistoryRow key={`trade-${index}`} trade={trade} />
      ))}
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
      {Number(trade.price).toFixed(4)}
    </span>
    <span className="trade-history-time">{formatDate(trade.time)}</span>
  </div>
);

export default TradeHistory;
