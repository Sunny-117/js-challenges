import path from 'path';
import fs from 'fs';
import { getProblemByFullName } from '../node/utils.mjs';
import { QUESTION_BASE, ROOT_BASE } from '../node/constants.mjs';

let problems = fs.readdirSync(QUESTION_BASE);

let result = [];

for (let problem of problems) {
  result.push(getProblemByFullName(problem, {
    basePath: path.resolve(ROOT_BASE, './dist'),
    transform: true
  }))
}

if (!fs.existsSync(path.resolve(ROOT_BASE, 'dist'))) {
  fs.mkdirSync(path.resolve(ROOT_BASE, 'dist'))
}

fs.writeFileSync(path.resolve(ROOT_BASE, 'dist', 'manifest.json'), JSON.stringify(result));
