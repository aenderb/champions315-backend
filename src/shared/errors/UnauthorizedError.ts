import { HTTP_STATUS } from "../utils/httpStatus";

export class UnauthorizedError extends Error {
  public readonly statusCode = HTTP_STATUS.UNAUTHORIZED;

  constructor(message: string = "Unauthorized") {
    super(message);
    this.name = 'UnauthorizedError';
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}
