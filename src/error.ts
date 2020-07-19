export default function throwError(type: string): never {
  throw Error(`Error guarding ${type}`);
}
