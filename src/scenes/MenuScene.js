import Phaser from 'phaser';
import { SAVE_KEY } from '../config.js';

const IS_TOUCH = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    const W  = this.cameras.main.width;
    const H  = this.cameras.main.height;
    const cx = W / 2;

    // ── Read save state ────────────────────────────────────────────────────
    let saveCount = -1; // -1 = no save
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) {
        const d  = JSON.parse(raw);
        saveCount = d.questsCompleted?.length || 0;
      }
    } catch (_) { /* ignore corrupt save */ }
    const hasSave = saveCount >= 0;

    // ── Measure total content height for vertical centering ────────────────
    // (approximate pixel heights for each block)
    const TITLE_H  = 110;  // title + subtitle + course text block
    const BTN_H    = 60;   // single button height (font 22px + padding 16px×2)
    const BTN_GAP  = 18;   // gap between New Game and Continue
    const INSTR_H  = 54;   // two instruction lines + gap
    const HINT_H   = 22;   // mobile fullscreen hint (touch only)
    const GAP1     = 34;   // between title block and first button
    const GAP2     = 30;   // between last button and instructions

    const totalH = TITLE_H + GAP1
      + BTN_H + (hasSave ? BTN_GAP + BTN_H : 0)
      + GAP2 + INSTR_H
      + (IS_TOUCH ? HINT_H + 6 : 0);

    // Start Y so the block is centered vertically
    let y = Math.round((H - totalH) / 2);

    // ── Background ─────────────────────────────────────────────────────────
    this.add.rectangle(cx, H / 2, W, H, 0x1a2a1a);

    // ── Title banner ───────────────────────────────────────────────────────
    // Dark panel behind text block
    this.add.rectangle(cx, y + TITLE_H / 2, 920, TITLE_H + 20, 0x0d1a0d, 0.9)
      .setStrokeStyle(4, 0x4a6a2a);

    this.add.text(cx, y + 12, 'Regatul Mesajului', {
      fontFamily: 'Georgia, serif',
      fontSize: '48px',
      color: '#ffdd88',
      fontStyle: 'bold',
      stroke: '#442200',
      strokeThickness: 6
    }).setOrigin(0.5, 0);

    this.add.text(cx, y + 70, 'Un joc educational despre posta electronica', {
      fontFamily: 'Georgia, serif',
      fontSize: '19px',
      color: '#aabbaa',
      fontStyle: 'italic'
    }).setOrigin(0.5, 0);

    this.add.text(cx, y + 96, 'Clasa a IX-a  |  TIC  |  Comunicarea prin Internet', {
      fontFamily: 'Georgia, serif',
      fontSize: '14px',
      color: '#778877'
    }).setOrigin(0.5, 0);

    y += TITLE_H + GAP1;

    // ── Buttons ────────────────────────────────────────────────────────────
    this._makeBtn(cx, y + BTN_H / 2, '  Incepe Aventura  ', () => {
      this._enterFullscreen();
      localStorage.removeItem(SAVE_KEY);
      this.scene.start('GameScene');
    }, '#ffdd44', '#000000', 0xaa7700);
    y += BTN_H;

    if (hasSave) {
      y += BTN_GAP;
      this._makeBtn(cx, y + BTN_H / 2,
        `  Continua Jocul (${saveCount}/9 misiuni)  `,
        () => { this._enterFullscreen(); this.scene.start('GameScene'); },
        '#88ccff', '#000000', 0x224488);
      y += BTN_H;
    }

    y += GAP2;

    // ── Instructions ───────────────────────────────────────────────────────
    // Desktop: show keyboard controls.  Mobile: show joystick/button hint.
    const hint = IS_TOUCH
      ? 'Joystick stanga pentru miscare  |  Buton galben pentru interactiune'
      : 'WASD sau sagetile pentru miscare  |  E pentru interactiune';

    this.add.text(cx, y, hint, {
      fontFamily: 'Georgia, serif',
      fontSize: '15px',
      color: '#667766'
    }).setOrigin(0.5, 0);
    y += 28;

    this.add.text(cx, y, 'Rezolva cele 9 misiuni pentru a trimite scrisoarea regala!', {
      fontFamily: 'Georgia, serif',
      fontSize: '13px',
      color: '#556655',
      fontStyle: 'italic'
    }).setOrigin(0.5, 0);
    y += 26;

    if (IS_TOUCH) {
      this.add.text(cx, y, '[ Apasand un buton intri automat in ecran complet ]', {
        fontFamily: 'Georgia, serif',
        fontSize: '12px',
        color: '#445544',
        fontStyle: 'italic'
      }).setOrigin(0.5, 0);
    }

    // ── Footer — pinned to bottom, outside the centered block ──────────────
    this.add.text(cx, H - 14, 'Muraru Silviu-Andrei — Colegiul Tehnic CF "Unirea", Pascani', {
      fontFamily: 'Georgia, serif',
      fontSize: '11px',
      color: '#3a4a3a'
    }).setOrigin(0.5, 1);
  }

  _enterFullscreen() {
    if (!IS_TOUCH) return;
    try {
      if (!this.scale.isFullscreen) this.scale.startFullscreen();
    } catch (_) { /* Fullscreen API not supported — game still works */ }
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
