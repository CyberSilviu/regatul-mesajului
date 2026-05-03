/**
 * Quest: Apararea Regatului
 * Curriculum topic: "Apararea impotriva virusilor + Firewall"
 * Mechanic: Click on virus icons before they reach the castle; avoid clicking legit traffic
 */

const VIRUSES = [
  { label: 'VIRUS',    color: 0xdd2222, bad: true  },
  { label: 'MALWARE',  color: 0xcc1144, bad: true  },
  { label: 'SPAM',     color: 0xdd6600, bad: true  },
  { label: 'PHISHING', color: 0xbb1166, bad: true  },
  { label: 'WORM',     color: 0xaa0033, bad: true  },
  { label: 'EMAIL',    color: 0x2266cc, bad: false },
  { label: 'UPDATE',   color: 0x226622, bad: false },
  { label: 'BACKUP',   color: 0x225588, bad: false }
];

export default class Quest_Firewall {
  constructor(scene) {
    this.scene = scene;
    this.lives = 3;
    this.destroyed = 0;
    this.needed = 10;
    this.wrong = 0;
    this.active = [];
    this.timer = null;
    this.spawnEvent = null;
    this.done = false;
  }

  start() {
    this._drawFrame();
    this._drawHUD();
    this._startTimer();
    this._startSpawning();
  }

  _drawFrame() {
    const cx = 640;
    this.scene.add.rectangle(cx, 370, 1240, 580, 0x0a0a1a).setStrokeStyle(3, 0x334466);
    this.scene.add.rectangle(cx, 110, 1240, 48, 0x223355);
    this.scene.add.text(cx, 110, 'Apararea Regatului - Firewall', {
      fontFamily: 'Georgia, serif', fontSize: '22px', color: '#88ccff', fontStyle: 'bold'
    }).setOrigin(0.5);
    this.scene.add.text(cx, 140, 'Click pe virusi pentru a-i distruge! Nu atinge traficul legitim!', {
      fontFamily: 'Georgia, serif', fontSize: '13px', color: '#aabbcc', fontStyle: 'italic'
    }).setOrigin(0.5);

    // Castle image at right
    if (this.scene.textures.exists('castle-blue')) {
      this.scene.add.image(1060, 400, 'castle-blue').setScale(0.5).setAlpha(0.8);
    } else {
      this.scene.add.rectangle(1060, 400, 180, 140, 0x2255aa, 0.6)
        .setStrokeStyle(3, 0x4488ff);
      this.scene.add.text(1060, 400, 'CASTEL\nREGAL', {
        fontFamily: 'Georgia, serif', fontSize: '18px', color: '#88ccff', align: 'center'
      }).setOrigin(0.5);
    }

    // Spawn line (left wall)
    this.scene.add.line(0, 0, 55, 170, 55, 620, 0x334466, 0.5).setLineWidth(2);
  }

  _drawHUD() {
    this.livesText = this.scene.add.text(75, 168, `Vieti: ${this.lives}`, {
      fontFamily: 'Georgia, serif', fontSize: '16px', color: '#ff6666', fontStyle: 'bold'
    });
    this.destroyedText = this.scene.add.text(75, 192, `Distrusi: ${this.destroyed}/${this.needed}`, {
      fontFamily: 'Georgia, serif', fontSize: '16px', color: '#88ff88'
    });
    this.timerText = this.scene.add.text(75, 216, 'Timp: 40s', {
      fontFamily: 'monospace', fontSize: '16px', color: '#ffff88'
    });

    this.scene.add.text(75, 248, 'ROSU = virus | ALBASTRU/VERDE = legitim', {
      fontFamily: 'Georgia, serif', fontSize: '12px', color: '#aaaaaa', fontStyle: 'italic'
    });
  }

  _startTimer() {
    let remaining = 40;
    this.timer = this.scene.time.addEvent({
      delay: 1000,
      repeat: 39,
      callback: () => {
        remaining--;
        this.timerText.setText(`Timp: ${remaining}s`);
        if (remaining <= 0 && !this.done) this._endGame();
      }
    });
  }

  _startSpawning() {
    this.spawnEvent = this.scene.time.addEvent({
      delay: 1200,
      repeat: 29,
      callback: this._spawnEnemy,
      callbackScope: this
    });
  }

  _spawnEnemy() {
    if (this.done) return;
    const template = Phaser.Utils.Array.GetRandom(VIRUSES);
    const y = Phaser.Math.Between(185, 610);
    const speed = Phaser.Math.Between(60, 130);

    const bg = this.scene.add.circle(60, y, 28, template.color, 0.9);
    const txt = this.scene.add.text(60, y, template.label, {
      fontFamily: 'monospace', fontSize: '11px', color: '#ffffff', fontStyle: 'bold'
    }).setOrigin(0.5);

    bg.setInteractive({ cursor: template.bad ? 'crosshair' : 'default' });
    const obj = { bg, txt, bad: template.bad, dead: false };

    if (template.bad) {
      bg.on('pointerdown', () => this._hit(obj));
    } else {
      bg.on('pointerdown', () => this._wrongHit(obj));
    }

    this.active.push(obj);

    // Move right toward castle
    this.scene.tweens.add({
      targets: [bg, txt],
      x: 1180,
      duration: (1180 - 60) / speed * 1000,
      onComplete: () => {
        if (!obj.dead && template.bad) {
          this._reachCastle(obj);
        } else if (!obj.dead) {
          obj.bg.destroy(); obj.txt.destroy();
        }
      }
    });
  }

  _hit(obj) {
    if (obj.dead || this.done) return;
    obj.dead = true;
    obj.bg.destroy(); obj.txt.destroy();
    this.destroyed++;
    this.destroyedText.setText(`Distrusi: ${this.destroyed}/${this.needed}`);
    this._spawnExplosion(obj.bg.x, obj.bg.y);
    if (this.destroyed >= this.needed) this._endGame();
  }

  _wrongHit(obj) {
    if (obj.dead || this.done) return;
    obj.dead = true;
    obj.bg.destroy(); obj.txt.destroy();
    this.wrong++;
    const fb = this.scene.add.text(640, 370, 'Atentie! Trafic legitim!', {
      fontFamily: 'Georgia, serif', fontSize: '18px', color: '#ff6600', fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(80);
    this.scene.time.delayedCall(800, () => fb.destroy());
  }

  _reachCastle(obj) {
    obj.bg.destroy(); obj.txt.destroy();
    this.lives--;
    this.livesText.setText(`Vieti: ${this.lives}`);
    this.scene.cameras.main.shake(200, 0.008);
    if (this.lives <= 0 && !this.done) this._endGame();
  }

  _spawnExplosion(x, y) {
    const star = this.scene.add.text(x, y, '💥', { fontSize: '28px' }).setOrigin(0.5);
    this.scene.tweens.add({ targets: star, alpha: 0, y: y - 40, duration: 500,
      onComplete: () => star.destroy() });
  }

  _endGame() {
    if (this.done) return;
    this.done = true;
    this.timer && this.timer.destroy();
    this.spawnEvent && this.spawnEvent.destroy();
    this.active.forEach(o => { if (!o.dead) { o.bg.destroy(); o.txt.destroy(); } });

    const passed = this.lives > 0 && this.wrong < 4;
    const msg = passed
      ? `Regatul e salvat! Viruși distrusi: ${this.destroyed}. Firewall-ul a tinut!`
      : this.lives <= 0 ? 'Castelul a fost infectat! Incearca din nou!'
        : 'Prea mult trafic legitim blocat! Incearca din nou!';
    const color = passed ? '#00ff88' : '#ff4444';

    this.scene.add.text(640, 400, msg, {
      fontFamily: 'Georgia, serif', fontSize: '20px', color,
      fontStyle: 'bold', backgroundColor: '#0a0a1a',
      padding: { x: 20, y: 12 }, wordWrap: { width: 900 }, align: 'center'
    }).setOrigin(0.5).setDepth(90);

    if (passed) {
      this.scene.time.delayedCall(2200, () => this.scene.onQuestComplete());
    } else {
      this.scene.time.delayedCall(2500, () => {
        this.scene.scene.restart({ questId: 'quest_firewall' });
      });
    }
  }
}
