import Phaser from 'phaser';
import { SAVE_KEY } from '../config.js';

export default class EndingScene extends Phaser.Scene {
  constructor() {
    super({ key: 'EndingScene' });
  }

  create() {
    const W = this.cameras.main.width;
    const H = this.cameras.main.height;

    // Dark night-sky background
    this.add.rectangle(W / 2, H / 2, W, H, 0x0a0a1e);

    // Stars
    for (let i = 0; i < 80; i++) {
      const sx = Phaser.Math.Between(0, W);
      const sy = Phaser.Math.Between(0, H / 2);
      this.add.circle(sx, sy, Phaser.Math.Between(1, 3), 0xffffff, Phaser.Math.FloatBetween(0.3, 0.9));
    }

    // Ground strip
    this.add.rectangle(W / 2, H - 80, W, 160, 0x2a4a1a);

    // Blue castle (left)
    if (this.textures.exists('castle-blue')) {
      this.add.image(200, H - 155, 'castle-blue').setOrigin(0.5, 1).setScale(0.9);
    } else {
      this._drawCastle(200, H - 80, 0x2255aa, 'Regatul\nAlbastru');
    }

    // Red castle (right, initially off screen or dark)
    this.redCastle = this.textures.exists('castle-red')
      ? this.add.image(W - 180, H - 155, 'castle-red').setOrigin(0.5, 1).setScale(0.9).setAlpha(0.3)
      : this._drawCastle(W - 180, H - 80, 0xaa2222, 'Regatul\nRosu');

    // Title text
    this.add.text(W / 2, 60, 'Misiunea este aproape de final!', {
      fontFamily: 'Georgia, serif', fontSize: '28px', color: '#ffdd88', fontStyle: 'bold'
    }).setOrigin(0.5);

    this.statusTxt = this.add.text(W / 2, 110, 'Arcasul se pregateste sa trimita scrisoarea...', {
      fontFamily: 'Georgia, serif', fontSize: '18px', color: '#aabbcc', fontStyle: 'italic'
    }).setOrigin(0.5);

    // Archer sprite (near blue castle)
    this.archer = this.add.sprite(330, H - 155, 'archer-blue-idle')
      .setScale(0.5).setOrigin(0.5, 1).setFlipX(false);
    this.archer.anims.play('archer-idle', true);

    // Delay then shoot
    this.time.delayedCall(1800, () => this._shootArrow());
  }

  _shootArrow() {
    this.statusTxt.setText('Scrisoarea zboara spre Regatul Rosu...');
    this.archer.anims.play('archer-shoot', true);

    const W = this.cameras.main.width;
    const H = this.cameras.main.height;

    // Arrow projectile (simple line/circle)
    const arrow = this.add.triangle(370, H - 200, 0, 5, 30, 0, 0, -5, 0xffdd88).setDepth(20);

    // Single tween — Sine easing gives a natural arc feel
    this.tweens.add({
      targets: arrow,
      x: W - 240,
      y: H - 290,
      duration: 2000,
      ease: 'Sine.easeInOut',
      onComplete: () => {
        arrow.destroy();
        this._arrowLanded();
      }
    });
  }

  _arrowLanded() {
    const W = this.cameras.main.width;
    const H = this.cameras.main.height;

    this.cameras.main.shake(250, 0.006);

    // Light up red castle
    if (this.redCastle) {
      this.tweens.add({ targets: this.redCastle, alpha: 1, duration: 600 });
    }

    // Success flash
    const flash = this.add.rectangle(W / 2, H / 2, W, H, 0xffff88, 0.3);
    this.tweens.add({ targets: flash, alpha: 0, duration: 500, onComplete: () => flash.destroy() });

    this.time.delayedCall(700, () => this._showSuccess());
  }

  _showSuccess() {
    const W = this.cameras.main.width;
    const H = this.cameras.main.height;

    this.statusTxt.setText('Scrisoarea a ajuns la destinatie!');

    this.add.rectangle(W / 2, H / 2 - 60, 900, 220, 0x000000, 0.75).setStrokeStyle(4, 0xffdd44);

    this.add.text(W / 2, H / 2 - 110, 'MISIUNE INDEPLINITA!', {
      fontFamily: 'Georgia, serif', fontSize: '36px', color: '#ffdd44', fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(W / 2, H / 2 - 55, 'Felicitari! Ai traversat Regatul Mesajului\nsi ai trimis scrisoarea regala cu succes!', {
      fontFamily: 'Georgia, serif', fontSize: '20px', color: '#ffffff',
      align: 'center', lineSpacing: 6
    }).setOrigin(0.5);

    this.add.text(W / 2, H / 2 + 15, 'Ai demonstrat ca stii cum functioneaza posta electronica,\ncriptarea, neticheta si motoarele de cautare!', {
      fontFamily: 'Georgia, serif', fontSize: '15px', color: '#aabbcc',
      align: 'center', lineSpacing: 4
    }).setOrigin(0.5);

    // Buttons
    const replayBtn = this.add.text(W / 2 - 130, H - 100, 'Joaca din nou', {
      fontFamily: 'Georgia, serif', fontSize: '20px', color: '#ffffff',
      backgroundColor: '#225599', padding: { x: 22, y: 14 }, fontStyle: 'bold'
    }).setOrigin(0.5).setInteractive({ cursor: 'pointer' });
    replayBtn.on('pointerdown', () => {
      localStorage.removeItem(SAVE_KEY);
      this.scene.start('MenuScene');
    });

    const menuBtn = this.add.text(W / 2 + 130, H - 100, 'Meniu principal', {
      fontFamily: 'Georgia, serif', fontSize: '20px', color: '#ffffff',
      backgroundColor: '#663311', padding: { x: 22, y: 14 }, fontStyle: 'bold'
    }).setOrigin(0.5).setInteractive({ cursor: 'pointer' });
    menuBtn.on('pointerdown', () => this.scene.start('MenuScene'));
  }

  _drawCastle(x, y, color, label) {
    const castle = this.add.rectangle(x, y - 60, 160, 120, color, 0.8)
      .setStrokeStyle(3, 0xffffff);
    this.add.text(x, y - 60, label, {
      fontFamily: 'Georgia, serif', fontSize: '16px', color: '#ffffff',
      align: 'center'
    }).setOrigin(0.5);
    return castle;
  }
}
