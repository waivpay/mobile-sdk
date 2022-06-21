export class OrderResponse {
    order_reference: string;
    status: string;
    total_cost: string;
    total_card_fees: string;
    gst: string;
    delivery_fee: string;
    error: string;
    hasError: boolean;
  
    constructor(order_reference: string, status: string, total_cost: string, total_card_fees: string, gst: string, delivery_fee: string, error: string, hasError: boolean) {
      this.order_reference = order_reference;
      this.status = status;
      this.total_cost = total_cost;
      this.error = error;
      this.hasError = hasError;
      this.total_card_fees = total_card_fees;
      this.gst = gst;
      this.delivery_fee = delivery_fee;
  
    }
  }
  