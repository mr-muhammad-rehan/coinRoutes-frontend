import "./app.css";
import CurrencyPairSelector from "./components/currencyPairSelector";
import OrderBook from "./components/orderBook";
import TradeHistory from "./components/tradeHistory";
import PriceChart from "./components/priceChart";

function App() {
  return (
    <div>
      <h1>CoinRoutes Frontend Test</h1>
      <CurrencyPairSelector />
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <OrderBook />
        {/* <PriceChart /> */}
        {/* <TradeHistory /> */}
      </div>
    </div>
  );
}

export default App;
