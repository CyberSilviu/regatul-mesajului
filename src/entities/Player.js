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

  update(cursors, wasd) {
    let vx = 0;
    let vy = 0;

    const left  = cursors.left.isDown  || (wasd && wasd.A.isDown);
    const right = cursors.right.isDown || (wasd && wasd.D.isDown);
    const up    = cursors.up.isDown    || (wasd && wasd.W.isDown);
    const down  = cursors.down.isDown  || (wasd && wasd.S.isDown);

    if (left)  { vx = -PLAYER_SPEED; this.setFlipX(true); }
    if (right) { vx =  PLAYER_SPEED; this.setFlipX(false); }
    if (up)    vy = -PLAYER_SPEED;
    if (down)  vy =  PLAYER_SPEED;

    // Normalize diagonal
    if (vx !== 0 && vy !== 0) {
      vx *= 0.707;
      vy *= 0.707;
    }

    this.setVelocity(vx, vy);

    if (vx !== 0 || vy !== 0) {
      this.anims.play('pawn-run', true);
    } else {
      this.anims.play('pawn-idle', true);
    }
  }
}
