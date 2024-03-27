import { GuardFunction, Optional, OptionalArray } from '../global.js';
import PowerGuardError from '../error.js';

function guardArray<T>(elemGuard: GuardFunction<T>): (x: unknown) => Array<T>;
function guardArray<T>(
  elemGuard: GuardFunction<T>,
  optional: true,
): (x: unknown) => OptionalArray<T>;
function guardArray<T>(
  elemGuard: GuardFunction<T>,
  optional = false,
): (x: unknown) => OptionalArray<T> {
  return (x) => {
    if (optional && !x) {
      return undefined;
    }

    if (!Array.isArray(x)) {
      throw new PowerGuardError('array', x, optional);
    }

    return x.map((el) => elemGuard(el));
  };
}

export default guardArray;
