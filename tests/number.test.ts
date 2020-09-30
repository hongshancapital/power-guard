import { number, PowerGuardError } from '../src';
import { expect } from 'chai';

describe('Number guard', () => {
  it('should return proper number when needed', () => {
    expect(number.required(10)).equals(10);
    expect(number.strict.optional(10)).equals(10);
    expect(number.optional(undefined)).equals(undefined);
    expect(number.gt(10).optional(undefined)).equals(undefined);
    expect(number.gt(10).required('11')).equals(11);
    expect(number.gt(10).lte(11).required(11)).equals(11);
    expect(number.lt(11).required(10)).equals(10);
    expect(number.gte(10).lte(11).required(10)).equals(10);
    expect(number.gte(10).lte(11).required('10')).equals(10);
    expect(number.gte(0).required(0)).equals(0);
    expect(number.lte(0).required('0')).equals(0);
    expect(number.strict.required(10)).equals(10);
    expect(number.with([10, 11]).strict.required(10)).equals(10);
    expect(
      number.with({ lower: 10, equalsLower: true, upper: 11, equalsUpper: true }).required(10),
    ).equals(10);
    expect(number.with({ lower: 10, upper: 11 }).optional(undefined)).equals(undefined);
    expect(number.with({ lower: 10, upper: 12 }).required(11)).equals(11);
  });

  it('should thow error when needed', () => {
    expect(() => number.required(undefined)).throws(PowerGuardError);
    expect(() => number.strict.optional('10')).throws(PowerGuardError);
    expect(() => number.optional('asd')).throws(PowerGuardError);
    expect(() => number.gt(10).optional('9')).throws(PowerGuardError);
    expect(() => number.gt(10).required(9)).throws(PowerGuardError);
    expect(() => number.gt(0).required(-1)).throws(PowerGuardError);
    expect(() => number.lt(0).required(0.1)).throws(PowerGuardError);
    expect(() => number.gt(10).lte(11).required(10)).throws(PowerGuardError);
    expect(() => number.lt(11).required(12)).throws(PowerGuardError);
    expect(() => number.gte(10).lte(11).required('9')).throws(PowerGuardError);
    expect(() => number.gte(10).lte(11).required('12')).throws(PowerGuardError);
    expect(() => number.strict.required('10')).throws(PowerGuardError);
    expect(() => number.with([10, 11]).strict.required('10')).throws(PowerGuardError);
    expect(() =>
      number.with({ lower: 10, equalsLower: true, upper: 11, equalsUpper: true }).required(9),
    ).throws(PowerGuardError);
    expect(() => number.with({ lower: 10, upper: 11 }).optional(10)).throws(PowerGuardError);
    expect(() => number.with({ lower: 10, upper: 12 }).required(10)).throws(PowerGuardError);
  });

  it('should return proper number array when needed', () => {
    expect(number.required.array([10, '11', '12'])).deep.equals([10, 11, 12]);
    expect(number.strict.optional.array([10, 11, 12])).deep.equals([10, 11, 12]);
    expect(number.optional.array(undefined)).deep.equals(undefined);
    expect(number.gt(10).optional.array(undefined)).deep.equals(undefined);
    expect(number.gt(10).required.array(['11', 12, 13])).deep.equals([11, 12, 13]);
    expect(number.gt(10).lte(11).required.array([11, '11'])).deep.equals([11, 11]);
    expect(number.lt(11).required.array([10, 9, 8])).deep.equals([10, 9, 8]);
    expect(number.gte(10).lte(11).required.array([10, 11])).deep.equals([10, 11]);
    expect(number.gte(10).lte(11).required.array(['10', '11'])).deep.equals([10, 11]);
    expect(number.strict.required.array([10, 11, 12])).deep.equals([10, 11, 12]);
    expect(number.with([10, 12]).strict.required.array([10, 11, 12])).deep.equals([10, 11, 12]);
  });

  it('should thow error for input array when needed', () => {
    expect(() => number.required.array([10, '11', false])).throws(PowerGuardError);
    expect(() => number.strict.optional.array([10, 11, '12'])).throws(PowerGuardError);
    expect(() => number.optional.array(10)).throws(PowerGuardError);
    expect(() => number.gt(10).optional.array([10, 9])).throws(PowerGuardError);
    expect(() => number.gt(10).required.array(undefined)).throws(PowerGuardError);
    expect(() => number.gt(10).lte(11).required.array([11, '12'])).throws(PowerGuardError);
    expect(() => number.lt(11).required.array([10, 11, 8])).throws(PowerGuardError);
    expect(() => number.gte(10).lte(11).required.array([9, 11])).throws(PowerGuardError);
    expect(() => number.gte(10).lte(11).required.array(['9', '11'])).throws(PowerGuardError);
    expect(() => number.strict.required.array(undefined)).throws(PowerGuardError);
    expect(() => number.with([10, 12]).strict.required.array([8, 11, 12])).throws(PowerGuardError);
  });
});
