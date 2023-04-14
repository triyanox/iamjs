import { Context, Next } from "koa";
import { AuthError, IAuthManager, IRole, permission } from "@iamjs/core/lib";

/**
 * The interface for the `authorize` function
 */
interface IKoaAutorizeOptions {
  /**
   * The key that is used to get the role from the request object
   * @default 'role'
   */
  roleKey?: string;
  /**
   * The action or actions that are authorized to be executed on the resource
   */
  action?: permission | permission[];
  /**
   * The resource or resources that are authorized to be accessed
   */
  resource: string | string[];
  /**
   * If the permissions are used from the request object
   * @default false
   */
  usePermissionKey?: boolean;
  /**
   * The key that is used to get the permissions from the request object
   * @default 'permissions'
   */
  permissionsKey?: string;
  /**
   * If the permissions should be checked in a loose way
   * @default false
   */
  loose?: boolean;
}

/**
 * The interface for the `KoaRoleManager` class
 * @extends IAuthManager
 */
interface IKoaRoleManager extends IAuthManager {
  /**
   * The function that is used to authorize a request
   */
  authorize: <T extends Context>(
    options: IKoaAutorizeOptions
  ) => (ctx: T, next: Next) => Promise<void> | void;
  onError?: <T extends Context>(
    err: AuthError,
    ctx: T,
    next: Next
  ) => Promise<void> | void;
  onSucess?: <T extends Context>(ctx: T, next: Next) => Promise<void> | void;
}

/**
 * The options for the `KoaRoleManager` class
 */
interface IKoaRoleManagerOptions {
  /**
   * The roles that are used for authorization
   */
  roles: { [key: string]: IRole };
  /**
   * The resources that are available to the `ExpressRoleManager` instance
   * @default []
   */
  resources: string[];
  /**
   * The function that is called when an error occurs
   */
  onError?: <T extends Context>(
    err: AuthError,
    ctx: T,
    next: Next
  ) => Promise<void> | void;
  /**
   * The function that is called when the authorization is successful
   */
  onSucess?: <T extends Context>(ctx: T, next: Next) => Promise<void> | void;
}

export type { IKoaAutorizeOptions, IKoaRoleManager, IKoaRoleManagerOptions };
