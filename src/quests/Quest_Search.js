/**
 * Quest: Motoare de Cautare
 * Curriculum topic: "Aplicatii practice: cautarea informatiilor pe internet"
 * Mechanic: Use a mock search engine to find 3 verified facts about internet history
 */

const SEARCH_RESULTS = {
  default: [
    { title: 'Istoria Internetului - Wikipedia', url: 'wikipedia.org/wiki/Internet', correct: false,
      excerpt: 'Internetul este o retea globala de calculatoare...' },
    { title: 'Cum sa faci bani rapid online - 10 secrete!', url: 'spam-site.biz/bani-rapizi',
      correct: false, excerpt: 'Descopera secretele milionarilor din internet...' },
    { title: 'ARPANET - Prima retea de calculatoare (1969)', url: 'istoria-net.edu.ro/arpanet',
      correct: true, excerpt: 'In 1969, ARPANET a fost prima retea de calculatoare, precursorul internetului modern.' },
    { title: 'Tim Berners-Lee si World Wide Web (1989)', url: 'web-history.org/www',
      correct: true, excerpt: 'Tim Berners-Lee a inventat World Wide Web in 1989 la CERN, Elvetia.' },
    { title: 'Primul e-mail trimis de Ray Tomlinson (1971)', url: 'email-history.net/tomlinson',
      correct: true, excerpt: 'Ray Tomlinson a trimis primul e-mail in 1971, inventand simbolul @ pentru adrese.' },
    { title: 'Retete de prajituri delicioase', url: 'prajituri.ro/retete-2024',
      correct: false, excerpt: 'Cele mai bune retete de prajituri pentru toate ocaziile...' }
  ],
  istoria: [
    { title: 'ARPANET - Originile Internetului (1969)', url: 'istoria-net.edu.ro/arpanet',
      correct: true, excerpt: 'In 1969, ARPANET a conectat primele 4 universitati americane.' },
    { title: 'WWW - Inventat de Tim Berners-Lee (1989)', url: 'web-history.org/www',
      correct: true, excerpt: 'World Wide Web (1989) a transformat internetul intr-un spatiu accesibil tuturor.' },
    { title: 'Primul e-mail din lume - 1971', url: 'email-history.net/tomlinson',
      correct: true, excerpt: 'Ray Tomlinson a trimis primul e-mail in 1971 si a inventat adresele cu @.' },
    { title: 'Cum sa joaci jocuri gratis online', url: 'jocuri-gratis.xyz',
      correct: false, excerpt: 'Mii de jocuri gratis te asteapta...' }
  ],
  internet: [
    { title: 'Ce este Internetul? - Ghid pentru incepatori', url: 'edu-net.ro/ce-este-internetul',
      correct: false, excerpt: 'Internetul este o retea globala de miliarde de calculatoare...' },
    { title: 'ARPANET 1969 - Precursorul Internetului', url: 'istoria-net.edu.ro/arpanet',
      correct: true, excerpt: 'ARPANET (1969) este reteaua militara americana care a stat la baza internetului.' },
    { title: 'Tim Berners-Lee - Parintele Web-ului', url: 'web-history.org/www',
      correct: true, excerpt: 'Tim Berners-Lee a inventat WWW in 1989, facand internetul accesibil publicului.' },
    { title: 'Castiga premii pe internet - Inregistreaza-te acum!', url: 'premii-false.ro',
      correct: false, excerpt: 'Esti castigatorul zilei! Click pentru a revendica premiul...' },
    { title: 'Primul e-mail - Ray Tomlinson 1971', url: 'email-history.net/tomlinson',
      correct: true, excerpt: 'Primul e-mail a fost trimis in 1971. Tomlinson a ales @ pentru a separa user de server.' }
  ]
};

const REQUIRED_FACTS = 3;
const IS_TOUCH = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

export default class Quest_Search {
  constructor(scene) {
    this.scene = scene;
    this.searchText = 'istoria internetului';
    this.collected  = new Set();
    this.resultRows = [];
    this.keyHandler = null;
    this.htmlInput  = null;
  }

  start() {
    this._drawFrame();
    this._drawBrowser();
    this._showResults('default');
    if (IS_TOUCH) {
      this._setupMobileInput();
    } else {
      this._setupKeyboard();
    }
  }

  _drawFrame() {
    const cx = 640;
    this.scene.add.rectangle(cx, 370, 1060, 545, 0xf5f5f5).setStrokeStyle(4, 0x8b6914);
    this.scene.add.rectangle(cx, 115, 1060, 52, 0x4466aa);
    this.scene.add.text(cx, 115, 'Motor de Cautare - RegSearch', {
      fontFamily: 'Georgia, serif', fontSize: '22px', color: '#ffffff', fontStyle: 'bold'
    }).setOrigin(0.5);
    this.scene.add.text(cx, 147, 'Gaseste 3 fapte verificate despre istoria internetului. Evita sursele false!', {
      fontFamily: 'Georgia, serif', fontSize: '13px', color: '#ccddff', fontStyle: 'italic'
    }).setOrigin(0.5);
  }

  _drawBrowser() {
    const cx = 640;

    // Browser address bar area
    this.scene.add.rectangle(cx, 183, 1020, 36, 0xdddddd).setStrokeStyle(2, 0xaaaaaa);

    // Search box
    this.searchBox = this.scene.add.rectangle(cx - 60, 183, 820, 30, 0xffffff)
      .setStrokeStyle(2, 0x4466aa)
      .setInteractive({ cursor: IS_TOUCH ? 'pointer' : 'text' });

    this.searchDsp = this.scene.add.text(230, 183, this.searchText + '|', {
      fontFamily: 'monospace', fontSize: '14px', color: '#333333'
    }).setOrigin(0, 0.5);

    const searchBtn = this.scene.add.rectangle(930, 183, 90, 30, 0x4466aa)
      .setInteractive({ cursor: 'pointer' });
    this.scene.add.text(930, 183, 'Cauta', {
      fontFamily: 'Georgia, serif', fontSize: '14px', color: '#ffffff', fontStyle: 'bold'
    }).setOrigin(0.5);
    searchBtn.on('pointerdown', () => this._doSearch());

    // On touch: tapping the search box focuses the HTML input
    if (IS_TOUCH) {
      this.searchBox.on('pointerdown', () => this.htmlInput?.focus());
    }

    this.collectLbl = this.scene.add.text(cx, 213, `Fapte colectate: 0 / ${REQUIRED_FACTS}`, {
      fontFamily: 'Georgia, serif', fontSize: '14px', color: '#334455', fontStyle: 'bold'
    }).setOrigin(0.5);
  }

  // ── Desktop: Phaser keyboard capture ────────────────────────────────────────

  _setupKeyboard() {
    this.keyHandler = (ev) => {
      if (ev.key === 'Backspace') this.searchText = this.searchText.slice(0, -1);
      else if (ev.key === 'Enter') this._doSearch();
      else if (ev.key.length === 1) this.searchText += ev.key;
      this.searchDsp.setText((this.searchText || '') + '|');
    };
    this.scene.input.keyboard.on('keydown', this.keyHandler);
  }

  // ── Mobile: HTML <input> at top of viewport ──────────────────────────────────

  _setupMobileInput() {
    const inp = document.createElement('input');
    inp.type  = 'text';
    inp.value = this.searchText;
    inp.setAttribute('autocomplete', 'off');
    inp.setAttribute('autocorrect',  'off');
    inp.setAttribute('spellcheck',   'false');
    Object.assign(inp.style, {
      position:    'fixed',
      top:         '6px',
      left:        '50%',
      transform:   'translateX(-50%)',
      zIndex:      '9999',
      fontSize:    '16px',  // ≥16px prevents iOS auto-zoom
      padding:     '6px 16px',
      borderRadius:'20px',
      border:      '2px solid #4466aa',
      background:  'rgba(240,245,255,0.97)',
      color:       '#1a1a2e',
      width:       '300px',
      fontFamily:  'monospace',
      outline:     'none',
      boxShadow:   '0 2px 8px rgba(0,0,0,0.4)'
    });
    document.body.appendChild(inp);
    this.htmlInput = inp;

    inp.addEventListener('input', () => {
      this.searchText = inp.value;
      this.searchDsp.setText((this.searchText || '') + '|');
    });

    // Enter key on the mobile keyboard triggers search
    inp.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter') {
        inp.blur();
        this._doSearch();
      }
    });

    // Cleanup on scene shutdown
    this.scene.events.once('shutdown', () => this._removeMobileInput());

    // Show hint that search box is tappable
    this.searchDsp.setText('Apasa campul de sus pentru a cauta');
    inp.focus();
  }

  _removeMobileInput() {
    if (this.htmlInput) {
      this.htmlInput.remove();
      this.htmlInput = null;
    }
  }

  // ── Shared ───────────────────────────────────────────────────────────────────

  _doSearch() {
    const q = this.searchText.toLowerCase();
    let results = SEARCH_RESULTS.default;
    if (q.includes('istoria')) results = SEARCH_RESULTS.istoria;
    else if (q.includes('internet')) results = SEARCH_RESULTS.internet;
    this._showResults(results);
  }

  _showResults(key) {
    this.resultRows.forEach(r => r.forEach(o => o.destroy()));
    this.resultRows = [];

    const results = typeof key === 'string'
      ? (SEARCH_RESULTS[key] || SEARCH_RESULTS.default)
      : key;

    results.forEach((r, i) => {
      const y = 253 + i * 66;
      if (y > 610) return;

      const isAlreadyCollected = r.correct && this.collected.has(r.url);

      const bg = this.scene.add.rectangle(640, y, 1000, 58, isAlreadyCollected ? 0xddffd4 : 0xffffff, 0.95)
        .setStrokeStyle(1, isAlreadyCollected ? 0x44aa44 : 0xdddddd)
        .setInteractive({ cursor: 'pointer' });

      const titleTxt = this.scene.add.text(155, y - 12, r.title, {
        fontFamily: 'Georgia, serif', fontSize: '15px',
        color: isAlreadyCollected ? '#226622' : (r.correct ? '#1a0dab' : '#660011'),
        fontStyle: r.correct ? 'bold' : 'normal'
      }).setOrigin(0, 0.5);

      const urlTxt = this.scene.add.text(155, y + 8, r.url, {
        fontFamily: 'monospace', fontSize: '11px', color: '#006621'
      }).setOrigin(0, 0.5);

      const excTxt = this.scene.add.text(155, y + 22, r.excerpt, {
        fontFamily: 'Georgia, serif', fontSize: '12px', color: '#555555'
      }).setOrigin(0, 0.5);

      const checkTxt = this.scene.add.text(1100, y, isAlreadyCollected ? '✓' : '', {
        fontFamily: 'monospace', fontSize: '20px', color: '#22aa44'
      }).setOrigin(0.5);

      bg.on('pointerdown', () => this._click(r, bg, checkTxt));

      this.resultRows.push([bg, titleTxt, urlTxt, excTxt, checkTxt]);
    });
  }

  _click(result, bg, checkTxt) {
    if (result.correct && !this.collected.has(result.url)) {
      this.collected.add(result.url);
      bg.setFillStyle(0xddffd4).setStrokeStyle(1, 0x44aa44);
      checkTxt.setText('✓');
      this.collectLbl.setText(`Fapte colectate: ${this.collected.size} / ${REQUIRED_FACTS}`);

      if (this.collected.size >= REQUIRED_FACTS) {
        if (this.keyHandler) this.scene.input.keyboard.off('keydown', this.keyHandler);
        this._removeMobileInput();
        this.scene.time.delayedCall(600, () => this._complete());
      }
    } else if (!result.correct) {
      const fb = this.scene.add.text(640, 640, 'Sursa nesigura sau irelevanta! Alege surse credibile (.edu, .org, .wikipedia)', {
        fontFamily: 'Georgia, serif', fontSize: '14px', color: '#880000',
        backgroundColor: '#ffeeee', padding: { x: 12, y: 6 }, wordWrap: { width: 900 }
      }).setOrigin(0.5).setDepth(80);
      this.scene.time.delayedCall(1500, () => fb.destroy());
    }
  }

  _complete() {
    this.resultRows.forEach(r => r.forEach(o => o.destroy()));
    this.scene.add.text(640, 370, 'Excelent! Ai gasit toate faptele verificate!\nReferatul tau este documentat corect.', {
      fontFamily: 'Georgia, serif', fontSize: '20px', color: '#004400', fontStyle: 'bold',
      backgroundColor: '#ddffd4', padding: { x: 20, y: 14 }, align: 'center',
      wordWrap: { width: 800 }
    }).setOrigin(0.5);
    this.scene.time.delayedCall(2200, () => this.scene.onQuestComplete());
  }
}
