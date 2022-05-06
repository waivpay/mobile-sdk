export class OrderResponse {
  order_reference;
  status;
  total_cost;

  constructor(order_reference, status, total_cost) {
    this.order_reference = order_reference;
    this.status = status;
    this.total_cost = total_cost;
  }
}
