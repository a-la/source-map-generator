import makeTestSuite from '@zoroaster/mask'
import Context from '../context'
import sourceMapGenerator from '../../src'

// export default
makeTestSuite('test/result', {
  async getResults(input) {
    const res = await sourceMapGenerator({
      text: input,
    })
    return res
  },
  context: Context,
})