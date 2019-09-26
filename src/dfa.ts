import { Epsilon, Map as TMap } from './common'
import NFA, { NFANode } from './nfa'

export class DFANode {
  id: number;
  isEnd: boolean = false;
  nfaSet: Set<NFANode>;
  trans: TMap<DFANode> = {};

  constructor(_id: number, nodes: NFANode[]) {
    this.id = _id;
    this.nfaSet = new Set(nodes);
    for (let nfanode of this.nfaSet) {
      if (nfanode.isEnd) {
        this.isEnd = true; break;
      }
    }
  }

  link(w: string, v: DFANode) {
    if (this.trans[w] !== undefined) throw new Error('DFA has two same trans');
    this.trans[w] = v;
  }
}

export default class DFA {
  root: DFANode;
  pool: DFANode[];

  constructor(nfa: NFA) {
    this.pool = [];

    const pool = nfa.pool;

    let alphaBet: string[] = [];
    for (let u in pool) {
      for (let w in pool[u].trans) alphaBet.push(w);
    }
    alphaBet = [...new Set([...alphaBet])];

    let closureList: TMap<NFANode[]> = {};
    for (let u in pool) {
      const dfs = (u: string): NFANode[] => {
        if (u in closureList) return closureList[u];
        let set: Set<string> = new Set([u]);
        if (pool[u].trans[Epsilon] !== undefined) {
          for (let v of pool[u].trans[Epsilon]) {
            if (v.id === u) throw new Error(`u link to itself with Epsilon`);
            set.add(v.id);
            dfs(v.id).forEach(node => set.add(node.id));
          }
        }
        return closureList[u] = [...set].map(id => pool[id]);
      };
      dfs(u);
    }

    const move = (nodes: NFANode[], w: string): NFANode[] => {
      let set: Set<string> = new Set();
      for (let node of nodes) {
        if (node.trans[w] === undefined) continue;
        node.trans[w].forEach(v => {
          closureList[v.id].forEach(x => set.add(x.id));
        });
      }
      return [...set].map(x => pool[x]);
    };

    const keys = (nodes: NFANode[]) => {
      return nodes.map(x => x.id).sort().toString();
    };

    let visited: Map<string,number> = new Map(), totId = 0;
    let queue: string[] = [];

    const getNode = (s: string, nodes: NFANode[]) => {
      if (!visited.has(s)) {
        this.pool.push(new DFANode(totId, nodes));
        visited.set(s, totId++);
        queue.push(s);
      }
      const id = visited.get(s);
      if (id === undefined) throw new Error('unknown');
      return this.pool[id];
    };

    this.root = getNode(keys(closureList[nfa.root.id]), closureList[nfa.root.id]);

    while (queue.length > 0) {
      let back = queue.pop();
      if (back === undefined) throw new Error('unknown');
      
      const top: string[] = back.split(',');
      const tot: NFANode[] = top.map(x => pool[x]);
      const id = visited.get(back);
      if (id === undefined) throw new Error('unknown');
      const node: DFANode = this.pool[id];

      for (let w of alphaBet) {
        if (w === Epsilon) continue;
        const next: NFANode[] = move(tot, w);
        if (next.length === 0) continue;
        node.link(w, getNode(keys(next), next));
      }
    }
  }

  report() {
    console.log('DFA root is [0]:\n');

    for (let node of this.pool) {
      for (let v in node.trans) {
        console.log(`[${node.id}] == ${v === Epsilon ? 'ε' : v} ==> [${node.trans[v].id}]`);
      }
    }

    let endpos = '';
    for (let node of this.pool) {
      if (node.isEnd) {
        endpos += ` [${node.id}]`;
      }
    }
    console.log(`\nEnd nodes:${endpos}`);
  }
}