export class Card {
    card_id: string;
    amount: number;
    delivery_email: string;
    delivery_sms_number: string;
    expiry_date: string;
    card_design_id: number;
    image: string;
    private_callback_url: string;
    private_token_id: string;
    created_at: string;
    type: string;
    status: string;
  
  
    constructor(card_id:string, amount:number, delivery_email:string, delivery_sms_number:string, expiry_date:string, card_design_id:number, image:string, private_callback_url:string, private_token_id:string, created_at:string, type:string, status:string) {
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
  