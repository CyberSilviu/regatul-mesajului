import Phaser from 'phaser';
import { SAVE_KEY } from '../config.js';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    const W = this.cameras.main.width;
    const H = this.cameras.main.height;

    // Background gradient
    this.add.rectangle(W / 2, H / 2, W, H, 0x1a2a1a);

    // Decorative banner area
    this.add.rectangle(W / 2, 180, 900, 200, 0x0d1a0d, 0.9)
      .setStrokeStyle(4, 0x4a6a2a);

    this.add.text(W / 2, 130, 'Regatul Mesajului', {
      fontFamily: 'Georgia, serif',
      fontSize: '52px',
      color: '#ffdd88',
      fontStyle: 'bold',
      stroke: '#442200',
      strokeThickness: 6
    }).setOrigin(0.5);

    this.add.text(W / 2, 195, 'Un joc educational despre posta electronica', {
      fontFamily: 'Georgia, serif',
      fontSize: '20px',
      color: '#aabbaa',
      fontStyle: 'italic'
    }).setOrigin(0.5);

    this.add.text(W / 2, 235, 'Clasa a IX-a | TIC | Comunicarea prin Internet', {
      fontFamily: 'Georgia, serif',
      fontSize: '15px',
      color: '#778877'
    }).setOrigin(0.5);

    // New Game button
    this._makeBtn(W / 2, 340, '  Incepe Aventura  ', () => {
      localStorage.removeItem(SAVE_KEY);
      this.scene.start('GameScene');
    }, '#ffdd44', '#000000', 0xaa7700);

    // Continue button (only if save exists)
    const save = localStorage.getItem(SAVE_KEY);
    if (save) {
      try {
        const data = JSON.parse(save);
        const count = data.questsCompleted ? data.questsCompleted.length : 0;
        this._makeBtn(W / 2, 420, `  Continua Jocul (${count}/9 misiuni)  `,
          () => this.scene.start('GameScene'),
          '#88ccff', '#000000', 0x224488);
      } catch (_) { /* corrupt save, ignore */ }
    }

    // Instructions
    this.add.text(W / 2, 520, 'WASD sau sagetile pentru miscare  |  E pentru interactiune', {
      fontFamily: 'Georgia, serif',
      fontSize: '16px',
      color: '#667766'
    }).setOrigin(0.5);

    this.add.text(W / 2, 548, 'Rezolva toate cele 9 misiuni pentru a trimite scrisoarea regala!', {
      fontFamily: 'Georgia, serif',
      fontSize: '14px',
      color: '#556655',
      fontStyle: 'italic'
    }).setOrigin(0.5);

    this.add.text(W / 2, 695, 'Muraru Silviu-Andrei — Colegiul Tehnic CF "Unirea", Pascani', {
      fontFamily: 'Georgia, serif',
      fontSize: '12px',
      color: '#445544'
    }).setOrigin(0.5);
  }

  _makeBtn(x, y, label, cb, textColor, bgColor, stroke) {
    const btn = this.add.text(x, y, label, {
      fontFamily: 'Georgia, serif',
      fontSize: '22px',
      color: textColor,
      backgroundColor: bgColor || '#000000',
      padding: { x: 28, y: 16 },
      fontStyle: 'bold',
      stroke: `#${stroke.toString(16).padStart(6, '0')}`,
      strokeThickness: 3
    }).setOrigin(0.5).setInteractive({ cursor: 'pointer' });

    btn.on('pointerover', () => btn.setAlpha(0.85));
    btn.on('pointerout',  () => btn.setAlpha(1));
    btn.on('pointerdown', cb);
    return btn;
  }
}
