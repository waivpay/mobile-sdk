export class Store {
  name = '';
  description = '';
  location = '';
  website = '';
  contact_number = '';
  categories = [];

  constructor(data) {
    Object.assign(this, data);
  }
}
