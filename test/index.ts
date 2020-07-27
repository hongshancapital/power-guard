import guard, { number, string } from '../src';

const numberGuard = guard({
  foo: number.strict.required,
  bar: number.optional,
  baz: number.required,
});

const stringGuard = guard({
  str1: string.optional,
  str2: string.required,
  str3: string.escaped.required,
  str4: string.escaped.required.array,
});

const { foo, bar, baz } = numberGuard({ foo: 123, baz: '456' });
const { str1, str2, str3, str4 } = stringGuard({
  str2: '！ａｂｃ　ＡＢＣ！',
  str3: '！ａｂｃ　ＡＢＣ！',
  str4: ['！ａｂｃ　ＡＢＣ！', '!!!!abcabＡＢＣ'],
});

console.log(foo, bar, baz);
console.log(str1, str2, str3, str4);
