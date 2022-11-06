import {
  expect
} from 'chai'; // Using Expect style

import {
  describe,
  it,
  run
} from 'mocha';

export function createMochaTest(testFn, codeFn) {
  testFn(describe, it, expect, codeFn);
}
