import { GuardFunction, Nullable } from '../global';
import PowerGuardError from '../error';

function guardArray<T>(elemGuard: GuardFunction<T>): (x: unknown) => Array<T>;
function guardArray<T>(
  elemGuard: GuardFunction<T>,
  optional: true,
): (x: unknown) => Nullable<Array<T>>;
function guardArray<T>(
  elemGuard: GuardFunction<T>,
  optional = false,
): (x: unknown) => Nullable<Array<T>> {
  return (x) => {
    if (optional && (x === undefined || x === null)) {
      return x;
    }

    if (!Array.isArray(x)) {
      throw new PowerGuardError('array', x, optional);
    }

    return x.map((el) => elemGuard(el));
  };
}

export default guardArray;
