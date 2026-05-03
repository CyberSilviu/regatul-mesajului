import Phaser from 'phaser';
import Quest_Email     from '../quests/Quest_Email.js';
import Quest_Address   from '../quests/Quest_Address.js';
import Quest_Folders   from '../quests/Quest_Folders.js';
import Quest_Attach    from '../quests/Quest_Attach.js';
import Quest_Crypto    from '../quests/Quest_Crypto.js';
import Quest_Firewall  from '../quests/Quest_Firewall.js';
import Quest_Etiquette from '../quests/Quest_Etiquette.js';
import Quest_Chat      from '../quests/Quest_Chat.js';
import Quest_Search    from '../quests/Quest_Search.js';

const QUEST_MAP = {
  quest_email:     Quest_Email,
  quest_address:   Quest_Address,
  quest_folders:   Quest_Folders,
  quest_attach:    Quest_Attach,
  quest_crypto:    Quest_Crypto,
  quest_firewall:  Quest_Firewall,
  quest_etiquette: Quest_Etiquette,
  quest_chat:      Quest_Chat,
  quest_search:    Quest_Search
};

export default class QuestScene extends Phaser.Scene {
  constructor() {
    super({ key: 'QuestScene' });
  }

  create(data) {
    this.questId = data.questId;

    // Semi-transparent overlay so paused GameScene dims behind
    this.add.rectangle(640, 360, 1280, 720, 0x000000, 0.68);

    const QuestClass = QUEST_MAP[data.questId];
    if (!QuestClass) {
      this._fallback(data.questId);
      return;
    }

    this.currentQuest = new QuestClass(this);

    // Handle two-step quests (crypto, chat) that restart with extra data
    if (data._step === 2) {
      if (typeof this.currentQuest.showStep2 === 'function') {
        this.currentQuest.showStep2(data.plain || null);
      }
    } else {
      this.currentQuest.start();
    }
  }

  // Called by quest classes when mini-game is successfully completed
  onQuestComplete() {
    const gameScene = this.scene.get('GameScene');
    gameScene.events.emit('quest-complete', { questId: this.questId });
    this.scene.stop('QuestScene');
    this.scene.resume('GameScene');
  }

  // Utility: show a temporary message then call onClose
  showMessage(text, onClose) {
    const overlay = this.add.rectangle(640, 360, 800, 160, 0x000000, 0.8).setDepth(200);
    const msg = this.add.text(640, 345, text, {
      fontFamily: 'Georgia, serif', fontSize: '18px', color: '#ffffff',
      wordWrap: { width: 740 }, align: 'center'
    }).setOrigin(0.5).setDepth(201);
    const btn = this.add.text(640, 415, 'OK', {
      fontFamily: 'Georgia, serif', fontSize: '17px', color: '#ffffff',
      backgroundColor: '#225599', padding: { x: 22, y: 10 }
    }).setOrigin(0.5).setDepth(201).setInteractive({ cursor: 'pointer' });
    btn.on('pointerdown', () => { overlay.destroy(); msg.destroy(); btn.destroy(); onClose?.(); });
  }

  _fallback(questId) {
    this.add.text(640, 360, `Quest "${questId}" — in curand!`, {
      fontFamily: 'Georgia, serif', fontSize: '22px', color: '#ffdd88'
    }).setOrigin(0.5);
    const btn = this.add.text(640, 450, 'Inapoi', {
      fontFamily: 'Georgia, serif', fontSize: '18px', color: '#ffffff',
      backgroundColor: '#225599', padding: { x: 20, y: 12 }
    }).setOrigin(0.5).setInteractive({ cursor: 'pointer' });
    btn.on('pointerdown', () => this.onQuestComplete());
  }
}
