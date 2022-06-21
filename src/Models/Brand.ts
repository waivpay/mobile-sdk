import type { Location } from "./Location";
import type { Tile } from "./Tile";

export class Brand {
    identifier: string;
    name: string;
    iap_enabled: string;
    locations: Location[];
    terms_of_use: string;
    card_terms_and_conditions: string;
    tiles: Tile[];
    faqs: string;
  
    constructor(identifier: string, iap_enabled: string,name: string, locations: Location[], terms_of_use: string, card_terms_and_conditions: string, tiles: Tile[], faqs: string) {
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
  