import type { Transaction } from "./Transaction";

export class TransactionList {
    transactions: Transaction[];
  
    constructor(transactions: Transaction[]) {
      this.transactions = transactions;
    }
  }
  