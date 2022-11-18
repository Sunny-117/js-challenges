import { expect } from 'chai';
// Mocha is defined in the global object and is not exported.
import 'mocha';

function getBlobURL (jsCode) {
  const blob = new Blob([jsCode], {
    type: 'text/javascript'
  });
  const blobURL = URL.createObjectURL(blob);
  return blobURL;
}

export async function getCodeFn(code) {
  const url = getBlobURL(code);
  const ret = await import(url);
  return ret;
}

export function judge(codeFn, testFn) {
  return new Promise((resolve) => {

    // 使用浏览器全局的Mocha 和 chai
    const mocha = new Mocha();
    mocha.ui('bdd');
    mocha.suite.emit('pre-require', mocha, null, mocha);
    testFn(mocha.describe, mocha.it, expect, codeFn);

    let failed = new Map();
    let runner



    mocha.before(() => {
      runner.on('fail', (test, error) => {
        failed.set(test, error);
      })
    })

    mocha.after((done) => {
      runner.failed = failed;
      resolve(runner);
      done()
    })
    runner = Mocha.prototype.run.call(mocha);
  })
}

export function getErrorInfo (error) {
  switch (error.code || error.name) {
    case 'ERR_MOCHA_TIMEOUT':
      return {
        type: 'TLE',
        time: error.timeout,
        message: `您的程序未能在规定时间(${error.timeout}ms)内运行结束`
      }
    case 'AssertionError':
      return {
        type: 'WA',
        message: `答案错误(${error.message})`
      }
    default:
      return {
        type: 'RE',
        message: `运行时错误(${error.message})`
      }
  }
}