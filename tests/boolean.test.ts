import { boolean, PowerGuardError } from '../src';
import guard from '../src/boolean/guard';
import { expect } from 'chai';

describe('Boolean guard', () => {
  it('should return proper boolean when needed', () => {
    expect(boolean.required(true)).equals(true);
    expect(boolean.required('false')).equals(false);
    expect(boolean.strict.required(false)).equals(false);
    expect(boolean.strict.optional(undefined)).equals(undefined);
    expect(boolean.loose.required('true')).equals(true);
    expect(boolean.loose.required(1)).equals(true);
    expect(boolean.loose.required('1')).equals(true);
    expect(boolean.loose.required(0)).equals(false);
    expect(boolean.loose.required('-1')).equals(true);
    expect(guard('true')).equals(true);
  });

  it('should throw error when needed', () => {
    expect(() => boolean.required('1')).throws(PowerGuardError);
    expect(() => boolean.required(undefined)).throws(PowerGuardError);
    expect(() => boolean.strict.required('false')).throws(PowerGuardError);
    expect(() => boolean.strict.optional(1)).throws(PowerGuardError);
    expect(() => boolean.loose.required('true1')).throws(PowerGuardError);
  });

  it('should return proper boolean array when needed', () => {
    expect(boolean.required.array([true])).deep.equals([true]);
    expect(boolean.required.array(['false', true])).deep.equals([false, true]);
    expect(boolean.strict.required.array([false])).deep.equals([false]);
    expect(boolean.strict.optional.array(undefined)).deep.equals(undefined);
    expect(boolean.loose.required.array(['true', 'false', 1, 0, '-1', false])).deep.equals([
      true,
      false,
      true,
      false,
      true,
      false,
    ]);
  });

  it('should throw error for input array when needed', () => {
    expect(() => boolean.required.array(['1'])).throws(PowerGuardError);
    expect(() => boolean.required.array(undefined)).throws(PowerGuardError);
    expect(() => boolean.strict.required.array([true, 'false'])).throws(PowerGuardError);
    expect(() => boolean.strict.optional.array([1])).throws(PowerGuardError);
    expect(() => boolean.loose.required.array(['true1'])).throws(PowerGuardError);
  });
});
