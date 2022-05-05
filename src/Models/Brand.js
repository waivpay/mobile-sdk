export class Brand {
    identifier;
    name;
    locations =new Array();
    terms_of_use;

    constructor(identifier, name, locations, terms_of_use) { 
       this.identifier = identifier;
       this.name = name;
       this.locations = locations;
       this.terms_of_use = terms_of_use;
     }
  }