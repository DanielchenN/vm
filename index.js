const { spawn } = require('child_process')
const path = require('path')


const code = 'var a = {"b": 123}; a'
const code2 = `this.constructor.constructor('return this.process')();
process.mainModule.require('child_process').execSync('cat /etc/passwd').toString()`

class VM  {
  constructor() {
    this.options = {
      timeout: 500,
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
      console.log('父进程chunk', chunk)
      this.result = chunk
    })
    this.child.on('exit', () => {
      console.log('exit')
      cb(this.error, this.result)
    })

    this.child.timer = setTimeout(() => {
      this.error = JSON.stringify({ result: 'TimeoutError', console: [] })
      this.child.kill('SIGKILL')
    }, this.options.timeout)
  }
}

const a = new VM()
a.run(code)

