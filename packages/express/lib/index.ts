import { AuthError, AuthManager, Roles, Schema, TAutorizeOptions } from '@iamjs/core';
import { NextFunction, Request, Response } from 'express';
import {
  ActivityCallbackOptions,
  IExpressRoleManager,
  IExpressRoleManagerOptions,
  TExpressCheckOptions
} from '../types';

/**
 * The class that is used to manage roles and permissions from `Express.js`
 */
class ExpressRoleManager<T extends Roles<T>>
  extends AuthManager<T>
  implements IExpressRoleManager<T>
{
  public schema: Schema<T>;

  onError?: <R extends Request, U extends Response = Response>(
    err: AuthError,
    req: R,
    res: U,
    next: NextFunction
  ) => void;
  onSucess?: <R extends Request, U extends Response = Response>(
    req: R,
    res: U,
    next: NextFunction
  ) => void;
  onActivity?: <R extends Request>(options: ActivityCallbackOptions<T, R>) => Promise<void>;

  constructor(options: IExpressRoleManagerOptions<T>) {
    super(options.schema);
    this.schema = options.schema;
    this.onError = options.onError;
    this.onSucess = options.onSucess;
    this.onActivity = options.onActivity;
  }

  private _role(options: TExpressCheckOptions<T>): keyof T | 'constrcuted' {
    if ('role' in options) {
      return options.role as keyof T;
    }
    return 'constrcuted';
  }

  private async _resolveOptions(
    req: Request,
    options: TExpressCheckOptions<T>
  ): Promise<TAutorizeOptions<T>> {
    if ('data' in options && options.data instanceof Function) {
      const data = await options.data(req);
      const o = options as TAutorizeOptions<T> & { data?: string | object };
      o.data = data;
      return o;
    }
    return options as TAutorizeOptions<T>;
  }

  private async _handleSuccess<R extends Request, U extends Response>(
    req: R,
    res: U,
    next: NextFunction,
    options: TExpressCheckOptions<T>
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
      this.onSucess<R, U>(req, res, next);
    } else {
      next();
    }
  }

  private async _handleError<R extends Request, U extends Response>(
    req: R,
    res: U,
    next: NextFunction,
    error: AuthError,
    options: TExpressCheckOptions<T>
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
      this.onError<R, U>(error, req, res, next);
    } else {
      next(error);
    }
  }

  /**
   * The method can be used as a middleware to check if the user is authorized to access the route
   */
  public check<R extends Request, U extends Response>(
    options: TExpressCheckOptions<T>
  ): (req: R, res: U, next: NextFunction) => void {
    return async (req: R, res: U, next: NextFunction) => {
      const o = await this._resolveOptions(req, options);
      const authorized = this.authorize(o);
      try {
        if (authorized) {
          await this._handleSuccess(req, res, next, options);
        } else {
          throw AuthError.throw_error('UNAUTHORIZED');
        }
      } catch (error: any) {
        await this._handleError(req, res, next, error, options);
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

export { ExpressRoleManager };
export type { ActivityCallbackOptions, IExpressRoleManager, IExpressRoleManagerOptions };
