import guard, { NumberRange } from './guard';
import { isArray, isNumber } from '../types';
import guardArray from '../array';

class NumberGuard implements GuardClass<number> {
  private range?: NumberRange;

  get required() {
    const { range } = this;
    const test: GuardFunctionWithArray<number> = function (x: unknown) {
      return guard(x, range);
    };

    test.array = guardArray((x) => guard(x, range));

    return test;
  }

  get optional() {
    const { range } = this;
    const test: OptionalGuardFunctionWithArray<number> = function (x: unknown) {
      return guard(x, true, range);
    };

    test.array = guardArray((x) => guard(x, range), true);

    return test;
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

  constructor(range?: NumberRange) {
    this.range = range;
  }
}

export default new NumberGuard();
