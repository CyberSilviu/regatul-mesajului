/**
 * MobileControls — virtual joystick (bottom-left) + interact button (bottom-right).
 * Only instantiated when a touch device is detected.
 *
 * Usage in GameScene:
 *   this.mobileControls = new MobileControls(this);
 *   // in update():
 *   this.player.update(this.cursors, this.wasd, this.mobileControls.getJoystick());
 *   if (this.mobileControls.consumeInteract()) { ... }
 */

const JOY_BASE_R  = 62;
const JOY_THUMB_R = 27;
const BTN_R       = 50;

export default class MobileControls {
  constructor(scene) {
    this.scene = scene;

    this.joyVec       = { x: 0, y: 0 };
    this.joyPointerId = -1;
    this._interactFired = false;

    const W = scene.scale.width;   // 1280
    const H = scene.scale.height;  // 720

    // Joystick sits above the HUD bar, left side
    this.joyCenter = { x: 110, y: H - 115 };
    // Interact button: right side, same height
    this.btnPos    = { x: W - 110, y: H - 115 };

    this._createJoystick(H);
    this._createInteractButton(W, H);
    this._bindPointerEvents();
  }

  // ─── Joystick ────────────────────────────────────────────────────────────────

  _createJoystick(H) {
    const { x, y } = this.joyCenter;

    this.baseGfx  = this.scene.add.graphics().setScrollFactor(0).setDepth(200);
    this.thumbGfx = this.scene.add.graphics().setScrollFactor(0).setDepth(201);

    this._drawBase(x, y);
    this._drawThumb(x, y);

    // Touch zone covers the bottom-left corner so the player can reach it easily
    this.joyZone = this.scene.add.rectangle(0, H, 260, 260, 0, 0)
      .setOrigin(0, 1)
      .setScrollFactor(0)
      .setDepth(202)
      .setInteractive();

    this.joyZone.on('pointerdown', ptr => {
      if (this.joyPointerId !== -1) return; // already tracking another finger
      this.joyPointerId = ptr.id;
    });
  }

  _drawBase(cx, cy) {
    this.baseGfx.clear();
    this.baseGfx.fillStyle(0x000000, 0.25);
    this.baseGfx.fillCircle(cx, cy, JOY_BASE_R);
    this.baseGfx.lineStyle(2, 0xffffff, 0.45);
    this.baseGfx.strokeCircle(cx, cy, JOY_BASE_R);

    // Subtle directional tick marks
    this.baseGfx.fillStyle(0xffffff, 0.3);
    const r = JOY_BASE_R - 12;
    [[0, -1], [1, 0], [0, 1], [-1, 0]].forEach(([dx, dy]) => {
      this.baseGfx.fillRect(cx + dx * r - 3, cy + dy * r - 3, 6, 6);
    });
  }

  _drawThumb(tx, ty) {
    this.thumbGfx.clear();
    this.thumbGfx.fillStyle(0xffffff, 0.6);
    this.thumbGfx.fillCircle(tx, ty, JOY_THUMB_R);
    this.thumbGfx.lineStyle(1.5, 0xcccccc, 0.8);
    this.thumbGfx.strokeCircle(tx, ty, JOY_THUMB_R);
  }

  _updateJoy(px, py) {
    const { x: cx, y: cy } = this.joyCenter;
    const dx   = px - cx;
    const dy   = py - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 8) {
      this.joyVec = { x: 0, y: 0 };
      this._drawThumb(cx, cy);
      return;
    }

    const clamped = Math.min(dist, JOY_BASE_R);
    const angle   = Math.atan2(dy, dx);
    const tx      = cx + Math.cos(angle) * clamped;
    const ty      = cy + Math.sin(angle) * clamped;

    this.joyVec = { x: Math.cos(angle), y: Math.sin(angle) };
    this._drawThumb(tx, ty);
  }

  // ─── Interact button ─────────────────────────────────────────────────────────

  _createInteractButton(W, H) {
    const { x, y } = this.btnPos;

    this.btnGfx = this.scene.add.graphics().setScrollFactor(0).setDepth(200);
    this._drawBtn(false);

    this.btnLabel = this.scene.add.text(x, y - 8, 'E', {
      fontFamily: 'Georgia', fontSize: '28px', color: '#1a1a2e', fontStyle: 'bold'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(202);

    this.btnSub = this.scene.add.text(x, y + 18, 'vorbeste', {
      fontFamily: 'Georgia', fontSize: '11px', color: '#1a1a2e'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(202);

    this.btnZone = this.scene.add.circle(x, y, BTN_R, 0, 0)
      .setScrollFactor(0).setDepth(203).setInteractive();

    this.btnZone.on('pointerdown', () => {
      this._interactFired = true;
      this._drawBtn(true);
    });
    this.btnZone.on('pointerup',  () => this._drawBtn(false));
    this.btnZone.on('pointerout', () => this._drawBtn(false));
  }

  _drawBtn(pressed) {
    const { x, y } = this.btnPos;
    this.btnGfx.clear();
    this.btnGfx.fillStyle(pressed ? 0xffa500 : 0xffd700, pressed ? 0.9 : 0.65);
    this.btnGfx.fillCircle(x, y, BTN_R);
    this.btnGfx.lineStyle(2.5, pressed ? 0xff8800 : 0xffcc00, 0.9);
    this.btnGfx.strokeCircle(x, y, BTN_R);
  }

  // ─── Global pointer tracking (handles finger moving outside the zone) ────────

  _bindPointerEvents() {
    this._onMove = ptr => {
      if (ptr.id !== this.joyPointerId) return;
      this._updateJoy(ptr.x, ptr.y);
    };

    this._onUp = ptr => {
      if (ptr.id !== this.joyPointerId) return;
      this.joyPointerId = -1;
      this.joyVec = { x: 0, y: 0 };
      const { x, y } = this.joyCenter;
      this._drawBase(x, y);
      this._drawThumb(x, y);
    };

    this.scene.input.on('pointermove', this._onMove);
    this.scene.input.on('pointerup',   this._onUp);
  }

  // ─── Public API ──────────────────────────────────────────────────────────────

  /** Returns {x, y} normalized direction vector, both 0 when idle. */
  getJoystick() {
    return this.joyVec;
  }

  /** Returns true (and resets flag) when the interact button was tapped. */
  consumeInteract() {
    if (this._interactFired) {
      this._interactFired = false;
      return true;
    }
    return false;
  }

  /** Call after quest/dialog ends so a tap during the overlay doesn't carry over. */
  reset() {
    this._interactFired = false;
  }

  setVisible(visible) {
    this.baseGfx.setVisible(visible);
    this.thumbGfx.setVisible(visible);
    this.btnGfx.setVisible(visible);
    this.btnLabel.setVisible(visible);
    this.btnSub.setVisible(visible);
  }

  destroy() {
    this.scene.input.off('pointermove', this._onMove);
    this.scene.input.off('pointerup',   this._onUp);
    this.baseGfx?.destroy();
    this.thumbGfx?.destroy();
    this.btnGfx?.destroy();
    this.btnLabel?.destroy();
    this.btnSub?.destroy();
  }
}
