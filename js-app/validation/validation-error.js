export class ValidationError {
  name;
  message;

  constructor(name, message) {
    this.name = name;
    this.message = message;
  }
}
