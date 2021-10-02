export default class TokenStore {
  private store: Map<string, number>; // Map<token, uid>; i know, very insecure
  constructor() {
    this.store = new Map();
  }

  add(token: string, uid: number): void {
    if (this.store.has(token)) throw new Error(`Token already exists. `);
    this.store.set(token, uid);
  }

  hasToken(token: string): boolean {
    return this.store.has(token);
  }

  getTokenByID(id: number): string | undefined {
    for (const [k, v] of this.store.entries()) {
      if (v === id) return k;
    }
  }

  getIDByToken(token: string): number | undefined {
    return this.store.get(token);
  }
  remove(token: string): void {
    this.store.delete(token);
  }
}
