"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Promotion = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Promotion {
  constructor(id, name, title, summary, tile_image, active, open, start_date, end_date, trackable, confirmable, external, country, form_schema) {
    let competition = arguments.length > 14 && arguments[14] !== undefined ? arguments[14] : false;
    let desktop_banner = arguments.length > 15 ? arguments[15] : undefined;
    let mobile_banner = arguments.length > 16 ? arguments[16] : undefined;
    let banner_background = arguments.length > 17 ? arguments[17] : undefined;
    let form_header_image = arguments.length > 18 ? arguments[18] : undefined;
    let products = arguments.length > 19 ? arguments[19] : undefined;
    let fulfilment_types = arguments.length > 20 ? arguments[20] : undefined;
    let disclaimer = arguments.length > 21 ? arguments[21] : undefined;
    let terms_and_conditions = arguments.length > 22 ? arguments[22] : undefined;
    let privacy_policy = arguments.length > 23 ? arguments[23] : undefined;
    let faqs = arguments.length > 24 ? arguments[24] : undefined;
    let support_email = arguments.length > 25 ? arguments[25] : undefined;
    let support_phone = arguments.length > 26 ? arguments[26] : undefined;
    let contact_us_content = arguments.length > 27 ? arguments[27] : undefined;
    let extra_claim_cta = arguments.length > 28 ? arguments[28] : undefined;
    let custom_tabs = arguments.length > 29 ? arguments[29] : undefined;
    let has_preparation_checks = arguments.length > 30 ? arguments[30] : undefined;
    let preparation_check_content = arguments.length > 31 ? arguments[31] : undefined;
    let preparation_checks = arguments.length > 32 ? arguments[32] : undefined;
    let has_support_categories = arguments.length > 33 ? arguments[33] : undefined;
    let support_categories = arguments.length > 34 ? arguments[34] : undefined;

    _defineProperty(this, "id", void 0);

    _defineProperty(this, "name", void 0);

    _defineProperty(this, "title", void 0);

    _defineProperty(this, "summary", void 0);

    _defineProperty(this, "tile_image", void 0);

    _defineProperty(this, "active", void 0);

    _defineProperty(this, "open", void 0);

    _defineProperty(this, "start_date", void 0);

    _defineProperty(this, "end_date", void 0);

    _defineProperty(this, "trackable", void 0);

    _defineProperty(this, "confirmable", void 0);

    _defineProperty(this, "external", void 0);

    _defineProperty(this, "country", void 0);

    _defineProperty(this, "form_schema", void 0);

    _defineProperty(this, "competition", false);

    _defineProperty(this, "desktop_banner", void 0);

    _defineProperty(this, "mobile_banner", void 0);

    _defineProperty(this, "banner_background", void 0);

    _defineProperty(this, "form_header_image", void 0);

    _defineProperty(this, "products", void 0);

    _defineProperty(this, "fulfilment_types", void 0);

    _defineProperty(this, "disclaimer", void 0);

    _defineProperty(this, "terms_and_conditions", void 0);

    _defineProperty(this, "privacy_policy", void 0);

    _defineProperty(this, "faqs", void 0);

    _defineProperty(this, "support_email", void 0);

    _defineProperty(this, "support_phone", void 0);

    _defineProperty(this, "contact_us_content", void 0);

    _defineProperty(this, "extra_claim_cta", void 0);

    _defineProperty(this, "custom_tabs", void 0);

    _defineProperty(this, "has_preparation_checks", void 0);

    _defineProperty(this, "preparation_check_content", void 0);

    _defineProperty(this, "preparation_checks", void 0);

    _defineProperty(this, "has_support_categories", void 0);

    _defineProperty(this, "support_categories", void 0);

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