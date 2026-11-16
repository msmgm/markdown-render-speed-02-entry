// Custom high-performance runner for the markdown-render-speed-02 competition.
// Processes input markdown cases deterministically using Node.js standard libraries.

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parse } from './parse.js';

interface TestCase {
  id: string;
  markdown: string;
}

const inputPath = resolve(process.env.MAKEFUN_INPUT_DIR ?? '/input', 'cases.json');
const outputPath = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? '/output', 'html.json');

const testCases: TestCase[] = JSON.parse(readFileSync(inputPath, 'utf8'));
const htmlResults: string[] = testCases.map((tc) => parse(tc.markdown));

writeFileSync(outputPath, JSON.stringify(htmlResults), 'utf8');
