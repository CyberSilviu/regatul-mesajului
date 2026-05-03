/**
 * Quest: Conversatie Online
 * Curriculum topic: "Servicii de conversatie: IRC, smileys, acronime, Telefonie IP"
 * Mechanic: (1) Match 6 emoticons to meanings  (2) Complete chat lines with acronyms
 */

const EMOTICONS = [
  { symbol: ':)',  meaning: 'Fericire / Zambet'   },
  { symbol: ':(',  meaning: 'Tristete'             },
  { symbol: ':D',  meaning: 'Ras puternic'         },
  { symbol: ';)',  meaning: 'Clipeala / Gluma'     },
  { symbol: ':o',  meaning: 'Surpriza / Uimire'    },
  { symbol: ':/',  meaning: 'Scepticism / Dubiu'   }
];

const CHAT_LINES = [
  { before: 'A: Hei! Esti acasa?', blank: '...', after: '(revin imediat)',   answer: 'BRB',  choices: ['BRB', 'LOL', 'AFK'] },
  { before: 'B: L-ai vazut pe Marius?', blank: '...', after: '(rad tare)', answer: 'LOL',  choices: ['OMG', 'LOL', 'BRB'] },
  { before: 'A: A luat 10 la examen!', blank: '...', after: '(serios?!)',   answer: 'OMG',  choices: ['LOL', 'OMG', 'THX'] },
  { before: 'B: Multumesc de veste!', blank: '...', after: '(multumesc)',   answer: 'THX',  choices: ['AFK', 'THX', 'BRB'] }
];

export default class Quest_Chat {
  constructor(scene) {
    this.scene = scene;
    this.step = 1;
    this.matched = {}; // emoticon index -> meaning index
    this.selected = null; // currently selected emoticon index
    this.chatScore = 0;
    this.chatQ = 0;
  }

  start() {
    this._drawFrame();
    this._showStep1();
  }

  _drawFrame() {
    const cx = 640;
    this.scene.add.rectangle(cx, 370, 1160, 560, 0xf5e6c8).setStrokeStyle(4, 0x8b6914);
    this.scene.add.rectangle(cx, 115, 1160, 52, 0x334455);
    this.scene.add.text(cx, 115, 'Chat Online, IRC si Acronime', {
      fontFamily: 'Georgia, serif', fontSize: '22px', color: '#ffffff', fontStyle: 'bold'
    }).setOrigin(0.5);
    this.stepLbl = this.scene.add.text(cx, 147, 'Pasul 1 din 2: Potriveste emoticon-urile', {
      fontFamily: 'Georgia, serif', fontSize: '13px', color: '#eecc88', fontStyle: 'italic'
    }).setOrigin(0.5);
  }

  _showStep1() {
    const cx = 640;
    this.scene.add.text(cx, 180, 'Click pe un emoticon, apoi click pe semnificatia corecta', {
      fontFamily: 'Georgia, serif', fontSize: '14px', color: '#442200'
    }).setOrigin(0.5);

    // Emoticons column (left)
    this.emotBtns = EMOTICONS.map((e, i) => {
      const y = 235 + i * 62;
      const bg = this.scene.add.rectangle(240, y, 120, 50, 0x334455, 0.8)
        .setStrokeStyle(3, 0x6688aa).setInteractive({ cursor: 'pointer' });
      const txt = this.scene.add.text(240, y, e.symbol, {
        fontFamily: 'monospace', fontSize: '22px', color: '#ffffff'
      }).setOrigin(0.5);
      bg.on('pointerdown', () => this._selectEmot(i, bg));
      return { bg, txt, matched: false };
    });

    // Meanings column (right) - shuffled
    const shuffled = [...EMOTICONS.map((e, i) => ({ meaning: e.meaning, origIdx: i }))]
      .sort(() => Math.random() - 0.5);

    this.meaningBtns = shuffled.map((m, i) => {
      const y = 235 + i * 62;
      const bg = this.scene.add.rectangle(730, y, 300, 50, 0xffffff, 0.9)
        .setStrokeStyle(2, 0xaaaaaa).setInteractive({ cursor: 'pointer' });
      const txt = this.scene.add.text(730, y, m.meaning, {
        fontFamily: 'Georgia, serif', fontSize: '14px', color: '#222222'
      }).setOrigin(0.5);
      bg.on('pointerdown', () => this._tryMatch(m.origIdx, bg, txt));
      return { bg, txt, origIdx: m.origIdx, matched: false };
    });

    this.matchCount = this.scene.add.text(cx, 618, 'Potriviri: 0 / 6', {
      fontFamily: 'Georgia, serif', fontSize: '15px', color: '#334455'
    }).setOrigin(0.5);
  }

  _selectEmot(idx, bg) {
    if (this.emotBtns[idx].matched) return;
    // Deselect previous
    if (this.selected !== null) {
      this.emotBtns[this.selected].bg.setStrokeStyle(3, 0x6688aa);
    }
    this.selected = idx;
    bg.setStrokeStyle(3, 0xffff00);
  }

  _tryMatch(origIdx, bg, txt) {
    if (this.selected === null) return;
    const emotIdx = this.selected;

    if (emotIdx === origIdx) {
      // Correct match
      this.emotBtns[emotIdx].bg.setFillStyle(0x226622).setStrokeStyle(3, 0x44ff44);
      this.emotBtns[emotIdx].matched = true;
      bg.setFillStyle(0xddffd4).setStrokeStyle(2, 0x44aa44);
      txt.setStyle({ color: '#226622' });
      this.matched[emotIdx] = origIdx;
      this.selected = null;

      const count = Object.keys(this.matched).length;
      this.matchCount.setText(`Potriviri: ${count} / 6`);
      if (count === 6) {
        this.scene.time.delayedCall(800, () => this._showStep2());
      }
    } else {
      // Wrong
      const fb = this.scene.add.text(640, 648, 'Gresit! Incearca alta combinatie.', {
        fontFamily: 'Georgia, serif', fontSize: '15px', color: '#880000'
      }).setOrigin(0.5);
      this.scene.time.delayedCall(900, () => fb.destroy());
    }
  }

  _showStep2() {
    // Clear step 1 objects (Phaser scene restart is cleanest for this)
    this.scene.scene.restart({ questId: 'quest_chat', _step: 2 });
  }

  showStep2() {
    this._drawFrame();
    this.stepLbl.setText('Pasul 2 din 2: Completeaza conversatia');
    const cx = 640;
    this.scene.add.text(cx, 180, 'Alege acronimul corect pentru fiecare blank din conversatie', {
      fontFamily: 'Georgia, serif', fontSize: '14px', color: '#442200'
    }).setOrigin(0.5);

    this._showChatLine();
  }

  _showChatLine() {
    this._clearChatObjs();
    if (this.chatQ >= CHAT_LINES.length) {
      this._chatDone();
      return;
    }
    const line = CHAT_LINES[this.chatQ];
    const cx = 640;

    // Chat bubble
    this.chatObjs = [];
    const bg = this.scene.add.rectangle(cx, 290, 900, 80, 0xf0f8ff, 0.9).setStrokeStyle(2, 0x8899bb);
    const topTxt = this.scene.add.text(cx, 265, line.before, {
      fontFamily: 'monospace', fontSize: '16px', color: '#223344'
    }).setOrigin(0.5);
    const botTxt = this.scene.add.text(cx, 300, `→ "${line.blank}" semnifica: ${line.after}`, {
      fontFamily: 'Georgia, serif', fontSize: '14px', color: '#445566', fontStyle: 'italic'
    }).setOrigin(0.5);
    this.chatObjs.push(bg, topTxt, botTxt);

    this.scene.add.text(cx, 355, 'Ce acronim se potriveste?', {
      fontFamily: 'Georgia, serif', fontSize: '15px', color: '#334455', fontStyle: 'bold'
    }).setOrigin(0.5);

    line.choices.forEach((ch, i) => {
      const x = 430 + i * 210;
      const btn = this.scene.add.rectangle(x, 420, 180, 52, 0x334455, 0.8)
        .setStrokeStyle(2, 0x6688aa).setInteractive({ cursor: 'pointer' });
      const btnTxt = this.scene.add.text(x, 420, ch, {
        fontFamily: 'monospace', fontSize: '20px', color: '#ffffff', fontStyle: 'bold'
      }).setOrigin(0.5);
      btn.on('pointerdown', () => this._checkChat(ch === line.answer, ch, line.answer));
      this.chatObjs.push(btn, btnTxt);
    });
  }

  _checkChat(correct, chosen, rightAnswer) {
    const fb = this.scene.add.text(640, 490, correct
      ? `Corect! "${rightAnswer}" = ${CHAT_LINES[this.chatQ].after}`
      : `Gresit. Raspuns corect: ${rightAnswer}`, {
      fontFamily: 'Georgia, serif', fontSize: '15px',
      color: correct ? '#006600' : '#880000',
      backgroundColor: correct ? '#eeffee' : '#ffeeee',
      padding: { x: 12, y: 8 }
    }).setOrigin(0.5);
    this.chatObjs.push(fb);
    if (correct) this.chatScore++;
    this.scene.time.delayedCall(1200, () => { this.chatQ++; this._showChatLine(); });
  }

  _chatDone() {
    this._clearChatObjs();
    const cx = 640;
    const passed = this.chatScore >= 3;
    this.scene.add.text(cx, 310, passed ? 'Excelent! Stii acronimele de chat!' : 'Mai studiaza acronimele...', {
      fontFamily: 'Georgia, serif', fontSize: '22px',
      color: passed ? '#006600' : '#880000', fontStyle: 'bold'
    }).setOrigin(0.5);
    this.scene.add.text(cx, 365, `Raspunsuri corecte: ${this.chatScore} / ${CHAT_LINES.length}`, {
      fontFamily: 'Georgia, serif', fontSize: '17px', color: '#334455'
    }).setOrigin(0.5);

    if (passed) {
      this.scene.time.delayedCall(1500, () => this.scene.onQuestComplete());
    } else {
      this.scene.time.delayedCall(2000, () => {
        this.scene.scene.restart({ questId: 'quest_chat', _step: 2 });
      });
    }
  }

  _clearChatObjs() {
    if (this.chatObjs) this.chatObjs.forEach(o => o.destroy());
    this.chatObjs = [];
  }
}
