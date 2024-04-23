export class Brand {
  identifier;
  name;
  iap_enabled;
  locations = new Array();
  terms_of_use;
  card_terms_and_conditions;
  tiles = new Array();;
  faqs;
  privacy_policy;
  profile_text;
  home_page_text;
  disable_parking_collection;

  constructor(identifier, iap_enabled,name, locations, terms_of_use, card_terms_and_conditions, tiles, faqs, profile_text, home_page_text, disable_parking_collection) {
    this.identifier = identifier;
    this.name = name;
    this.iap_enabled = iap_enabled;
    this.locations = locations;
    this.terms_of_use = terms_of_use;
    this.card_terms_and_conditions = card_terms_and_conditions;
    this.tiles = tiles;
    this.faqs = faqs;
    this.profile_text = profile_text;
    this.home_page_text = home_page_text;
    this.disable_parking_collection = disable_parking_collection;
  }
}
