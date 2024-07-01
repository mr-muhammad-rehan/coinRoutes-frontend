import { useEffect, useRef, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getOrderBookSubMessage, getOrderBookUnSubMessage } from "../utils";
import {
  setOrderBook,
  setBestOrderBook,
  resetOrderBook
} from "../store/actions/orderBookActions";
import { updateTradeHistory, resetTradeHistory } from "../store/actions/tradeHistoryActions";
import Worker from "../workers/orderBookWorker?worker";
import TaskQueue from "../utils/taskQueue";
import {
  COINBASE_SOCKET_URL,
  COINBASE_SANDBOX_SOCKET_URL,
  SYSTEM_ENVIRONMENT,
} from "../config";

const useWebSocket = () => {
  const dispatch = useDispatch();
  
  const { currencyPair, systemEnvironment, asks, bids } = useSelector(
    (state) => state.orderBooks
  );
  const [isConnected, setIsConnected] = useState(false); 

  const webSocket = useRef(null);
  const asksRef = useRef(asks);
  const bidsRef = useRef(bids);
  const taskQueue = useRef(new TaskQueue(500)); // Intervals as to process a task ( can be adjusted)

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

    worker.onmessage = pushAsksAndBids;

    const connectWebSocket = () => {
      const webSocketUrl =
        systemEnvironment === SYSTEM_ENVIRONMENT.MAIN_NET
          ? COINBASE_SOCKET_URL
          : COINBASE_SANDBOX_SOCKET_URL;
      webSocket.current = new WebSocket(webSocketUrl);

      webSocket.current.onopen = () => {
        setIsConnected(true);
        if (webSocket.current.readyState === WebSocket.OPEN) {
          const message = getOrderBookSubMessage({
            currencyPair: currencyPair,
            environment: systemEnvironment,
          });
          webSocket.current.send(message);
        }
      };

      webSocket.current.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type === "match") {
          dispatch(updateTradeHistory(data));
        } else if (data.type === "snapshot") {
          taskQueue.current.addTask(() => {
            worker.postMessage(data);
          });
        } else if (data.type === "l2update") {
          taskQueue.current.addTask(() => {
            worker.postMessage({
              ...data,
              currentAsks: asksRef.current,
              currentBids: bidsRef.current,
            });
          });
        } else if (data.type === "ticker") {
          dispatch(setBestOrderBook(data));
        }
      };

      webSocket.current.onclose = () => {
        setIsConnected(false);
        console.log("WebSocket connection closed");
      };

      webSocket.current.onerror = (error) => {
        console.error("WebSocket error", error);
      };
    };

    const disconnectWebSocket = () => {
      if (webSocket.current) {
        if (webSocket.current.readyState === WebSocket.OPEN) {
          webSocket.current.send(getOrderBookUnSubMessage({ currencyPair }));
          console.log("Unsubscribed from", currencyPair);
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
