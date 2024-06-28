// src/workers/orderBookWorker.js

self.onmessage = function (e) {
  const { newMessage, asks, bids } = e.data;

  let updatedAsks = new Map();
  let updatedBids = new Map();

  // console.log('Asks:', asks, 'Bids:', bids);

  if (newMessage.type === "open" || newMessage.type === "filled") {
    if (newMessage.side === "buy") {
      updatedAsks = appendAsks(asks, newMessage);
    } else if (newMessage.side === 'sell') {
      updatedBids = appendBids(bids, newMessage);
    }
  } else if (newMessage.type === "done") {
    if (newMessage.maker_side === "buy") {
      if (asks.delete(newMessage.order_id)) {
        updatedAsks = appendAsks(asks);
      }
    } else if (newMessage.maker_side === 'sell') {
      if (bids.delete(newMessage.order_id)) {
        updatedBids = appendBids(bids);
      }
    }
  }
  // console.log('updatedAsks:', updatedAsks, 'updatedBids:', updatedBids);

  // Send the result back to the main thread
  self.postMessage({ asks: updatedAsks, bids: updatedBids });
};

