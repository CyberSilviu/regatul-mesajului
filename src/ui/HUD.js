import { GAME_WIDTH, GAME_HEIGHT, QUEST_REWARDS } from '../config.js';

export default class HUD {
  constructor(scene, questManager) {
    this.scene = scene;
    this.qm = questManager;
    this.iconObjs = {};

    const BAR_Y = GAME_HEIGHT - 38;
    const BAR_H = 72;

    // Background bar
    this.bar = scene.add.rectangle(GAME_WIDTH / 2, BAR_Y, GAME_WIDTH, BAR_H, 0x000000, 0.75)
      .setScrollFactor(0).setDepth(50);

    // Progress label
    this.progressLabel = scene.add.text(16, BAR_Y - 20, 'Misiuni: 0 / 9', {
      fontFamily: 'Georgia, serif',
      fontSize: '15px',
      color: '#ffdd88',
      fontStyle: 'bold'
    }).setScrollFactor(0).setDepth(51).setOrigin(0, 0.5);

    // 9 inventory slots
    this.slots = [];
    const questIds = Object.keys(QUEST_REWARDS);
    const totalSlots = questIds.length;
    const slotSize = 52;
    const gap = 6;
    const totalW = totalSlots * (slotSize + gap) - gap;
    const startX = GAME_WIDTH / 2 - totalW / 2 + slotSize / 2;

    questIds.forEach((id, i) => {
      const sx = startX + i * (slotSize + gap);
      const slot = scene.add.rectangle(sx, BAR_Y, slotSize, slotSize, 0x333344, 0.9)
        .setStrokeStyle(2, 0x6688bb)
        .setScrollFactor(0).setDepth(51);
      this.slots.push({ rect: slot, x: sx, y: BAR_Y, questId: id });
    });

    // Notification text (fades out)
    this.notification = scene.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 120, '', {
      fontFamily: 'Georgia, serif',
      fontSize: '20px',
      color: '#ffff66',
      fontStyle: 'bold',
      backgroundColor: '#00000099',
      padding: { x: 14, y: 8 }
    }).setOrigin(0.5).setScrollFactor(0).setDepth(55).setAlpha(0);

    // "Send mail" button - hidden until all quests done
    this.sendBtn = scene.add.text(GAME_WIDTH - 20, BAR_Y, 'TRIMITE MESAJUL! ✉', {
      fontFamily: 'Georgia, serif',
      fontSize: '16px',
      color: '#000000',
      fontStyle: 'bold',
      backgroundColor: '#ffdd00',
      padding: { x: 14, y: 10 }
    }).setOrigin(1, 0.5).setScrollFactor(0).setDepth(55).setVisible(false)
      .setInteractive({ cursor: 'pointer' });

    this.sendBtn.on('pointerover', () => this.sendBtn.setStyle({ backgroundColor: '#ffee44' }));
    this.sendBtn.on('pointerout',  () => this.sendBtn.setStyle({ backgroundColor: '#ffdd00' }));

    this.update();
  }

  update() {
    const count = this.qm.getCompletedCount();
    this.progressLabel.setText(`Misiuni: ${count} / 9`);

    const inventory = this.qm.getInventory();
    const questIds = Object.keys(QUEST_REWARDS);

    questIds.forEach((questId, i) => {
      const reward = QUEST_REWARDS[questId];
      const has = inventory.includes(reward.item);
      const slot = this.slots[i];

      if (has && !this.iconObjs[questId]) {
        const icon = this.scene.add.image(slot.x, slot.y, reward.icon)
          .setDisplaySize(44, 44)
          .setScrollFactor(0).setDepth(52);
        this.iconObjs[questId] = icon;
        slot.rect.setStrokeStyle(2, 0x44ff88);
      }
    });

    if (count === 9) this.showSendButton();
  }

  showItemObtained(itemName) {
    this.notification.setText(`Ai primit: ${itemName}!`).setAlpha(1);
    this.scene.tweens.add({
      targets: this.notification,
      alpha: 0,
      duration: 800,
      delay: 2000
    });
    this.update();
  }

  showSendButton() {
    this.sendBtn.setVisible(true);
  }

  onSendClick(callback) {
    this.sendBtn.on('pointerdown', callback);
  }
}
