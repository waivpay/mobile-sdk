export class BillingAddress {
   address_line_1;
   address_line_2;
   suburb;
   postcode;
   state;
   first_name;
   last_name;
   street_address;

    constructor(address_line_1, address_line_2, suburb, postcode, state, first_name, last_name, street_address) { 
      this.address_line_1 = address_line_1;
      this.address_line_2 = address_line_2;
      this.suburb = suburb; 
      this.postcode = postcode;
      this.state = state;
      this.first_name = first_name;
      this.last_name =last_name;
      this.street_address = street_address;
     }
  }