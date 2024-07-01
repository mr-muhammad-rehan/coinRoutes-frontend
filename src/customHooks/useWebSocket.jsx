import { useEffect, useRef, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getOrderBookSubMessage,
  getOrderBookUnSubMessage,
} from "../utils";
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
  SYSTEM_ENVIRONMENT,
} from "../config";

const WEBSOCKET_URLS = {
  MAIN_NET: COINBASE_SOCKET_URL,
  SANDBOX: COINBASE_SANDBOX_SOCKET_URL,
};

const MESSAGE_TYPES = {
  MATCH: "match",
  SNAPSHOT: "snapshot",
  L2UPDATE: "l2update",
  TICKER: "ticker",
};

const useWebSocket = () => {
  const dispatch = useDispatch();

  const { currencyPair, systemEnvironment, asks, bids } = useSelector(
    (state) => state.orderBooks
  );
  const [isConnected, setIsConnected] = useState(false);

  const webSocket = useRef(null);
  const asksRef = useRef(asks);
  const bidsRef = useRef(bids);
  const taskQueue = useRef(new TaskQueue(500)); // Intervals to process a task (can be adjusted)

  const pushAsksAndBids = (message) => {
    const { bids, asks } = message.data;
    dispatch(setOrderBook({ asks, bids }));
  };

  useEffect(() => {
    asksRef.current = asks || [];
    bidsRef.current = bids || [];
  }, [asks, bids]);

  useEffect(() => {
    const worker = new Worker();
    taskQueue.current = new TaskQueue(500);

    worker.onmessage = pushAsksAndBids;

    const connectWebSocket = () => {
      const webSocketUrl =
        systemEnvironment === SYSTEM_ENVIRONMENT.MAIN_NET
          ? WEBSOCKET_URLS.MAIN_NET
          : WEBSOCKET_URLS.SANDBOX;

      webSocket.current = new WebSocket(webSocketUrl);

      webSocket.current.onopen = () => {
        setIsConnected(true);
        if (webSocket.current.readyState === WebSocket.OPEN) {
          const message = getOrderBookSubMessage({
            currencyPair,
            environment: systemEnvironment,
          });
          webSocket.current.send(message);
        }
      };

      webSocket.current.onmessage = (event) => {
        const data = JSON.parse(event.data);

        switch (data.type) {
          case MESSAGE_TYPES.MATCH:
            dispatch(updateTradeHistory(data));
            break;
          case MESSAGE_TYPES.SNAPSHOT:
            taskQueue.current.addTask(() => {
              worker.postMessage(data);
            });
            break;
          case MESSAGE_TYPES.L2UPDATE:
            taskQueue.current.addTask(() => {
              worker.postMessage({
                ...data,
                currentAsks: asksRef.current,
                currentBids: bidsRef.current,
              });
            });
            break;
          case MESSAGE_TYPES.TICKER:
            dispatch(setBestOrderBook(data));
            break;
          default:
            console.log("Unhandled message", data);
        }
      };

      webSocket.current.onclose = () => {
        setIsConnected(false);
        console.log("WebSocket connection closed");
      };

      webSocket.current.onerror = (error) => {
        console.error("WebSocket error", error);
        setIsConnected(false); // Optionally update state to indicate disconnection
      };
    };

    const disconnectWebSocket = () => {
      if (webSocket.current) {
        if (webSocket.current.readyState === WebSocket.OPEN) {
          webSocket.current.send(getOrderBookUnSubMessage({ currencyPair }));
        }
        taskQueue.current.stop();
        dispatch(resetOrderBook());
        dispatch(resetTradeHistory());
        webSocket.current.close();
      }
    };

    // Initial connection
    connectWebSocket();

    return () => {
      disconnectWebSocket();
      worker.terminate(); // Clean worker to avoid leakage
    };
  }, [currencyPair, systemEnvironment, dispatch]);

  const sendMessage = useCallback((message) => {
    if (webSocket.current && webSocket.current.readyState === WebSocket.OPEN) {
      webSocket.current.send(JSON.stringify(message));
    } else {
      console.error(
        "WebSocket is not open. Ready state:",
        webSocket.current?.readyState
      );
    }
  }, []);

  return { isConnected, sendMessage };
};

export default useWebSocket;
