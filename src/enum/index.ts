import guard from './guard';

class EnumGuard<T> implements GuardClass<T[keyof T]> {
  static create<T>(enumObject: T) {
    return new EnumGuard(enumObject);
  }

  private enumObject: T;

  get required() {
    return (x: unknown) => guard(this.enumObject, x);
  }

  get optional() {
    return (x: unknown) => guard(this.enumObject, x, true);
  }

  constructor(enumObject: T) {
    this.enumObject = enumObject;
  }
}

export default EnumGuard.create;
