export class OrderResponse {
  order_reference;
  status;
  total_cost;
  total_card_fees;
  gst;
  delivery_fee;
  error;
  hasError = false;

  constructor(order_reference, status, total_cost, total_card_fees, gst, delivery_fee, error, hasError) {
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
