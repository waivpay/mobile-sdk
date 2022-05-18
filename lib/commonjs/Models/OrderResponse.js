"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OrderResponse = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class OrderResponse {
  constructor(order_reference, status, total_cost, error, hasError) {
    _defineProperty(this, "order_reference", void 0);

    _defineProperty(this, "status", void 0);

    _defineProperty(this, "total_cost", void 0);

    _defineProperty(this, "error", void 0);

    _defineProperty(this, "hasError", false);

    this.order_reference = order_reference;
    this.status = status;
    this.total_cost = total_cost;
    this.error = error;
    this.hasError = hasError;
  }

}

exports.OrderResponse = OrderResponse;
//# sourceMappingURL=OrderResponse.js.map