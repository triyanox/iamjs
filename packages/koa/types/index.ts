import { AuthError, IAuthManager, Roles, Schema, TAutorizeOptions } from '@iamjs/core';
import { Context, Next } from 'koa';

/**
 * The options for the `onActivity` method
 */
type ActivityCallbackOptions<T extends Roles<T>, C extends Context = Context> = {
  /**
   * The action or actions that are authorized to be executed on the resource
   */
  actions?: TAutorizeOptions<T>['actions'];
  /**
   * The resource or resources that are authorized to be accessed
   */
  resources?: TAutorizeOptions<T>['resources'];
  /**
   * The role that is used to authorize the request
   */
  role?: keyof T | 'constrcuted';
  /**
   * The permissions that are used to authorize the request
   */
  success?: boolean;
  /**
   * The context object
   */
  ctx?: C;
};

type TKoaCheckOptions<T extends Roles<T>> = Omit<TAutorizeOptions<T>, 'data'> &
  (
    | {
        data: (ctx: Context) => Promise<string | object>;
        construct: boolean;
      }
    | {
        role: keyof T;
      }
  );

/**
 * The interface for the `KoaRoleManager` class
 */
interface IKoaRoleManager<T extends Roles<T>> extends IAuthManager<T> {
  /**
   * `AuthManager` schema
   */
  schema: Schema<T>;
  /**
   * The method that is used to authorize a request
   */
  check: <C extends Context>(options: TKoaCheckOptions<T>) => (ctx: C, next: Next) => Promise<void>;
  /**
   * The method that is called when an error occurs
   */
  onError?: <C extends Context>(err: AuthError, ctx: C, next: Next) => void;
  /**
   * The method that is called when the authorization is successful
   */
  onSuccess?: <C extends Context>(ctx: C, next: Next) => void;
  /**
   * The method that is called when an activity is performed
   */
  onActivity?: <C extends Context>(options: ActivityCallbackOptions<T, C>) => Promise<void>;
}

/**
 * The options for the `KoaRoleManager` class
 */
interface IKoaRoleManagerOptions<T extends Roles<T>> {
  /**
   * The schema that is used to authorize the request
   */
  schema: Schema<T>;
  /**
   * The method that is called when an error occurs
   */
  onError?: <C extends Context>(err: AuthError, ctx: C, next: Next) => void;
  /**
   * The method that is called when the authorization is successful
   */
  onSuccess?: <C extends Context>(ctx: C, next: Next) => void;
  /**
   * The method that is called when an activity is performed
   */
  onActivity?: <C extends Context>(options: ActivityCallbackOptions<T, C>) => Promise<void>;
}

export type { ActivityCallbackOptions, IKoaRoleManager, IKoaRoleManagerOptions, TKoaCheckOptions };
