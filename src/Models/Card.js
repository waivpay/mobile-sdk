export class Card {
  card_id;
  amount;
  delivery_email;
  delivery_sms_number;
  expiry_date;
  card_design_id;
  image;
  private_callback_url;
  private_token_id;
  created_at;
  type;
  status;


  constructor(card_id, amount, delivery_email, delivery_sms_number, expiry_date, card_design_id, image, private_callback_url, private_token_id, created_at, type, status) {
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
