"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Balance = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Balance {
  constructor(balance, expiry_date) {
    _defineProperty(this, "balance", void 0);

    _defineProperty(this, "expiry_date", void 0);

    this.balance = balance;
    this.expiry_date = expiry_date;
  }

}

exports.Balance = Balance;
//# sourceMappingURL=Balance.js.map