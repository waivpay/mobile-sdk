function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

export class Form_Schema_Item {
  constructor(id, type, label, hint, required, example_image, example_text) {
    _defineProperty(this, "id", void 0);

    _defineProperty(this, "type", void 0);

    _defineProperty(this, "label", void 0);

    _defineProperty(this, "hint", void 0);

    _defineProperty(this, "required", void 0);

    _defineProperty(this, "example_image", void 0);

    _defineProperty(this, "example_text", void 0);

    this.id = id;
    this.type = type;
    this.label = label;
    this.hint = hint;
    this.required = required;
    this.example_image = example_image;
    this.example_text = example_text;
  }

}
//# sourceMappingURL=Form_Schema_Item.js.map