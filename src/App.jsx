import "./app.css";
import CurrencyPairSelector from "./components/currencyPairSelector";
import OrderBook from "./components/orderBook";
import TradeHistory from "./components/tradeHistory";
import PriceChart from "./components/priceChart";

function App() {
  return (
    <div>
      <h1 style={{ color: "white", display: "flex", justifyContent: "center" }}>CoinRoutes Frontend Test</h1>
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
