export class Brand {
    identifier;
    name;
    locations =new Array();
    terms_of_use;
    card_terms_and_conditions;

    constructor(identifier, name, locations, terms_of_use, card_terms_and_conditions) { 
       this.identifier = identifier;
       this.name = name;
       this.locations = locations;
       this.terms_of_use = terms_of_use;
       this.card_terms_and_conditions = card_terms_and_conditions;
     }
  }