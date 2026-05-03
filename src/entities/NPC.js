import Phaser from 'phaser';

const ANIM_MAP = {
  'warrior-blue-idle': 'warrior-idle',
  'pawn-blue-idle':    'pawn-idle',
  'monk-blue-idle':    'monk-idle',
  'archer-blue-idle':  'archer-idle',
  'lancer-blue-idle':  'lancer-idle'
};

const SCALE_MAP = {
  'lancer-blue-idle': 0.3,
};
const DEFAULT_SCALE = 0.45;

export default class NPC extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, npcKey, cfg) {
    super(scene, cfg.x, cfg.y, cfg.sprite);
    scene.add.existing(this);
    scene.physics.add.existing(this, true); // static body

    this.npcKey = npcKey;
    this.setScale(SCALE_MAP[cfg.sprite] || DEFAULT_SCALE);
    this.setDepth(9);

    // Interaction prompt
    this.prompt = scene.add.text(cfg.x, cfg.y - 75, 'Apasa E pentru a vorbi', {
      fontFamily: 'Georgia, serif',
      fontSize: '13px',
      color: '#ffffff',
      backgroundColor: '#000000cc',
      padding: { x: 8, y: 5 }
    }).setOrigin(0.5).setVisible(false).setDepth(20).setScrollFactor(0);

    // Store screen-space position for prompt; will be updated in GameScene
    this._promptVisible = false;

    const animKey = ANIM_MAP[cfg.sprite];
    if (animKey && scene.anims.exists(animKey)) {
      this.anims.play(animKey, true);
    }
  }

  // Called by GameScene with camera-adjusted screen coords
  updatePromptPosition(camera) {
    const sx = (this.x - camera.scrollX) * camera.zoom;
    const sy = (this.y - camera.scrollY) * camera.zoom - 60;
    this.prompt.setPosition(sx, sy);
  }

  showPrompt(visible) {
    this._promptVisible = visible;
    this.prompt.setVisible(visible);
  }

  destroy() {
    this.prompt.destroy();
    super.destroy();
  }
}
