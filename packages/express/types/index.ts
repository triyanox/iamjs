import { AuthError, IAuthManager, Roles, Schema, TAutorizeOptions } from '@iamjs/core';
import { NextFunction, Request, Response } from 'express';

/**
 * The options for the `onActivity` method
 */
type ActivityCallbackOptions<T extends Roles<T>, R extends Request = Request> = {
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
   * The request object
   */
  req?: R;
};

type TExpressCheckOptions<T extends Roles<T>> = Omit<TAutorizeOptions<T>, 'data'> &
  (
    | {
        data: (req: Request) => Promise<string | object>;
        construct: boolean;
      }
    | {
        role: keyof T;
      }
  );

/**
 * The interface for the `ExpressRoleManager` class
 * @extends IAuthManager
 */
interface IExpressRoleManager<T extends Roles<T>> extends IAuthManager<T> {
  /**
   * `AuthManager` schema
   */
  schema: Schema<T>;
  /**
   * The method that is used to authorize a request
   * ***********************************************************************************************
   * You can declaration merging to add the `role` or `data` keys to the `Request` interface
   * @see https://www.typescriptlang.org/docs/handbook/declaration-merging.html
   */
  check: <R extends Request, U extends Response>(
    options: TExpressCheckOptions<T>
  ) => (req: R, res: U, next: NextFunction) => void;
  /**
   * The method that is called when an error occurs
   */
  onError?: <R extends Request, U extends Response>(
    err: AuthError,
    req: R,
    res: U,
    next: NextFunction
  ) => void;
  /**
   * The method that is called when the authorization is successful
   */
  onSucess?: <R extends Request, U extends Response>(req: R, res: U, next: NextFunction) => void;
  /**
   * The method that is called when an activity is performed
   */
  onActivity?: <R extends Request>(options: ActivityCallbackOptions<T, R>) => Promise<void>;
}

/**
 * The options for the `ExpressRoleManager` class
 */
interface IExpressRoleManagerOptions<T extends Roles<T>> {
  /**
   * The schema that is used to authorize the request
   */
  schema: Schema<T>;
  /**
   * The method that is called when an error occurs
   */
  onError?: <R extends Request, U extends Response>(
    err: AuthError,
    req: R,
    res: U,
    next: NextFunction
  ) => void;
  /**
   * The method that is called when the authorization is successful
   */
  onSucess?: <R extends Request, U extends Response>(req: R, res: U, next: NextFunction) => void;
  /**
   * The method that is called when an activity is performed
   */
  onActivity?: <R extends Request>(options: ActivityCallbackOptions<T, R>) => Promise<void>;
}

export type {
  ActivityCallbackOptions,
  IExpressRoleManager,
  IExpressRoleManagerOptions,
  TExpressCheckOptions
};
