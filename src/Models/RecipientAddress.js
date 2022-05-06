export class RecipientAddress {
  address_line_1;
  address_line_2;
  suburb;
  postcode;
  state;

  constructor(address_line_1, address_line_2, suburb, postcode, state) {
    this.address_line_1 = address_line_1;
    this.address_line_2 = address_line_2;
    this.suburb = suburb;
    this.postcode = postcode;
    this.state = state;
  }
}
