export class Store {
  name: string = '';
  description: string = '';
  location: string = '';
  website: string = '';
  contact_number: string = '';
  categories: string[] = [];

  constructor(data: Store) {
    Object.assign(this, data);
  }
}
