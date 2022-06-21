export class OrderItem {
    card_design_id: number;
    card_type: string;
    amount: number;
    quantity: number;
    delivery_sms_number: string;
    delivery_email: string;
    include_message: boolean;
    message: string;
    to: string;
    delivery_first_name: string;
    delivery_last_name: string;
    from: string;
    scheduled_time: string;
    card_fee: string;
    card_image: string;
  
  
    constructor(card_design_id: number,
        card_type: string,
        amount: number,
        quantity: number,
        delivery_sms_number: string,
        delivery_email: string,
        include_message: boolean,
        message: string,
        to: string,
        delivery_first_name: string,
        delivery_last_name: string,
        from: string,
        scheduled_time: string,
        card_fee: string,
        card_image: string) {
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
  