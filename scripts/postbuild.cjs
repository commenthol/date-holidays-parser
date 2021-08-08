/* eslint-disable node/no-path-concat */
const fs = require('fs')

function replace () {
  const filename = `${__dirname}/../lib/vsop87Bearth.cjs`
  let data = fs.readFileSync(filename, 'utf8')
  data = data.replace("require('astronomia/data/vsop87Bearth')", "require('astronomia/lib/data/vsop87Bearth.cjs')")
  fs.writeFileSync(filename, data, 'utf8')
}

replace()
