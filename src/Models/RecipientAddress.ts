export class RecipientAddress {
    company_name: string;
    first_name: string;
    last_name: string;
    street_address: string;
    suburb: string;
    postcode: string;
    state: string;
  
    constructor(company_name:string, first_name:string, last_name:string, street_address:string, suburb:string, postcode:string, state:string) {
      this.company_name = company_name;
      this.first_name = first_name;
      this.last_name = last_name;
      this.street_address = street_address;
      this.suburb = suburb;
      this.postcode = postcode;
      this.state = state;
    }
  }
  