import type { Order } from "./Order";


export class OrderList {
    orders: Order[];
  
    constructor(orders:Order[]) {
      this.orders = orders;
    }
  }