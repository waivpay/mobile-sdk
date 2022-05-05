export class Product {
    id;
    name;
    active;
    digital;
    description;
    image;
    digital_fee;


    constructor(id, name, active, digital, description, image, digital_fee) { 
       this.id = id;
       this.name = name;
       this.active = active; 
       this.digital = digital;
       this.description = description;
       this.image = image;
       this.digital_fee = digital_fee;

     }
  }