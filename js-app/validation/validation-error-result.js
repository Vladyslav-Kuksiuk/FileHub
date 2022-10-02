export class ValidationErrorResult extends Error {
  errors = [];

  constructor(errors) {
    super();
    this.errors = errors;
  }
}
