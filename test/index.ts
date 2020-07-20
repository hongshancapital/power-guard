import guard, { number } from '../src';

const numberGuard = guard({
  foo: number.strict.required,
  bar: number.optional,
  baz: number.required,
});

const { foo, bar, baz } = numberGuard({ foo: 123, baz: '456' });

console.log(foo, bar, baz);
