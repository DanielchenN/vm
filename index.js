const { spawn } = require('child_process')
const path = require('path')

class VM  {
  constructor(options) {
    this.options = {
      timeout: 500 || options.timeout,
      node:    'node',
      executor:  path.join(__dirname, 'execute.js')
    }
    this.error = null
    this.result = null
  }

  run(code, cb) {
    this.child = spawn(this.options.node, [this.options.executor], {stdio: ['inherit', 'inherit', 'inherit', 'ipc']})
    this.child.send(code)
    this.child.on('message', (chunk) => {
      // console.log('父进程chunk', chunk)
      this.result = chunk
    })
    this.child.on('exit', () => {
      // console.log('exit')
      cb(this.error, this.result)
    })

    this.child.timer = setTimeout(() => {
      this.error = JSON.stringify({ result: 'TimeoutError', console: [] })
      this.child.kill('SIGKILL')
    }, this.options.timeout)
  }
}

module.exports = VM



