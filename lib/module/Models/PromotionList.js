function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
export class PromotionList {
  constructor(promotions) {
    _defineProperty(this, "promotions", new Array());
    this.promotions = promotions;
  }
}
//# sourceMappingURL=PromotionList.js.map