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

  private async _handleSuccess(ctx: Context, next: Next, options: TKoaCheckOptions<T>) {
    if (this.onActivity) {
      await this.onActivity({
        actions: options.actions,
        ctx,
        resources: options.resources,
        role: this._role(options),
        success: true
      });
    }

    if (this.onSuccess) {
      this.onSuccess(ctx, next);
    } else {
      await next();
    }
  }

  private async _handleError(
    ctx: Context,
    next: Next,
    error: AuthError,
    options: TKoaCheckOptions<T>
  ) {
    if (this.onActivity) {
      await this.onActivity({
        actions: options.actions,
        ctx,
        resources: options.resources,
        role: this._role(options),
        success: false
      });
    }

    if (this.onError) {
      this.onError(error, ctx, next);
    } else {
      throw error;
    }
  }

  /**
   * The method can be used as a middleware to check if the user is authorized to access the route
   */
  public check(options: TKoaCheckOptions<T>): (ctx: Context, next: Next) => Promise<void> {
    return async (ctx: Context, next: Next) => {
      const o = await this._resolveOptions(ctx, options);
      const authorized = this.authorize(o);

      try {
        if (authorized) {
          await this._handleSuccess(ctx, next, options);
        } else {
          throw AuthError.throw_error('UNAUTHORIZED');
        }
      } catch (error: any) {
        await this._handleError(ctx, next, error, options);
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

export { KoaRoleManager };
export type { ActivityCallbackOptions, IKoaRoleManager, IKoaRoleManagerOptions };
