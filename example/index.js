/* alanode example/ */
import sourceMapGenerator from '../src'

(async () => {
  const res = await sourceMapGenerator({
    text: 'example',
  })
  console.log(res)
})()