function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

export class Product {
  constructor(id, name, active, physical, digital, description, image, fee, digital_fee, minimum_card_value, maximum_card_value) {
    _defineProperty(this, "id", void 0);

    _defineProperty(this, "name", void 0);

    _defineProperty(this, "active", void 0);

    _defineProperty(this, "physical", void 0);

    _defineProperty(this, "digital", void 0);

    _defineProperty(this, "description", void 0);

    _defineProperty(this, "image", void 0);

    _defineProperty(this, "fee", void 0);

    _defineProperty(this, "digital_fee", void 0);

    _defineProperty(this, "minimum_card_value", void 0);

    _defineProperty(this, "maximum_card_value", void 0);

    this.id = id;
    this.name = name;
    this.active = active;
    this.physical = physical;
    this.digital = digital;
    this.description = description;
    this.image = image;
    this.fee = fee;
    this.digital_fee = digital_fee;
    this.minimum_card_value = minimum_card_value;
    this.maximum_card_value = maximum_card_value;
  }

}
//# sourceMappingURL=Product.js.map