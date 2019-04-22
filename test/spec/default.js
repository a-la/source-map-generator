import { equal, ok } from 'zoroaster/assert'
import Context from '../context'
import sourceMapGenerator from '../../src'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  'is a function'() {
    equal(typeof sourceMapGenerator, 'function')
  },
  async 'calls package without error'() {
    await sourceMapGenerator()
  },
  async 'gets a link to the fixture'({ FIXTURE }) {
    const res = await sourceMapGenerator({
      text: FIXTURE,
    })
    ok(res, FIXTURE)
  },
}

export default T