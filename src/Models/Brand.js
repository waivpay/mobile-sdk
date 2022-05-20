export class Brand {
  identifier;
  name;
  iap_enabled;
  locations = new Array();
  terms_of_use;
  card_terms_and_conditions;
  tiles = new Array();;
  faqs;

  constructor(identifier, iap_enabled,name, locations, terms_of_use, card_terms_and_conditions, tiles, faqs) {
    this.identifier = identifier;
    this.name = name;
    this.iap_enabled = iap_enabled;
    this.locations = locations;
    this.terms_of_use = terms_of_use;
    this.card_terms_and_conditions = card_terms_and_conditions;
    this.tiles = tiles;
    this.faqs = faqs;
  }
}
