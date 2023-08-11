import { AuthError, AuthManager, Roles, Schema, TAutorizeOptions } from '@iamjs/core';
import { NextApiRequest, NextApiResponse } from 'next';
import {
  ActivityCallbackOptions,
  INextRoleManager,
  INextRoleManagerOptions,
  TNextCheckOptions
} from '../types';

/**
 * The class that is used to manage roles and permissions from `Next.js`
 */
class NextRoleManager<T extends Roles<T>> extends AuthManager<T> implements INextRoleManager<T> {
  public schema: Schema<T>;

  onError?: <R extends NextApiRequest, U extends NextApiResponse = NextApiResponse>(
    err: AuthError,
    req: R,
    res: U
  ) => void;
  onSucess?: <R extends NextApiRequest, U extends NextApiResponse = NextApiResponse>(
    req: R,
    res: U
  ) => void;
  onActivity?: <R extends NextApiRequest>(options: ActivityCallbackOptions<T, R>) => Promise<void>;

  constructor(options: INextRoleManagerOptions<T>) {
    super(options.schema);
    this.schema = options.schema;
    this.onError = options.onError;
    this.onSucess = options.onSucess;
    this.onActivity = options.onActivity;
  }

  private _role(options: TNextCheckOptions<T>): keyof T | 'constrcuted' {
    if ('role' in options) {
      return options.role as keyof T;
    }
    return 'constrcuted';
  }

  private async _resolveOptions(
    req: NextApiRequest,
    options: TNextCheckOptions<T>
  ): Promise<TAutorizeOptions<T>> {
    if ('data' in options && options.data instanceof Function) {
      const data = await options.data(req);
      const o = options as TAutorizeOptions<T> & { data?: string | object };
      o.data = data;
      return o;
    }
    return options as TAutorizeOptions<T>;
  }

  private async _handleSuccess<R extends NextApiRequest, U extends NextApiResponse>(
    handler: (req: R, res: U) => void,
    req: R,
    res: U,
    options: TNextCheckOptions<T>
  ) {
    if (this.onActivity) {
      await this.onActivity<R>({
        actions: options.actions,
        req,
        resources: options.resources,
        role: this._role(options),
        success: true
      });
    }

    if (this.onSucess) {
      this.onSucess<R, U>(req, res);
    } else {
      handler(req, res);
    }
  }

  private async _handleError<R extends NextApiRequest, U extends NextApiResponse>(
    _handler: (req: R, res: U) => void,
    req: R,
    res: U,
    error: AuthError,
    options: TNextCheckOptions<T>
  ) {
    if (this.onActivity) {
      await this.onActivity<R>({
        actions: options.actions,
        req,
        resources: options.resources,
        role: this._role(options),
        success: false
      });
    }

    if (this.onError) {
      this.onError<R, U>(error, req, res);
    } else {
      throw error;
    }
  }

  /**
   * The method can be used as a middleware to check if the user is authorized to access the route
   */
  public check<R extends NextApiRequest, U extends NextApiResponse>(
    handler: (req: R, res: U) => void,
    options: TNextCheckOptions<T>
  ): (req: R, res: U) => void {
    return async (req: R, res: U) => {
      const o = await this._resolveOptions(req, options);
      const authorized = this.authorize(o);

      try {
        if (authorized) {
          await this._handleSuccess(handler, req, res, options);
        } else {
          throw AuthError.throw_error('UNAUTHORIZED');
        }
      } catch (error: any) {
        await this._handleError(handler, req, res, error, options);
      }
    };
  }

  /**
   * The method returns a boolean value to check if the user is authorized to access the route
   */
  public async checkFn(options: TAutorizeOptions<T>): Promise<boolean> {
    const authorized = await new Promise<boolean>((resolve) => {
      const authorized = this.authorize(options);
      if (authorized) {
        resolve(true);
      }
      resolve(false);
    });

    if (authorized) {
      if (this.onActivity) {
        await this.onActivity({
          actions: options.actions,
          resources: options.resources,
          success: true
        });
      }
      return true;
    }
    if (this.onActivity) {
      await this.onActivity({
        actions: options.actions,
        resources: options.resources,
        success: false
      });
    }
    return false;
  }
}

export { NextRoleManager };
export type { ActivityCallbackOptions, INextRoleManager, INextRoleManagerOptions };
