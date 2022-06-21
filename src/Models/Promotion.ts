import type { Form_Schema_Item } from "./Form_Schema_Item";

export class Promotion {
    id: number;
    name: string;
    title: string;
    summary: string;
    tile_image: string;
    active: boolean;
    open: boolean;
    start_date: string;
    end_date: string;
    trackable: boolean;
    confirmable: boolean;
    external: boolean;
    country: string;
    form_schema: Form_Schema_Item[];
    competition = false;
    desktop_banner: string;
    mobile_banner: string;
    banner_background: string;
    form_header_image: string;
    products: string[];
    fulfilment_types: string[];
    disclaimer: string;
    terms_and_conditions: string;
    privacy_policy: string;
    faqs:string;
    support_email: string;
    support_phone: string;
    contact_us_content: string;
    extra_claim_cta: boolean;
    custom_tabs: string[];
    has_preparation_checks: boolean;
    preparation_check_content: string;
    preparation_checks: string[];
    has_support_categories: boolean;
    support_categories: string[];

    constructor(id: number,
        name: string,
        title: string,
        summary: string,
        tile_image: string,
        active: boolean,
        open: boolean,
        start_date: string,
        end_date: string,
        trackable: boolean,
        confirmable: boolean,
        external: boolean,
        country: string,
        form_schema: Form_Schema_Item[],
        competition = false,
        desktop_banner: string,
        mobile_banner: string,
        banner_background: string,
        form_header_image: string,
        products: string[],
        fulfilment_types: string[],
        disclaimer: string,
        terms_and_conditions: string,
        privacy_policy: string,
        faqs:string,
        support_email: string,
        support_phone: string,
        contact_us_content: string,
        extra_claim_cta: boolean,
        custom_tabs: string[],
        has_preparation_checks: boolean,
        preparation_check_content: string,
        preparation_checks: string[],
        has_support_categories: boolean,
        support_categories: string[]) {
            this.id = id;
            this.name = name;
            this.title = title;
            this.summary = summary;
            this.tile_image = tile_image;
            this.active = active;
            this.open = open;
            this.start_date = start_date;
            this.end_date = end_date;
            this.trackable = trackable;
            this.confirmable = confirmable;
            this.external = external;
            this.country = country;
            this.form_schema = form_schema;
            this.competition = competition;
            this.desktop_banner = desktop_banner;
            this.mobile_banner = mobile_banner;
            this.banner_background = banner_background;
            this.form_header_image = form_header_image;
            this.products = products;
            this.fulfilment_types = fulfilment_types;
            this.disclaimer = disclaimer;
            this.terms_and_conditions = terms_and_conditions;
            this.privacy_policy = privacy_policy;
            this.faqs = faqs;
            this.support_email = support_email;
            this.support_phone = support_phone;
            this.contact_us_content = contact_us_content;
            this.extra_claim_cta = extra_claim_cta;
            this.custom_tabs = custom_tabs;
            this.has_preparation_checks = has_preparation_checks;
            this.preparation_check_content = preparation_check_content;
            this.preparation_checks = preparation_checks;
            this.has_support_categories = has_support_categories;
            this.support_categories = support_categories;
    }
  }