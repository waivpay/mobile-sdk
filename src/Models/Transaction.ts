export class Transaction {
    description: string;
    date: string;
    amount: number;
    type: string;
  
    constructor(description: string, date: string, amount: number, type: string) {
      this.description = description;
      this.date = date;
      this.amount = amount;
      this.type = type;
    }
  }
  