export class OrderItem {
  card_design_id;
  card_type;
  amount;
  quantity;
  delivery_sms_number;
  delivery_email;
  include_message;
  message;
  to;
  delivery_first_name;
  delivery_last_name;
  from;
  scheduled_time;

  constructor(card_design_id, card_type, amount, quantity, delivery_sms_number, delivery_email, include_message, message, to, delivery_first_name, delivery_last_name, from, scheduled_time) {
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
  }
}
