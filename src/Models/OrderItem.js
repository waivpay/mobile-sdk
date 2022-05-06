export class OrderItem {
    card_design_id;
    card_type;
    amount;
    quantity;
    delivery_sms_number;
    delivery_email;
    message;
    to;
    from;
    scheduled_time;

    constructor(card_design_id, card_type, amount, quantity, delivery_sms_number, delivery_email, message, to, from, scheduled_time) { 
       this.card_design_id = card_design_id;
       this.card_type = card_type;
       this.amount = amount; 
       this.quantity = quantity;
       this.delivery_sms_number = delivery_sms_number;
       this.delivery_email = delivery_email;
       this.message =message;
       this.to = to;
       this.from = from;
       this.scheduled_time = scheduled_time;

     }
  }