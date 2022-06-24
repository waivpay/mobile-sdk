function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

export class Order {
  constructor() {
    _defineProperty(this, "email", void 0);

    _defineProperty(this, "phone_number", void 0);

    _defineProperty(this, "user_id", void 0);

    _defineProperty(this, "validate", void 0);

    _defineProperty(this, "external_user_id", void 0);

    _defineProperty(this, "billing_same_address", void 0);

    _defineProperty(this, "recipient_address", void 0);

    _defineProperty(this, "credit_card_number", void 0);

    _defineProperty(this, "credit_card_name", void 0);

    _defineProperty(this, "credit_card_expiry_month", void 0);

    _defineProperty(this, "credit_card_expiry_year", void 0);

    _defineProperty(this, "credit_card_security_code", void 0);

    _defineProperty(this, "payment_token", void 0);

    _defineProperty(this, "billing_address", void 0);

    _defineProperty(this, "order_items", void 0);

    _defineProperty(this, "delivery_option_id", void 0);

    _defineProperty(this, "reference", void 0);

    _defineProperty(this, "created_at", void 0);

    _defineProperty(this, "total_cost", void 0);
  }

}
//# sourceMappingURL=Order.js.mapard_security_code", void 0);

    _defineProperty(this, "payment_token", void 0);

    _defineProperty(this, "billing_address", new BillingAddress());

    _defineProperty(this, "order_items", new Array());

    _defineProperty(this, "delivery_option_id", void 0);

    _defineProperty(this, "reference", void 0);

    _defineProperty(this, "created_at", void 0);

    _defineProperty(this, "total_cost", void 0);

    this.delivery_option_id = delivery_option_id;
    this.email = email;
    this.phone_number = phone_number;
    this.user_id = user_id;
    this.validate = validate;
    this.billing_same_address = billing_same_address;
    this.recipient_address = recipient_address;
    this.credit_card_number = credit_card_number;
    this.credit_card_expiry_month = credit_card_expiry_month;
    this.credit_card_expiry_year = credit_card_expiry_year;
    this.credit_card_security_code = credit_card_security_code;
    this.payment_token = payment_token;
    this.billing_address = billing_address;
    this.credit_card_name = credit_card_name;
    this.order_items = order_items;
    this.external_user_id = external_user_id;
    this.reference = reference;
    this.created_at = created_at;
    this.total_cost = total_cost;
  }

}
//# sourceMappingURL=Order.js.map