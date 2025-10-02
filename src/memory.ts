export class Memory {
  state; storage;
  constructor(state, env) {
    this.state = state;
    this.storage = state.storage;
  }

  async getHistory(userId: string) {
    return (await this.storage.get(userId)) || "";
  }

  async addMessage(userId: string, message: string) {
    const history = await this.getHistory(userId);
    const newHistory = history + "\n" + message;
    await this.storage.put(userId, newHistory);
    return newHistory;
  }
}
