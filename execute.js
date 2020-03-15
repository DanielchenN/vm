const vm = require('vm')
const fs = require('fs')

let result = ''

const genRunner = function() {
  return function run(code) {
    const result = new Function(`return eval(${JSON.stringify(code)})`)
    return result()
  }
}


const run = function(code) {
  const context = vm.createContext(Object.create(null))
  const runner = vm.runInContext(`(${genRunner.toString()})()`, context)
  // const runner2 = vm.runInContext(code2, context)
  // console.log('runner2', runner2)
  try {
    const res = runner(code)
    process.send(res)
    process.exit(0)
  } catch(e) {
    result += e.name + ' ' + e.message
    process.send(JSON.stringify(result))
    process.exit(0)
  }
}


process.on('message', (m) => {
  console.log('子进程收到消息', m);
  run(m)
});