function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

export class TransactionList {
  constructor(transactions) {
    _defineProperty(this, "transactions", new Array());

    this.transactions = transactions;
  }

}
//# sourceMappingURL=TransactionList.js.map