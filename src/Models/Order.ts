import type { BillingAddress } from "./BillingAddress";
import type { OrderItem } from "./OrderItem";
import type { RecipientAddress } from "./RecipientAddress";


export class Order {
  email: string;
  phone_number: string;
  user_id: string;
  validate: boolean;
  external_user_id: string;
  billing_same_address: boolean;
  recipient_address: RecipientAddress;
  credit_card_number: string;
  credit_card_name: string;
  credit_card_expiry_month: string;
  credit_card_expiry_year: string;
  credit_card_security_code: string;
  payment_token: string;
  billing_address: BillingAddress;
  order_items: OrderItem[];
  delivery_option_id: number;
  reference: string;
  created_at: string;
  total_cost: string;


  constructor(  email: string,
    phone_number: string,
    user_id: string,
    validate: boolean,
    external_user_id: string,
    billing_same_address: boolean,
    recipient_address: RecipientAddress,
    credit_card_number: string,
    credit_card_name: string,
    credit_card_expiry_month: string,
    credit_card_expiry_year: string,
    credit_card_security_code: string,
    payment_token: string,
    billing_address: BillingAddress,
    order_items :OrderItem[],
    delivery_option_id: number,
    reference: string,
    created_at: string,
    total_cost: string) {
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
