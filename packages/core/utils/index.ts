import { MergeObjects } from '../types/utils.types';

const utils = {
  merge: <T extends Record<string, any>, U extends Record<string, any>>(
    a: T | null | undefined,
    b: U | null | undefined,
    options?: {
      /**
       * If true, the merge will not override the existing properties
       */
      preserve?: boolean;
    }
  ): MergeObjects<T, U> => {
    if (!a && !b) return {} as MergeObjects<T, U>;
    if (!a) return b as MergeObjects<T, U>;
    if (!b) return a as MergeObjects<T, U>;

    if (options?.preserve) {
      const overlaps = utils.overlaps(a, b);
      const bWithoutOverlaps = utils.omit(b, overlaps);
      const merged = { ...a, ...bWithoutOverlaps };
      return merged as MergeObjects<T, U>;
    }

    const merged = { ...a, ...b };
    return merged as MergeObjects<T, U>;
  },
  omit<T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]) {
    const ret = {} as Record<string, any>;
    for (const key in obj) {
      if (keys.includes(key as any)) continue;
      ret[key] = obj[key];
    }
    return ret;
  },
  pick<T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]) {
    const ret = {} as Record<string, any>;
    for (const key of keys) {
      ret[key as string] = obj[key];
    }
    return ret;
  },
  overlaps<T extends Record<string, any>, U extends Record<string, any>>(a: T, b: U) {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    const overlaps = aKeys.filter((key) => bKeys.includes(key));
    return overlaps;
  },
  seialize<T extends Record<string, any>>(obj: T) {
    return JSON.stringify(obj);
  },
  deserialize<T extends Record<string, any>>(json: string) {
    try {
      return JSON.parse(json) as T;
    } catch (err) {
      throw 'Invalid JSON';
    }
  },
  validate: {
    notNull: (value: any, error: string, errors?: string[]) => {
      if (value === null || value === undefined) {
        errors?.push('Validation Error: ' + error);
      }
    },
    string: (value: any, error: string, errors?: string[]) => {
      if (typeof value !== 'string') {
        errors?.push('Validation Error: ' + error);
      }
    },
    object: (value: any, error: string, errors?: string[]) => {
      if (typeof value !== 'object') {
        errors?.push('Validation Error: ' + error);
      }
    },
    number: (value: any, error: string, errors?: string[]) => {
      if (typeof value !== 'number') {
        errors?.push('Validation Error: ' + error);
      }
    },
    notEmpty: (value: any, error: string, errors?: string[]) => {
      if (!value || value.length === 0) {
        errors?.push('Validation Error: ' + error);
      }
    }
  },
  throwErr: (errors: string[]) => {
    throw errors[0];
  },
  getValue: <T extends Record<string, any>, K extends keyof T>(
    obj: T,
    key: K,
    defaultValue?: T[K]
  ) => {
    if (obj[key] === undefined) {
      return defaultValue || null;
    }
    return obj[key];
  },
  /**
   * If the args is an array, it returns the array, otherwise it returns an array with the args as the only element
   */
  asArray<T>(args: T | T[]) {
    if (Array.isArray(args)) return args;
    return [args];
  }
};

export default utils;
