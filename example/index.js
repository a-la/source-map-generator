import SourceMapGenerator from '../src'
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