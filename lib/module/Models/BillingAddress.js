function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

export class BillingAddress {
  constructor(company_name, suburb, postcode, state, first_name, last_name, street_address) {
    _defineProperty(this, "company_name", void 0);

    _defineProperty(this, "street_address", void 0);

    _defineProperty(this, "suburb", void 0);

    _defineProperty(this, "postcode", void 0);

    _defineProperty(this, "state", void 0);

    _defineProperty(this, "first_name", void 0);

    _defineProperty(this, "last_name", void 0);

    this.company_name = company_name;
    this.suburb = suburb;
    this.postcode = postcode;
    this.state = state;
    this.first_name = first_name;
    this.last_name = last_name;
    this.street_address = street_address;
  }

}
//# sourceMappingURL=BillingAddress.js.map