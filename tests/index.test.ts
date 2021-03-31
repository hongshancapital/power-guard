import guard, { number, string, enumGuard, boolean, array } from '../src';
import { expect } from 'chai';
import PowerGuardError, { PowerGuardKeyError } from '../src/error';

enum Foo {
  key1 = 'key1',
  key2 = 2,
}

const guardFunc = guard({
  foo: number.gte(10).required,
  bar: string.escaped.optional,
  baz: enumGuard(Foo).optional.array,
  bla: boolean.loose.optional,
  bnd: array(guard({ foo: number.strict.required }), true),
});

describe('Power guard', () => {
  it('should return proper object when needed', () => {
    expect(
      guardFunc({
        foo: '10',
        bar: '！ａｂｃ　ＡＢＣ！',
        baz: [2, 'key1'],
        bla: 1,
        bnd: [{ foo: 123 }],
      }),
    ).deep.equals({
      foo: 10,
      bar: 'abc ABC',
      baz: [Foo.key2, Foo.key1],
      bla: true,
      bnd: [{ foo: 123 }],
    });

    expect(guardFunc({ foo: 10, baz: null, bla: '0' })).deep.equals({
      foo: 10,
      bar: undefined,
      baz: null,
      bla: false,
      bnd: undefined,
    });
  });

  it('should throw error when needed', () => {
    expect(() =>
      guardFunc({
        foo: '10',
        bar: '！ａｂｃ　ＡＢＣ！',
        baz: [2, 'key1'],
        bla: 1,
        bnd: [{ foo: '123' }],
      }),
    ).throws(PowerGuardKeyError);

    expect(() =>
      guardFunc({
        foo: 'a10d',
        bar: '！ａｂｃ　ＡＢＣ！',
        baz: [2, 'key1'],
        bla: 1,
        bnd: [{ foo: 123 }],
      }),
    ).throws(PowerGuardKeyError);

    expect(() =>
      guardFunc(`{
        foo: 'a10d',
        baz: [2, 'key1'],
        bla: 1,
        bnd: [{ foo: 123 }],
      }`),
    ).throws(PowerGuardError);
  });
});
