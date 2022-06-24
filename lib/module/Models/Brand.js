function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

export class Brand {
  constructor(identifier, iap_enabled, name, locations, terms_of_use, card_terms_and_conditions, tiles, faqs) {
    _defineProperty(this, "identifier", void 0);

    _defineProperty(this, "name", void 0);

    _defineProperty(this, "iap_enabled", void 0);

    _defineProperty(this, "locations", void 0);

    _defineProperty(this, "terms_of_use", void 0);

    _defineProperty(this, "card_terms_and_conditions", void 0);

    _defineProperty(this, "tiles", void 0);

    _defineProperty(this, "faqs", void 0);

    this.identifier = identifier;
    this.name = name;
    this.iap_enabled = iap_enabled;
    this.locations = locations;
    this.terms_of_use = terms_of_use;
    this.card_terms_and_conditions = card_terms_and_conditions;
    this.tiles = tiles;
    this.faqs = faqs;
  }

}
//# sourceMappingURL=Brand.js.mapand.js.map