import Phaser from 'phaser';
import Player from '../entities/Player.js';
import NPC from '../entities/NPC.js';
import Building from '../entities/Building.js';
import HUD from '../ui/HUD.js';
import MobileControls from '../ui/MobileControls.js';
import QuestManager from '../quests/QuestManager.js';
import {
  GAME_WIDTH, GAME_HEIGHT, WORLD_WIDTH, WORLD_HEIGHT,
  NPC_CONFIG, BUILDING_DATA, QUEST_REWARDS, INTERACTION_RADIUS
} from '../config.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    this.questManager = new QuestManager();
    this.inputEnabled = true;

    this._buildWorld();
    this._buildBuildings();
    this._buildDecorations();
    this._buildNPCs();
    this._buildPlayer();
    this._setupCamera();
    this._buildHUD();
    this._bindEvents();

    // Restore position from save
    const pos = this.questManager.getSavedPos();
    this.player.setPosition(pos.x, pos.y);

    // Autosave position every 10s
    this.time.addEvent({
      delay: 10000,
      loop: true,
      callback: () => this.questManager.savePlayerPos(this.player.x, this.player.y)
    });

    // If all quests already done (resumed from save), show send button
    if (this.questManager.allComplete()) {
      this.hud.showSendButton();
    }
  }

  _buildWorld() {
    // Ground
    this.add.rectangle(WORLD_WIDTH / 2, WORLD_HEIGHT / 2, WORLD_WIDTH, WORLD_HEIGHT, 0x4e7a3a);

    const P = 0x8a7a60;

    // === Road network connecting all 9 NPCs ===

    // Castle approach: rege (1600,490) — vertical, castle base→main road
    this.add.rectangle(1600, 490, 62,  420, P, 0.65);

    // Main horizontal artery at y=700: scrib(500) ↔ castle ↔ strajer(2550)
    this.add.rectangle(1450, 700, 2500, 56, P, 0.55);

    // Main vertical spine at x=1600: y=700 → y=1500
    this.add.rectangle(1600, 1100, 56, 800, P, 0.50);

    // Tower approach: strajer (2550,640) — vertical spur down to main road
    this.add.rectangle(2550,  520,  50, 360, P, 0.45);

    // Right branch: x=2100, y=700→1100 for sergent (2100,1070)
    this.add.rectangle(2100,  900,  50, 400, P, 0.45);

    // Horizontal connector: spine → sergent at y=1100
    this.add.rectangle(1875, 1100, 550,  50, P, 0.45);

    // Left vertical: x=500, y=700→1650 (scrib 690, calugar 1330, cioban 1600)
    this.add.rectangle(500,  1175,  50, 950, P, 0.45);

    // Spur to bibliotecara (820,880): x=500 → x=855 at y=880
    this.add.rectangle(677,   880, 355,  50, P, 0.45);

    // Spur to trimis (1300,760): y=700→790 at x=1300
    this.add.rectangle(1300,  745,  50,  90, P, 0.45);

    // Spur to calugar (350,1330): x=350→500 at y=1330
    this.add.rectangle(427,  1330, 155,  50, P, 0.45);

    // Lower horizontal: y=1420, x=350→1800 (calugar ↔ arcas 1750,1410)
    this.add.rectangle(1075, 1420, 1450, 50, P, 0.45);

    // Spur to cioban (750,1600): x=500→800 at y=1600
    this.add.rectangle(650,  1600, 300,  50, P, 0.45);

    // World physics bounds
    this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
  }

  _buildBuildings() {
    this.buildings = [];
    for (const [key, cfg] of Object.entries(NPC_CONFIG)) {
      if (cfg.building && cfg.buildingX !== null) {
        this.buildings.push(new Building(this, cfg.building, cfg.buildingX, cfg.buildingY));
      }
    }
  }

  _buildDecorations() {
    const bushKeys = ['bushe1', 'bushe2', 'bushe3', 'bushe4'];
    const excluded = this._buildExclusionZones();

    for (let i = 0; i < 65; i++) {
      const pos = this._randPos(90, excluded);
      if (pos) this.add.image(pos.x, pos.y, bushKeys[i % 4]).setDepth(2);
    }

    for (let i = 0; i < 22; i++) {
      const pos = this._randPos(160, excluded);
      if (pos) this.add.image(pos.x, pos.y, i % 2 === 0 ? 'rock1' : 'rock2').setDepth(2);
    }

    // Sheep decorations near shepherd (cioban)
    [[680, 1570], [800, 1550], [730, 1640], [660, 1630]].forEach(([sx, sy]) => {
      const sheep = this.add.sprite(sx, sy, 'sheep-idle').setScale(0.5).setDepth(7);
      sheep.anims.play('sheep-idle', true);
    });

    // Easter egg rubber duck (hidden in a corner)
    if (this.textures.exists('rubber-duck')) {
      this.add.image(3100, 2350, 'rubber-duck').setScale(0.4).setDepth(6).setAlpha(0.9);
    }
  }

  // Rectangle + circle exclusion zones around buildings and NPCs
  _buildExclusionZones() {
    const zones = [];
    for (const cfg of Object.values(NPC_CONFIG)) {
      zones.push({ x: cfg.x, y: cfg.y, r: 130 });
      if (cfg.building && cfg.buildingX !== null) {
        const d = BUILDING_DATA[cfg.building];
        zones.push({
          x: cfg.buildingX,
          y: cfg.buildingY - d.h / 2,
          hw: d.w / 2 + 70,
          hh: d.h / 2 + 70
        });
      }
    }
    return zones;
  }

  // Returns a random {x,y} that avoids all excluded zones, then adds itself to excluded
  _randPos(minSpacing, excluded) {
    const margin = 80;
    for (let attempt = 0; attempt < 40; attempt++) {
      const x = Phaser.Math.Between(margin, WORLD_WIDTH - margin);
      const y = Phaser.Math.Between(margin, WORLD_HEIGHT - margin);

      let ok = true;
      for (const z of excluded) {
        if (z.hw !== undefined) {
          if (Math.abs(x - z.x) < z.hw && Math.abs(y - z.y) < z.hh) { ok = false; break; }
        } else {
          const dx = x - z.x, dy = y - z.y;
          if (dx * dx + dy * dy < z.r * z.r) { ok = false; break; }
        }
      }

      if (ok) {
        excluded.push({ x, y, r: minSpacing });
        return { x, y };
      }
    }
    return null;
  }

  _buildNPCs() {
    this.npcs = [];
    for (const [key, cfg] of Object.entries(NPC_CONFIG)) {
      const npc = new NPC(this, key, cfg);
      this.npcs.push(npc);
    }
  }

  _buildPlayer() {
    this.player = new Player(this, 1600, 550);
    this.cursors  = this.input.keyboard.createCursorKeys();
    this.wasd = {
      W: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      A: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      S: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      D: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    };
    this.eKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

    // Collide player against each building's invisible footprint body
    this.buildings.forEach(b => {
      if (b.staticBody) this.physics.add.collider(this.player, b.staticBody);
    });

    // Touch controls — only on devices that support touch
    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    this.mobileControls = isTouch ? new MobileControls(this) : null;
  }

  _setupCamera() {
    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
    this.cameras.main.setZoom(1);
  }

  _buildHUD() {
    this.hud = new HUD(this, this.questManager);
    this.hud.onSendClick(() => {
      if (this.questManager.allComplete()) {
        this.questManager.savePlayerPos(this.player.x, this.player.y);
        this.scene.start('EndingScene');
      }
    });
  }

  _bindEvents() {
    // From DialogScene: accept quest
    this.events.on('quest-start', data => {
      this.scene.stop('DialogScene');
      this.scene.launch('QuestScene', data);
      this.scene.bringToTop('QuestScene');
      this.scene.pause();
    });

    // From QuestScene: quest completed
    this.events.on('quest-complete', data => {
      this.questManager.complete(data.questId);
      const reward = QUEST_REWARDS[data.questId];
      if (reward) this.hud.showItemObtained(reward.name);
      this.mobileControls?.reset(); // discard any tap that happened during the quest
      this.inputEnabled = true;
    });

    // From DialogScene: dialog closed without quest
    this.events.on('dialog-close', () => {
      this.mobileControls?.reset();
      this.inputEnabled = true;
    });
  }

  update() {
    if (!this.inputEnabled) return;

    const joy = this.mobileControls?.getJoystick() ?? null;
    this.player.update(this.cursors, this.wasd, joy);

    let nearestNPC  = null;
    let nearestDist = INTERACTION_RADIUS;

    for (const npc of this.npcs) {
      const dist = Phaser.Math.Distance.Between(
        this.player.x, this.player.y, npc.x, npc.y
      );
      npc.showPrompt(false);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearestNPC = npc;
      }
    }

    if (nearestNPC) {
      nearestNPC.updatePromptPosition(this.cameras.main);
      nearestNPC.showPrompt(true);

      const ePressed      = Phaser.Input.Keyboard.JustDown(this.eKey);
      const btnPressed    = this.mobileControls?.consumeInteract() ?? false;
      if (ePressed || btnPressed) {
        this._startDialog(nearestNPC.npcKey);
      }
    }
  }

  _startDialog(npcKey) {
    this.inputEnabled = false;
    const questId = NPC_CONFIG[npcKey].questId;
    const state   = this.questManager.isCompleted(questId) ? 'completed' : 'available';
    this.scene.launch('DialogScene', { npcKey, state });
    this.scene.bringToTop('DialogScene');
  }
}
