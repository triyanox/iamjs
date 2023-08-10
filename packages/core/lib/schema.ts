import { GetRoleConfig, ISchema, MergePermissions, TSchemaOptions } from '../types';
import Role from './role';

/**
 * Auth schema
 */
class Schema<
  T extends {
    [K in keyof T]: T[K] extends Role<infer U> ? Role<U> : never;
  }
> implements ISchema<T>
{
  constructor(public options: TSchemaOptions<T>) {}

  /**
   * Get roles
   */
  public get roles(): T {
    return this.options.roles;
  }

  /**
   * Get role by key
   */
  public getRole<K extends keyof T>(name: K): T[K] {
    return this.roles[name];
  }

  /**
   * Get all resources in the schema
   */
  public getResources(): Record<keyof MergePermissions<T>, keyof MergePermissions<T>> {
    const resources = {} as Record<keyof MergePermissions<T>, keyof MergePermissions<T>>;
    for (const role in this.roles) {
      const permissions = this.roles[role].permissions;
      for (const resource in permissions) {
        resources[resource as keyof typeof resources] = resource;
      }
    }
    return resources;
  }

  /**
   * Get all permissions in the schema
   */
  public getPermissions<U extends keyof T>(role: U) {
    return this.roles[role].permissions as T[U]['permissions'];
  }

  /**
   * Convert a role into a JSON string, optionally transform the result
   */
  public toJSON<K extends keyof T>(role: K): string;
  public toJSON<K extends keyof T, R>(role: K, transform: (data: string) => R): R;
  public toJSON<K extends keyof T, R>(role: K, transform?: (data: string) => R): string | R {
    const roleObject = this.roles[role].toJSON();
    if (transform) {
      return transform(roleObject);
    }
    return roleObject;
  }

  /**
   * Convert a role into an object, optionally transform the result
   */
  public toObject<K extends keyof T>(role: K): GetRoleConfig<T[K]>;
  public toObject<K extends keyof T, R>(role: K, transform: (data: GetRoleConfig<T[K]>) => R): R;
  public toObject<K extends keyof T, R>(
    role: K,
    transform?: (data: GetRoleConfig<T[K]>) => R
  ): GetRoleConfig<T[K]> | R {
    const roleObject = this.roles[role].toObject() as unknown as GetRoleConfig<T[K]>;
    return transform ? transform(roleObject as GetRoleConfig<T[K]>) : roleObject;
  }

  /**
   * Check if a role exists in the schema
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  public exists(role: keyof T | (string & {})): boolean {
    return !!this.roles[role as keyof T];
  }
}

export default Schema;
