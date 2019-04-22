# @a-la/source-map-generator

[![npm version](https://badge.fury.io/js/@a-la/source-map-generator.svg)](https://npmjs.org/package/@a-la/source-map-generator)

`@a-la/source-map-generator` is [fork] Generates Source Maps, Works With Google Closure Compiler.

```sh
yarn add -E @a-la/source-map-generator
```

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [API](#api)
- [`sourceMapGenerator(arg1: string, arg2?: boolean)`](#mynewpackagearg1-stringarg2-boolean-void)
  * [`Config`](#type-config)
- [Copyright](#copyright)

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/0.svg?sanitize=true"></a></p>

## API

The package is available by importing its default function:

```js
import sourceMapGenerator from '@a-la/source-map-generator'
```

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/1.svg?sanitize=true"></a></p>

## `sourceMapGenerator(`<br/>&nbsp;&nbsp;`arg1: string,`<br/>&nbsp;&nbsp;`arg2?: boolean,`<br/>`): void`

Call this function to get the result you want.

__<a name="type-config">`Config`</a>__: Options for the program.

|   Name    |   Type    |    Description    | Default |
| --------- | --------- | ----------------- | ------- |
| shouldRun | _boolean_ | A boolean option. | `true`  |
| __text*__ | _string_  | A text to return. | -       |

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
example
```

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/2.svg?sanitize=true"></a></p>

## Copyright

(c) [À La Mode][1] 2019

[1]: https://alamode.cc

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/-1.svg?sanitize=true"></a></p>