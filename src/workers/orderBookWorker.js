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