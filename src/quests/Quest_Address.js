/**
 * Quest: Agenda Scribului
 * Curriculum topic: "Folosirea agendei de adrese + Cautarea adreselor de e-mail"
 * Mechanic: Filter a contact list and click the correct email address
 */

const CONTACTS = [
  { name: 'Regele Rosu',        address: 'rege.rosu@castelulrosu.ro',       correct: true  },
  { name: 'Regele Rosu',        address: 'regele-rosie@castelul.ro',         correct: false },
  { name: 'Regele Rosu',        address: 'reg.rosu@regalitate.ro',           correct: false },
  { name: 'Regele Albastru',    address: 'rege.albastru@castelulalbastru.ro',correct: false },
  { name: 'Principesa Violet',  address: 'principesa@castelulviolet.ro',     correct: false },
  { name: 'Generalul Negru',    address: 'general@castelulnegru.ro',         correct: false },
  { name: 'Mesagerul Regal',    address: 'mesager@postaregala.ro',           correct: false },
  { name: 'Comerciantul',       address: 'comert@piataregala.ro',            correct: false }
];

import { IS_TOUCH } from '../config.js';

export default class Quest_Address {
  constructor(scene) {
    this.scene = scene;
    this.searchText = '';
    this.rows = [];
    this.keyHandler = null;
    this.htmlInput  = null;
  }

  start() {
    this._drawFrame();
    this._drawSearchBox();
    this._renderList(CONTACTS);
    if (IS_TOUCH) {
      this._setupMobileInput();
    } else {
      this._setupKeyboard();
    }
  }

  _drawFrame() {
    const cx = 640;
    this.scene.add.rectangle(cx, 360, 860, 520, 0xf5e6c8).setStrokeStyle(4, 0x8b6914);
    this.scene.add.rectangle(cx, 130, 860, 56, 0x8b6914);
    this.scene.add.text(cx, 130, 'Agenda de Adrese a Scribului', {
      fontFamily: 'Georgia, serif', fontSize: '22px', color: '#ffffff', fontStyle: 'bold'
    }).setOrigin(0.5);
    this.scene.add.text(cx, 163, 'Gaseste adresa de e-mail corecta a Regelui din Regatul Rosu', {
      fontFamily: 'Georgia, serif', fontSize: '13px', color: '#665533', fontStyle: 'italic'
    }).setOrigin(0.5);
    this.scene.add.text(270, 196, 'Cauta dupa nume:', {
      fontFamily: 'Georgia, serif', fontSize: '15px', color: '#442200'
    }).setOrigin(0, 0.5);
  }

  _drawSearchBox() {
    this.searchBg = this.scene.add.rectangle(640, 196, 460, 34, 0xffffff)
      .setStrokeStyle(2, 0x8b6914);
    this.searchDisplay = this.scene.add.text(420, 196, '|', {
      fontFamily: 'monospace', fontSize: '15px', color: '#000000'
    }).setOrigin(0, 0.5);

    this.scene.add.text(270, 232, 'Click pe adresa corecta:', {
      fontFamily: 'Georgia, serif', fontSize: '14px', color: '#886644', fontStyle: 'italic'
    }).setOrigin(0, 0.5);
  }

  // ── Desktop: Phaser keyboard capture ────────────────────────────────────────

  _setupKeyboard() {
    this.keyHandler = (ev) => {
      if (ev.key === 'Backspace') {
        this.searchText = this.searchText.slice(0, -1);
      } else if (ev.key.length === 1) {
        this.searchText += ev.key;
      }
      this.searchDisplay.setText(this.searchText + '|');
      this._filterAndRender(this.searchText);
    };
    this.scene.input.keyboard.on('keydown', this.keyHandler);
  }

  // ── Mobile: HTML <input> at the top of the viewport ─────────────────────────
  // Positioned top-center so the native keyboard slides in from the bottom
  // without shrinking the game canvas (avoids viewport-resize issues).

  _setupMobileInput() {
    const inp = document.createElement('input');
    inp.type = 'text';
    inp.placeholder = 'Cauta contact...';
    inp.setAttribute('autocomplete', 'off');
    inp.setAttribute('autocorrect', 'off');
    inp.setAttribute('spellcheck', 'false');
    Object.assign(inp.style, {
      position:    'fixed',
      top:         '6px',
      left:        '50%',
      transform:   'translateX(-50%)',
      zIndex:      '9999',
      fontSize:    '16px',  // ≥16px prevents iOS auto-zoom
      padding:     '6px 16px',
      borderRadius:'20px',
      border:      '2px solid #8b6914',
      background:  'rgba(245,230,200,0.97)',
      color:       '#221100',
      width:       '270px',
      fontFamily:  'monospace',
      outline:     'none',
      boxShadow:   '0 2px 8px rgba(0,0,0,0.4)'
    });
    document.body.appendChild(inp);
    this.htmlInput = inp;

    inp.addEventListener('input', () => {
      this.searchText = inp.value;
      this.searchDisplay.setText(this.searchText + '|');
      this._filterAndRender(this.searchText);
    });

    // Tapping the in-game search box re-focuses the input
    this.searchBg.setInteractive({ cursor: 'pointer' });
    this.searchBg.on('pointerdown', () => inp.focus());

    // Hint text instead of cursor
    this.searchDisplay.setText('Apasa campul de sus pentru a cauta');

    // Cleanup when scene shuts down (quest complete or scene restart)
    this.scene.events.once('shutdown', () => this._removeMobileInput());

    inp.focus();
  }

  _removeMobileInput() {
    if (this.htmlInput) {
      this.htmlInput.remove();
      this.htmlInput = null;
    }
  }

  // ── Shared ───────────────────────────────────────────────────────────────────

  _filterAndRender(text) {
    const filtered = CONTACTS.filter(c =>
      c.name.toLowerCase().includes(text.toLowerCase()) ||
      c.address.toLowerCase().includes(text.toLowerCase())
    );
    this._renderList(filtered);
  }

  _renderList(contacts) {
    this.rows.forEach(r => r.forEach(o => o.destroy()));
    this.rows = [];

    contacts.forEach((c, i) => {
      const y = 264 + i * 44;
      if (y > 580) return; // clip at panel bottom

      const bg = this.scene.add.rectangle(640, y, 800, 38, 0xffffff, 0.85)
        .setStrokeStyle(1, 0xddcc99)
        .setInteractive({ cursor: 'pointer' });

      const nameTxt = this.scene.add.text(260, y, c.name, {
        fontFamily: 'Georgia, serif', fontSize: '14px', color: '#221100', fontStyle: 'bold'
      }).setOrigin(0, 0.5);

      const addrTxt = this.scene.add.text(500, y, c.address, {
        fontFamily: 'monospace', fontSize: '13px', color: '#334455'
      }).setOrigin(0, 0.5);

      bg.on('pointerover', () => bg.setFillStyle(0xddeeff));
      bg.on('pointerout',  () => bg.setFillStyle(0xffffff));
      bg.on('pointerdown', () => this._select(c));

      this.rows.push([bg, nameTxt, addrTxt]);
    });

    if (contacts.length === 0) {
      const noResult = this.scene.add.text(640, 350, 'Niciun contact gasit.', {
        fontFamily: 'Georgia, serif', fontSize: '15px', color: '#888888', fontStyle: 'italic'
      }).setOrigin(0.5);
      this.rows.push([noResult]);
    }
  }

  _select(contact) {
    if (this.keyHandler) {
      this.scene.input.keyboard.off('keydown', this.keyHandler);
    }
    this._removeMobileInput();
    this.rows.forEach(r => r.forEach(o => o.destroy()));

    if (contact.correct) {
      this.scene.add.text(640, 380, 'Corect! Adresa gasita!', {
        fontFamily: 'Georgia, serif', fontSize: '24px', color: '#006600', fontStyle: 'bold'
      }).setOrigin(0.5);
      this.scene.add.text(640, 430, contact.address, {
        fontFamily: 'monospace', fontSize: '18px', color: '#334455'
      }).setOrigin(0.5);
      this.scene.time.delayedCall(1800, () => this.scene.onQuestComplete());
    } else {
      const msg = this.scene.add.text(640, 350, `Adresa "${contact.address}" nu este corecta.\nIncearca din nou!`, {
        fontFamily: 'Georgia, serif', fontSize: '17px', color: '#880000',
        align: 'center', wordWrap: { width: 700 }
      }).setOrigin(0.5);
      this.scene.time.delayedCall(1500, () => {
        msg.destroy();
        this._renderList(CONTACTS);
        if (IS_TOUCH) {
          this._setupMobileInput();
        } else {
          this._setupKeyboard();
        }
      });
    }
  }
}
