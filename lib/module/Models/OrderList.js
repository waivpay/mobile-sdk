function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

export class OrderList {
  constructor(orders) {
    _defineProperty(this, "orders", new Array());

    this.orders = orders;
  }

}
//# sourceMappingURL=OrderList.js.map