import guard from './guard.js';
import guardArray from '../array/index.js';
import {
  GuardClass,
  GuardFunctionWithArray,
  OptionalGuardFunctionWithArray,
  Optional,
} from '../global.js';
import PowerGuardError from '../error.js';

const punctuation = '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~';
const unknownChar = '\uFFFD';

class StringGuard implements GuardClass<string> {
  private maxLength?: number;
  private shouldEscape?: boolean;

  private escapeIfNeeded(x: string): string;
  private escapeIfNeeded(x: Optional<string>): Optional<string>;
  private escapeIfNeeded(x: Optional<string>): Optional<string> {
    if (!this.shouldEscape || x === undefined) {
      return x;
    }
    // https://stackoverflow.com/questions/20486551/javascript-function-to-convert-utf8-string-between-fullwidth-and-halfwidth-forms
    return x
      .replace(/[\uff01-\uff5e]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xfee0))
      .replace(/\u3000/g, '\u0020')
      .replace(new RegExp(`[${punctuation}${unknownChar}]`, 'g'), '');
  }

  get notEmpty() {
    const { maxLength, escapeIfNeeded } = this;
    const escape = escapeIfNeeded.bind(this);
    const finalGuard = (x: unknown) => {
      const result = escape(guard(x, maxLength));

      if (!result.trim()) {
        throw new PowerGuardError('string', x, false, 'Value should not be empty');
      }

      return result;
    };
    const test: GuardFunctionWithArray<string> = function (x: unknown) {
      return finalGuard(x);
    };

    test.array = guardArray((x) => finalGuard(x));

    return test;
  }

  get required() {
    const { maxLength, escapeIfNeeded } = this;
    const escape = escapeIfNeeded.bind(this);
    const test: GuardFunctionWithArray<string> = function (x: unknown) {
      return escape(guard(x, maxLength));
    };

    test.array = guardArray((x) => escape(guard(x, maxLength)));

    return test;
  }

  get optional() {
    const { maxLength, escapeIfNeeded } = this;
    const escape = escapeIfNeeded.bind(this);
    const test: OptionalGuardFunctionWithArray<string> = function (x: unknown) {
      return escape(guard(x, true, maxLength));
    };

    test.array = guardArray((x) => escape(guard(x, maxLength)), true);

    return test;
  }

  get escaped() {
    return new StringGuard(this.maxLength, true);
  }

  with(maxLength: number): StringGuard {
    return new StringGuard(maxLength, this.shouldEscape);
  }

  constructor(maxLength?: number, shouldEscape?: boolean) {
    this.maxLength = maxLength;
    this.shouldEscape = shouldEscape;
  }
}

export default new StringGuard();
