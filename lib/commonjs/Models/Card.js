"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Card = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Card {
  constructor(card_id, amount, delivery_email, delivery_sms_number, expiry_date, card_design_id, image, private_callback_url, private_token_id, created_at, type, status) {
    _defineProperty(this, "card_id", void 0);

    _defineProperty(this, "amount", void 0);

    _defineProperty(this, "delivery_email", void 0);

    _defineProperty(this, "delivery_sms_number", void 0);

    _defineProperty(this, "expiry_date", void 0);

    _defineProperty(this, "card_design_id", void 0);

    _defineProperty(this, "image", void 0);

    _defineProperty(this, "private_callback_url", void 0);

    _defineProperty(this, "private_token_id", void 0);

    _defineProperty(this, "created_at", void 0);

    _defineProperty(this, "type", void 0);

    _defineProperty(this, "status", void 0);

    this.card_id = card_id;
    this.amount = amount;
    this.delivery_email = delivery_email;
    this.delivery_sms_number = delivery_sms_number;
    this.card_design_id = card_design_id;
    this.image = image;
    this.expiry_date = expiry_date;
    this.private_callback_url = private_callback_url;
    this.private_token_id = private_token_id;
    this.created_at = created_at;
    this.type = type;
    this.status = status;
  }

}

exports.Card = Card;
//# sourceMappingURL=Card.js.map