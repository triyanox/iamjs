import {
  DefaultScope,
  IPermission,
  IRole,
  InferPermissions,
  InferResources,
  RoleAddResult,
  RoleRemoveResult,
  RoleUpdateResult,
  TRoleOptions,
  ToObjectResult,
  addOptions,
  removeOptions,
  updateOptions
} from '../types';
import utils from '../utils';

/**
 * `Role` class
 */
class Role<T extends TRoleOptions> implements IRole<T> {
  name: T['name'];
  description?: string;
  meta?: Record<string, any> = {};
  config: T['config'];
  resources: InferResources<T['config']>[];
  permissions: InferPermissions<T['config']>;

  constructor(options: T) {
    this.config = options.config;
    this.name = options.name;
    this.description = options.description;
    this.meta = options.meta;
    this.resources = Object.keys(options.config);
    this.permissions = this.init(options.config, this.resources as string[]);
  }

  private getDefaultPermission(p: DefaultScope) {
    const scopes = {
      c: 'create',
      r: 'read',
      u: 'update',
      d: 'delete',
      l: 'list'
    };
    return scopes[p];
  }

  private init<C extends Record<string, IPermission>, R extends InferResources<C>[]>(
    config: C,
    resources: R
  ): InferPermissions<T['config']> {
    const permissions: InferPermissions<C> = {} as InferPermissions<C>;

    for (const resource of resources) {
      const resourcePermissions = config[resource].scopes;
      const customPermissions = config[resource].custom;
      const resourcePermissionsSet = new Set(resourcePermissions);
      const resourcePermissionsObject: any = {};

      for (const p of ['c', 'r', 'u', 'd', 'l']) {
        resourcePermissionsObject[this.getDefaultPermission(p as DefaultScope)] =
          resourcePermissionsSet.has(p);
      }

      permissions[resource] = utils.merge<Record<string, boolean>, any>(
        resourcePermissionsObject,
        customPermissions
      );
    }
    return permissions;
  }

  public getPermissions() {
    return this.permissions;
  }

  public getResources(): InferResources<T['config']>[] {
    return this.resources;
  }

  public add<S extends string, P extends IPermission>(options: addOptions<S, P>) {
    const { permissions, resource, mutate, noOverride } = options;

    if (mutate) {
      this.config = utils.merge(
        this.config,
        {
          [resource]: permissions
        } as {
          [K in S]: P;
        },
        {
          preserve: noOverride
        }
      );
      this.permissions = this.init(this.config, this.resources as string[]);
      return this as unknown as RoleAddResult<T, S, P>;
    }

    return new Role({
      name: this.name,
      description: this.description,
      meta: this.meta,
      config: utils.merge(
        this.config,
        {
          [resource]: permissions
        } as {
          [K in S]: P;
        },
        {
          preserve: noOverride
        }
      )
    });
  }

  public remove<S extends string>(options: removeOptions<S>) {
    const { resource, mutate } = options;
    if (mutate) {
      delete this.config[resource];
      delete this.permissions[resource];
      return this as unknown as RoleRemoveResult<T, S>;
    }
    return new Role({
      name: this.name,
      description: this.description,
      meta: this.meta,
      config: utils.omit(this.config, [resource]) as Omit<T['config'], S>
    });
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  public update<S extends keyof this['permissions'] & (string & {}), P extends IPermission>(
    options: updateOptions<S, P>
  ) {
    const { permissions, resource, mutate, noOverride } = options;
    if (mutate) {
      this.config = utils.merge(
        this.config,
        {
          [resource]: permissions
        } as {
          [K in S]: P;
        },
        {
          preserve: noOverride
        }
      );
      this.permissions = this.init(this.config, this.resources as string[]);
      return this as unknown as RoleUpdateResult<T, S, P>;
    }
    return new Role({
      name: this.name,
      description: this.description,
      meta: this.meta,
      config: utils.merge(
        this.config,
        {
          [resource]: permissions
        } as {
          [K in S]: P;
        },
        {
          preserve: noOverride
        }
      )
    });
  }

  public can<S extends keyof this['permissions'], P extends keyof this['permissions'][S]>(
    resource: S,
    permission: P
  ): boolean {
    const permissions = new Map(Object.entries(this.getPermissions()));
    const resourcePermissions = permissions.get(resource as string);
    if (!resourcePermissions) return false;
    return resourcePermissions[permission as string];
  }

  public cannot<S extends keyof this['permissions'], P extends keyof this['permissions'][S]>(
    resource: S,
    permission: P
  ): boolean {
    return !this.can(resource, permission);
  }

  public canAny<S extends keyof this['permissions']>(
    resource: S,
    permissions: (keyof this['permissions'][S])[]
  ): boolean {
    return permissions.some((p) => this.can(resource, p));
  }

  public canAll<S extends keyof this['permissions']>(
    resource: S,
    permissions: (keyof this['permissions'][S])[]
  ): boolean {
    return permissions.every((p) => this.can(resource, p));
  }

  public clone() {
    return new Role({
      name: this.name,
      description: this.description,
      meta: this.meta,
      config: this.config
    }) as unknown as Role<T>;
  }

  public toJSON() {
    return utils.seialize({
      name: this.name,
      description: this.description,
      meta: this.meta,
      config: this.config
    });
  }

  public toObject(): ToObjectResult<T> {
    return {
      name: this.name,
      description: this.description,
      meta: this.meta,
      config: this.config,
      permissions: this.permissions,
      resources: this.resources
    };
  }

  /**
   *  Creates a role from a JSON string
   */
  public static fromJSON<T extends TRoleOptions>(json: string) {
    const data = utils.deserialize(json);
    return this.fromObject<T>(data as T);
  }

  /**
   *  Creates a role from object
   */
  public static fromObject<T extends TRoleOptions>(object: T) {
    const errors = this.validate(object);
    if (errors.length) {
      return utils.throwErr(errors);
    }
    return new Role({
      config: object.config as T['config'],
      description: object.description as T['description'],
      meta: object.meta as T['meta'],
      name: object.name as T['name']
    });
  }

  /**
   * Validates the role object
   */
  public static validate(object: any, cb?: (result: boolean, errors: string[]) => void): string[];
  public static validate(object: any): string[];
  public static validate(object: any, cb?: (result: boolean, errors: string[]) => void): string[] {
    const { name, config } = object;
    const errors: string[] = [];
    utils.validate.notEmpty(Object.keys(object), 'Role must not be empty', errors);
    utils.validate.notNull(name, 'Name of the role is required', errors);
    utils.validate.string(name, 'Name of the role must be a string', errors);
    utils.validate.notNull(config, 'Config of the role is required', errors);
    utils.validate.object(config, 'Config of the role must be an object', errors);
    if (cb) {
      cb(errors.length === 0, errors);
    }
    return errors;
  }
}

export default Role;
