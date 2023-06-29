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
 * @extends AuthManager
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
    if ('data' in options) {
      const data = await options.data(req);
      const o = options as TAutorizeOptions<T> & { data?: string | object };
      o.data = data;
      return o;
    }
    return options as TAutorizeOptions<T>;
  }

  public check<R extends Request, U extends Response>(
    options: TExpressCheckOptions<T>
  ): (req: R, res: U, next: NextFunction) => void {
    return async (req: R, res: U, next: NextFunction) => {
      const o = await this._resolveOptions(req, options);
      const authorized = this.authorize(o);
      try {
        if (authorized) {
          if (this.onActivity) {
            this.onActivity<R>({
              actions: options.actions,
              req,
              resources: options.resources,
              role: this._role(options),
              success: true
            }).then(() => {
              if (this.onSucess) {
                this.onSucess<R, U>(req, res, next);
              } else {
                next();
              }
            });
            return;
          }
          if (this.onSucess) {
            this.onSucess<R, U>(req, res, next);
          } else {
            next();
          }
        } else {
          throw AuthError.throw_error('UNAUTHORIZED');
        }
      } catch (error: any) {
        if (this.onActivity) {
          this.onActivity<R>({
            actions: options.actions,
            req,
            resources: options.resources,
            role: this._role(options),
            success: false
          }).then(() => {
            if (this.onError) {
              this.onError<R, U>(error, req, res, next);
            } else {
              next(error);
            }
          });
          return;
        }
        if (this.onError) {
          this.onError<R, U>(error, req, res, next);
        } else {
          next(error);
        }
      }
    };
  }
}

export { ExpressRoleManager };
export type { ActivityCallbackOptions, IExpressRoleManager, IExpressRoleManagerOptions };
