export class Product {
  id;
  name;
  active;
  physical;
  digital;
  description;
  image;
  fee;
  digital_fee;
  minimum_card_value;
  maximum_card_value;


  constructor(id, name, active, physical, digital, description, image, fee,  digital_fee, minimum_card_value, maximum_card_value) {
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
