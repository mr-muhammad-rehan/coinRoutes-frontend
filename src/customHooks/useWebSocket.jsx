import { useEffect, useRef, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getOrderBookSubMessage, getOrderBookUnSubMessage } from "../utils";
import { COINBASE_SOCKET_URL } from "../config";
import { setOrderBook } from "../store/actions/orderBookActions";

import Worker from "../workers/orderBookWorker?worker";

function appendAsks(asks, newMessage) {
  const updatedAsks = new Map(asks);
  updatedAsks.set(newMessage.order_id, newMessage);
  return updatedAsks;
}

const useWebSocket = () => {
  const dispatch = useDispatch();
  const { currencyPair, asks, bids } = useSelector((state) => state.orderBooks);
  const [isConnected, setIsConnected] = useState(false);

  const webSocket = useRef(null);
  let count = 0;

  useEffect(() => {
    const worker = new Worker();

    // worker.onmessage = function (e) {
    //   // console.log("Main thread received result from worker:", e.data);
    //   dispatch(setOrderBook({ bids: e.data.bids, asks: e.data.asks }));
    // };

    const connectWebSocket = () => {
      webSocket.current = new WebSocket(COINBASE_SOCKET_URL);

      webSocket.current.onopen = () => {
        setIsConnected(true);
        if (webSocket.current.readyState === WebSocket.OPEN) {
          webSocket.current.send(getOrderBookSubMessage({ currencyPair }));
        }
      };

      webSocket.current.onmessage = (event) => {
        const newMessage = JSON.parse(event.data);

        if (newMessage.type === "open" || newMessage.type === "filled") {
          if (newMessage.side === "buy") {
            updatedAsks = appendAsks(asks, newMessage);
          } else if (newMessage.side === "sell") {
            updatedBids = appendBids(bids, newMessage);
          }
        } else if (newMessage.type === "done") {
          if (newMessage.maker_side === "buy") {
            if (asks.delete(newMessage.order_id)) {
              updatedAsks = appendAsks(asks);
            }
          } else if (newMessage.maker_side === "sell") {
            if (bids.delete(newMessage.order_id)) {
              updatedBids = appendBids(bids);
            }
          }
        }

        dispatch(setOrderBook({ bids: updatedAsks, asks: updatedBids }));

        count++;
        if (count > 50) {
          disconnectWebSocket();
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
        webSocket.current.close();
      }
    };

    // Initial connection
    connectWebSocket();

    return () => {
      disconnectWebSocket();
      worker.terminate(); // Clean up the worker when the component unmounts
    };
  }, [currencyPair, dispatch]);

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
