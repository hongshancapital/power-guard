import { isEnum } from '../types';
import { Nullable } from '../global';
import PowerGuardError from '../error';

function guard<T extends Record<string, unknown>>(enumObject: T, x: unknown): T[keyof T];
function guard<T extends Record<string, unknown>>(enumObject: T, x: unknown, optional: true): Nullable<T[keyof T]>;
function guard<T extends Record<string, unknown>>(enumObject: T, x: unknown, optional = false): Nullable<T[keyof T]> {
  if (isEnum(enumObject)(x)) {
    return x;
  }
  if (optional && (x === undefined || x === null)) {
    return x;
  }
  throw new PowerGuardError(String(enumObject), x, optional);
}

export default guard;
