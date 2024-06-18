import CurrencyPairSelector from "./components/currencyPairSelector";
import OrderBook from "./components/orderBook";
import TradeHistory from "./components/tradeHistory";
import PriceChart from "./components/priceChart";

function App() {
  return (
    <div>
      <h1>CoinRoutes Frontend Test</h1>
      <CurrencyPairSelector />
      <div style={{ display: "flex", gap: 20 }}>
        <OrderBook />
        {/* https://mui.com/x/react-charts/bars/ */}
        {/* <PriceChart /> */}
        <TradeHistory />
      </div>
    </div>
  );
}

export default App;
