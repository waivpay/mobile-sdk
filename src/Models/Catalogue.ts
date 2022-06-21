import type { Product } from "./Product";


export class Catalogue {
    products: Product[];
  
    constructor(products: Product[]) {
      this.products = products;
    }
  }
  