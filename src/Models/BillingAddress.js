export class BillingAddress {
  company_name;
  street_address;
  suburb;
  postcode;
  state;
  first_name;
  last_name;

  constructor(company_name, suburb, postcode, state, first_name, last_name, street_address) {
    this.company_name = company_name;
    this.suburb = suburb;
    this.postcode = postcode;
    this.state = state;
    this.first_name = first_name;
    this.last_name = last_name;
    this.street_address = street_address;
  }
}
