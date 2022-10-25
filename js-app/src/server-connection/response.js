export class Response {
  status;
  body;

  constructor(status, body) {
    this.status = status;
    this.body = body;
  }
}
