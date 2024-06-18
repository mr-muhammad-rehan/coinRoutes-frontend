import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { subscribeTradeHistory } from "../store/actions/tradeHistoryActions";

const TradeHistory = () => {
  const dispatch = useDispatch();
  const tradeHistory = useSelector((state) => state.tradeHistory.tradeHistory);
  const currencyPair = useSelector((state) => state.orderBooks.currencyPair);

  useEffect(() => {
    dispatch(subscribeTradeHistory(currencyPair));
  }, [currencyPair, dispatch]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  return (
    <div>
      <h3>Trade History</h3>
      <table>
        <thead>
          <tr>
            <th>Trade Size</th>
            <th>Price ({currencyPair.split("-")[1]})</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {tradeHistory?.map((trade, index) => (
            <tr key={index}>
              <td>{Number(trade.size).toFixed(4)}</td>
              <td>{trade.price}</td>
              <td>{formatDate(trade.time)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TradeHistory;
