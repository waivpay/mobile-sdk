export class Product {
  id;
  name;
  active;
  digital;
  description;
  image;
  digital_fee;
  minimum_card_value;
  maximum_card_value;


  constructor(id, name, active, digital, description, image, digital_fee, minimum_card_value, maximum_card_value) {
    this.id = id;
    this.name = name;
    this.active = active;
    this.digital = digital;
    this.description = description;
    this.image = image;
    this.digital_fee = digital_fee;
    this.minimum_card_value = minimum_card_value;
    this.maximum_card_value = maximum_card_value;

  }
}
