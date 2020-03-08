# `@morrighan/decorators-bridge`

The bridged interface for legacy and stage 2 decorators in order to use [`@babel/plugin-proposal-decorators`][babel decorators plugin] without `{ "legacy": true }` option.

[![Build Status][github actions badge]][github actions][![License][license badge]](LICENSE)[![Package Version][github releases version badge]][github releases]

## Table of Contents

- [`@morrighan/decorators-bridge`](#morrighandecorators-bridge)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
    - [Without GitHub Packages](#without-github-packages)
  - [Usage](#usage)
    - [For legacy decorators hoisting](#for-legacy-decorators-hoisting)
      - [Class decorator](#class-decorator)
      - [Property decorator](#property-decorator)
      - [Method decorator](#method-decorator)
    - [For stage 2 decorators with TypeScript](#for-stage-2-decorators-with-typescript)
      - [Class decorator](#class-decorator-1)
      - [Field decorator](#field-decorator)
      - [Method decorator](#method-decorator-1)
  - [License](#license)

## Installation

This library published on GitHub Packages. details are checkout [this link][github packages installing docs].

```sh
$ npm login --registry="https://npm.pkg.github.com" --scope=@morrighan
$ npm install --save @morrighan/decorators-bridge
```

### Without GitHub Packages

```sh
$ npm install --save "git+ssh://git@github.com:morrighan/decorators-bridge#semver"
```

Followed from [npm's official `package.json` docs][npm package.json docs].

## Usage

This library only supports compilation to stage 2 decorators targeting.

### For legacy decorators hoisting

These functions will hoist legacy decorators to stage 2 and keeping type as-is.

#### Class decorator

```typescript
import { fromClassDecorator } from '@morrighan/decorators-bridge';

type Constructible<T = any> = new (...args: any[]) => T;

export default fromClassDecorator(<T extends Constructible>(
    targetClass: T
): void | T => {
    // ...
});
```

#### Property decorator

```typescript
import { fromPropertyDecorator } from '@morrighan/decorators-bridge';

type PropertyDescriptor = Record<'configurable' | 'enumerable' | 'writable', boolean | undefined>;

export default fromPropertyDecorator((
    target: object,
    propertyKey: PropertyKey,
    descriptor?: PropertyDescriptor & { initializer?: () => any }
): void => {
    // ...
});
```

#### Method decorator

```typescript
import { fromMethodDecorator } from '@morrighan/decorators-bridge';

type PropertyDescriptor = Record<'configurable' | 'enumerable' | 'writable', boolean | undefined>;

interface MethodDescriptor extends PropertyDescriptor {
    value: (...args: any[]) => any;
}

interface AccessorDescriptor extends Omit<PropertyDescriptor, 'writable'> {
    get: () => any;
    set: (value: any) => void;
}

export default fromMethodDecorator((
    target: object,
    propertyKey: PropertyKey,
    descriptor: MethodDescriptor | AccessorDescriptor
): void | PropertyDescriptor => {
    // ...
});
```

### For stage 2 decorators with TypeScript

These functions just perform forced type casting to legacy's that for compatibility.
(e.g. `Stage2ClassDecorator as unknown as LegacyClassDecorator`)

You can check usage and details of stage 2 decorators on [this link][decorators proposal].

#### Class decorator

```typescript
import type { ClassDescriptor } from '@morrighan/decorators-bridge';
import { asClassDecorator } from '@morrighan/decorators-bridge';

export default asClassDecorator((descriptor: ClassDescriptor) => {
    // ...
});
```

#### Field decorator

**Caveats**: In stage 2, `property` term has changed to `field`.

```typescript
import type { FieldDescriptor } from '@morrighan/decorators-bridge';
import { asFieldDecorator } from '@morrighan/decorators-bridge';

export default asFieldDecorator((descriptor: FieldDescriptor) => {
    // ...
});
```

#### Method decorator

```typescript
import type { MethodDescriptor } from '@morrighan/decorators-bridge';
import { asMethodDecorator } from '@morrighan/decorators-bridge';

export default asMethodDecorator((descriptor: MethodDescriptor) => {
    // ...
});
```

## License

[MIT Licensed](LICENSE).

[github actions badge]: https://img.shields.io/github/workflow/status/morrighan/decorators-bridge/On%20default/develop?style=flat-square
[github actions]: https://github.com/morrighan/decorators-bridge/actions
[license badge]: https://img.shields.io/github/license/morrighan/decorators-bridge.svg?style=flat-square
[github releases version badge]: https://img.shields.io/github/v/release/morrighan/decorators-bridge?sort=semver&style=flat-square
[github releases]: https://github.com/morrighan/decorators-bridge/releases
[github packages installing docs]: https://help.github.com/en/packages/publishing-and-managing-packages/installing-a-package
[babel decorators plugin]: https://babeljs.io/docs/en/babel-plugin-proposal-decorators
[decorators proposal]: https://github.com/tc39/proposal-decorators/tree/master/previous
[npm package.json docs]: https://docs.npmjs.com/files/package.json#git-urls-as-dependencies
