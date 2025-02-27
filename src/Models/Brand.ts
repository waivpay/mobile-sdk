import type { Location } from "./Location";
import type { Tile } from "./Tile";

export class Brand {
    identifier!: string;
    name!: string;
    iap_enabled!: string;
    locations!: Location[];
    terms_of_use!: string;
    card_terms_and_conditions!: string;
    tiles!: Tile[];
    faqs!: string;
    privacy_policy!: string;
    profile_text!: string;
    home_page_text!: string;
    disable_parking_collection!: boolean;
  }
