import { string, PowerGuardError } from '../src';
import { expect } from 'chai';

describe('String guard', () => {
  it('should return proper string when needed', () => {
    expect(string.required('str')).equals('str');
    expect(string.with(10).required('str')).equals('str');
    expect(string.with(10).optional(undefined)).equals(undefined);
    expect(string.escaped.optional('！ａｂｃ　ＡＢＣ！')).equals('abc ABC');
    expect(string.escaped.optional('Image.PNG')).equals('ImagePNG');
    expect(string.required('！ａｂｃ　ＡＢＣ！')).equals('！ａｂｃ　ＡＢＣ！');
    expect(string.notEmpty('abc ')).equals('abc ');
  });

  it('should throw error when needed', () => {
    expect(() => string.required(undefined)).throws(PowerGuardError);
    expect(() => string.with(10).required('areallylongstring')).throws(PowerGuardError);
    expect(() => string.escaped.optional(123)).throws(PowerGuardError);
    expect(() => string.escaped.optional(true)).throws(PowerGuardError);
    expect(() => string.escaped.optional({})).throws(PowerGuardError);
    expect(() => string.escaped.required(undefined)).throws(PowerGuardError);
    expect(() => string.escaped.notEmpty('   ')).throws(PowerGuardError);
    expect(() => string.escaped.notEmpty('  ! ')).throws(PowerGuardError);
    expect(() => string.escaped.notEmpty('')).throws(PowerGuardError);
  });

  it('should return proper string array when needed', () => {
    expect(string.required.array(['foo', 'bar', 'baz'])).deep.equals(['foo', 'bar', 'baz']);
    expect(string.with(10).required.array(['str', '123', '1234567890'])).deep.equals([
      'str',
      '123',
      '1234567890',
    ]);
    expect(string.with(10).optional.array(undefined)).deep.equals(undefined);
    expect(
      string.escaped.optional.array(['！ａｂｃ　ＡＢＣ！', '?ABC.abc', 'Image.PNG']),
    ).deep.equals(['abc ABC', 'ABCabc', 'ImagePNG']);
    expect(string.required.array(['！ａｂｃ　ＡＢＣ！', '?ABC.abc', 'Image.PNG'])).deep.equals([
      '！ａｂｃ　ＡＢＣ！',
      '?ABC.abc',
      'Image.PNG',
    ]);
    expect(string.notEmpty.array([' foo', 'bar ', 'baz'])).deep.equals([' foo', 'bar ', 'baz']);
  });

  it('should throw error for input array when needed', () => {
    expect(() => string.required.array(undefined)).throws(PowerGuardError);
    expect(() => string.with(10).required.array(['foo', 'areallylongstring'])).throws(
      PowerGuardError,
    );
    expect(() => string.escaped.optional.array(['123', 123])).throws(PowerGuardError);
    expect(() => string.escaped.optional.array([true])).throws(PowerGuardError);
    expect(() => string.escaped.optional.array([{}])).throws(PowerGuardError);
    expect(() => string.escaped.required.array(undefined)).throws(PowerGuardError);
    expect(() => string.escaped.notEmpty.array([' foo', 'bar ', '！'])).throws(PowerGuardError);
  });
});
