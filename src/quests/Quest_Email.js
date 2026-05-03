/**
 * Quest: Misiunea Regelui
 * Curriculum topic: "Citirea / intocmirea / trimiterea unui mesaj. Programe de posta (Outlook, Eudora, Pegasus)"
 * Mechanic: 3-question multiple choice quiz about email basics
 */

const QUESTIONS = [
  {
    text: 'Care dintre urmatoarele programe este folosit pentru trimiterea si primirea e-mail-urilor?',
    options: ['Microsoft Outlook', 'Adobe Photoshop', 'Microsoft Excel'],
    correct: 0
  },
  {
    text: 'Ce inseamna campul "CC" atunci cand trimiti un e-mail?',
    options: ['Carbon Copy - trimiti o copie altei persoane', 'Cod Cifrat - mesajul este criptat', 'Confirmare Completa - mesajul a fost livrat'],
    correct: 0
  },
  {
    text: 'Care parte dintr-o adresa de e-mail identifica serverul de mail al destinatarului?',
    options: ['Partea de dupa semnul @', 'Partea de inainte de semnul @', 'Extensia (.ro, .com)'],
    correct: 0
  }
];

export default class Quest_Email {
  constructor(scene) {
    this.scene = scene;
    this.currentQ = 0;
    this.score = 0;
    this.objs = [];
  }

  start() {
    this._drawFrame();
    this._showQuestion();
  }

  _drawFrame() {
    const cx = 640, cy = 360;
    this._add(this.scene.add.rectangle(cx, cy, 860, 500, 0xf5e6c8).setStrokeStyle(4, 0x8b6914));
    this._add(this.scene.add.rectangle(cx, 150, 860, 56, 0x8b6914));
    this._add(this.scene.add.text(cx, 150, 'Test de Cunostinte - E-mail', {
      fontFamily: 'Georgia, serif', fontSize: '22px', color: '#ffffff', fontStyle: 'bold'
    }).setOrigin(0.5));
    this._add(this.scene.add.text(cx, 185, 'Subiect: Citirea si trimiterea unui mesaj electronic', {
      fontFamily: 'Georgia, serif', fontSize: '13px', color: '#665533', fontStyle: 'italic'
    }).setOrigin(0.5));
  }

  _showQuestion() {
    // Clear previous question objects (keep frame)
    this.qObjs && this.qObjs.forEach(o => o.destroy());
    this.qObjs = [];

    if (this.currentQ >= QUESTIONS.length) {
      this._showResult();
      return;
    }

    const q = QUESTIONS[this.currentQ];
    const cx = 640;

    const prog = this.scene.add.text(cx, 215, `Intrebarea ${this.currentQ + 1} din ${QUESTIONS.length}`, {
      fontFamily: 'Georgia, serif', fontSize: '14px', color: '#885522'
    }).setOrigin(0.5);
    this.qObjs.push(prog);

    const qText = this.scene.add.text(cx, 280, q.text, {
      fontFamily: 'Georgia, serif', fontSize: '17px', color: '#221100',
      wordWrap: { width: 760 }, align: 'center'
    }).setOrigin(0.5);
    this.qObjs.push(qText);

    const labels = ['A', 'B', 'C'];
    q.options.forEach((opt, i) => {
      const by = 390 + i * 58;
      const bg = this.scene.add.rectangle(cx, by, 760, 48, 0xffffff, 0.9)
        .setStrokeStyle(2, 0xaaaaaa).setInteractive({ cursor: 'pointer' });
      const txt = this.scene.add.text(cx, by, `${labels[i]})  ${opt}`, {
        fontFamily: 'Georgia, serif', fontSize: '15px', color: '#222222'
      }).setOrigin(0.5);

      bg.on('pointerover', () => bg.setFillStyle(0xddeeff));
      bg.on('pointerout',  () => bg.setFillStyle(0xffffff));
      bg.on('pointerdown', () => this._answer(i));

      this.qObjs.push(bg, txt);
    });
  }

  _answer(index) {
    const q = QUESTIONS[this.currentQ];
    const isCorrect = index === q.correct;
    if (isCorrect) this.score++;

    // Flash feedback
    const color = isCorrect ? '#00aa00' : '#cc0000';
    const msg = isCorrect ? 'Corect!' : `Gresit. Raspuns corect: ${String.fromCharCode(65 + q.correct)})`;
    const fb = this.scene.add.text(640, 590, msg, {
      fontFamily: 'Georgia, serif', fontSize: '18px', color, fontStyle: 'bold'
    }).setOrigin(0.5);
    this.qObjs.push(fb);

    this.scene.time.delayedCall(900, () => {
      this.currentQ++;
      this._showQuestion();
    });
  }

  _showResult() {
    this.qObjs && this.qObjs.forEach(o => o.destroy());
    this.qObjs = [];

    const cx = 640, cy = 400;
    const passed = this.score >= 2;

    this.scene.add.text(cx, 270, passed ? 'Felicitari! Ai trecut testul!' : 'Mai ai nevoie de studiu...', {
      fontFamily: 'Georgia, serif', fontSize: '22px',
      color: passed ? '#006600' : '#880000', fontStyle: 'bold'
    }).setOrigin(0.5);

    this.scene.add.text(cx, 330, `Scor: ${this.score} / ${QUESTIONS.length} raspunsuri corecte`, {
      fontFamily: 'Georgia, serif', fontSize: '18px', color: '#334455'
    }).setOrigin(0.5);

    if (passed) {
      this.scene.add.text(cx, 390, 'Ai demonstrat ca stii elementele de baza ale postei electronice.', {
        fontFamily: 'Georgia, serif', fontSize: '15px', color: '#334455',
        wordWrap: { width: 700 }, align: 'center'
      }).setOrigin(0.5);

      this._makeBtn(cx, 480, 'Primeste Scrisoarea Regala!', () => this.scene.onQuestComplete());
    } else {
      this._makeBtn(cx, 480, 'Incearca din nou', () => {
        this.currentQ = 0; this.score = 0; this._showQuestion();
      });
    }
  }

  _makeBtn(x, y, label, cb) {
    const btn = this.scene.add.text(x, y, label, {
      fontFamily: 'Georgia, serif', fontSize: '18px', color: '#ffffff',
      backgroundColor: '#225599', padding: { x: 22, y: 12 }, fontStyle: 'bold'
    }).setOrigin(0.5).setInteractive({ cursor: 'pointer' });
    btn.on('pointerover', () => btn.setStyle({ backgroundColor: '#3366bb' }));
    btn.on('pointerout',  () => btn.setStyle({ backgroundColor: '#225599' }));
    btn.on('pointerdown', cb);
    return btn;
  }

  _add(obj) { this.objs.push(obj); return obj; }
}
