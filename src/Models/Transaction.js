export class Transaction {
    description;
    date;
    amount;
    type;

     constructor(description, date, amount, type) { 
        this.description = description;
        this.date = date;
        this.amount = amount;
        this.type = type;
 
      }
   }