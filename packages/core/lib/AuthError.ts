import { ErrorCodes } from '../types';

/**
 * The error class for the `AuthManager`
 */
export default class AuthError extends Error {
  code: ErrorCodes;
  constructor(code: ErrorCodes) {
    super(code);
    this.code = code;
  }

  public static throw_error(code: ErrorCodes): never {
    throw new AuthError(code);
  }

  public static throw_unknown_error(error: any): never {
    throw Error(error);
  }
}
