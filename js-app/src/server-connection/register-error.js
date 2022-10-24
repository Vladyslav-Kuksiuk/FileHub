export class RegisterError extends Error{
  errors = []

  constructor(errors) {
    super();
    this.errors = errors;
  }
}
