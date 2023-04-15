import { AuthError, IAuthManager, IRole, permission } from '@iamjs/core';
import { NextApiRequest, NextApiResponse } from 'next';

/**
 * The interface for the `authorize` function
 */
interface INextAutorizeOptions {
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
 * The interface for the `NextRoleManager` class
 * @extends IAuthManager
 */
interface INextRoleManager extends IAuthManager {
  /**
   * The function that is used to authorize a request
   * This function takes some options as first argument and a `NextApiHandler` as second argument
   * @param options The options for authorization
   */
  authorize: <T extends NextApiRequest, U extends NextApiResponse>(
    options: INextAutorizeOptions,
    handler: (req: T, res: U) => Promise<void> | void
  ) => (req: T, res: U) => Promise<void> | void;
  onError?: <T extends NextApiRequest, U extends NextApiResponse>(
    err: AuthError,
    req: T,
    res: U
  ) => Promise<void> | void;
  onSucess?: <T extends NextApiRequest, U extends NextApiResponse>(
    req: T,
    res: U
  ) => Promise<void> | void;
}

/**
 * The options for the `NextRoleManager` class
 * @extends IAuthManagerOptions
 */
interface INextRoleManagerOptions {
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
  onError?: <T extends NextApiRequest, U extends NextApiResponse>(
    err: AuthError,
    req: T,
    res: U
  ) => Promise<void> | void;
  /**
   * The function that is called when the request is authorized
   */
  onSucess?: <T extends NextApiRequest, U extends NextApiResponse>(
    req: T,
    res: U
  ) => Promise<void> | void;
}

export type { INextAutorizeOptions, INextRoleManager, INextRoleManagerOptions };
