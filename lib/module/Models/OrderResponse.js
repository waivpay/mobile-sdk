function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

export class OrderResponse {
  constructor(order_reference, status, total_cost, total_card_fees, gst, delivery_fee, error, hasError) {
    _defineProperty(this, "order_reference", void 0);

    _defineProperty(this, "status", void 0);

    _defineProperty(this, "total_cost", void 0);

    _defineProperty(this, "total_card_fees", void 0);

    _defineProperty(this, "gst", void 0);

    _defineProperty(this, "delivery_fee", void 0);

    _defineProperty(this, "error", void 0);

    _defineProperty(this, "hasError", false);

    this.order_reference = order_reference;
    this.status = status;
    this.total_cost = total_cost;
    this.error = error;
    this.hasError = hasError;
    this.total_card_fees = total_card_fees;
    this.gst = gst;
    this.delivery_fee = delivery_fee;
  }

}
//# sourceMappingURL=OrderResponse.js.map