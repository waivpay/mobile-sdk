export class OrderResponse {
    order_reference!: string;
    status!: string;
    total_cost!: string;
    total_card_fees!: string;
    gst!: string;
    delivery_fee!: string;
    error!: string;
    hasError!: boolean;
}
  