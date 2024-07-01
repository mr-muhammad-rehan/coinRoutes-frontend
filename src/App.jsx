import "./app.css";
import { useSelector } from "react-redux";
import CurrencyPairSelector from "./components/currencyPairSelector";
import OrderBook from "./components/orderBook";
import TradeHistory from "./components/tradeHistory";
import PriceChart from "./components/priceChart";
import Header from "./components/header";
import useWebSocket from "./customHooks/useWebSocket";

function App() {
  const { isConnected } = useWebSocket();

  return (
    <div>
      <Header isConnected={isConnected} />
      <hr />
      <div className="price-selection">
        <CurrencyPairSelector />
      </div>
      <hr />
      <div className="home-container">
        <OrderBook />
        <PriceChart />
        <TradeHistory />
      </div>

      <div className="footer">
        <span>All Rights Reserved. Coin Routes © 2024</span>
      </div>
    </div>
  );
}

export default App;
