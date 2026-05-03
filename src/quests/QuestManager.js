import { SAVE_KEY, QUEST_REWARDS } from '../config.js';

export default class QuestManager {
  constructor() {
    this.state = this._load();
  }

  _load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        if (data.version === 1) return data;
      }
    } catch (_) { /* corrupt save */ }
    return this._fresh();
  }

  _fresh() {
    return {
      version: 1,
      questsCompleted: [],
      inventory: [],
      playerPos: { x: 1600, y: 550 },
      timestamp: Date.now()
    };
  }

  _save() {
    this.state.timestamp = Date.now();
    localStorage.setItem(SAVE_KEY, JSON.stringify(this.state));
  }

  isCompleted(questId) {
    return this.state.questsCompleted.includes(questId);
  }

  complete(questId) {
    if (this.isCompleted(questId)) return;
    this.state.questsCompleted.push(questId);
    const reward = QUEST_REWARDS[questId];
    if (reward && !this.state.inventory.includes(reward.item)) {
      this.state.inventory.push(reward.item);
    }
    this._save();
  }

  allComplete() {
    return Object.keys(QUEST_REWARDS).every(id => this.isCompleted(id));
  }

  getCompletedCount() {
    return this.state.questsCompleted.length;
  }

  getInventory() {
    return [...this.state.inventory];
  }

  savePlayerPos(x, y) {
    this.state.playerPos = { x, y };
    this._save();
  }

  getSavedPos() {
    return this.state.playerPos;
  }

  hasSave() {
    return this.state.questsCompleted.length > 0 || this.state.inventory.length > 0;
  }

  reset() {
    this.state = this._fresh();
    this._save();
  }
}
