# @a-la/source-map-generator

[![npm version](https://badge.fury.io/js/%40a-la%2Fsource-map-generator.svg)](https://npmjs.org/package/@a-la/source-map-generator)

`@a-la/source-map-generator` is [fork] Generates Source Maps, Works With Google Closure Compiler.

```sh
yarn add -E @a-la/source-map-generator
```

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [API](#api)
- [`class SourceMapGenerator`](#class-sourcemapgenerator)
  * [`constructor(conf: Config)`](#constructorconf-config-void)
    * [`_sourceMapGenerator.Config`](#type-_sourcemapgeneratorconfig)
- [Copyright](#copyright)

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/0.svg?sanitize=true"></a></p>

## API

The package is available by importing its default function:

```js
import sourceMapGenerator from '@a-la/source-map-generator'
```

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/1.svg?sanitize=true"></a></p>

## `class SourceMapGenerator`

An instance of the SourceMapGenerator represents a source map which is being built incrementally.

**Removed Methods For Now**

- [x] `static fromSourceMap`
- [x] `applySourceMap`


### `constructor(`<br/>&nbsp;&nbsp;`conf: Config,`<br/>`): void`

The constructor method is called to create a new source map.

__<a name="type-_sourcemapgeneratorconfig">`_sourceMapGenerator.Config`</a>__: Options for the program.

|      Name      |   Type    |                                                                                                           Description                                                                                                           | Default |
| -------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| file           | _string_  | The filename of the generated source.                                                                                                                                                                                           | -       |
| sourceRoot     | _string_  | A root for all relative URLs in this source map.                                                                                                                                                                                | -       |
| skipValidation | _boolean_ | When `true`, disables validation of mappings as they are added. This can improve performance but should be used with discretion, as a last resort. Even then, one should avoid using this flag when running tests, if possible. | `false` |

```js
/* alanode example/ */
import sourceMapGenerator from '@a-la/source-map-generator'

(async () => {
  const res = await sourceMapGenerator({
    text: 'example',
  })
  console.log(res)
})()
```
```

```

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/2.svg?sanitize=true"></a></p>

## Copyright

(c) [À La Mode][1] 2019

[1]: https://alamode.cc

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/-1.svg?sanitize=true"></a></p>