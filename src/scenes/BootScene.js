import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    const W = this.cameras.main.width;
    const H = this.cameras.main.height;

    // Loading bar (drawn with graphics — no assets needed yet)
    const barBg  = this.add.graphics().fillStyle(0x333333).fillRect(W / 2 - 202, H / 2 - 17, 404, 34);
    const bar    = this.add.graphics();
    const label  = this.add.text(W / 2, H / 2 - 50, 'Se incarca...', {
      fontFamily: 'Georgia, serif', fontSize: '22px', color: '#ffffff'
    }).setOrigin(0.5);
    const pct    = this.add.text(W / 2, H / 2 + 32, '0%', {
      fontFamily: 'monospace', fontSize: '16px', color: '#aaaaaa'
    }).setOrigin(0.5);

    this.load.on('progress', v => {
      bar.clear().fillStyle(0x4a8c3f).fillRect(W / 2 - 200, H / 2 - 15, 400 * v, 30);
      pct.setText(Math.floor(v * 100) + '%');
    });

    // ── Units ────────────────────────────────────────────────────────────────
    this.load.spritesheet('pawn-blue-idle',
      'assets/Units/Blue Units/Pawn/Pawn_Idle.png', { frameWidth: 192, frameHeight: 192 });
    this.load.spritesheet('pawn-blue-run',
      'assets/Units/Blue Units/Pawn/Pawn_Run.png',  { frameWidth: 192, frameHeight: 192 });

    this.load.spritesheet('warrior-blue-idle',
      'assets/Units/Blue Units/Warrior/Warrior_Idle.png',    { frameWidth: 192, frameHeight: 192 });
    this.load.spritesheet('warrior-blue-attack',
      'assets/Units/Blue Units/Warrior/Warrior_Attack1.png', { frameWidth: 192, frameHeight: 192 });

    this.load.spritesheet('monk-blue-idle',
      'assets/Units/Blue Units/Monk/Idle.png',  { frameWidth: 192, frameHeight: 192 });
    this.load.spritesheet('monk-blue-heal',
      'assets/Units/Blue Units/Monk/Heal.png',  { frameWidth: 192, frameHeight: 192 });

    this.load.spritesheet('archer-blue-idle',
      'assets/Units/Blue Units/Archer/Archer_Idle.png',  { frameWidth: 192, frameHeight: 192 });
    this.load.spritesheet('archer-blue-shoot',
      'assets/Units/Blue Units/Archer/Archer_Shoot.png', { frameWidth: 192, frameHeight: 192 });

    this.load.spritesheet('lancer-blue-idle',
      'assets/Units/Blue Units/Lancer/Lancer_Idle.png', { frameWidth: 320, frameHeight: 320 });

    this.load.spritesheet('sheep-idle',
      'assets/Terrain/Resources/Meat/Sheep/Sheep_Idle.png', { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet('sheep-move',
      'assets/Terrain/Resources/Meat/Sheep/Sheep_Move.png', { frameWidth: 128, frameHeight: 128 });

    // ── Buildings ────────────────────────────────────────────────────────────
    this.load.image('castle-blue',    'assets/Buildings/Blue Buildings/Castle.png');
    this.load.image('castle-red',     'assets/Buildings/Red Buildings/Castle.png');
    this.load.image('house1-blue',    'assets/Buildings/Blue Buildings/House1.png');
    this.load.image('house2-blue',    'assets/Buildings/Blue Buildings/House2.png');
    this.load.image('house3-blue',    'assets/Buildings/Blue Buildings/House3.png');
    this.load.image('monastery-blue', 'assets/Buildings/Blue Buildings/Monastery.png');
    this.load.image('tower-blue',     'assets/Buildings/Blue Buildings/Tower.png');
    this.load.image('barracks-blue',  'assets/Buildings/Blue Buildings/Barracks.png');
    this.load.image('archery-blue',   'assets/Buildings/Blue Buildings/Archery.png');

    // ── Terrain ──────────────────────────────────────────────────────────────
    this.load.image('bushe1', 'assets/Terrain/Decorations/Bushes/Bushe1.png');
    this.load.image('bushe2', 'assets/Terrain/Decorations/Bushes/Bushe2.png');
    this.load.image('bushe3', 'assets/Terrain/Decorations/Bushes/Bushe3.png');
    this.load.image('bushe4', 'assets/Terrain/Decorations/Bushes/Bushe4.png');
    this.load.image('rock1',  'assets/Terrain/Decorations/Rocks/Rock1.png');
    this.load.image('rock2',  'assets/Terrain/Decorations/Rocks/Rock2.png');
    this.load.image('rubber-duck', 'assets/Terrain/Decorations/Rubber Duck/Rubber duck.png');

    // ── UI ───────────────────────────────────────────────────────────────────
    this.load.image('paper-regular', 'assets/UI Elements/UI Elements/Papers/RegularPaper.png');
    this.load.image('paper-special', 'assets/UI Elements/UI Elements/Papers/SpecialPaper.png');
    this.load.image('banner',        'assets/UI Elements/UI Elements/Banners/Banner.png');
    this.load.image('bigbar-base',   'assets/UI Elements/UI Elements/Bars/BigBar_Base.png');
    this.load.image('bigbar-fill',   'assets/UI Elements/UI Elements/Bars/BigBar_Fill.png');
    this.load.image('wood-table',    'assets/UI Elements/UI Elements/Wood Table/WoodTable.png');

    this.load.image('btn-blue-big',   'assets/UI Elements/UI Elements/Buttons/BigBlueButton_Regular.png');
    this.load.image('btn-red-big',    'assets/UI Elements/UI Elements/Buttons/BigRedButton_Regular.png');
    this.load.image('btn-blue-small', 'assets/UI Elements/UI Elements/Buttons/SmallBlueRoundButton_Regular.png');
    this.load.image('btn-red-small',  'assets/UI Elements/UI Elements/Buttons/SmallRedRoundButton_Regular.png');

    // Icons
    for (let i = 1; i <= 9; i++) {
      const pad = String(i).padStart(2, '0');
      this.load.image(`icon-${String(i).padStart(2, '0')}`,
        `assets/UI Elements/UI Elements/Icons/Icon_${pad}.png`);
    }
    // alias without leading zero for config.js references like 'icon-01'
    // (already loaded above with padded names)

    // Avatars
    for (let i = 1; i <= 20; i++) {
      const pad = String(i).padStart(2, '0');
      this.load.image(`avatar-${pad}`,
        `assets/UI Elements/UI Elements/Human Avatars/Avatars_${pad}.png`);
    }
  }

  create() {
    // ── Animations ───────────────────────────────────────────────────────────
    const A = this.anims;

    A.create({ key: 'pawn-idle', frames: A.generateFrameNumbers('pawn-blue-idle', { start: 0, end: 7 }), frameRate: 8,  repeat: -1 });
    A.create({ key: 'pawn-run',  frames: A.generateFrameNumbers('pawn-blue-run',  { start: 0, end: 5 }), frameRate: 12, repeat: -1 });

    A.create({ key: 'warrior-idle',   frames: A.generateFrameNumbers('warrior-blue-idle',   { start: 0, end: 7 }), frameRate: 8,  repeat: -1 });
    A.create({ key: 'warrior-attack', frames: A.generateFrameNumbers('warrior-blue-attack', { start: 0, end: 3 }), frameRate: 10, repeat: -1 });

    A.create({ key: 'monk-idle', frames: A.generateFrameNumbers('monk-blue-idle', { start: 0, end: 7 }), frameRate: 8,  repeat: -1 });
    A.create({ key: 'monk-heal', frames: A.generateFrameNumbers('monk-blue-heal', { start: 0, end: 10}), frameRate: 12, repeat: -1 });

    A.create({ key: 'archer-idle',  frames: A.generateFrameNumbers('archer-blue-idle',  { start: 0, end: 7 }), frameRate: 8,  repeat: -1 });
    A.create({ key: 'archer-shoot', frames: A.generateFrameNumbers('archer-blue-shoot', { start: 0, end: 7 }), frameRate: 12, repeat: -1 });

    A.create({ key: 'lancer-idle', frames: A.generateFrameNumbers('lancer-blue-idle', { start: 0, end: 11 }), frameRate: 10, repeat: -1 });

    A.create({ key: 'sheep-idle', frames: A.generateFrameNumbers('sheep-idle', { start: 0, end: 5 }), frameRate: 6,  repeat: -1 });
    A.create({ key: 'sheep-move', frames: A.generateFrameNumbers('sheep-move', { start: 0, end: 3 }), frameRate: 10, repeat: -1 });

    this.scene.start('MenuScene');
  }
}
