import guard, { number, string, boolean } from '../src';

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

const booleanGuard = guard({
  bool1: boolean.strict.required,
  bool2: boolean.optional,
  bool3: boolean.loose.required,
  bool4: boolean.loose.required.array,
});

const { foo, bar, baz } = numberGuard({ foo: 123, baz: '456' });
const { str1, str2, str3, str4 } = stringGuard({
  str2: '！ａｂｃ　ＡＢＣ！',
  str3: '！ａｂｃ　ＡＢＣ！',
  str4: ['！ａｂｃ　ＡＢＣ！', '!!!!abcabＡＢＣ'],
});
const guarded = booleanGuard({
  bool1: false,
  bool2: 'false1',
  bool3: 1,
  bool4: ['true', false, true, 1, '0'],
});

console.log(foo, bar, baz);
console.log(str1, str2, str3, str4);
console.log(guarded);
