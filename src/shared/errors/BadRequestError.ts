import { HTTP_STATUS } from "../utils/httpStatus";

export class BadRequestError extends Error {
  public readonly statusCode = HTTP_STATUS.BAD_REQUEST;

  constructor(message: string) {
    super(message);
    this.name = 'BadRequestError';
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}
