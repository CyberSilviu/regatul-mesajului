/**
 * Quest: Sortarea Mesajelor
 * Curriculum topic: "Administrarea e-mail-urilor (directoare, filtre)"
 * Mechanic: Drag & drop 8 emails into 4 folders (Inbox / Spam / Cos / Important)
 */

import emailsData from '../data/emails.json';

const FOLDERS = [
  { id: 'inbox',     label: 'Inbox',     color: 0x2255aa, x: 280,  y: 310 },
  { id: 'spam',      label: 'Spam',      color: 0xaa2222, x: 560,  y: 310 },
  { id: 'trash',     label: 'Cos',       color: 0x777777, x: 840,  y: 310 },
  { id: 'important', label: 'Important', color: 0xcc8800, x: 1020, y: 310 }
];

export default class Quest_Folders {
  constructor(scene) {
    this.scene = scene;
    this.sorted = {}; // { emailId: folderId }
    this.cards = [];
    this.folderObjs = {};
  }

  start() {
    this._drawFrame();
    this._drawFolders();
    this._drawCards();
    this._setupDrag();
  }

  _drawFrame() {
    this.scene.add.rectangle(640, 370, 1180, 580, 0xf5e6c8).setStrokeStyle(4, 0x8b6914);
    this.scene.add.rectangle(640, 110, 1180, 56, 0x8b6914);
    this.scene.add.text(640, 110, 'Sortarea Mesajelor', {
      fontFamily: 'Georgia, serif', fontSize: '22px', color: '#ffffff', fontStyle: 'bold'
    }).setOrigin(0.5);
    this.scene.add.text(640, 143, 'Trage fiecare mesaj in directorul corect', {
      fontFamily: 'Georgia, serif', fontSize: '13px', color: '#eecc88', fontStyle: 'italic'
    }).setOrigin(0.5);

    this.counterTxt = this.scene.add.text(640, 172, 'Sortate: 0 / 8', {
      fontFamily: 'Georgia, serif', fontSize: '14px', color: '#334455'
    }).setOrigin(0.5);
  }

  _drawFolders() {
    FOLDERS.forEach(f => {
      const zone = this.scene.add.rectangle(f.x, f.y, 210, 130, f.color, 0.85)
        .setStrokeStyle(3, 0xffffff);
      this.scene.add.text(f.x, f.y - 40, f.label, {
        fontFamily: 'Georgia, serif', fontSize: '18px', color: '#ffffff', fontStyle: 'bold'
      }).setOrigin(0.5);
      this.folderObjs[f.id] = { zone, x: f.x, y: f.y, w: 210, h: 130, count: 0 };
    });
  }

  _drawCards() {
    emailsData.forEach((email, i) => {
      const col = i % 4;
      const row = Math.floor(i / 4);
      const ox = 280 + col * 240;
      const oy = 450 + row * 75;

      const bg = this.scene.add.rectangle(ox, oy, 220, 60, 0xffffff, 0.95)
        .setStrokeStyle(2, 0xaaaacc)
        .setInteractive({ draggable: true });

      bg.setDepth(30);

      const fromT = this.scene.add.text(ox, oy - 10, this._trim(email.from, 28), {
        fontFamily: 'monospace', fontSize: '11px', color: '#334455'
      }).setOrigin(0.5).setDepth(31);

      const subjT = this.scene.add.text(ox, oy + 10, this._trim(email.subject, 30), {
        fontFamily: 'Georgia, serif', fontSize: '11px', color: '#221100', fontStyle: 'bold'
      }).setOrigin(0.5).setDepth(31);

      bg._email = email;
      bg._origX = ox; bg._origY = oy;
      bg._fromT = fromT; bg._subjT = subjT;
      bg._placed = false;

      this.cards.push(bg);
    });
  }

  _setupDrag() {
    this.scene.input.on('dragstart', (_p, go) => {
      if (go._placed) return;
      go.setDepth(100);
      go._fromT.setDepth(101);
      go._subjT.setDepth(101);
    });

    this.scene.input.on('drag', (_p, go, dx, dy) => {
      if (go._placed) return;
      go.x = dx; go.y = dy;
      go._fromT.x = dx; go._fromT.y = dy - 10;
      go._subjT.x = dx; go._subjT.y = dy + 10;
    });

    this.scene.input.on('dragend', (_p, go) => {
      if (go._placed) return;
      go.setDepth(30); go._fromT.setDepth(31); go._subjT.setDepth(31);

      const folder = this._folderAt(go.x, go.y);
      if (folder) {
        this._placeCard(go, folder);
      } else {
        this.scene.tweens.add({ targets: [go, go._fromT, go._subjT],
          x: go._origX, duration: 180 });
        go.y = go._origY; go._fromT.y = go._origY - 10; go._subjT.y = go._origY + 10;
      }
    });
  }

  _folderAt(x, y) {
    for (const f of FOLDERS) {
      const fo = this.folderObjs[f.id];
      if (Math.abs(x - fo.x) < fo.w / 2 && Math.abs(y - fo.y) < fo.h / 2) return f;
    }
    return null;
  }

  _placeCard(go, folder) {
    go._placed = true;
    this.sorted[go._email.id] = folder.id;

    const fo = this.folderObjs[folder.id];
    fo.count++;
    const nx = fo.x + (fo.count % 2 === 0 ? 30 : -30);
    const ny = fo.y + (Math.floor((fo.count - 1) / 2)) * 18 - 20;

    go.x = nx; go.y = ny; go._fromT.x = nx; go._fromT.y = ny - 10;
    go._subjT.x = nx; go._subjT.y = ny + 10;
    go.setFillStyle(0xdddddd).setStrokeStyle(1, 0x888888);

    this.counterTxt.setText(`Sortate: ${Object.keys(this.sorted).length} / 8`);

    if (Object.keys(this.sorted).length === emailsData.length) {
      this.scene.time.delayedCall(400, () => this._checkResult());
    }
  }

  _checkResult() {
    let correct = 0;
    emailsData.forEach(e => {
      if (this.sorted[e.id] === e.correctFolder) correct++;
    });

    if (correct >= 6) {
      this.scene.add.text(640, 660, `Bravo! ${correct}/8 sortate corect. Misiune reusita!`, {
        fontFamily: 'Georgia, serif', fontSize: '19px', color: '#006600', fontStyle: 'bold',
        backgroundColor: '#f5e6c8', padding: { x: 18, y: 10 }
      }).setOrigin(0.5);
      this.scene.time.delayedCall(2000, () => this.scene.onQuestComplete());
    } else {
      this.scene.add.text(640, 660, `Ai sortat corect ${correct}/8. Trebuie cel putin 6. Incearca din nou!`, {
        fontFamily: 'Georgia, serif', fontSize: '16px', color: '#880000',
        backgroundColor: '#f5e6c8', padding: { x: 18, y: 10 }
      }).setOrigin(0.5);
      this.scene.time.delayedCall(2000, () => {
        this.scene.scene.restart({ questId: 'quest_folders' });
      });
    }
  }

  _trim(str, max) { return str.length > max ? str.slice(0, max - 1) + '…' : str; }
}
