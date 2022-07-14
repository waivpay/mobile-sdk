export class ErrorResponse {
  error;
  error_detail = new Array();;

  constructor(error, error_detail) {
    this.error = error;
    this.error_detail = error_detail;
  }
}
