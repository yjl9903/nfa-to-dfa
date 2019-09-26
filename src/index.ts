import fs from 'fs';
import NFA from './nfa';
import DFA from './dfa';

console.log('Start changing NFA into DFA...\n');

if (process.argv.length <= 2) {
  console.log('need param <file>');
  process.exit(0);
}

const input = fs.readFileSync(process.argv[2], 'utf8').split('\r\n');

let data: Array<string[]> = [];
for (let s of input) {
  data.push(s.split(' '));
}

const nfa = new NFA(data);

const dfa = new DFA(nfa);

dfa.report();