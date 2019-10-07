#!/usr/bin/env node

import fs from 'fs';
import NFA from './nfa';
import DFA from './dfa';

if (process.argv.length <= 2) {
  console.log('Usage: nfatodfa <file>');
  console.log('\n  Change the NFA from the file into a DFA');
  process.exit(0);
}

console.log('\nStart changing NFA into DFA...\n');

const input = fs.readFileSync(process.argv[2], 'utf8').split('\r\n');

let data: Array<string[]> = [];
for (let s of input) {
  let t = s.trim();
  if (t === '') continue;
  if (t.startsWith('//')) continue;
  data.push(s.split(' '));
}

const nfa = new NFA(data);

const dfa = new DFA(nfa);

dfa.report();
