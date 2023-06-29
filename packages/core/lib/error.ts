import { AuthErrorCodes } from '../types';

/**
 * The error class for the `AuthManager`
 */
export default class AuthError extends Error {
  constructor(public code: AuthErrorCodes) {
    super(code);
  }

  public static throw_error(code: AuthErrorCodes): never {
    throw new AuthError(code);
  }

  public static throw_unknown_error(error: any): never {
    throw Error(error);
  }
}
