import { isEnum } from '../types';
import { Optional } from '../global';
import PowerGuardError from '../error';

function guard<T extends Record<string, unknown>>(enumObject: T, x: unknown): T[keyof T];
function guard<T extends Record<string, unknown>>(enumObject: T, x: unknown, optional: true): Optional<T[keyof T]>;
function guard<T extends Record<string, unknown>>(enumObject: T, x: unknown, optional = false): Optional<T[keyof T]> {
  if (isEnum(enumObject)(x)) {
    return x;
  }
  if (optional && x === undefined) {
    return x;
  }
  throw new PowerGuardError(String(enumObject), x, optional);
}

export default guard;
