import path from 'path';
import fs, { read } from 'fs';
import {
  fileURLToPath
} from 'url';

import {QUESTION_BASE, PLAYGROUND_BASE, CACHE_BASE} from './constants.mjs'

function readFile(path) {
  return fs
    .readFileSync(path)
    .toString('utf-8')
}

function getPath (parts, options = {}) {
  let result = path.resolve(...parts)
  result = options.basePath ? path.relative(options.basePath, result) : result;
  result = options.transform ? result.split(path.sep).join('/') : result;
  return result;
}

function getPlaygroundCodePath (problem, options) {
  return getPath([PLAYGROUND_BASE, `${problem}.mjs`], options)
}

function getDescriptionPath(problem, options) {
  return getPath([QUESTION_BASE, problem, 'README.md'], options)
}

function getTemplateCodePath (problem, options) {
  return getPath([QUESTION_BASE, problem, 'template.js'], options)
}

function getTestCodePath (problem, options) {
  return getPath([QUESTION_BASE, problem, 'test.js'], options)
}

export function getProblem(key, options = {}) {
  if (!key) return null;

  let problems = fs.readdirSync(QUESTION_BASE);
  let problem = problems.find((str) => str.startsWith(key));
  if (!problem) return null;
  return getProblemByFullName(problem, options);
}

export function getProblemByFullName (problem, options = {}) {
  if (!problem) return null;

  let [id, ...others] = problem.split('-');

  return {
    id,
    title: others.join('-'),
    fullName: problem,
    descriptionPath: getDescriptionPath(problem, options),
    playgroundCodePath: getPlaygroundCodePath(problem, options),
    testCodePath: getTestCodePath(problem, options),
    templateCodePath: getTemplateCodePath(problem, options),
    hasPlaygroundCode: fs.existsSync(getPlaygroundCodePath(problem, options))
  }

}

// mocha works with cli and file
export function generateTestCode (problemFullName) {
  let options = {
    transform: true,
    basePath: CACHE_BASE
  }
  let info = getProblemByFullName(problemFullName, options);
  let testCode = `
import {createMochaTest} from '../lib/node/create-mocha-test.mjs';
import testFn from '${info.testCodePath}';
import playgroundFn from '${info.playgroundCodePath}';

createMochaTest(testFn, playgroundFn)
`;
  let targetPath = path.resolve(CACHE_BASE, `${info.fullName}.mjs`);
  if (!fs.existsSync(CACHE_BASE)) {
    fs.mkdirSync(CACHE_BASE)
  }
  fs.writeFileSync(targetPath, testCode);
  return targetPath;
}

export function generatePlaygroundCode (problemFullName, force) {
  let info = getProblemByFullName(problemFullName);
  if (!force && fs.existsSync(info.playgroundCodePath)) {
    throw new Error('The code has been generated. Please use `--force` option to override.')
  }
  if (!fs.existsSync(PLAYGROUND_BASE)) {
    fs.mkdirSync(PLAYGROUND_BASE)
  }
  fs.writeFileSync(info.playgroundCodePath, readFile(info.templateCodePath));
}