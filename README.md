# CoinRoutes Front-end Test

This project is a front-end application for visualizing cryptocurrency order books, trade history, and price charts. It is built using React and Redux, and it connects to the Coinbase WebSocket feed to fetch real-time data.

# Demo
[![Demo](https://img.youtube.com/vi/hb8BP8h_9SI/0.jpg)](https://www.youtube.com/watch?v=hb8BP8h_9SI)

## Features

1. **Order Book**: Displays the current bids and asks for a selected currency pair, with options to aggregate the order book data.
2. **Trade History**: Shows the recent trades for the selected currency pair.
3. **Price Chart**: Plots real-time bids and asks on a chart, with the best bid and ask prices highlighted.
4. **Currency Pair Selector**: Allows users to select different currency pairs to view their order books, trade history, and price charts.
5. **Environment Selector**: Users can switch between the main net and test net environments.

## Project Structure

### Components

- **OrderBook**: Displays the order book with bids and asks, and allows aggregation of data.
  
```1:64:src/components/orderBook.jsx
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import LoadingBar from "./loadingBar";
import { aggregateOrderBook, calculateAggregationRange } from "../utils";
import "../styles/orderBook.css";

const DEFAULT_AGGREGATION_AMOUNT = 0.0;

const OrderBook
```


- **TradeHistory**: Shows the recent trade history for the selected currency pair.
  
```1:52:src/components/tradeHistory.jsx
import "../styles/tradeHistory.css";
import { useSelector } from "react-redux";
import { formatDate } from "../utils";
import { SYSTEM_ENVIRONMENT } from "../config";
import LoadingBar from "./loadingBar";

const TradeHistory = () => {
  const { tradeHistory, isLoading } = useSelector(
    (state) => state.tradeHistory
  );
  const { currencyPair, systemEnvironment } = useSelector(
    (state) => state.orderBooks
  );

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

      {systemEnvironment === SYSTEM_ENVIRONMENT.MAIN_NET ? (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <span style={{ color: "yellow" }}>Cannot display on Main_Net</span>
        </div>
      ) : (
        <>
          {isLoading ? (
            <div className="trade-history-loading">
              <LoadingBar />
            </div>
          ) : (
            tradeHistory.map((trade, index) => (
              <TradeHistoryRow key={`trade-${index}`} trade={trade} />
            ))
          )}
        </>
      )}
    </div>
  );
};
```


- **PriceChart**: Plots real-time bids and asks on a chart.
  
```1:58:src/components/priceChart.jsx
import React, { useEffect, useState, useMemo } from "react";
import Plot from "react-plotly.js";
import { useSelector } from "react-redux";
import BestOrder from "./bestOrder";
import { formatDate } from "../utils";
import "../styles/priceChart.css";

const PriceChart
```


- **CurrencyPairSelector**: Dropdown to select different currency pairs.
  
```1:39:src/components/currencyPairSelector.jsx
import "../styles/currencyPair.css";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCurrencyPair } from "../store/actions/orderBookActions";
import { DEFAULT_CURRENCY_PAIR } from "../config";

const AVAILABLE_CURRENCY = [
  "ETH-USD",
  "ETH-BTC",
  "BTC-USD",
  "LTC-USD",
  "BCH-USD",
];

const CurrencyPairSelector = () => {
  const [selectedPair, setSelectedPair] = useState(DEFAULT_CURRENCY_PAIR);
  const dispatch = useDispatch();

  const handleChange = (event) => {
    setCurrencyPair(event.target.value); 
    setSelectedPair(event.target.value);
  };

  useEffect(() => {
    dispatch(setCurrencyPair(selectedPair));
  }, [selectedPair, dispatch]);

  return (
    <select value={selectedPair} onChange={handleChange}>
      {AVAILABLE_CURRENCY.map((currency, key) => (
        <option key={key} value={currency}>
          {currency}
        </option>
      ))}
    </select>
  );
};

export default CurrencyPairSelector;
```


- **Header**: Displays the connection status and allows switching between environments.
  
```1:43:src/components/header.jsx
import { useSelector, useDispatch } from "react-redux";
import { setEnvironment } from "../store/actions/orderBookActions";
import { SYSTEM_ENVIRONMENT } from "../config";

export default function Header({ isConnected }) {
  const dispatch = useDispatch();
  const { systemEnvironment } = useSelector((state) => state.orderBooks);

  const onTestNetChange = (e) => {
    dispatch(
      setEnvironment(
        e.target.value === "TEST_NET"
          ? SYSTEM_ENVIRONMENT.TEST_NET
          : SYSTEM_ENVIRONMENT.MAIN_NET
      )
    );
  };

  return (
    <div
      style={{
        color: "white",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
      }}
    >
      <div className="connection-status">
        {isConnected ? (
          <div className="system-connected"></div>
        ) : (
          <div className="system-disconnected"></div>
        )}
        <span>{isConnected ? "Connected" : "Not-Connected"}</span>
      </div>
      <h1>CoinRoutes Frontend Test</h1>
      <select value={systemEnvironment} onChange={onTestNetChange}>
        <option value="TEST_NET">Test Net</option>
        <option value="MAIN_NET">Main Net</option>
      </select>
    </div>
  );
}
```


### Custom Hooks

- **useWebSocket**: Manages the WebSocket connection to the Coinbase feed, handles incoming messages, and updates the Redux store.
  
```1:17:src/customHooks/useWebSocket.jsx
import { useEffect, useRef, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getOrderBookSubMessage, getOrderBookUnSubMessage } from "../utils";
import {
  setOrderBook,
  setBestOrderBook,
  resetOrderBook,
} from "../store/actions/orderBookActions";
import {
  updateTradeHistory,
  resetTradeHistory,
} from "../store/actions/tradeHistoryActions";
import Worker from "../workers/orderBookWorker?worker";
import TaskQueue from "../utils/taskQueue";
import {
  COINBASE_SOCKET_URL,
  COINBASE_SANDBOX_SOCKET_URL,
```


### Redux

- **Actions**: Defines actions for setting the order book, trade history, currency pair, and environment.
  
```1:30:src/store/actions/orderBookActions.js
export const SET_CURRENCY_PAIR = 'SET_CURRENCY_PAIR';
export const SET_ORDER_BOOK = 'SET_ORDER_BOOK';
export const SET_BEST_ORDER_BOOK = 'SET_BEST_ORDER_BOOK';
export const RESET_ORDER_BOOK = 'RESET_ORDER_BOOK';
export const SET_ENVIRONMENT = 'SET_ENVIRONMENT';

export const setCurrencyPair = (currencyPair) => ({
  type: SET_CURRENCY_PAIR,
  payload: currencyPair,
});

export const setOrderBook = (orderBook) => ({
  type: SET_ORDER_BOOK,
  payload: orderBook,
});


export const setBestOrderBook = (bestOrderBook) => ({
  type: SET_BEST_ORDER_BOOK,
  payload: bestOrderBook,
});

export const resetOrderBook = () => ({
  type: RESET_ORDER_BOOK,
});

export const setEnvironment = (environment) => ({
  type: SET_ENVIRONMENT,
  payload: environment
});
```

  
```1:19:src/store/actions/tradeHistoryActions.js
export const SET_TRADE_HISTORY = 'SET_TRADE_HISTORY';
export const UPDATE_TRADE_HISTORY = 'UPDATE_TRADE_HISTORY';
export const RESET_TRADE_HISTORY = 'RESET_TRADE_HISTORY';
 

export const setTradeHistory = (tradeHistory) => ({
  type: SET_TRADE_HISTORY,
  payload: tradeHistory,
});

export const updateTradeHistory = (trade) => ({
  type: UPDATE_TRADE_HISTORY,
  payload: trade,
});


export const resetTradeHistory = () => ({
  type: RESET_TRADE_HISTORY,
});
```


- **Reducers**: Handles state changes for the order book and trade history.
  
```1:72:src/store/reducers/orderBookReducer.js
import { SET_ORDER_BOOK, SET_CURRENCY_PAIR, RESET_ORDER_BOOK, SET_BEST_ORDER_BOOK, SET_ENVIRONMENT } from '../actions/orderBookActions';
import { DEFAULT_CURRENCY_PAIR, SYSTEM_ENVIRONMENT } from '../../config';

const MAX_ORDERS_LIST = 50;

const initialState = {
  bids: [],
  asks: [],
  bestAsk: {
    size: 0,
    amount: 0
  },
  bestBid: {
    size: 0,
    amount: 0
  },
  currencyPair: DEFAULT_CURRENCY_PAIR,
  isLoading: true,
  systemEnvironment: SYSTEM_ENVIRONMENT.MAIN_NET
};

const orderBookReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ORDER_BOOK:
      const bids = action.payload.bids;
      const asks = action.payload.asks;
      if (bids.length > MAX_ORDERS_LIST) {
        bids.length = MAX_ORDERS_LIST;
      }
      if (asks.length > MAX_ORDERS_LIST) {
        asks.length = MAX_ORDERS_LIST;
      }
      return {
        ...state,
        isLoading: false,
        bids: bids,
        asks: asks,
      };
    case SET_CURRENCY_PAIR:
      return {
        ...state,
        isLoading: false,
        currencyPair: action.payload,
      };
    case RESET_ORDER_BOOK:
      const currency = state.currencyPair;
      const systemEnvironment = state.systemEnvironment;
      return {
        ...initialState,
        isLoading: false,
        systemEnvironment: systemEnvironment,
        currencyPair: currency
      };
    case SET_BEST_ORDER_BOOK:
      const bestAsk = {
        size: action.payload.best_ask_size,
        amount: action.payload.best_ask
      }
      const bestBid = {
        size: action.payload.best_bid_size,
        amount: action.payload.best_bid
      }
      return { ...state, bestAsk, bestBid };
    case SET_ENVIRONMENT:
      return {
        ...state,
        systemEnvironment: action.payload
      }
    default:
      return state;
  }
};
```

  
```1:34:src/store/reducers/tradeHistoryReducer.js
import { SET_TRADE_HISTORY, UPDATE_TRADE_HISTORY, RESET_TRADE_HISTORY } from '../actions/tradeHistoryActions';

const MAX_TRADE_HISTORY_LENGTH = 32;

const initialState = {
  tradeHistory: [],
  isLoading: true,
};

const tradeHistoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_TRADE_HISTORY:
      return {
        ...state,
        isLoading: false,
        tradeHistory: action.payload,
      };
    case UPDATE_TRADE_HISTORY:
      return {
        ...state,
        isLoading: false,
        tradeHistory: [action.payload, ...state.tradeHistory].slice(0, MAX_TRADE_HISTORY_LENGTH),  //keep the recent history with length of [MAX_TRADE_HISTORY_LENGTH] 
      };
    case RESET_TRADE_HISTORY:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

export default tradeHistoryReducer;

```


- **Store**: Configures the Redux store with the root reducer.
  
```1:11:src/store/index.js
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers";

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ immutableCheck: true, serializableCheck: true }),
});


```


### Utilities

- **orderBook.utils.js**: Contains utility functions for processing order book data.
  
```1:41:src/utils/orderBook.utils.js
import { getWebSocketAuth } from './general.utils';
import { SYSTEM_ENVIRONMENT } from '../config';

const apiKey = import.meta.env.VITE_COINBASE_API_KEY;
const passphrase = import.meta.env.VITE_COINBASE_PASSPHRASE;

export function getOrderBookSubMessage({ currencyPair, channels = ['level2_batch', 'ticker'], environment = SYSTEM_ENVIRONMENT.TEST_NET }) {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const signature = getWebSocketAuth(timestamp);
    let subscription = {
        type: 'subscribe',
        product_ids: [currencyPair],
        channels: [...channels],
    };

    if (environment === SYSTEM_ENVIRONMENT.MAIN_NET) {
        return JSON.stringify(subscription);
    }

    return JSON.stringify({
        type: 'subscribe',
        product_ids: [currencyPair],
        channels: [...channels, 'full'],
        signature: signature,
        key: apiKey,
        passphrase: passphrase,
        timestamp: timestamp,
    });
}

export function getOrderBookUnSubMessage({ currencyPair, channels = ['level2_batch', 'ticker'] }) {
    return JSON.stringify({
        type: "unsubscribe",
        product_ids: [currencyPair],
        channels: channels
    });
}
```


- **general.utils.js**: Contains general utility functions, including WebSocket authentication.
  
```1:33:src/utils/general.utils.js
import CryptoJS from 'crypto-js';

export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
};

export function getWebSocketAuth(timestamp) {
  const apiSecret = import.meta.env.VITE_COINBASE_API_SECRET;
  const method = 'GET';
  const requestPath = '/users/self/verify';
  const body = '';

  const prehash = timestamp + method + requestPath + body;
  const key = CryptoJS.enc.Base64.parse(apiSecret);
  const hmac = CryptoJS.HmacSHA256(prehash, key);
  return CryptoJS.enc.Base64.stringify(hmac);
};


export function padDecimals(numbers) {
  let maxDecimals = 0;
  const decimals = numbers.toString().split('.')[1];
  if (decimals && decimals.length > maxDecimals) {
    maxDecimals = decimals.length;
  }
  return decimals.toFixed(maxDecimals);
}
```


### Workers

- **orderBookWorker.js**: Web worker for processing order book data in the background.
  
```1:24:src/workers/orderBookWorker.js
import { createOrderBooksFromList, filterNewBooks } from '../utils/orderBook.utils';
self.onmessage = function (e) {
  const message = e.data;
  const timestamp = new Date(message.time).getTime();

  //if initial data
  if (message.type == "snapshot") {
    const asks = createOrderBooksFromList(message.asks, timestamp, true).reverse();
    const bids = createOrderBooksFromList(message.bids, timestamp);
    self.postMessage({ asks: asks, bids: bids });

    //If an update message
  } else if (message.type == 'l2update') {
    let newBids = message.changes.filter((order) => order[0] == 'buy').map((ask) => createBookObject(ask, timestamp));
    let newAsks = message.changes.filter((order) => order[0] == 'sell').map((bid) => createBookObject(bid, timestamp));
    const { updatedBids, updatedAsks } = filterNewBooks(message.currentAsks, message.currentBids, newAsks, newBids);
    self.postMessage({ asks: updatedAsks.reverse(), bids: updatedBids });
  }

};

function createBookObject(book, timestamp) {
  return { price: book[1], marketSize: book[2], timestamp: timestamp }
}
```


## Getting Started

### Prerequisites

- Node.js and npm installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/mr-muhammad-rehan/coinRoutes-frontend.git
   ```

2. Navigate to the project directory:
   ```bash
   cd coinRoutes-frontend
   ```

3. Install the dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Running the Application

Once the development server is running, you can access the application in your web browser at `http://localhost:3000`.

### Screenshots

![Screen Shot](./screen.png)

---

This explanation should provide a comprehensive overview of the project, its structure, and how to get started. Feel free to modify it as needed!