export class Product {
    id: number;
    name: string;
    active: boolean;
    physical: boolean;
    digital: boolean;
    description: string;
    image: string;
    fee: string;
    digital_fee: string;
    minimum_card_value:string;
    maximum_card_value: string;
  
  
    constructor(id: number,
        name: string,
        active: boolean,
        physical: boolean,
        digital: boolean,
        description: string,
        image: string,
        fee: string,
        digital_fee: string,
        minimum_card_value:string,
        maximum_card_value: string) {
      this.id = id;
      this.name = name;
      this.active = active;
      this.physical = physical;
      this.digital = digital;
      this.description = description;
      this.image = image;
      this.fee = fee;
      this.digital_fee = digital_fee;
      this.minimum_card_value = minimum_card_value;
      this.maximum_card_value = maximum_card_value;
  
    }
  }
  