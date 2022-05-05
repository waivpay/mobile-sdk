export class Order {
    email;
    phone_number;
    billing_same_address;
    recipient_address = new RecipientAddress();
    credit_card_number;
    credit_card_name;
    credit_card_expiry_month;
    credit_card_expiry_year;
    credit_card_security_code;
    billing_address = new BillingAddress();
    order_items = new Array();


    constructor(email, phone_number, billing_same_address, recipient_address, credit_card_number, credit_card_name, credit_card_expiry_month, credit_card_expiry_year, credit_card_security_code, billing_address, order_items) { 
       this.email = email;
       this.phone_number = phone_number;
       this.billing_same_address = billing_same_address; 
       this.recipient_address = recipient_address;
       this.credit_card_number = credit_card_number;
       this.credit_card_expiry_month = credit_card_expiry_month;
       this.credit_card_expiry_year = credit_card_expiry_year;
       this.credit_card_security_code = credit_card_security_code;
       this.billing_address = billing_address;
       this.credit_card_name = credit_card_name;
       this.order_items = order_items;

     }
  }