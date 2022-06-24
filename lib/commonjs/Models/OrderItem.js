"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OrderItem = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class OrderItem {
  constructor(card_design_id, card_type, amount, quantity, delivery_sms_number, delivery_email, include_message, message, to, delivery_first_name, delivery_last_name, from, scheduled_time, card_fee, card_image) {
    _defineProperty(this, "card_design_id", void 0);

    _defineProperty(this, "card_type", void 0);

    _defineProperty(this, "amount", void 0);

    _defineProperty(this, "quantity", void 0);

    _defineProperty(this, "delivery_sms_number", void 0);

    _defineProperty(this, "delivery_email", void 0);

    _defineProperty(this, "include_message", void 0);

    _defineProperty(this, "message", void 0);

    _defineProperty(this, "to", void 0);

    _defineProperty(this, "delivery_first_name", void 0);

    _defineProperty(this, "delivery_last_name", void 0);

    _defineProperty(this, "from", void 0);

    _defineProperty(this, "scheduled_time", void 0);

    _defineProperty(this, "card_fee", void 0);

    _defineProperty(this, "card_image", void 0);

    this.card_design_id = card_design_id;
    this.card_type = card_type;
    this.amount = amount;
    this.quantity = quantity;
    this.delivery_sms_number = delivery_sms_number;
    this.delivery_email = delivery_email;
    this.include_message = include_message;
    this.message = message;
    this.to = to;
    this.delivery_first_name = delivery_first_name;
    this.delivery_last_name = delivery_last_name;
    this.from = from;
    this.scheduled_time = scheduled_time;
    this.card_fee = card_fee;
    this.card_image = card_image;
  }

}

exports.OrderItem = OrderItem;
//# sourceMappingURL=OrderItem.js.map