const opts = require('commander')
  .version('1.0.0')
  .option('-p, --port <n>', 'use port')
  .parse(process.argv)

const port = opts.port
const service = opts.args[0]

if( !( port || service) ) {
  console.error('service or port not specified')
  process.exit(1)
}




