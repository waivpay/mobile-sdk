import type { Location } from "./Location";
import type { Tile } from "./Tile";
export declare class Brand {
    identifier: string;
    name: string;
    iap_enabled: string;
    locations: Location[];
    terms_of_use: string;
    card_terms_and_conditions: string;
    tiles: Tile[];
    faqs: string;
    profile_text: string;
}
