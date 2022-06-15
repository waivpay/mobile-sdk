"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Promotion = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Promotion {
  constructor(id, name, title, summary, tile_image, active, open, start_date, end_date, trackable, confirmable, external, country, form_schema, competition, desktop_banner, mobile_banner, banner_background, form_header_image, products, fulfilment_types, disclaimer, terms_and_conditions, privacy_policy, faqs, support_email, support_phone, contact_us_content, extra_claim_cta, custom_tabs, has_preparation_checks, preparation_check_content, preparation_checks, has_support_categories, support_categories) {
    _defineProperty(this, "id", void 0);

    _defineProperty(this, "name", void 0);

    _defineProperty(this, "title", void 0);

    _defineProperty(this, "summary", void 0);

    _defineProperty(this, "tile_image", void 0);

    _defineProperty(this, "active", false);

    _defineProperty(this, "open", false);

    _defineProperty(this, "start_date", void 0);

    _defineProperty(this, "end_date", void 0);

    _defineProperty(this, "trackable", false);

    _defineProperty(this, "confirmable", false);

    _defineProperty(this, "external", false);

    _defineProperty(this, "country", void 0);

    _defineProperty(this, "form_schema", new Array());

    _defineProperty(this, "competition", false);

    _defineProperty(this, "desktop_banner", void 0);

    _defineProperty(this, "mobile_banner", void 0);

    _defineProperty(this, "banner_background", void 0);

    _defineProperty(this, "form_header_image", void 0);

    _defineProperty(this, "products", new Array());

    _defineProperty(this, "fulfilment_types", new Array());

    _defineProperty(this, "disclaimer", void 0);

    _defineProperty(this, "terms_and_conditions", void 0);

    _defineProperty(this, "privacy_policy", void 0);

    _defineProperty(this, "faqs", void 0);

    _defineProperty(this, "support_email", void 0);

    _defineProperty(this, "support_phone", void 0);

    _defineProperty(this, "contact_us_content", void 0);

    _defineProperty(this, "extra_claim_cta", false);

    _defineProperty(this, "custom_tabs", new Array());

    _defineProperty(this, "has_preparation_checks", false);

    _defineProperty(this, "preparation_check_content", void 0);

    _defineProperty(this, "preparation_checks", new Array());

    _defineProperty(this, "has_support_categories", false);

    _defineProperty(this, "support_categories", new Array());

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

exports.Promotion = Promotion;
//# sourceMappingURL=Promotion.js.map