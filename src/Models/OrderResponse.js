export class OrderResponse {
  order_reference;
  status;
  total_cost;
  error;
  hasError = false;

  constructor(order_reference, status, total_cost, error, hasError) {
    this.order_reference = order_reference;
    this.status = status;
    this.total_cost = total_cost;
    this.error = error;
    this.hasError = hasError;
  }
}
