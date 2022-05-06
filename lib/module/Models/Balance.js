function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

export class Balance {
  constructor(balance, expiry_date) {
    _defineProperty(this, "balance", void 0);

    _defineProperty(this, "expiry_date", void 0);

    this.balance = balance;
    this.expiry_date = expiry_date;
  }

}
//# sourceMappingURL=Balance.js.map