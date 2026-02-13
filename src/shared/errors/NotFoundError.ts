import { HTTP_STATUS } from "../utils/httpStatus";

export class NotFoundError extends Error {
  public readonly statusCode = HTTP_STATUS.NOT_FOUND;

  constructor(message: string = "Resource not found") {
    super(message);
    this.name = 'NotFoundError';
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}
