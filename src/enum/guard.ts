import { isEnum } from '../types.js';
import { Optional } from '../global.js';
import PowerGuardError from '../error.js';

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
