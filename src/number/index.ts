import guard, { NumberRange } from './guard.js';
import { isArray, isNumber } from '../types.js';
import guardArray from '../array/index.js';
import { GuardClass, GuardFunctionWithArray, OptionalGuardFunctionWithArray } from '../global.js';

class NumberGuard implements GuardClass<number> {
  private range?: NumberRange;
  private allowString: boolean;

  get required() {
    const { range, allowString } = this;
    const test: GuardFunctionWithArray<number> = function (x: unknown) {
      return guard(x, range, allowString);
    };

    test.array = guardArray((x) => guard(x, range, allowString));

    return test;
  }

  get optional() {
    const { range, allowString } = this;
    const test: OptionalGuardFunctionWithArray<number> = function (x: unknown) {
      return guard(x, true, range, allowString);
    };

    test.array = guardArray((x) => guard(x, range, allowString), true);

    return test;
  }

  get strict() {
    return new NumberGuard(this.range, false);
  }

  with(range: number[]): NumberGuard;
  with(range: NumberRange): NumberGuard;
  with(range: number[] | NumberRange): NumberGuard {
    if (isArray(isNumber)(range)) {
      const [lower, upper] = range;

      return new NumberGuard({ lower, equalsLower: true, upper, equalsUpper: true });
    }
    return new NumberGuard(range);
  }

  lt(value: number) {
    return new NumberGuard({ ...this.range, upper: value, equalsUpper: false });
  }

  lte(value: number) {
    return new NumberGuard({ ...this.range, upper: value, equalsUpper: true });
  }

  gt(value: number) {
    return new NumberGuard({ ...this.range, lower: value, equalsLower: false });
  }

  gte(value: number) {
    return new NumberGuard({ ...this.range, lower: value, equalsLower: true });
  }

  constructor(range?: NumberRange, allowString = true) {
    this.range = range;
    this.allowString = allowString;
  }
}

export default new NumberGuard();
