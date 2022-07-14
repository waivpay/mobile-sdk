export class ErrorDetail {
  field;
  description = new Array();

  constructor(field, description) {
    this.field = field;
    this.description = description;
  }
}
