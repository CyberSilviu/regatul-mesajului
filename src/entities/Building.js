import { BUILDING_DATA } from '../config.js';

export default class Building {
  constructor(scene, type, x, y) {
    const data = BUILDING_DATA[type];
    if (!data) return;

    this.image = scene.add.image(x, y, data.key)
      .setOrigin(0.5, 1)
      .setDepth(8);

    // Collision body covers ~65% of building height, centered on the sprite.
    // Insets ~17% on both top and bottom so the body stays within visible pixels
    // and avoids the transparent padding common in these sprites.
    const bw = Math.floor(data.w * 0.80);
    const bh = Math.floor(data.h * 0.65);
    const cy = y - data.h / 2; // vertical center of the sprite
    this.staticBody = scene.add.rectangle(x, cy, bw, bh).setVisible(false);
    scene.physics.add.existing(this.staticBody, true);
  }
}
