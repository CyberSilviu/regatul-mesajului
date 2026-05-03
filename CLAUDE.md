# CLAUDE.md — Reguli pentru Claude Code

> Acest fisier este citit automat de Claude Code la fiecare sesiune.
> Contine regulile, conventiile si contextul proiectului **Regatul Mesajului**.

---

## 📌 Context proiect

- **Nume:** Regatul Mesajului
- **Tip:** Joc educational 2D sandbox
- **Audienta:** Elevi clasa a 9-a, disciplina TIC (Tehnologia Informatiei si Comunicatiilor)
- **Subiect curricular:** Capitolul "Comunicarea prin Internet"
- **Autor:** Muraru Silviu-Andrei, Colegiul Tehnic CF "Unirea", Pascani
- **Deploy tinta:** Netlify (static hosting)

> Pentru detalii complete despre gameplay, quest-uri si maparea pe programa
> scolara, consulta `README.md` in radacina proiectului.

---

## 🛠 Stack tehnic — REGULI STRICTE

### Folosim:
- ✅ **Phaser 3** (motor de joc 2D)
- ✅ **Vite** (build tool si dev server)
- ✅ **JavaScript vanilla** (ES6+ modules)
- ✅ **localStorage** pentru salvare progres

### NU folosim:
- ❌ **TypeScript** — proiectul e in JS pur
- ❌ **React / Vue / Svelte** — Phaser controleaza tot rendering-ul
- ❌ **CSS frameworks** (Tailwind, Bootstrap) — UI-ul e in Phaser, nu in DOM
- ❌ **Backend / baze de date** — totul ruleaza client-side
- ❌ **Pachete npm care nu sunt strict necesare** — keep it lean

---

## ✍️ Reguli pentru texte — IMPORTANT

### Toate textele afisate elevilor sunt in romana FARA diacritice

Inlocuieste:
- `ă` → `a`
- `â` → `a`
- `î` → `i`
- `ș` → `s`
- `ț` → `t`
- `Ă/Â` → `A`, `Î` → `I`, `Ș` → `S`, `Ț` → `T`

**Exemple:**
- ❌ `"Bună, călătorule! Să trimitem un mesaj!"`
- ✅ `"Buna, calatorule! Sa trimitem un mesaj!"`

- ❌ `"Apasă E pentru a vorbi"`
- ✅ `"Apasa E pentru a vorbi"`

### Motivul
Compatibilitate cu proiectoare vechi din scoli, fonturi pixel-art care nu suporta
diacritice complete, si consistenta cu materialele didactice deja folosite la clasa.

### Exceptie
Comentariile din cod si numele de variabile/functii raman **in engleza standard**.

---

## 📁 Structura proiectului

```
regatul-mesajului/
├── CLAUDE.md                ← acest fisier
├── README.md                ← brief complet de implementare
├── package.json
├── vite.config.js
├── index.html
├── public/
│   └── assets/              ← Tiny Swords asset pack (NU modifica)
└── src/
    ├── main.js              ← entry point Phaser
    ├── config.js            ← config global
    ├── scenes/              ← scene Phaser
    ├── entities/            ← Player, NPC, Building
    ├── quests/              ← logica fiecarui quest
    ├── ui/                  ← componente UI (DialogBox, Inventory, HUD)
    └── data/                ← JSON: npcs, quests, emails
```

---

## 🎨 Asset-uri — atentie la detalii

### Path-uri cu spatii
Folderele Tiny Swords au **spatii in nume** (`Blue Buildings`, `UI Elements`).
Foloseste mereu ghilimele si template literals:

```js
// ❌ GRESIT
this.load.image('castle', 'assets/Buildings/Blue Buildings/Castle.png');

// ✅ CORECT — functioneaza, dar fii atent la encoding URL daca apar probleme
this.load.image('castle-blue', 'assets/Buildings/Blue Buildings/Castle.png');
```

### Frame sizes — capcana Lancer
Toate unitatile au frame **192×192**, **EXCEPT Lancer-ul** care are **320×320**.
Verifica de doua ori cand incarci Lancer:

```js
// Pawn / Warrior / Archer / Monk:
this.load.spritesheet('pawn-blue-idle', 'path/to/Pawn_Idle.png',
  { frameWidth: 192, frameHeight: 192 });

// Lancer (ATENTIE!):
this.load.spritesheet('lancer-blue-idle', 'path/to/Lancer_Idle.png',
  { frameWidth: 320, frameHeight: 320 });

// Sheep (oitele):
this.load.spritesheet('sheep-idle', 'path/to/Sheep_Idle.png',
  { frameWidth: 128, frameHeight: 128 });
```

### Numar de frame-uri per animatie
Vezi tabelul complet din `README.md` sectiunea *Configurare animatii*.
Cele mai folosite:
- **Pawn_Idle** — 8 frames @ 8fps
- **Pawn_Run** — 6 frames @ 12fps
- **Warrior_Attack1** — 4 frames @ 10fps
- **Archer_Shoot** — 8 frames @ 12fps
- **Monk_Heal** — 11 frames @ 12fps

---

## 🎮 Conventii de cod

### Naming
- **Fisiere:** PascalCase pentru clase (`Player.js`, `DialogBox.js`), camelCase pentru module (`questManager.js`)
- **Clase:** PascalCase (`class Player extends Phaser.GameObjects.Sprite`)
- **Variabile/functii:** camelCase (`const playerSpeed = 150; function startQuest() {}`)
- **Constante globale:** UPPER_SNAKE_CASE (`const TILE_SIZE = 64;`)
- **Chei Phaser** (asset keys, scene keys, anim keys): kebab-case (`'pawn-blue-idle'`, `'main-game'`)

### Structura unei scene Phaser

```js
// src/scenes/GameScene.js
import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    // de obicei gol — incarcam totul in BootScene
  }

  create() {
    // initializare
  }

  update(time, delta) {
    // game loop
  }
}
```

### Comentarii
- **In engleza**, scurte si clare
- Comentarii pentru "DE CE", nu pentru "CE" face codul
- Pentru quest-uri: adauga la inceput un comentariu cu **subiectul curricular** acoperit

```js
/**
 * Quest: Folders & Filters
 * Curriculum topic: "Administrarea e-mail-urilor (directoare, filtre)"
 * Mechanic: Drag & drop sorting of 8 emails into 4 folders
 */
export default class Quest_Folders {
  // ...
}
```

---

## 📚 Pedagogie — fii intentional

Fiecare quest **trebuie sa invete un concept concret** din capitol, nu sa fie
generic. Cand implementezi un quest, intreaba-te:

1. Ce **subiect din programa** acopera?
2. Ce **abilitate** verifica? (cunoastere teoretica vs aplicatie practica)
3. Cum o sa stie **profesorul** ca elevul a inteles?

Nu face quest-uri generice "colecteaza 5 obiecte". Vezi tabelul din README
*Maparea task-urilor pe programa scolara* pentru ce mecanica are fiecare quest.

---

## 🔄 Workflow recomandat

### Cand primesti un task de la utilizator:

1. **Citeste README.md** sectiunea relevanta (Etapele de implementare)
2. **Confirma intelegerea** — spune ce ai de gand sa faci, asteapta OK
3. **Implementeaza incremental** — fa lucruri mici, verificabile
4. **Verifica `npm run dev`** — daca pici la build, repara INAINTE sa raportezi
5. **Raporteaza scurt** ce ai facut + ce sa testeze utilizatorul in browser

### Reguli de commit (daca folosesti git)
- Mesaje in engleza, prefix conventional:
  - `feat:` pentru functionalitate noua
  - `fix:` pentru bug fix
  - `refactor:` pentru reorganizare cod
  - `docs:` pentru actualizari README/CLAUDE.md
  - `assets:` pentru schimbari de asset-uri

Exemplu: `feat: implement Quest_Folders drag-and-drop mechanic`

---

## 💾 Salvare progres

Folosim **localStorage** cu o singura cheie:

```js
const SAVE_KEY = 'regatul_mesajului_save';

// Format save:
{
  version: 1,                    // pentru migrari viitoare
  questsCompleted: ['quest_email', 'quest_address'],
  inventory: ['scrisoare_regala', 'adresa_corecta'],
  playerPos: { x: 400, y: 300 },
  timestamp: 1714738800000
}
```

Adauga **versionare** (`version: 1`) ca sa poti migra save-uri vechi daca schimbi formatul.

---

## ✅ Checklist inainte sa raportezi un task ca "gata"

- [ ] Codul ruleaza fara erori in consola browser-ului
- [ ] `npm run dev` porneste fara erori
- [ ] Texte afisate elevilor sunt **fara diacritice**
- [ ] Asset-urile se incarca corect (verifica Network tab)
- [ ] Animatiile au frame size si frame count corecte
- [ ] Functionalitatea noua nu strica ce era inainte
- [ ] Daca ai adaugat quest, e mapat pe un subiect din programa
- [ ] (Optional) Testat pe rezolutie mica (laptop scolar 1366×768)

---

## 🚫 Anti-patterns — NU FACE asta

- ❌ Nu adauga TypeScript "ca sa fie mai sigur"
- ❌ Nu pune React/Vue pentru UI — UI-ul e in Phaser
- ❌ Nu folosi backend / Firebase / Supabase — totul e static
- ❌ Nu inventa quest-uri care nu sunt in README — daca ai o idee, intreaba intai
- ❌ Nu modifica asset-urile din `public/assets/` — sunt CC0 originale
- ❌ Nu folosi diacritice in texte afisate elevilor (vezi sectiunea de texte)
- ❌ Nu refactoriza masiv fara sa intrebi — schimbarile mari pot rupe progres anterior
- ❌ Nu comite `node_modules/`, `dist/`, sau `.env` (asigura-te ca `.gitignore` e bun)

---

## 🎯 Obiective de calitate

Codul trebuie sa fie:
- **Citibil de un elev de clasa a 9-a** care vrea sa se uite peste el
- **Comentat** suficient sa inteleg eu (profesorul) la o relectura peste 6 luni
- **Modular** — un quest nou se adauga fara sa modifici alte quest-uri
- **Performant** pe laptop-uri de scoala (Intel HD Graphics, 4GB RAM)

---

## 📞 Cand sa intrebi utilizatorul

Intreaba **inainte** sa faci, daca:
- Schimbi ceva ce e deja implementat si functioneaza
- Adaugi o dependinta npm noua
- Te abati de la planul din README.md
- Ai mai multe abordari posibile si nu e clar care e mai buna pentru context educational
- Vrei sa modifici structura folderelor

NU intreba pentru:
- Detalii minore de implementare (nume de variabile, structura interna a unei functii)
- Bug-uri evidente pe care le repari
- Comentarii / documentatie

---

## 🦆 Easter egg

In `public/assets/Terrain/Decorations/Rubber Duck/` exista un rubber duck.
La un moment dat (decide tu cand), ascunde-l undeva pe harta ca easter egg —
referinta la *rubber duck debugging*. E un mic cadou pentru elevii curiosi care
exploreaza si pentru profesorii care sa-l foloseasca ca punct de discutie.

---

> *"Mesajul nu pleaca singur — trebuie sa-l ajutam noi sa traverseze regatul!"* 🏰✉️
