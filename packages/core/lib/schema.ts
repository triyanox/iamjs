import { ISchema, MergePermissions } from '../types';
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
  constructor(public roles: T) {}

  public getRole<K extends keyof T>(name: K): T[K] {
    return this.roles[name];
  }

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
}

export default Schema;
