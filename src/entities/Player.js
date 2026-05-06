import Phaser from 'phaser';
import { PLAYER_SPEED } from '../config.js';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'pawn-blue-idle');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);
    this.setScale(0.45);
    this.body.setSize(80, 80);
    this.setDepth(10);
    this.setFlipX(false);
  }

  /**
   * @param {Phaser.Types.Input.Keyboard.CursorKeys} cursors
   * @param {object} wasd
   * @param {{x: number, y: number}|null} mobileJoy  normalised direction from MobileControls
   */
  update(cursors, wasd, mobileJoy = null) {
    let vx = 0;
    let vy = 0;

    // ── Keyboard input ────────────────────────────────────────────────────────
    const left  = cursors.left.isDown  || (wasd && wasd.A.isDown);
    const right = cursors.right.isDown || (wasd && wasd.D.isDown);
    const up    = cursors.up.isDown    || (wasd && wasd.W.isDown);
    const down  = cursors.down.isDown  || (wasd && wasd.S.isDown);

    if (left)  { vx = -PLAYER_SPEED; this.setFlipX(true);  }
    if (right) { vx =  PLAYER_SPEED; this.setFlipX(false); }
    if (up)    vy = -PLAYER_SPEED;
    if (down)  vy =  PLAYER_SPEED;

    // Normalize diagonal for keyboard
    if (vx !== 0 && vy !== 0) {
      vx *= 0.707;
      vy *= 0.707;
    }

    // ── Virtual joystick overrides keyboard when active ───────────────────────
    if (mobileJoy && (Math.abs(mobileJoy.x) > 0.1 || Math.abs(mobileJoy.y) > 0.1)) {
      vx = mobileJoy.x * PLAYER_SPEED;
      vy = mobileJoy.y * PLAYER_SPEED;
      if      (mobileJoy.x < -0.1) this.setFlipX(true);
      else if (mobileJoy.x >  0.1) this.setFlipX(false);
    }

    this.setVelocity(vx, vy);

    if (vx !== 0 || vy !== 0) {
      this.anims.play('pawn-run', true);
    } else {
      this.anims.play('pawn-idle', true);
    }
  }
}
