import { NextFunction, Request, Response } from 'express';
import { IAuthManager, IRole, permission, AuthError } from '@iamjs/core';

/**
 * We used declaration merging to add the `role` and `permissions` keys to the `Request` interface
 * @see https://www.typescriptlang.org/docs/handbook/declaration-merging.html
 * ***********************************************************************************************
 * you can use this to add the keys to the `Request` interface
 */
declare global {
  namespace Express {
    interface Request {
      role: string;
      permissions: Record<string, Record<permission, boolean>>;
    }
  }
}

/**
 * The interface for the `authorize` method
 */
interface IExpressAutorizeOptions {
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
 * The options for the `onActivity` method
 */
type ActivityCallbackOptions<T extends Request = Request> = {
  /**
   * The action or actions that are authorized to be executed on the resource
   */
  action?: permission | permission[];
  /**
   * The resource or resources that are authorized to be accessed
   */
  resource?: string | string[];
  /**
   * The role that is used to authorize the request
   */
  role?: string;
  /**
   * The permissions that are used to authorize the request
   */
  success?: boolean;
  /**
   * The request object
   */
  req?: T;
};

/**
 * The interface for the `ExpressRoleManager` class
 * @extends IAuthManager
 */
interface IExpressRoleManager extends IAuthManager {
  /**
   * The method that is used to authorize a request
   * ***********************************************************************************************
   * We used declaration merging to add the `role` and `permissions` keys to the `Request` interface
   * @see https://www.typescriptlang.org/docs/handbook/declaration-merging.html
   * ***********************************************************************************************
   * you can use this to add the keys to the `Request` interface
   */
  authorize: <T extends Request, U extends Response>(
    options: IExpressAutorizeOptions
  ) => (req: T, res: U, next: NextFunction) => void;
  /**
   * The method that is called when an error occurs
   */
  onError?: <T extends Request, U extends Response>(
    err: AuthError,
    req: T,
    res: U,
    next: NextFunction
  ) => void;
  /**
   * The method that is called when the authorization is successful
   */
  onSucess?: <T extends Request, U extends Response>(req: T, res: U, next: NextFunction) => void;
  /**
   * The method that is called when an activity is performed
   */
  onActivity?: <T extends Request>(options: ActivityCallbackOptions<T>) => Promise<void>;
}

/**
 * The options for the `ExpressRoleManager` class
 */
interface IExpressRoleManagerOptions {
  /**
   * The roles that are available to the `ExpressRoleManager` instance
   * @default {}
   */
  roles: { [key: string]: IRole };
  /**
   * The resources that are available to the `ExpressRoleManager` instance
   * @default []
   */
  resources: string[];
  /**
   * The method that is called when an error occurs
   */
  onError?: <T extends Request, U extends Response>(
    err: AuthError,
    req: T,
    res: U,
    next: NextFunction
  ) => void;
  /**
   * The method that is called when the authorization is successful
   */
  onSucess?: <T extends Request, U extends Response>(req: T, res: U, next: NextFunction) => void;
  /**
   * The method that is called when an activity is performed
   */
  onActivity?: <T extends Request>(options: ActivityCallbackOptions<T>) => Promise<void>;
}

export type {
  IExpressRoleManager,
  IExpressRoleManagerOptions,
  IExpressAutorizeOptions,
  ActivityCallbackOptions
};
