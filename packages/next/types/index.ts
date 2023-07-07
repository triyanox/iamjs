import { AuthError, IAuthManager, Roles, Schema, TAutorizeOptions } from '@iamjs/core';
import { NextApiRequest, NextApiResponse } from 'next';

/**
 * The options for the `onActivity` method
 */
type ActivityCallbackOptions<T extends Roles<T>, R extends NextApiRequest = NextApiRequest> = {
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

type TNextCheckOptions<T extends Roles<T>> = Omit<TAutorizeOptions<T>, 'data'> &
  (
    | {
        data: (req: NextApiRequest) => Promise<string | object>;
        construct: boolean;
      }
    | {
        role: keyof T;
      }
  );

/**
 * The interface for the `NextRoleManager` class
 * @extends IAuthManager
 */
interface INextRoleManager<T extends Roles<T>> extends IAuthManager<T> {
  /**
   * `AuthManager` schema
   */
  schema: Schema<T>;
  /**
   * The method that is used to authorize a request
   */
  check: <R extends NextApiRequest, U extends NextApiResponse>(
    handler: (req: R, res: U) => Promise<void> | void,
    options: TNextCheckOptions<T>
  ) => (req: R, res: U) => void;
  /**
   * The method that is called when an error occurs
   */
  onError?: <R extends NextApiRequest, U extends NextApiResponse>(
    err: AuthError,
    req: R,
    res: U
  ) => void;
  /**
   * The method that is called when the authorization is successful
   */
  onSucess?: <R extends NextApiRequest, U extends NextApiResponse>(req: R, res: U) => void;
  /**
   * The method that is called when an activity is performed
   */
  onActivity?: <R extends NextApiRequest>(options: ActivityCallbackOptions<T, R>) => Promise<void>;
}

/**
 * The options for the `NextRoleManager` class
 */
interface INextRoleManagerOptions<T extends Roles<T>> {
  /**
   * The schema that is used to authorize the request
   */
  schema: Schema<T>;
  /**
   * The method that is called when an error occurs
   */
  onError?: <R extends NextApiRequest, U extends NextApiResponse>(
    err: AuthError,
    req: R,
    res: U
  ) => void;
  /**
   * The method that is called when the authorization is successful
   */
  onSucess?: <R extends NextApiRequest, U extends NextApiResponse>(req: R, res: U) => void;
  /**
   * The method that is called when an activity is performed
   */
  onActivity?: <R extends NextApiRequest>(options: ActivityCallbackOptions<T, R>) => Promise<void>;
}

export type {
  ActivityCallbackOptions,
  INextRoleManager,
  INextRoleManagerOptions,
  TNextCheckOptions
};
