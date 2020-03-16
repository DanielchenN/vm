const VM = require('./')

const code = 'var a = {"b": 123}; a'
const code2 = `this.constructor.constructor('return this.process')();
process.mainModule.require('child_process').execSync('cat /etc/passwd').toString()`

const runner = new VM()
const runner2 = new VM()
runner.run(code, (err, res) => {
  console.log('err', err)
  console.log('ser', res)
})

runner2.run(code2, (err, res) => {
  console.log('err', err)
  console.log('ser', res)
})