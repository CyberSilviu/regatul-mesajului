import Phaser from 'phaser';
import { NPC_CONFIG } from '../config.js';
import npcDialogs from '../data/npcs.json';

export default class DialogScene extends Phaser.Scene {
  constructor() {
    super({ key: 'DialogScene' });
  }

  create(data) {
    this.npcKey    = data.npcKey;
    this.state     = data.state; // 'available' | 'completed'
    this.npcCfg    = NPC_CONFIG[this.npcKey];
    this.dialog    = npcDialogs[this.npcKey];
    this.typeEvent = null;
    this.step      = 0; // 0=greeting, 1=questOffer

    this._buildUI();
    this._startStep0();
  }

  _buildUI() {
    const W = this.cameras.main.width;
    const H = this.cameras.main.height;

    // Dim overlay
    this.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.55);

    // Paper background — taller to avoid text/button overlap
    this.paper = this.add.rectangle(W / 2, H / 2, 940, 500, 0xf5e6c8)
      .setStrokeStyle(5, 0x8b6914);

    // NPC Avatar
    if (this.textures.exists(this.npcCfg.avatarKey)) {
      this.add.image(195, H / 2 - 90, this.npcCfg.avatarKey)
        .setDisplaySize(130, 130);
    } else {
      this.add.circle(195, H / 2 - 90, 55, 0x334466);
    }

    // NPC name
    this.add.text(280, H / 2 - 195, this.npcCfg.name, {
      fontFamily: 'Georgia, serif', fontSize: '21px',
      color: '#5c3a00', fontStyle: 'bold'
    });

    // Subject label (shown for quest)
    this.subjectLbl = this.add.text(280, H / 2 - 166, '', {
      fontFamily: 'Georgia, serif', fontSize: '12px',
      color: '#886644', fontStyle: 'italic'
    });

    // Dialog text area — starts lower to clear name/subject, more room before buttons
    this.dialogTxt = this.add.text(280, H / 2 - 135, '', {
      fontFamily: 'Georgia, serif', fontSize: '16px',
      color: '#221100', wordWrap: { width: 600 },
      lineSpacing: 10
    });

    // Click-to-skip hint
    this.skipHint = this.add.text(W / 2, H / 2 + 170, 'Click pentru a sari animatia de text', {
      fontFamily: 'Georgia, serif', fontSize: '12px',
      color: '#998866', fontStyle: 'italic'
    }).setOrigin(0.5).setAlpha(0);

    // Buttons (initially hidden)
    this.continueBtn = this._makeBtn(W / 2, H / 2 + 210, 'Continua', () => this._onContinue());
    this.acceptBtn   = this._makeBtn(W / 2 - 155, H / 2 + 210, 'Accepta Misiunea!',
      () => this._onAccept(), '#ffffff', '#1a6622');
    this.rejectBtn   = this._makeBtn(W / 2 + 155, H / 2 + 210, 'Poate mai tarziu',
      () => this._close(), '#ffffff', '#663311');

    this.continueBtn.setVisible(false);
    this.acceptBtn.setVisible(false);
    this.rejectBtn.setVisible(false);

    // Skip typewriter on pointer click (before buttons appear)
    this.input.on('pointerdown', () => this._skipTypewriter());
  }

  _startStep0() {
    const text = this.state === 'completed'
      ? this.dialog.greetingComplete
      : this.dialog.greeting;
    this._typewrite(text, () => {
      this.skipHint.setAlpha(0);
      if (this.state === 'completed') {
        this.continueBtn.setText('Inchide');
      }
      this.continueBtn.setVisible(true);
    });
  }

  _onContinue() {
    this.continueBtn.setVisible(false);
    if (this.state === 'completed') { this._close(); return; }

    // Show quest offer
    import('../data/quests.json').then(module => {
      const quests = module.default;
      const quest = quests[this.npcCfg.questId];
      this.subjectLbl.setText(`Subiect: ${quest.subject}`);
    });

    this._typewrite(this.dialog.questOffer, () => {
      this.skipHint.setAlpha(0);
      this.acceptBtn.setVisible(true);
      this.rejectBtn.setVisible(true);
    });
  }

  _onAccept() {
    const gameScene = this.scene.get('GameScene');
    gameScene.events.emit('quest-start', { questId: this.npcCfg.questId });
    // GameScene.events handler will stop DialogScene
  }

  _close() {
    this.scene.get('GameScene').events.emit('dialog-close');
    this.scene.stop('DialogScene');
  }

  _typewrite(text, onDone) {
    this.dialogTxt.setText('');
    this.skipHint.setAlpha(0.6);
    let i = 0;
    this._fullText  = text;
    this._onTypeDone = onDone;

    if (this.typeEvent) { this.typeEvent.destroy(); this.typeEvent = null; }

    this.typeEvent = this.time.addEvent({
      delay: 22,
      repeat: text.length - 1,
      callback: () => {
        i++;
        this.dialogTxt.setText(text.substring(0, i));
        if (i >= text.length) {
          this.typeEvent = null;
          this.skipHint.setAlpha(0);
          onDone?.();
        }
      }
    });
  }

  _skipTypewriter() {
    if (!this.typeEvent) return;
    this.typeEvent.destroy();
    this.typeEvent = null;
    this.dialogTxt.setText(this._fullText);
    this.skipHint.setAlpha(0);
    this._onTypeDone?.();
    this._onTypeDone = null;
  }

  _makeBtn(x, y, label, cb, textColor = '#ffffff', bg = '#225599') {
    const btn = this.add.text(x, y, label, {
      fontFamily: 'Georgia, serif', fontSize: '16px',
      color: textColor, backgroundColor: bg,
      padding: { x: 18, y: 11 }, fontStyle: 'bold'
    }).setOrigin(0.5).setInteractive({ cursor: 'pointer' });

    btn.on('pointerover', () => btn.setAlpha(0.78));
    btn.on('pointerout',  () => btn.setAlpha(1));
    btn.on('pointerdown', cb);
    return btn;
  }
}
