import { HTTP_STATUS } from "../utils/httpStatus";

export class ConflictError extends Error {
  public readonly statusCode = HTTP_STATUS.CONFLICT;

  constructor(message: string = "Conflict") {
    super(message);
    this.name = 'ConflictError';
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}
