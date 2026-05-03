/**
 * Quest: Criptare si Semnatura
 * Curriculum topic: "Criptarea transmisiei + Semnatura digitala"
 * Mechanic: (1) Decode a Caesar-cipher message by choosing the correct answer
 *           (2) Apply the digital stamp by clicking the button
 */

const CIPHER_MSG = 'PHVDM UHJDO SHQWUX UHJDWXO URV';
const PLAIN_MSG  = 'MESAJ REGAL PENTRU REGATUL ROS';
const SHIFT      = 3;

const OPTIONS = [
  { text: 'MESAJ REGAL PENTRU REGATUL ROS', correct: true  },
  { text: 'MISAJ RIGAL PENTRU RUGATUL RAS', correct: false },
  { text: 'MOSAJ ROGAL PINTRU ROGETUL RES', correct: false }
];

export default class Quest_Crypto {
  constructor(scene) {
    this.scene = scene;
    this.step = 1;
  }

  start() {
    this._drawFrame();
    this._showStep1();
  }

  _drawFrame() {
    const cx = 640;
    this.scene.add.rectangle(cx, 370, 900, 530, 0xf5e6c8).setStrokeStyle(4, 0x8b6914);
    this.scene.add.rectangle(cx, 130, 900, 56, 0x8b6914);
    this.scene.add.text(cx, 130, 'Criptare si Semnatura Digitala', {
      fontFamily: 'Georgia, serif', fontSize: '22px', color: '#ffffff', fontStyle: 'bold'
    }).setOrigin(0.5);

    this.stepTxt = this.scene.add.text(cx, 163, 'Pasul 1 din 2: Decodifica mesajul', {
      fontFamily: 'Georgia, serif', fontSize: '13px', color: '#eecc88', fontStyle: 'italic'
    }).setOrigin(0.5);
  }

  _showStep1() {
    const cx = 640;
    this.scene.add.text(cx, 205, 'Mesaj criptat (Cifrul Cezar, deplasare +3):', {
      fontFamily: 'Georgia, serif', fontSize: '15px', color: '#442200'
    }).setOrigin(0.5);

    // Visual cipher explanation
    this.scene.add.rectangle(cx, 260, 780, 70, 0x332200, 0.8);
    this.scene.add.text(cx, 248, CIPHER_MSG, {
      fontFamily: 'monospace', fontSize: '22px', color: '#ffee88', fontStyle: 'bold'
    }).setOrigin(0.5);
    this.scene.add.text(cx, 276, 'Fiecare litera este deplasata cu 3 pozitii spre dreapta in alfabet', {
      fontFamily: 'Georgia, serif', fontSize: '12px', color: '#aaaaaa', fontStyle: 'italic'
    }).setOrigin(0.5);

    this.scene.add.text(cx, 318, 'Alege mesajul decodat corect:', {
      fontFamily: 'Georgia, serif', fontSize: '16px', color: '#334455', fontStyle: 'bold'
    }).setOrigin(0.5);

    OPTIONS.forEach((opt, i) => {
      const y = 360 + i * 62;
      const bg = this.scene.add.rectangle(cx, y, 780, 48, 0xffffff, 0.9)
        .setStrokeStyle(2, 0xaaaaaa).setInteractive({ cursor: 'pointer' });
      const txt = this.scene.add.text(cx, y, `${String.fromCharCode(65 + i)})  ${opt.text}`, {
        fontFamily: 'monospace', fontSize: '15px', color: '#222222'
      }).setOrigin(0.5);

      bg.on('pointerover', () => bg.setFillStyle(0xddeeff));
      bg.on('pointerout',  () => bg.setFillStyle(0xffffff));
      bg.on('pointerdown', () => this._checkDecode(opt));
    });
  }

  _checkDecode(opt) {
    if (opt.correct) {
      this.scene.add.text(640, 572, 'Corect! Ai decodat mesajul!', {
        fontFamily: 'Georgia, serif', fontSize: '18px', color: '#006600', fontStyle: 'bold'
      }).setOrigin(0.5);
      this.scene.time.delayedCall(1200, () => this._showStep2());
    } else {
      const fb = this.scene.add.text(640, 572, 'Gresit. Incearca din nou!', {
        fontFamily: 'Georgia, serif', fontSize: '16px', color: '#880000'
      }).setOrigin(0.5);
      this.scene.time.delayedCall(1000, () => fb.destroy());
    }
  }

  _showStep2() {
    this.scene.scene.restart({ questId: 'quest_crypto', _step: 2, plain: PLAIN_MSG });
  }

  // Step 2 is handled directly when scene is restarted with _step=2
  showStep2(plain) {
    this._drawFrame();
    this.stepTxt && this.stepTxt.setText('Pasul 2 din 2: Aplica Semnatura Digitala');
    const cx = 640;

    this.scene.add.text(cx, 220, 'Mesaj decodat:', {
      fontFamily: 'Georgia, serif', fontSize: '15px', color: '#442200'
    }).setOrigin(0.5);

    this.scene.add.rectangle(cx, 280, 780, 70, 0xeeffee, 0.95).setStrokeStyle(2, 0x448844);
    this.scene.add.text(cx, 268, plain, {
      fontFamily: 'monospace', fontSize: '20px', color: '#004400', fontStyle: 'bold'
    }).setOrigin(0.5);
    this.scene.add.text(cx, 292, 'Mesaj decodat cu succes!', {
      fontFamily: 'Georgia, serif', fontSize: '13px', color: '#447744', fontStyle: 'italic'
    }).setOrigin(0.5);

    this.scene.add.text(cx, 350, 'Semnatura digitala confirma identitatea expeditorului.', {
      fontFamily: 'Georgia, serif', fontSize: '15px', color: '#334455', wordWrap: { width: 700 }, align: 'center'
    }).setOrigin(0.5);
    this.scene.add.text(cx, 395, 'Este ca un sigiliu de ceara, dar in format electronic.', {
      fontFamily: 'Georgia, serif', fontSize: '15px', color: '#334455', wordWrap: { width: 700 }, align: 'center'
    }).setOrigin(0.5);

    // Stamp area
    this.scene.add.rectangle(cx, 480, 300, 100, 0xcc2222, 0.15).setStrokeStyle(3, 0xcc2222, 0.6);
    this.stampTxt = this.scene.add.text(cx, 480, 'CLICK PENTRU\nA APLICA STAMPILA', {
      fontFamily: 'Georgia, serif', fontSize: '16px', color: '#cc2222',
      align: 'center', fontStyle: 'bold'
    }).setOrigin(0.5);

    const stampArea = this.scene.add.rectangle(cx, 480, 300, 100, 0x000000, 0)
      .setInteractive({ cursor: 'pointer' });
    stampArea.on('pointerdown', () => this._applyStamp());
  }

  _applyStamp() {
    this.stampTxt.destroy();
    this.scene.add.text(640, 480, '🔴 SEMNAT DIGITAL\nREGATUL ALBASTRU', {
      fontFamily: 'Georgia, serif', fontSize: '18px', color: '#cc0000',
      align: 'center', fontStyle: 'bold'
    }).setOrigin(0.5);
    this.scene.add.text(640, 570, 'Semnatura aplicata! Mesajul este autentificat.', {
      fontFamily: 'Georgia, serif', fontSize: '16px', color: '#006600', fontStyle: 'bold'
    }).setOrigin(0.5);
    this.scene.time.delayedCall(1800, () => this.scene.onQuestComplete());
  }
}
