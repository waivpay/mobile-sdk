"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OrderList = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class OrderList {
  constructor(orders) {
    _defineProperty(this, "orders", new Array());

    this.orders = orders;
  }

}

exports.OrderList = OrderList;
//# sourceMappingURL=OrderList.js.map