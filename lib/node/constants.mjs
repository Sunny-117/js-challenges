import path from 'path';
import fs from 'fs';
import {
  fileURLToPath
} from 'url';

// `__filename` is unavailable in ES module
const __filename = fileURLToPath(
  import.meta.url);
const __dirname = path.dirname(__filename);

export const QUESTION_BASE = path.resolve(__dirname, '../../questions/')
export const PLAYGROUND_BASE = path.resolve(__dirname, '../../playground/')
export const CACHE_BASE = path.resolve(__dirname, '../../.cache/')
export const CLI_BASE = __dirname
export const ROOT_BASE = path.resolve(__dirname,'../../')