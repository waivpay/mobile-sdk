import type { BillingAddress } from "./BillingAddress";
import type { OrderItem } from "./OrderItem";
import type { RecipientAddress } from "./RecipientAddress";
export declare class Order {
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
    payment_method: string;
    session_identifier: string;
}
