export class OrderItem {
    card_design_id;
    card_type;
    amount;
    quantity;
    delivery_sms_number;
    delivery_email;
    message;

    constructor(card_design_id, card_type, amount, quantity, delivery_sms_number, delivery_email, message) { 
       this.card_design_id = card_design_id;
       this.card_type = card_type;
       this.amount = amount; 
       this.quantity = quantity;
       this.delivery_sms_number = delivery_sms_number;
       this.delivery_email = delivery_email;
       this.message =message;

     }
  }