/**
 * Quest: Fisiere Atasate
 * Curriculum topic: "Folosirea atasamentelor si redirectionarea unui mesaj"
 * Mechanic: Select exactly the 3 required official files from a mixed list
 */

const FILES = [
  { id: 'scrisoare',  name: 'scrisoare_regala.doc',  desc: 'Scrisoarea oficiale a regelui', required: true  },
  { id: 'harta',      name: 'harta_regatului.pdf',    desc: 'Harta cu granitele regatului',  required: true  },
  { id: 'sigiliu',    name: 'sigiliu_regal.png',      desc: 'Imaginea sigiliului oficial',   required: true  },
  { id: 'poza',       name: 'poza_profil.jpg',         desc: 'Fotografie personala',          required: false },
  { id: 'reteta',     name: 'reteta_piine.txt',        desc: 'Reteta de paine a bucatarului', required: false },
  { id: 'jurnal',     name: 'jurnalul_meu.doc',        desc: 'Jurnal personal privat',        required: false }
];

export default class Quest_Attach {
  constructor(scene) {
    this.scene = scene;
    this.selected = new Set();
    this.rowObjs = {};
  }

  start() {
    this._drawFrame();
    this._drawFiles();
    this._drawActionArea();
  }

  _drawFrame() {
    const cx = 640;
    this.scene.add.rectangle(cx, 370, 900, 530, 0xf5e6c8).setStrokeStyle(4, 0x8b6914);
    this.scene.add.rectangle(cx, 130, 900, 56, 0x8b6914);
    this.scene.add.text(cx, 130, 'Atasare Fisiere la Mesaj', {
      fontFamily: 'Georgia, serif', fontSize: '22px', color: '#ffffff', fontStyle: 'bold'
    }).setOrigin(0.5);
    this.scene.add.text(cx, 164, 'Selecteaza EXACT fisierele oficiale necesare pentru mesajul regal', {
      fontFamily: 'Georgia, serif', fontSize: '13px', color: '#eecc88', fontStyle: 'italic'
    }).setOrigin(0.5);

    this.scene.add.text(240, 200, 'Fisiere disponibile:', {
      fontFamily: 'Georgia, serif', fontSize: '16px', color: '#442200', fontStyle: 'bold'
    });
    this.scene.add.text(240, 222, 'Click pe fisier pentru a-l selecta / deselecta', {
      fontFamily: 'Georgia, serif', fontSize: '13px', color: '#886644', fontStyle: 'italic'
    });

    this.selLabel = this.scene.add.text(cx, 592, 'Selectate: 0 fisiere', {
      fontFamily: 'Georgia, serif', fontSize: '15px', color: '#334455'
    }).setOrigin(0.5);
  }

  _drawFiles() {
    FILES.forEach((f, i) => {
      const y = 252 + i * 50;
      const bg = this.scene.add.rectangle(640, y, 820, 42, 0xffffff, 0.9)
        .setStrokeStyle(2, 0xccbbaa).setInteractive({ cursor: 'pointer' });

      const icon = this.scene.add.text(255, y, '📄', { fontSize: '18px' }).setOrigin(0.5);
      const nameTxt = this.scene.add.text(280, y, f.name, {
        fontFamily: 'monospace', fontSize: '14px', color: '#223344', fontStyle: 'bold'
      }).setOrigin(0, 0.5);
      const descTxt = this.scene.add.text(560, y, f.desc, {
        fontFamily: 'Georgia, serif', fontSize: '13px', color: '#665544'
      }).setOrigin(0, 0.5);
      const checkTxt = this.scene.add.text(990, y, '', {
        fontFamily: 'monospace', fontSize: '20px', color: '#22aa44'
      }).setOrigin(0.5);

      bg.on('pointerover', () => !this.selected.has(f.id) && bg.setFillStyle(0xeef4ff));
      bg.on('pointerout',  () => !this.selected.has(f.id) && bg.setFillStyle(0xffffff));
      bg.on('pointerdown', () => this._toggle(f, bg, checkTxt));

      this.rowObjs[f.id] = { bg, checkTxt };
    });
  }

  _toggle(f, bg, checkTxt) {
    if (this.selected.has(f.id)) {
      this.selected.delete(f.id);
      bg.setFillStyle(0xffffff).setStrokeStyle(2, 0xccbbaa);
      checkTxt.setText('');
    } else {
      this.selected.add(f.id);
      bg.setFillStyle(0xddffd4).setStrokeStyle(2, 0x22aa44);
      checkTxt.setText('✓');
    }
    this.selLabel.setText(`Selectate: ${this.selected.size} fisiere`);
  }

  _drawActionArea() {
    const btn = this.scene.add.text(640, 640, 'Ataseaza Fisierele Selectate', {
      fontFamily: 'Georgia, serif', fontSize: '18px', color: '#ffffff',
      backgroundColor: '#225599', padding: { x: 22, y: 12 }, fontStyle: 'bold'
    }).setOrigin(0.5).setInteractive({ cursor: 'pointer' });

    btn.on('pointerover', () => btn.setStyle({ backgroundColor: '#3366bb' }));
    btn.on('pointerout',  () => btn.setStyle({ backgroundColor: '#225599' }));
    btn.on('pointerdown', () => this._check());
  }

  _check() {
    const required = new Set(FILES.filter(f => f.required).map(f => f.id));
    const correct = [...required].every(id => this.selected.has(id));
    const noExtra = [...this.selected].every(id => required.has(id));

    if (correct && noExtra) {
      this.scene.add.text(640, 680, 'Corect! Ai atasat exact documentele necesare!', {
        fontFamily: 'Georgia, serif', fontSize: '18px', color: '#006600', fontStyle: 'bold',
        backgroundColor: '#f5e6c8', padding: { x: 14, y: 8 }
      }).setOrigin(0.5);
      this.scene.time.delayedCall(1800, () => this.scene.onQuestComplete());
    } else {
      let hint = '';
      if (!correct) hint = 'Lipsesc fisiere oficiale necesare!';
      else if (!noExtra) hint = 'Ai selectat fisiere care nu trebuie atasate!';
      this.scene.add.text(640, 680, hint, {
        fontFamily: 'Georgia, serif', fontSize: '16px', color: '#880000',
        backgroundColor: '#f5e6c8', padding: { x: 14, y: 8 }
      }).setOrigin(0.5).setDepth(80);
    }
  }
}
