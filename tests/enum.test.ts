import { enumGuard, PowerGuardError } from '../src';
import { expect } from 'chai';

enum Foo {
  key1 = 'key1',
  key2 = 2,
}

describe('Enum guard', () => {
  const guard = enumGuard(Foo);

  it('should return proper enum when needed', () => {
    expect(guard.required(Foo.key1)).equals(Foo.key1);
    expect(guard.required(Foo.key2)).equals(Foo.key2);
    expect(guard.optional(undefined)).equals(undefined);
    expect(guard.optional(null)).equals(null);
  });

  it('should throw error when needed', () => {
    expect(() => guard.optional('2')).throws(PowerGuardError);
    expect(() => guard.required(undefined)).throws(PowerGuardError);
    expect(() => guard.required(null)).throws(PowerGuardError);
  });

  it('should return proper enum array when needed', () => {
    expect(guard.required.array([Foo.key2, Foo.key1])).deep.equals([Foo.key2, Foo.key1]);
    expect(guard.required.arrayNotEmpty([Foo.key2, Foo.key1])).deep.equals([Foo.key2, Foo.key1]);
    expect(guard.optional.array(undefined)).deep.equals(undefined);
    expect(guard.optional.array(null)).deep.equals(null);
  });

  it('should throw error for input array when needed', () => {
    expect(() => guard.optional.array([Foo.key1, '2'])).throws(PowerGuardError);
    expect(() => guard.required.arrayNotEmpty([])).throws(PowerGuardError);
    expect(() => guard.required.array(undefined)).throws(PowerGuardError);
    expect(() => guard.required.array(null)).throws(PowerGuardError);
  });
});
