import { AuthError, AuthManager, Roles, Schema, TAutorizeOptions } from '@iamjs/core';
import { Context, Next } from 'koa';
import {
  ActivityCallbackOptions,
  IKoaRoleManager,
  IKoaRoleManagerOptions,
  TKoaCheckOptions
} from '../types';

class KoaRoleManager<T extends Roles<T>> extends AuthManager<T> implements IKoaRoleManager<T> {
  public schema: Schema<T>;

  onError?: (err: AuthError, ctx: Context, next: Next) => void;
  onSuccess?: (ctx: Context, next: Next) => void;
  onActivity?: (options: ActivityCallbackOptions<T, Context>) => Promise<void>;

  constructor(options: IKoaRoleManagerOptions<T>) {
    super(options.schema);
    this.schema = options.schema;
    this.onError = options.onError;
    this.onSuccess = options.onSuccess;
    this.onActivity = options.onActivity;
  }

  private _role(options: TKoaCheckOptions<T>): keyof T | 'constrcuted' {
    if ('role' in options) {
      return options.role as keyof T;
    }
    return 'constrcuted';
  }

  private async _resolveOptions(
    ctx: Context,
    options: TKoaCheckOptions<T>
  ): Promise<TAutorizeOptions<T>> {
    if ('data' in options && options.data instanceof Function) {
      const data = await options.data(ctx);
      const o = options as TAutorizeOptions<T> & { data?: string | object };
      o.data = data;
      return o;
    }
    return options as TAutorizeOptions<T>;
  }

  public check(options: TKoaCheckOptions<T>): (ctx: Context, next: Next) => Promise<void> {
    return async (ctx: Context, next: Next) => {
      const o = await this._resolveOptions(ctx, options);
      const authorized = this.authorize(o);
      try {
        if (authorized) {
          if (this.onActivity) {
            this.onActivity({
              actions: options.actions,
              ctx,
              resources: options.resources,
              role: this._role(options),
              success: true
            }).then(() => {
              if (this.onSuccess) {
                this.onSuccess(ctx, next);
              } else {
                next();
              }
            });
            return;
          }
          if (this.onSuccess) {
            this.onSuccess(ctx, next);
          } else {
            next();
          }
        } else {
          throw AuthError.throw_error('UNAUTHORIZED');
        }
      } catch (error: any) {
        if (this.onActivity) {
          this.onActivity({
            actions: options.actions,
            ctx,
            resources: options.resources,
            role: this._role(options),
            success: false
          }).then(() => {
            if (this.onError) {
              this.onError(error, ctx, next);
            } else {
              throw error;
            }
          });
          return;
        }
        if (this.onError) {
          this.onError(error, ctx, next);
        } else {
          throw error;
        }
      }
    };
  }
}

export { KoaRoleManager };
export type { ActivityCallbackOptions, IKoaRoleManager, IKoaRoleManagerOptions };
