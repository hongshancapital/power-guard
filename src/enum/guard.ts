import throwError from '../error';
import { isEnum } from '../types';

function guard<T>(enumObject: T, x: unknown): T[keyof T];
function guard<T>(enumObject: T, x: unknown, optional: true): Optional<T[keyof T]>;
function guard<T>(enumObject: T, x: unknown, optional = false): Optional<T[keyof T]> {
  if (isEnum(enumObject)(x)) {
    return x;
  }
  if (optional) {
    return undefined;
  }
  return throwError('Error guarding enum');
}

export default guard;
