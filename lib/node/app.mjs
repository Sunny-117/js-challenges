
import {
  generatePlaygroundCode,
  getProblem,
  generateTestCode
} from './utils.mjs';
import {
  program
} from 'commander';
import { execa } from 'execa';

program.name('js-challenges-cli')

program.command('test')
  .argument('<id>', 'problem id to test')
  .action(async (id) => {
    const problem = getProblem(id);
    const file = generateTestCode(problem.fullName);
    console.log('running test:', 'npx', 'mocha', file)
    execa('npx', ['mocha',file]).stdout.pipe(process.stdout);

  })

program.command('create')
  .argument('<id>', 'problem id to test')
  .option('--force', 'override the file if exists')
  .action((id, options) => {
    const problem = getProblem(id);
    generatePlaygroundCode(problem.fullName, options.force);
    console.log('Code generated at:', problem.playgroundCodePath)
  })

program.parseAsync().catch((e) => console.error(`${e.name}:${e.message}` || e));