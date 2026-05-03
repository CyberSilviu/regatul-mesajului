import Phaser from 'phaser';
import BootScene    from './scenes/BootScene.js';
import MenuScene    from './scenes/MenuScene.js';
import GameScene    from './scenes/GameScene.js';
import DialogScene  from './scenes/DialogScene.js';
import QuestScene   from './scenes/QuestScene.js';
import EndingScene  from './scenes/EndingScene.js';

const config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  backgroundColor: '#1a1a2e',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: [BootScene, MenuScene, GameScene, DialogScene, QuestScene, EndingScene]
};

new Phaser.Game(config);
