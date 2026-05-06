/**
 * MobileControls — virtual joystick (bottom-left) + interact button (bottom-right).
 * Only instantiated when a touch device is detected in GameScene.
 *
 * Usage in GameScene:
 *   this.mobileControls = new MobileControls(this);
 *   // in update():
 *   this.player.update(this.cursors, this.wasd, this.mobileControls.getJoystick());
 *   if (this.mobileControls.consumeInteract()) { ... }
 */

// Control sizes — generous so they're easy to tap even on scaled-down screens
const JOY_BASE_R  = 105;  // outer ring radius
const JOY_THUMB_R = 46;   // moveable thumb radius
const BTN_R       = 88;   // interact button radius

export default class MobileControls {
  constructor(scene) {
    this.scene = scene;

    this.joyVec       = { x: 0, y: 0 };
    this.joyPointerId = -1;
    this._interactFired = false;

    const W = scene.scale.width;   // 1280
    const H = scene.scale.height;  // 720

    // Position controls so the ring fits comfortably above the HUD bar
    this.joyCenter = { x: 130, y: H - 125 };
    this.btnPos    = { x: W - 130, y: H - 125 };

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

    // Touch zone: generous bottom-left area (covers the full joystick + margin)
    this.joyZone = this.scene.add.rectangle(0, H, 360, 360, 0, 0)
      .setOrigin(0, 1)
      .setScrollFactor(0)
      .setDepth(202)
      .setInteractive();

    this.joyZone.on('pointerdown', ptr => {
      if (this.joyPointerId !== -1) return; // another finger is already on the joystick
      this.joyPointerId = ptr.id;
    });
  }

  _drawBase(cx, cy) {
    this.baseGfx.clear();

    // Outer ring
    this.baseGfx.fillStyle(0x000000, 0.35);
    this.baseGfx.fillCircle(cx, cy, JOY_BASE_R);
    this.baseGfx.lineStyle(3, 0xffffff, 0.6);
    this.baseGfx.strokeCircle(cx, cy, JOY_BASE_R);

    // Inner guide ring
    this.baseGfx.lineStyle(1, 0xffffff, 0.2);
    this.baseGfx.strokeCircle(cx, cy, JOY_BASE_R * 0.5);

    // Cardinal tick marks (show direction affordance)
    this.baseGfx.fillStyle(0xffffff, 0.45);
    const r = JOY_BASE_R - 14;
    [[0, -1], [1, 0], [0, 1], [-1, 0]].forEach(([dx, dy]) => {
      this.baseGfx.fillRect(cx + dx * r - 4, cy + dy * r - 4, 8, 8);
    });
  }

  _drawThumb(tx, ty) {
    this.thumbGfx.clear();
    this.thumbGfx.fillStyle(0xffffff, 0.7);
    this.thumbGfx.fillCircle(tx, ty, JOY_THUMB_R);
    this.thumbGfx.lineStyle(2, 0xdddddd, 0.9);
    this.thumbGfx.strokeCircle(tx, ty, JOY_THUMB_R);
  }

  _updateJoy(px, py) {
    const { x: cx, y: cy } = this.joyCenter;
    const dx   = px - cx;
    const dy   = py - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 10) {
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

    // "E" label
    this.btnLabel = this.scene.add.text(x, y - 16, 'E', {
      fontFamily: 'Georgia', fontSize: '44px', color: '#1a1a2e', fontStyle: 'bold'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(202);

    // Sub-label
    this.btnSub = this.scene.add.text(x, y + 34, 'vorbeste', {
      fontFamily: 'Georgia', fontSize: '16px', color: '#1a1a2e', fontStyle: 'bold'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(202);

    // Invisible hit zone (slightly larger than visual for easier tapping)
    this.btnZone = this.scene.add.circle(x, y, BTN_R + 12, 0, 0)
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
    this.btnGfx.fillStyle(pressed ? 0xff9900 : 0xffd700, pressed ? 0.95 : 0.75);
    this.btnGfx.fillCircle(x, y, BTN_R);
    this.btnGfx.lineStyle(3, pressed ? 0xff6600 : 0xffcc00, 1);
    this.btnGfx.strokeCircle(x, y, BTN_R);
  }

  // ─── Fullscreen toggle button (top-right corner) ─────────────────────────────

  addFullscreenButton(scene) {
    const W = scene.scale.width;
    const fsBtn = scene.add.text(W - 8, 8, '⛶', {
      fontSize: '28px', color: '#ffffff'
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(300).setAlpha(0.55)
      .setInteractive({ cursor: 'pointer' });

    fsBtn.on('pointerdown', () => {
      try {
        if (scene.scale.isFullscreen) {
          scene.scale.stopFullscreen();
        } else {
          scene.scale.startFullscreen();
        }
      } catch (_) {}
    });
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

  /** Returns {x, y} normalised direction vector, both 0 when idle. */
  getJoystick() {
    return this.joyVec;
  }

  /** Returns true (and resets) when the interact button was tapped. */
  consumeInteract() {
    if (this._interactFired) {
      this._interactFired = false;
      return true;
    }
    return false;
  }

  /** Discard any tap that happened during a quest/dialog overlay. */
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
