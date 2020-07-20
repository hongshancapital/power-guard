import guard from './guard';
import guardArray from '../array';
import { GuardClass, GuardFunctionWithArray, OptionalGuardFunctionWithArray } from '../global';

class BooleanGuard implements GuardClass<boolean> {
  get required() {
    const test: GuardFunctionWithArray<boolean> = function (x: unknown) {
      return guard(x);
    };

    test.array = guardArray((x) => guard(x));

    return test;
  }

  get optional() {
    const test: OptionalGuardFunctionWithArray<boolean> = function (x: unknown) {
      return guard(x, true);
    };

    test.array = guardArray((x) => guard(x), true);

    return test;
  }
}

export default new BooleanGuard();
