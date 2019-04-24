# @a-la/source-map-generator

[![npm version](https://badge.fury.io/js/%40a-la%2Fsource-map-generator.svg)](https://npmjs.org/package/@a-la/source-map-generator)

`@a-la/source-map-generator` is a [fork](https://github.com/mozilla/source-map) of Mozilla/SourceMap that Generates Source Maps and Works With Google Closure Compiler. It was rewritten in ES6 syntax and externs for _GCC_ were provided for compilation.

```sh
yarn add @a-la/source-map-generator
```

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [API](#api)
- [`class SourceMapGenerator`](#class-sourcemapgenerator)
  * [`constructor(conf: Config): SourceMapGenerator`](#constructorconf-config-sourcemapgenerator)
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


### `constructor(`<br/>&nbsp;&nbsp;`conf: Config,`<br/>`): SourceMapGenerator`

The constructor method is called to create a new source map.

__<a name="type-_sourcemapgeneratorconfig">`_sourceMapGenerator.Config`</a>__: Options for the program.

|      Name      |   Type    |                                                                                                           Description                                                                                                           | Default |
| -------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| file           | _string_  | The filename of the generated source.                                                                                                                                                                                           | -       |
| sourceRoot     | _string_  | A root for all relative URLs in this source map.                                                                                                                                                                                | -       |
| skipValidation | _boolean_ | When `true`, disables validation of mappings as they are added. This can improve performance but should be used with discretion, as a last resort. Even then, one should avoid using this flag when running tests, if possible. | `false` |

```js
import SourceMapGenerator from '@a-la/source-map-generator'
import { readFileSync } from 'fs'

const file = `${readFileSync(__filename)}`

const gen = new SourceMapGenerator({
  file: 'example/index.js',
})
/**
 * Generate the source map for the file, keeping all positions as they are.
 *
 * The first two rules will update inline and block comments to not have any tokens in them.
 * The third rule will break each line into tokens and add mappings.
 */
const linesInSource = file
  .replace(/\/\*(?:[\s\S]+?)\*\//g, (match, pos) => {
    const next = file[pos + match.length]
    if (next == '\n') return '\n'.repeat(match.split('\n').length - 1)

    const lines = match.split('\n')
    const lastLineI = lines.length - 1
    const lastLine = lines[lastLineI]
    const ss = ' '.repeat(lastLine.length)
    const ws = '\n'.repeat(lastLineI)
    return `${ws}${ss}`
  })
  .replace(/\/\/(.+)/gm, (match) => {
    return ' '.repeat(match.length)
  })
  .split('\n')
linesInSource.forEach((l, i) => {
  const line = i + 1
  l
    .replace(/(?:(?:\s+)|(?:[$_\w\d]+)|.)/g, (match, column) => {
      if (column == 0 && /^\s+$/.test(match)) return
      const generated = {
        line,
        column,
      }
      const m = {
        generated,
        source: __filename,
        original: generated,
      }
      gen.addMapping(m)
    })
})
gen.setSourceContent(__filename, file)
const sourceMap = gen.toJSON()
console.log(sourceMap)
```
```js
{ version: 3,
  sources: [ '/Users/zavr/a-la/source-map-generator/example/index.js' ],
  names: [],
  mappings: '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',
  file: 'example/index.js',
  sourcesContent: 
   [ 'import SourceMapGenerator from \'../src\'\nimport { readFileSync } from \'fs\'\n\nconst file = `${readFileSync(__filename)}`\n\nconst gen = new SourceMapGenerator({\n  file: \'example/index.js\',\n})\n/**\n * Generate the source map for the file, keeping all positions as they are.\n *\n * The first two rules will update inline and block comments to not have any tokens in them.\n * The third rule will break each line into tokens and add mappings.\n */\nconst linesInSource = file\n  .replace(/\\/\\*(?:[\\s\\S]+?)\\*\\//g, (match, pos) => {\n    const next = file[pos + match.length]\n    if (next == \'\\n\') return \'\\n\'.repeat(match.split(\'\\n\').length - 1)\n\n    const lines = match.split(\'\\n\')\n    const lastLineI = lines.length - 1\n    const lastLine = lines[lastLineI]\n    const ss = \' \'.repeat(lastLine.length)\n    const ws = \'\\n\'.repeat(lastLineI)\n    return `${ws}${ss}`\n  })\n  .replace(/\\/\\/(.+)/gm, (match) => {\n    return \' \'.repeat(match.length)\n  })\n  .split(\'\\n\')\nlinesInSource.forEach((l, i) => {\n  const line = i + 1\n  l\n    .replace(/(?:(?:\\s+)|(?:[$_\\w\\d]+)|.)/g, (match, column) => {\n      if (column == 0 && /^\\s+$/.test(match)) return\n      const generated = {\n        line,\n        column,\n      }\n      const m = {\n        generated,\n        source: __filename,\n        original: generated,\n      }\n      gen.addMapping(m)\n    })\n})\ngen.setSourceContent(__filename, file)\nconst sourceMap = gen.toJSON()\nconsole.log(sourceMap)' ] }
```

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/2.svg?sanitize=true"></a></p>

## Copyright

Original Authors: [Mozilla](https://github.com/mozilla/source-map/)

---

<table>
  <tr>
    <th>
      <a href="https://artd.eco">
        <img src="https://raw.githubusercontent.com/wrote/wrote/master/images/artdeco.png" alt="Art Deco" />
      </a>
    </th>
    <th>© <a href="https://artd.eco">Art Deco</a> for <a href="https://alamode.cc">À La Mode</a> 2019</th>
    <th>
      <a href="https://www.technation.sucks" title="Tech Nation Visa">
        <img src="https://raw.githubusercontent.com/artdecoweb/www.technation.sucks/master/anim.gif"
          alt="Tech Nation Visa" />
      </a>
    </th>
    <th><a href="https://www.technation.sucks">Tech Nation Visa Sucks</a></th>
  </tr>
</table>

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/-1.svg?sanitize=true"></a></p>