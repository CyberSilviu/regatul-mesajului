/**
 * Quest: Eticheta Digitala
 * Curriculum topic: "Adresarea politicoasa + Legislatie Internet"
 * Mechanic: 5 scenario quiz — pick the correct (polite / legal) response
 */

const SCENARIOS = [
  {
    situation: 'Primesti un email in care toate cuvintele sunt scrise CU MAJUSCULE. Ce faci?',
    options: [
      'Raspunzi la fel, tot cu majuscule',
      'Ii scrii politicos ca in neticheta, majusculele semnifica TIPAT',
      'Il stergi fara sa raspunzi'
    ],
    correct: 1,
    explanation: 'In neticheta, textul cu MAJUSCULE = tipat. Este nepoliticos si trebuie evitat.'
  },
  {
    situation: 'Vrei sa trimiti un email cu un fisier video de 800MB. Ce faci?',
    options: [
      'Il atasezi direct - calculatorul va face totul automat',
      'Incarci fisierul pe un serviciu cloud si trimiti linkul',
      'Comprimezi fisierul si il trimiti oricum'
    ],
    correct: 1,
    explanation: 'Fisierele mari se trimit prin link cloud (Google Drive, WeTransfer). Attachmentele mari blocheaza serverele.'
  },
  {
    situation: 'Primesti un email suspect cu un link de la o adresa necunoscuta. Ce faci?',
    options: [
      'Apesi pe link din curiozitate sa vezi ce este',
      'Il raportezi ca spam si il stergi fara a da click pe nimic',
      'Trimiti adresa ta de email prietenilor sa vada si ei'
    ],
    correct: 1,
    explanation: 'Link-urile suspecte pot fi phishing sau malware. Raporteaza si sterge - niciodata nu da click!'
  },
  {
    situation: 'Este legal sa distribui pe internet o fotografie cu o persoana, fara acordul ei?',
    options: [
      'Da, daca fotografia a fost postata public pe internet',
      'Nu, incalca dreptul la imagine al persoanei respective',
      'Da, daca nu ceri bani pentru fotografie'
    ],
    correct: 1,
    explanation: 'GDPR si legislatia romana protejeaza dreptul la imagine. Ai nevoie de acordul persoanei.'
  },
  {
    situation: 'Ce reprezinta "neticheta" (netiquette) in comunicarea online?',
    options: [
      'Un program antivirus pentru retele',
      'Regulile de comportament politicos si respectuos pe internet',
      'Un tip special de retea de internet'
    ],
    correct: 1,
    explanation: 'Neticheta = "net" + "eticheta". Este codul nescris de bune maniere in comunicarea online.'
  }
];

export default class Quest_Etiquette {
  constructor(scene) {
    this.scene = scene;
    this.currentQ = 0;
    this.score = 0;
    this.qObjs = [];
  }

  start() {
    this._drawFrame();
    this._showQuestion();
  }

  _drawFrame() {
    const cx = 640;
    this.scene.add.rectangle(cx, 370, 920, 540, 0xf5e6c8).setStrokeStyle(4, 0x8b6914);
    this.scene.add.rectangle(cx, 120, 920, 52, 0x334466);
    this.scene.add.text(cx, 120, 'Eticheta si Legislatie pe Internet', {
      fontFamily: 'Georgia, serif', fontSize: '21px', color: '#ffffff', fontStyle: 'bold'
    }).setOrigin(0.5);
    this.progBar = this.scene.add.text(cx, 152, 'Situatia 1 din 5', {
      fontFamily: 'Georgia, serif', fontSize: '13px', color: '#445566', fontStyle: 'italic'
    }).setOrigin(0.5);
  }

  _showQuestion() {
    this.qObjs.forEach(o => o.destroy());
    this.qObjs = [];

    if (this.currentQ >= SCENARIOS.length) { this._showResult(); return; }

    const s = SCENARIOS[this.currentQ];
    const cx = 640;
    this.progBar.setText(`Situatia ${this.currentQ + 1} din ${SCENARIOS.length}`);

    const sitBg = this.scene.add.rectangle(cx, 255, 870, 100, 0xeef4ff, 0.9)
      .setStrokeStyle(2, 0x6688aa);
    const sitTxt = this.scene.add.text(cx, 255, s.situation, {
      fontFamily: 'Georgia, serif', fontSize: '16px', color: '#221144',
      wordWrap: { width: 820 }, align: 'center'
    }).setOrigin(0.5);
    this.qObjs.push(sitBg, sitTxt);

    this.scene.add.text(cx, 322, 'Ce faci?', {
      fontFamily: 'Georgia, serif', fontSize: '15px', color: '#334455', fontStyle: 'italic'
    }).setOrigin(0.5);

    s.options.forEach((opt, i) => {
      const y = 380 + i * 64;
      const bg = this.scene.add.rectangle(cx, y, 850, 52, 0xffffff, 0.9)
        .setStrokeStyle(2, 0xbbaaaa).setInteractive({ cursor: 'pointer' });
      const txt = this.scene.add.text(cx, y, `${String.fromCharCode(65 + i)})  ${opt}`, {
        fontFamily: 'Georgia, serif', fontSize: '14px', color: '#222222',
        wordWrap: { width: 800 }
      }).setOrigin(0.5);
      bg.on('pointerover', () => bg.setFillStyle(0xeef8ff));
      bg.on('pointerout',  () => bg.setFillStyle(0xffffff));
      bg.on('pointerdown', () => this._answer(i, s));
      this.qObjs.push(bg, txt);
    });
  }

  _answer(index, s) {
    const isCorrect = index === s.correct;
    if (isCorrect) this.score++;

    const color = isCorrect ? '#006600' : '#880000';
    const prefix = isCorrect ? 'Corect! ' : 'Gresit! ';
    const fb = this.scene.add.text(640, 580, `${prefix}${s.explanation}`, {
      fontFamily: 'Georgia, serif', fontSize: '14px', color,
      backgroundColor: isCorrect ? '#eeffee' : '#ffeeee',
      padding: { x: 12, y: 8 }, wordWrap: { width: 800 }, align: 'center'
    }).setOrigin(0.5).setDepth(60);
    this.qObjs.push(fb);

    this.scene.time.delayedCall(2000, () => {
      this.currentQ++;
      this._showQuestion();
    });
  }

  _showResult() {
    const cx = 640;
    const passed = this.score >= 4;
    this.scene.add.text(cx, 300, passed ? 'Felicitari! Stii regulile!' : 'Mai studiaza neticheta...', {
      fontFamily: 'Georgia, serif', fontSize: '24px',
      color: passed ? '#006600' : '#880000', fontStyle: 'bold'
    }).setOrigin(0.5);
    this.scene.add.text(cx, 360, `Scor: ${this.score} / ${SCENARIOS.length} situatii corecte`, {
      fontFamily: 'Georgia, serif', fontSize: '18px', color: '#334455'
    }).setOrigin(0.5);

    if (passed) {
      this._btn(cx, 450, 'Primeste Manualul de Eticheta!', () => this.scene.onQuestComplete());
    } else {
      this._btn(cx, 450, 'Incearca din nou', () => { this.currentQ = 0; this.score = 0; this._showQuestion(); });
    }
  }

  _btn(x, y, label, cb) {
    const b = this.scene.add.text(x, y, label, {
      fontFamily: 'Georgia, serif', fontSize: '18px', color: '#ffffff',
      backgroundColor: '#334466', padding: { x: 22, y: 12 }, fontStyle: 'bold'
    }).setOrigin(0.5).setInteractive({ cursor: 'pointer' });
    b.on('pointerover', () => b.setStyle({ backgroundColor: '#4455aa' }));
    b.on('pointerout',  () => b.setStyle({ backgroundColor: '#334466' }));
    b.on('pointerdown', cb);
    return b;
  }
}
