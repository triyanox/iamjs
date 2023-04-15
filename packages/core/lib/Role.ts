import { IPermission, IRole, extendOpts, permission, permissions, scopes } from '../types';

/**
 * Role class
 */
export default class Role implements IRole {
  public permissions: IPermission[] = [];

  /**
   * Role constructor
   */
  constructor(permissions: IPermission[] = []) {
    this.permissions = permissions;
  }

  private formatPermission(permission: permission): 'c' | 'r' | 'u' | 'd' | 'l' {
    switch (permission) {
      case 'create':
        return 'c';
      case 'read':
        return 'r';
      case 'update':
        return 'u';
      case 'delete':
        return 'd';
      case 'list':
        return 'l';
      default:
        return permission;
    }
  }

  public addPermission(permission: IPermission): this {
    this.permissions.push(permission);
    return this;
  }

  public removePermission(resource: string): this {
    this.permissions = this.permissions.filter((p) => {
      return p.resource !== resource;
    });
    return this;
  }

  public updatePermission(permission: IPermission): this {
    this.permissions = this.permissions.map((p) => {
      if (p.resource === permission.resource) {
        return permission;
      }
      return p;
    });
    return this;
  }

  public canCreate(resource: string): boolean {
    return this.can('create', resource);
  }

  public canRead(resource: string): boolean {
    return this.can('read', resource);
  }

  public canUpdate(resource: string): boolean {
    return this.can('update', resource);
  }

  public canDelete(resource: string): boolean {
    return this.can('delete', resource);
  }

  public canList(resource: string): boolean {
    return this.can('list', resource);
  }

  public can(permission: permission, resource: string): boolean {
    const formattedPermission = this.formatPermission(permission);
    const permissionObject = this.permissions.find((p) => {
      return p.resource === resource;
    });
    if (!permissionObject) {
      return false;
    }
    return permissionObject.scopes.includes(formattedPermission);
  }

  public canAny(permissions: permissions, resource: string): boolean {
    if (Array.isArray(permissions)) {
      return (permissions as any[]).some((permission) => {
        return this.can(permission, resource);
      });
    }

    return this.can(permissions, resource);
  }

  public canAll(permissions: permissions, resource: string): boolean {
    if (Array.isArray(permissions)) {
      return (permissions as any[]).every((permission) => {
        return this.can(permission, resource);
      });
    }

    return this.can(permissions, resource);
  }

  public extend(role: IRole, options?: extendOpts): this {
    if (Array.isArray(options)) {
      options = { permissions: options };
      role.permissions.forEach((permission) => {
        this.addPermission(permission);
      });
      options?.permissions?.forEach((permission) => {
        this.addPermission(permission);
      });
      return this;
    }

    if (!options) {
      role.permissions.forEach((permission) => {
        this.addPermission(permission);
      });
      return this;
    }

    if (options.overwrite) {
      this.permissions = role.permissions;
      if (options.permissions) {
        options.permissions?.forEach((permission) => {
          const existingPermission = this.permissions.find(
            (p) => p.resource === permission.resource
          );
          if (existingPermission) {
            this.updatePermission(permission);
          } else {
            this.addPermission(permission);
          }
        });
      }
      return this;
    }
    if (options.permissions) {
      this.permissions = role.permissions;
      options.permissions?.forEach((permission) => {
        const existingPermission = this.permissions.find((p) => p.resource === permission.resource);
        if (existingPermission) {
          return;
        } else {
          this.addPermission(permission);
        }
      });
    }
    return this;
  }

  public generate(format: 'json' | 'object' = 'json'): string | object {
    const Object: any = {};

    this.permissions.forEach((permission) => {
      const resource = permission.resource;
      const scopes = permission.scopes;
      Object[resource] = {
        create: scopes.includes('c'),
        read: scopes.includes('r'),
        update: scopes.includes('u'),
        delete: scopes.includes('d'),
        list: scopes.includes('l')
      };
    });
    if (format === 'json') {
      return JSON.stringify(Object);
    }
    return Object;
  }

  public toJSON() {
    return this.generate('json') as string;
  }

  public toObject() {
    return this.generate('object') as object;
  }

  /**
   * Load a role from a json string
   * @param json - Json string to load
   */
  public static fromJSON(json: string): IRole {
    const object = JSON.parse(json);
    return Role.fromObject(object);
  }

  /**
   * Load a role from a javascript object
   * @param object - Object to load
   */
  public static fromObject(object: { [key: string]: any }): IRole {
    const permissions: IPermission[] = [];
    Object.keys(object).forEach((resource) => {
      let scopes = '';
      Object.keys(object[resource]).forEach((scope) => {
        if (object[resource][scope]) {
          scopes += scope[0];
        } else {
          scopes += '-';
        }
      });
      permissions.push({
        resource,
        scopes: scopes as scopes
      });
    });
    return new Role(permissions as IPermission[]);
  }

  public static validate(role: IRole, cb?: (result: boolean, error?: Error) => void): boolean {
    try {
      const result = role.permissions.every((permission) => {
        return this.validatePermission(permission);
      });
      if (cb) {
        cb(result);
      }
      return result;
    } catch (e: any) {
      if (cb) {
        cb(false, e);
      }
      return false;
    }
  }

  public static validatePermission(permission: IPermission): boolean {
    if (!permission.resource) {
      throw new Error('Resource is required');
    }
    if (!permission.scopes) {
      throw new Error('Scopes are required');
    }
    if (permission.scopes.length !== 5) {
      throw new Error('Scopes must be 5 characters long');
    }
    if (!permission.scopes.match(/^[crudl-]+$/)) {
      throw new Error('Scopes must be in the format of crudl');
    }
    return true;
  }
}
