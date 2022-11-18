import {
  judge,
  getCodeFn,
  getErrorInfo
} from './judger.mjs';
import markdownIt from 'markdown-it';
import Prism from 'prismjs';
import jcodeStyle from './css/jcode.css';
import prismCss from 'prismjs/themes/prism.css';

function sleep(ms = 50) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function createStyleEl (css) {
  let el = document.createElement('style');
  el.innerText = css;
  return el
}

// run test in a browser
class OjTest extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({
      mode: 'open'
    });
    this.root = document.createElement('div');
    this.shadow.appendChild(this.root);
    this.shadow.appendChild(createStyleEl(jcodeStyle));
    this.root.innerHTML = `
    <div class="info"><span class="info-reverse">RUN</span>运行测试中...</div>
    `;
    this.runTest().then(runner => {
      this.render(runner)
    }).catch((e) => {
      this.root.innerHTML = `<div class="error">
      <span class="error-reverse">RE</span>
      ${e.message}</div>`;
    })
  }

  async runTest () {
    let [problemName] = ['problem'].map((x) => this.getAttribute(x));
    let script = document.querySelectorAll('script[type=module]');
    while (script.length <= 0) {
      await sleep();
      script = document.querySelectorAll('script[type=module]');
    }

    const code = script[script.length - 1].textContent;
    let [codeFn, testFn] = await Promise.all([
      getCodeFn(code),
      import(`../questions/${problemName}/test.js`)
    ]).catch((e) => {
      console.error(e);
      throw new Error('测试代码加载失败,请检查问题名称是否正确')
    });

    if (!codeFn || !codeFn.default || typeof !codeFn.default === 'function') {
      throw new Error('代码格式需要默认导出为函数')
    }

    return judge(codeFn.default, testFn.default)
  }

  render(runner) {
    let [problemName] = ['problem'].map((x) => this.getAttribute(x));
    this.root.innerHTML = '';
    this.root.appendChild(this.renderStat(runner))
  }

  renderStat(runner) {
    let root = document.createElement('div');
    if (runner.failed.size > 0) {
      let firstError = runner.failed.entries().next().value
      let info = getErrorInfo(firstError[1])
      root.innerHTML = `<div class="error">
      <span class="error-reverse">${info.type}</span>
      ${info.message}(已通过 ${runner.stats.passes}/${runner.stats.tests} 个测试用例)</div>`
    }
    else {
      root.innerHTML = `<div class="success"><span class="success-reverse">AC</span>已通过全部测试用例(${runner.stats.passes}/${runner.stats.tests})</div>`
    }
    return root;
  }

}

customElements.define('oj-test', OjTest);

// display info of problem
class OjDescription extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' })
    this.shadow.appendChild(createStyleEl(prismCss));
    this.render();
  }

  async render () {
    let [problemName] = ['problem'].map((x) => this.getAttribute(x));
    let md = markdownIt({
      highlight: function (str, lang) {
        const language = Prism.languages[lang];
        if (language) {
          try {
            return '<pre><code>' +
              Prism.highlight(str, language, lang) +
              '</code></pre>';
          } catch (__) {}
        }

        return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
      }
    });
    let text = await fetch(`../questions/${problemName}/README.md`)
      .then(res => {
        if ([2, 3].includes(Math.floor(res.status / 100))) {
          return res.text();
        }
        else {
          return "问题加载失败"
        }
      })
    let el = document.createElement('div');
    el.innerHTML = md.render(text);
    this.shadow.appendChild(el);
  }

}

customElements.define('oj-desc', OjDescription);
