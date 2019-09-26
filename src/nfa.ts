import { Map, Epsilon } from './common'

export class NFANode {
  id: string;
  isEnd: boolean = false;
  trans: Map<NFANode[]> = {};

  constructor(_id: string) {
    this.id = _id;
  }

  link(w: string, node: NFANode) {
    if (this.trans[w] === null || this.trans[w] === undefined) {
      this.trans[w] = [];
    }
    this.trans[w].push(node);
  }
}

export default class NFA {
  root: NFANode;

  pool: Map<NFANode> = {};

  getNode(id: string): NFANode {
    if (id in this.pool) return this.pool[id];
    return this.pool[id] = new NFANode(id);
  }

  private build(data: string[][]) {
    for (let edge of data) {
      if (edge.length < 2) throw new Error('miss edge info');
      const u = edge[0], v = edge[1];
      const w = edge.length >= 3 ? edge[2] : Epsilon;
      this.getNode(u).link(w, this.getNode(v));
    }
  }

  // first line: root
  // second line: end node
  // others: edge => (u, v, w) | (u, v)
  constructor(data: string[][]) {
    if (data.length <= 2) throw new Error('data too few');

    this.root = new NFANode(data[0][0]);
    this.getNode(this.root.id);

    for (let u of data[1]) {
      this.getNode(u).isEnd = true;
    }

    data.splice(0, 2);
    this.build(data);
  }
}