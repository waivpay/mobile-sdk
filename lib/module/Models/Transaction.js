function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

export class Transaction {
  constructor(description, date, amount, type) {
    _defineProperty(this, "description", void 0);

    _defineProperty(this, "date", void 0);

    _defineProperty(this, "amount", void 0);

    _defineProperty(this, "type", void 0);

    this.description = description;
    this.date = date;
    this.amount = amount;
    this.type = type;
  }

}
//# sourceMappingURL=Transaction.js.map