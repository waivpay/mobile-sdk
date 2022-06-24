function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

export class Catalogue {
  constructor(products) {
    _defineProperty(this, "products", void 0);

    this.products = products;
  }

}
//# sourceMappingURL=Catalogue.js.maps.map