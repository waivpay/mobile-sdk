import type { Card } from "./Card";


export class CardList {
    cards: Card[];
  
    constructor(cards: Card[]) {
      this.cards = cards;
    }
  }
  