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
 * @extends AuthManager
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

  public check<R extends NextApiRequest, U extends NextApiResponse>(
    handler: (req: R, res: U) => void,
    options: TNextCheckOptions<T>
  ): (req: R, res: U) => void {
    return async (req: R, res: U) => {
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
                this.onSucess<R, U>(req, res);
              } else {
                handler(req, res);
              }
            });
            return;
          }
          if (this.onSucess) {
            this.onSucess<R, U>(req, res);
          } else {
            handler(req, res);
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
              this.onError<R, U>(error, req, res);
            } else {
              throw error;
            }
          });
          return;
        }
        if (this.onError) {
          this.onError<R, U>(error, req, res);
        } else {
          throw error;
        }
      }
    };
  }
}

export { NextRoleManager };
export type { ActivityCallbackOptions, INextRoleManager, INextRoleManagerOptions };
