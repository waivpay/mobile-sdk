export class RecipientAddress {
  company_name;
  first_name;
  last_name;
  street_address;
  suburb;
  postcode;
  state;

  constructor(company_name, first_name, last_name, street_address, suburb, postcode, state) {
    this.company_name = company_name;
    this.first_name = first_name;
    this.last_name = last_name;
    this.street_address = street_address;
    this.suburb = suburb;
    this.postcode = postcode;
    this.state = state;
  }
}
