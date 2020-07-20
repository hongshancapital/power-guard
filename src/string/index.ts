import guard from './guard';
import guardArray from '../array';
import { GuardClass, GuardFunctionWithArray, OptionalGuardFunctionWithArray } from '../global';

class StringGuard implements GuardClass<string> {
  private maxLength?: number;

  get required() {
    const { maxLength } = this;
    const test: GuardFunctionWithArray<string> = function (x: unknown) {
      return guard(x, maxLength);
    };

    test.array = guardArray((x) => guard(x, maxLength));

    return test;
  }

  get optional() {
    const { maxLength } = this;
    const test: OptionalGuardFunctionWithArray<string> = function (x: unknown) {
      return guard(x, true, maxLength);
    };

    test.array = guardArray((x) => guard(x, maxLength), true);

    return test;
  }

  with(maxLength: number): StringGuard {
    return new StringGuard(maxLength);
  }

  constructor(maxLength?: number) {
    this.maxLength = maxLength;
  }
}

export default new StringGuard();
