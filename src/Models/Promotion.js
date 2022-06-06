export class Promotion {
    id;
    name;
    title;
    summary;
    tile_image;
    active = false;
    open = false;
    start_date;
    end_date;
    trackable = false;
    confirmable = false;
    external = false;
    country;
    form_schema = new Array();
    competition = false;
    desktop_banner;
    mobile_banner;
    banner_background;
    form_header_image;
    products = new Array();
    fulfilment_types = new Array();
    disclaimer;
    terms_and_conditions;
    privacy_policy;
    faqs;
    support_email;
    support_phone;
    contact_us_content;
    extra_claim_cta = false;
    custom_tabs = new Array();
    has_preparation_checks = false;
    preparation_check_content;
    preparation_checks = new Array();
    has_support_categories = false;
    support_categories = new Array();

    constructor(id, 
        name, 
        title,
        summary,
        tile_image, 
        active, 
        open,
        start_date,
        end_date,
        trackable,
        confirmable,
        external,
        country,
        form_schema, 
        competition,
        desktop_banner,
        mobile_banner,
        banner_background,
        form_header_image,
        products,
        fulfilment_types,
        disclaimer,
        terms_and_conditions,
        privacy_policy,
        faqs,
        support_email,
        support_phone,
        contact_us_content, 
        extra_claim_cta,
        custom_tabs,
        has_preparation_checks,
        preparation_check_content,
        preparation_checks,
        has_support_categories,
        support_categories) {
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