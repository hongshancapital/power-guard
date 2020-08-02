# Power Guard

The 0 dependency recipe for type strong validations: from `unknown` to anything you want. [中文](README-cn.md)

![CI](https://github.com/gao-sun/power-guard/workflows/CI/badge.svg) ![version](https://badgen.net/npm/v/power-guard) ![size](https://badgen.net/bundlephobia/minzip/power-guard)

### 🤔 A Cozy Way to Validate Unknown Variables

Instead of having:

```ts
const validate = (x: unknown): SomeType => {
  if (!(typeof x === 'object' && x !== null)) {
    throw new Error('x should be an object');
  }
  if (!('foo' in x && typeof x.foo === 'string')) {
    throw new Error('x.foo should be a string');
  }
  if (!('bar' in x && typeof x.bar === 'boolean')) {
    throw new Error('x.bar should be a boolean');
  }
  // ... a lot of validations
  return x;
};
```

Why not:

```ts
const guarded = guard({
  foo: string.required,
  bar: boolean.required,
  // ... other rules
})(x);
```

### Installation

```bash
yarn add power-guard
# npm
npm i power-guard
```

### Play with Your Favorite Framework

`Express.js`:

```ts
const { id, name } = guard({ id: number.required, name: string.required })(req.body);
```

`Koa`:

```ts
const { id, name } = guard({ id: number.required, name: string.required })(ctx.request.body);
```

## Examples

### Primitive Validation

```ts
import { number, string, boolean } from 'power-guard';

number.required(10); // 10
number.strict.required('10'); // error: string is not allowed in strict mode
number.gt(10).required('10'); // error: value should be greater than 10
string.with(10).required('a really long string'); // error: string has max length 10
string.optional(undefined); // undefined
boolean.required.array([true, false]); // [true, false]
boolean.required.array(true); // error: value should be an array
boolean.loose.required('1'); // true
```

### Object Validation

```ts
import guard, { number, string, boolean } from 'power-guard';

const guardObject = guard({
  foo: number.required,
  bar: string.optional,
  baz: boolean.required,
});

const { foo, bar, baz } = guardObject({ foo: 10, baz: true }); // 10, undefined, true
const { foo, bar, baz } = guardObject({ foo: '10', baz: 'true' }); // 10, undefined, true
const { foo, bar, baz } = guardObject({ foo: 'abc', baz: 'true' }); // error: foo should be a number
```

### Validating Complex Objects

```ts
import guard, { number, string, enumGuard, boolean, array } from 'power-guard';

enum Foo {
  key1 = 'key1',
  key2 = 2,
}

const guardObject = guard({
  foo: number.gte(10).required,
  bar: string.escaped.optional,
  baz: enumGuard(Foo).optional.array,
  bla: boolean.loose.optional,
  bnd: array(guard({ foo: number.strict.required })),
});

const guarded = guardObject({
  foo: '10',
  bar: '！ａｂｃ　ＡＢＣ！',
  baz: [2, 'key1'],
  bla: 1,
  bnd: [{ foo: 123 }, { foo: 456 }],
});

/*
{
  foo: 10,
  bar: 'abc ABC',
  baz: [2, 'key1'],
  bla: true,
  bnd: [{ foo: 123 }, { foo: 456 }],
}
*/
```

## Docs

### The `guard` function

This function receives a `DataConfig` object as parameter, and returns a guard function which accepts an unknown variable and returns a typed object based on the config if validation succeeded, otherwise it will throw a `PowerGuardError`.

In short, this is the function for validating objects. Say we want an object to have the shape like:

```ts
{ foo: 123, bar: 'abc' }
```

Then we just need to tell `power-guard`:

```ts
const guardObject = guard({
  foo: number.required,
  bar: string.required,
});
```

You may notice there are various built-in guards, meanwhile deep customizations are also allowed:

```ts
const validate = (x: unknown): SomeType => {
  // your code goes here
};

const guardObject = guard({
  foo: validate,
});

const { foo } = guardObject(x); // foo will be `SomeType` if succeeded
```

### Built-in Guards

Each of the guards below should follow with a `.required` or `.optional`, while the latter will allow `undefined`. Simply append `.array` in the end when needed e.g. `boolean.required.array`.

#### boolean

| Boolean Guard  | Description                                                                                                                                                                         |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| boolean        | A boolean value must be presented. `'true'` and `'false'` are acceptable.                                                                                                           |
| boolean.strict | A boolean value must be presented. No implicit conversions allowed.                                                                                                                 |
| boolean.loose  | A boolean value must be presented. `'true'` and `'false'` are acceptable. If the value can be converted to a number, then return `false` iff the number equals 0, otherwise `true`. |

#### enum

| Enum Guard          | Description                            |
| ------------------- | -------------------------------------- |
| enumGuard(EnumType) | A value of EnumType must be presented. |

#### number

| Number Guard                    | Description                                                               |
| ------------------------------- | ------------------------------------------------------------------------- |
| number                          | A number value must be presented. Valid number string is also acceptable. |
| number.strict                   | A number value must be presented. No implicit conversions allowed.        |
| number.with([lower, upper])     | A number value within [lower, upper] must be presented.                   |
| number.with(range: NumberRange) | A number value within the range must be presented.                        |
| number.gt(x)                    | A number value within (x, +∞) must be presented.                          |
| number.gte(x)                   | A number value within [x, +∞) must be presented.                          |
| number.lt(x)                    | A number value within (-∞, x) must be presented.                          |
| number.lte(x)                   | A number value within (-∞, x] must be presented.                          |

```ts
type NumberRange = Partial<{
  lower: number;
  equalsLower: boolean;
  upper: number;
  equalsUpper: boolean;
}>;
```

Note you can chain these restrictions like: `number.gt(10).lte(20).strict.required`

#### string

| String Guard   | Description                                                                                                                            |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| string         | A string value must be presented.                                                                                                      |
| string.escaped | A string value must be presented. Punctuations and unknown chars will be removed and fullwidth chars will be converted into halfwidth. |
| string.with(x) | A string value with a max length of x must be presented.                                                                               |

Note you can chain them as well, e.g.: `string.with(10).escaped.optional`

#### array

There's a helper function for customized array guards with optional override:

```ts
function array(elemGuard: (x: unknown) => T): (x: unknown) => Array<T>;
function array(elemGuard: (x: unknown) => T, optional: true): (x: unknown) => Array<T> | undefined;
```

#### Traditional Type Guards

`power-guard` will return a variable with the type you want instead of asserting types like traditional type guards. Browse [types.ts](src/types.ts) if you would like to infer types.
