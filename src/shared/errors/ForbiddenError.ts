import { HTTP_STATUS } from "../utils/httpStatus";

export class ForbiddenError extends Error {
  public readonly statusCode = HTTP_STATUS.FORBIDDEN;

  constructor(message: string = "Forbidden") {
    super(message);
    this.name = 'ForbiddenError';
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}
