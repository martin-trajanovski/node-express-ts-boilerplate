export class HttpException extends Error {
  public status: number;
  public message: string;
  public data: {};
  constructor(status: number, message: string, data: {} = {}) {
    super(message);
    this.status = status;
    this.message = message;
    this.data = data;
  }
}
