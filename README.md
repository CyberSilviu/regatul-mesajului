# 🏰 Regatul Mesajului — joc educațional 2D

> Joc sandbox 2D pentru clasa a 9-a TIC, capitolul **„Comunicarea prin Internet"**.
> Elevul se află într-un regat medieval și trebuie să rezolve nouă task-uri interactive
> pentru a putea trimite un mesaj oficial criptat și semnat digital către un regat îndepărtat.

**Autor:** Muraru Silviu-Andrei — Colegiul Tehnic de Căi Ferate „Unirea", Pașcani
**Stack:** Phaser 3 · Vite · JavaScript ES6+
**Audiență:** clasa a 9-a, disciplina TIC
**Deploy:** Netlify (static hosting, fără backend)

---

## 📜 Cuprins

1. [Concept și gameplay](#-concept-și-gameplay)
2. [Controale](#-controale)
3. [Scenele jocului](#-scenele-jocului)
4. [Harta lumii și NPC-urile](#-harta-lumii-și-npc-urile)
5. [Quest-urile — descriere completă](#-quest-urile--descriere-completă)
6. [Maparea pe programa școlară](#-maparea-pe-programa-școlară)
7. [Structura proiectului](#-structura-proiectului)
8. [Instalare și rulare](#-instalare-și-rulare)
9. [Configurare animații (sprite-sheets)](#-configurare-animații-sprite-sheets)
10. [Sistem de salvare progres](#-sistem-de-salvare-progres)
11. [Asset pack (Tiny Swords) — inventar](#-asset-pack-tiny-swords--inventar)
12. [Deploy pe Netlify](#-deploy-pe-netlify)
13. [Idei de evaluare](#-idei-de-evaluare)
14. [Extensii posibile](#-extensii-posibile)
15. [Licențe](#-licențe)

---

## 🎮 Concept și gameplay

**Setting:** Elevul controlează un **mesager** (Pawn albastru) în **Regatul Albastru**.
Trebuie să trimită o scrisoare oficială regelui din **Regatul Roșu**, dar înainte trebuie
să rezolve task-urile pe care i le dau cei 9 locuitori ai regatului — fiecare task acoperă
un concept concret din capitolul *Comunicarea prin Internet*.

**Loop-ul de bază:**

1. Jucătorul se deplasează prin lumea 2D (3200×2400 px) cu WASD / săgeți sau **joystick virtual** pe mobil.
2. Se apropie de un NPC și apasă `E` (sau **butonul galben** pe mobil) pentru a iniția dialogul.
3. Dialogul prezintă contextul quest-ului; jucătorul poate **accepta** sau refuza.
4. La acceptare, se lansează mini-jocul corespunzător (quiz, drag & drop, click-to-destroy etc.).
5. La rezolvare, primește un **item de inventar** vizibil în HUD-ul de jos.
6. Când toate 9 quest-uri sunt complete, apare butonul **„TRIMITE MESAJUL!"** în HUD.
7. **Scena finală:** un Archer trage o săgeată cu scrisoarea de la Castelul Albastru spre Castelul Roșu.

**Progresie:** quest-urile 1–9 pot fi rezolvate în **orice ordine**. Butonul de trimitere
apare doar după finalizarea tuturor. Progresul se salvează automat în `localStorage`.

---

## 🕹 Controale

### Desktop (tastatură + mouse)

| Acțiune | Taste |
|---|---|
| Deplasare | `W` `A` `S` `D` sau ↑ ↓ ← → |
| Interacțiune cu NPC | `E` (când ești în raza de 95px) |
| Click / selectare în quest | Mouse stânga |
| Drag & drop (Quest Sortare) | Mouse drag |

### Mobil / browser tactil

| Acțiune | Control |
|---|---|
| Deplasare | **Joystick virtual** — cerc semitransparent, colțul stânga-jos |
| Interacțiune cu NPC | **Butonul galben** „E / vorbeste" — colțul dreapta-jos |
| Click / selectare în quest | Tap |
| Drag & drop (Quest Sortare) | Drag cu degetul |
| Căutare text (Quest Agendă, Quest Motor) | Câmp HTML nativ apare în vârful ecranului |

> **Mod landscape obligatoriu** pe telefon. Un mesaj „Roteste telefonul" apare automat
> dacă telefonul e în portrait mode.

Toate butoanele din quest-uri folosesc evenimentele `pointer` ale Phaser — funcționează
nativ cu touch fără cod suplimentar, cu excepția introducerii de text (Quest_Address și
Quest_Search) care utilizează un `<input>` HTML suprapus.

---

## 🎬 Scenele jocului

| Scenă | Rol |
|---|---|
| `BootScene` | Încarcă toate asset-urile, afișează bară de progres. Trece la MenuScene. |
| `MenuScene` | Meniu principal: „Joc Nou" (șterge save) și „Continua" (dacă există save, afișează câte quest-uri completate). |
| `GameScene` | Scena principală — lumea 2D, player, NPC-uri, clădiri, HUD, controale mobile. |
| `DialogScene` | Overlay modal cu avatar NPC, text cu efect typewriter, buton Accept / Refuza. |
| `QuestScene` | Dispatcher: lansează instanța quest-ului corespunzător, gestionează overlay negru 68%. |
| `EndingScene` | Cutscenă finală: câmp de stele, arcaș trage săgeată, Castelul Roșu se aprinde. |

**Fluxul scenelor:**
```
BootScene → MenuScene → GameScene
                            ├─ (apasă E lângă NPC) → DialogScene (overlay)
                            │       └─ (acceptă quest) → QuestScene (overlay, GameScene pauzat)
                            │               └─ (quest terminat) → GameScene reia
                            └─ (toate 9 quests) → EndingScene
```

---

## 🗺 Harta lumii și NPC-urile

Lumea are **3200×2400 px**. O rețea de drumuri (dreptunghiuri semi-transparente) leagă
toate cele 9 locații. Decorațiunile (65 tufișuri, 22 stânci, 4 oițe animate) sunt plasate
aleatoriu cu evitarea zonelor de excludere (NPC-uri, clădiri).

| # | NPC (key) | Sprite | Clădire | Poziție (world) | Quest |
|---|---|---|---|---|---|
| 1 | `rege` | Warrior Idle | Castle Blue | 1600, 440 | Quest_Email |
| 2 | `scrib` | Pawn Idle | House1 | 500, 690 | Quest_Address |
| 3 | `bibliotecara` | Monk Idle | House2 | 820, 880 | Quest_Folders |
| 4 | `trimis` | Pawn Idle | House3 | 1300, 760 | Quest_Attach |
| 5 | `calugar` | Monk Idle | Monastery | 350, 1330 | Quest_Crypto |
| 6 | `strajer` | Lancer Idle | Tower | 2550, 640 | Quest_Firewall |
| 7 | `sergent` | Warrior Idle | Barracks | 2100, 1070 | Quest_Etiquette |
| 8 | `arcas` | Archer Idle | Archery | 1750, 1410 | Quest_Chat |
| 9 | `cioban` | Pawn Idle | — | 750, 1600 | Quest_Search |

**Easter egg:** un rubber duck (`rubber-duck`) este ascuns la coordonatele (3100, 2350)
în colțul din dreapta-jos al lumii — referință la *rubber duck debugging* pentru elevii curioși.

**Oițe decorative:** 4 sprite-uri `Sheep_Idle` animate lângă NPC-ul ciobanului.

---

## 📜 Quest-urile — descriere completă

### Quest 1 — Misiunea Regelui (`Quest_Email.js`)

**NPC:** Regele (Warrior) la Castel
**Mechanic:** Quiz cu 3 întrebări cu variante multiple despre email-uri.
**Întrebări:** programe de poștă electronică (Outlook, Eudora, Pegasus), câmpul CC,
structura adresei de email (@ și domeniu).
**Prag de trecere:** minim 2/3 răspunsuri corecte.
**Feedback:** culoare verde/roșu instant; pauză 900ms între întrebări.
**Recompensă:** `scrisoare_regala` (Icon 1)

---

### Quest 2 — Agenda Scribului (`Quest_Address.js`)

**NPC:** Scribul (Pawn) la House1
**Mechanic:** Agendă de 8 contacte cu câmp de căutare live (filtrare după nume sau adresă).
Elevul trebuie să identifice și să dea click pe adresa corectă: `rege.rosu@castelulrosu.ro`.
Celelalte 7 adrese sunt deliberat similare sau plauzibile (capcane).
**Desktop:** tastatura actualizează filtrul în timp real.
**Mobil:** câmp HTML nativ în vârful ecranului; tapping pe search box îl focusează.
**Feedback:** mesaj de eroare 1.5s, reia lista completă dacă selecție greșită.
**Recompensă:** `adresa_corecta` (Icon 2)

---

### Quest 3 — Sortarea Mesajelor (`Quest_Folders.js`)

**NPC:** Bibliotecara (Monk) la House2
**Mechanic:** Drag & drop — 8 card-uri de email trebuie trase în 4 foldere:
**Inbox**, **Spam**, **Cos** (trash), **Important**.
**Prag de trecere:** minim 6/8 sortate corect.
**Touch:** Phaser gestionează drag nativ — funcționează pe orice dispozitiv.
**Feedback:** scor final; restart dacă nu treci.
**Recompensă:** `mail_sortat` (Icon 3)

---

### Quest 4 — Atasare Fisiere (`Quest_Attach.js`)

**NPC:** Trimisul (Pawn) la House3
**Mechanic:** Listă cu 6 fișiere; elevul trebuie să selecteze **exact** 3 fișiere
obligatorii (`scrisoare`, `harta`, `sigiliu`) fără a selecta altele.
Click pe fișier = toggle selecție (border verde + bifă).
**Feedback:** validare instantă la apăsarea butonului „Ataseaza".
**Recompensă:** `fisier_atasat` (Icon 4)

---

### Quest 5 — Criptare si Semnatura (`Quest_Crypto.js`)

**NPC:** Călugărul (Monk) la Mânăstire
**Mechanic — 2 etape:**
- **Etapa 1:** Decriptare cifru Cezar (+3). Elevul vede mesajul criptat și trebuie să
  tasteze varianta decodată. Verificare pe Enter.
- **Etapa 2** (scenă restartată cu date): Click pe ștampila digitală pentru a o aplica
  pe scrisoarea decodată. Animație de aplicare.
**Recompensă:** `cifru_si_stampila` (Icon 5)

---

### Quest 6 — Apararea Regatului (`Quest_Firewall.js`)

**NPC:** Străjerul (Lancer) la Turn
**Mechanic:** Mini-joc click-to-destroy în timp real.
- Timer: 40 secunde; 3 vieți.
- **Inamici** (trebuie distruși cu click/tap): VIRUS · MALWARE · SPAM · PHISHING · WORM
- **Trafic legitim** (NU trebuie atins): EMAIL · UPDATE · BACKUP
- Dacă un inamic atinge castelul → pierde o viață.
- Dacă dai click pe trafic legitim → avertisment.
**Prag de trecere:** 10 inamici distruși cu cel puțin 1 viață rămasă.
**Recompensă:** `pana_firewall` (Icon 6)

---

### Quest 7 — Eticheta si Legislatie (`Quest_Etiquette.js`)

**NPC:** Sergentul (Warrior) la Cazarmă
**Mechanic:** 5 scenarii etice (dilemă cu variante multiple):
CAPS = agresivitate, fișiere mari → cloud, phishing, GDPR, netiquetă generală.
**Prag de trecere:** minim 4/5 răspunsuri corecte.
**Feedback:** explicație detaliată după fiecare răspuns (corect sau nu).
**Recompensă:** `manual_eticheta` (Icon 7)

---

### Quest 8 — Chat Online si Acronime (`Quest_Chat.js`)

**NPC:** Arcașul (Archer) la Tabăra de Arcași
**Mechanic — 2 etape:**
- **Etapa 1:** Potrivire 6 emoticoane (`:)`, `:(`, `:D`, `;)`, `:o`, `:/`) cu semnificațiile lor.
  Drag sau click pentru asociere.
- **Etapa 2** (scenă restartată): 4 rânduri de chat incomplete — elevul completează acronimele
  corecte (BRB, LOL, OMG, THX).
**Prag de trecere:** 3/4 rânduri de chat corecte.
**Recompensă:** `lista_smileys` (Icon 8)

---

### Quest 9 — Motor de Cautare (`Quest_Search.js`)

**NPC:** Ciobanul (Pawn) lângă oițe
**Mechanic:** Motor de căutare fictiv „RegSearch". Elevul caută informații despre istoria
internetului și trebuie să colecteze **3 fapte verificate** din surse credibile, evitând
sursele false (spam, reclame, clickbait).
**Rezultate corecte:** ARPANET 1969 · Tim Berners-Lee WWW 1989 · Ray Tomlinson email 1971.
**Surse false:** site-uri .biz/.xyz, reclame, rețete.
**Desktop:** tastatura actualizează câmpul de căutare; Enter sau buton Cauta lansează căutarea.
**Mobil:** câmp HTML nativ în vârful ecranului.
**Recompensă:** `referat_documentat` (Icon 9)

---

## 🗺 Maparea pe programa școlară

| Quest | Subiect din programa TIC clasa a 9-a |
|---|---|
| Quest_Email | Citirea / întocmirea / trimiterea unui mesaj; programe de poștă electronică |
| Quest_Address | Folosirea agendei de adrese; căutarea adreselor de e-mail |
| Quest_Folders | Administrarea e-mail-urilor: directoare, filtre |
| Quest_Attach | Atașarea fișierelor la un mesaj; redirecționarea unui mesaj |
| Quest_Crypto | Criptarea transmisiei; semnătura digitală |
| Quest_Firewall | Protecția împotriva virușilor; conceptul de Firewall |
| Quest_Etiquette | Adresarea politicoasă (netiquetă); aspecte legislative (GDPR, phishing) |
| Quest_Chat | Servicii de conversație: IRC, emoticoane, acronime |
| Quest_Search | Aplicații practice: căutarea informațiilor pe motoare de căutare |

---

## 📂 Structura proiectului

```
regatul-mesajului/
├── CLAUDE.md               ← instrucțiuni pentru Claude Code
├── README.md               ← acest fișier
├── package.json
├── vite.config.js
├── index.html
├── public/
│   └── assets/
│       ├── Buildings/      ← Tiny Swords (Blue/Red/etc.)
│       ├── Units/          ← Pawn, Warrior, Archer, Monk, Lancer, Sheep
│       ├── Terrain/        ← Decorations (Bushes, Rocks, Rubber Duck)
│       ├── Particle FX/
│       └── UI Elements/    ← Avatars, Icons, Papers, Buttons
└── src/
    ├── main.js             ← entry point Phaser (config joc + lista scene)
    ├── config.js           ← constante globale + config NPC/clădiri/recompense
    ├── scenes/
    │   ├── BootScene.js    ← preload asset-uri + creare animații + loading bar
    │   ├── MenuScene.js    ← meniu principal (New Game / Continue)
    │   ├── GameScene.js    ← scena principală (lume, player, NPC-uri, HUD, mobile)
    │   ├── DialogScene.js  ← dialog NPC cu typewriter + accept/refuza
    │   ├── QuestScene.js   ← dispatcher quest-uri + overlay
    │   └── EndingScene.js  ← cutscenă finală (arcaș + castel roșu)
    ├── entities/
    │   ├── Player.js       ← Pawn albastru; mișcare WASD + joystick virtual
    │   ├── NPC.js          ← sprite NPC + prompt interacțiune (auto-detectează touch)
    │   └── Building.js     ← imagine clădire + corp de coliziune static
    ├── quests/
    │   ├── QuestManager.js ← salvare/încărcare progres (localStorage)
    │   ├── Quest_Email.js
    │   ├── Quest_Address.js
    │   ├── Quest_Folders.js
    │   ├── Quest_Attach.js
    │   ├── Quest_Crypto.js
    │   ├── Quest_Firewall.js
    │   ├── Quest_Etiquette.js
    │   ├── Quest_Chat.js
    │   └── Quest_Search.js
    ├── ui/
    │   ├── HUD.js           ← bară progres + 9 sloturi inventar + buton Trimite
    │   └── MobileControls.js← joystick virtual + buton interacțiune (doar pe touch)
    └── data/
        ├── npcs.json        ← textele de dialog ale NPC-urilor
        ├── quests.json      ← metadate quest-uri (subject lines)
        └── emails.json      ← date email pentru Quest_Folders (sortare)
```

---

## 🚀 Instalare și rulare

### Cerințe

- **Node.js** ≥ 18
- **npm** (vine cu Node)
- Browser modern (Chrome, Firefox, Edge, Safari)

### Pași

```bash
# Clonează / descarcă proiectul, intră în folder
cd regatul-mesajului

# Instalează dependențele (Phaser + Vite)
npm install

# Pornește serverul de dezvoltare
npm run dev
# → http://localhost:5173
```

### Build pentru producție

```bash
npm run build
# generează dist/ — conține tot ce trebuie urcat pe Netlify
```

---

## 🎞 Configurare animații (sprite-sheets)

Toate sprite-urile Tiny Swords sunt **sprite-sheets orizontale** (frame-uri aliniate pe rând).

| Animație | Frame size | Nr. frame-uri | FPS |
|---|---|---|---|
| Pawn_Idle | 192×192 | 8 | 8 |
| Pawn_Run | 192×192 | 6 | 12 |
| Warrior_Idle | 192×192 | 8 | 8 |
| Warrior_Run | 192×192 | 6 | 12 |
| Warrior_Attack1 | 192×192 | 4 | 10 |
| Archer_Idle | 192×192 | 8 | 8 |
| Archer_Shoot | 192×192 | 8 | 12 |
| Monk_Idle | 192×192 | 8 | 8 |
| Monk_Heal | 192×192 | 11 | 12 |
| **Lancer_Idle** | **320×320** | **12** | **10** |
| Sheep_Idle | 128×128 | 6 | 6 |

> ⚠️ **Lancer-ul are frame de 320×320** (nu 192). Singura excepție din toate unitățile.

```js
// BootScene.js — exemplu corect de încărcare
this.load.spritesheet('pawn-blue-idle',
  'assets/Units/Blue Units/Pawn/Pawn_Idle.png',
  { frameWidth: 192, frameHeight: 192 });

// Lancer — ATENȚIE la dimensiune!
this.load.spritesheet('lancer-blue-idle',
  'assets/Units/Blue Units/Lancer/Lancer_Idle.png',
  { frameWidth: 320, frameHeight: 320 });

// Sheep
this.load.spritesheet('sheep-idle',
  'assets/Terrain/Decorations/Rocks in the Water/Sheep_Idle.png',
  { frameWidth: 128, frameHeight: 128 });
```

---

## 💾 Sistem de salvare progres

Salvare automată în **`localStorage`**, cheia `regatul_mesajului_save`:

```js
{
  version: 1,
  questsCompleted: ['quest_email', 'quest_address'],
  inventory: ['scrisoare_regala', 'adresa_corecta'],
  playerPos: { x: 1600, y: 550 },
  timestamp: 1714738800000
}
```

- **Autosave poziție:** la fiecare 10 secunde.
- **Autosave quest:** imediat după completare.
- **New Game:** șterge save-ul din localStorage.
- **Continue:** restaurează poziția și inventarul exact de unde a rămas.
- **Versionare (`version: 1`):** permite migrarea save-urilor vechi dacă formatul se schimbă.

---

## 🎨 Asset pack (Tiny Swords) — inventar

Pack-ul utilizat este **Tiny Swords by Pixel Frog** (CC0).

### Clădiri (`Assets/Buildings/`)

5 culori (Black, Blue, Purple, Red, Yellow) × 8 clădiri.

| Fișier | Dimensiune | Folosit pentru |
|---|---|---|
| `Castle.png` | 320×256 | Castelul Blue (jucător) + Red (final) |
| `House1.png` | 128×192 | Casa Scribului |
| `House2.png` | 128×192 | Casa Bibliotecarei |
| `House3.png` | 128×192 | Casa Trimisului |
| `Tower.png` | 128×256 | Turn de pază (Firewall) |
| `Monastery.png` | 192×320 | Mânăstire (Criptare) |
| `Archery.png` | 192×256 | Tabăra arcașilor (Chat) |
| `Barracks.png` | 192×256 | Cazarmă (Netiquetă) |

### Unități (`Assets/Units/`)

Folosite în joc: Blue Units pentru player și NPC-uri, Red Castle la animația finală.
Frame-urile sunt pe orizontală (vezi tabelul de animații de mai sus).

### Teren și decorațiuni (`Assets/Terrain/`)

- `Decorations/Bushes/` — Bushe1–4 (folosite aleatoriu, 65 bucăți)
- `Decorations/Rocks/` — Rock1–2 (22 bucăți)
- `Decorations/Rubber Duck/` — 🦆 easter egg la (3100, 2350)
- `Resources/Meat/Sheep/` — oițe animate lângă cioban

### UI Elements (`Assets/UI Elements/UI Elements/`)

| Folder | Folosit pentru |
|---|---|
| `Human Avatars/` | Portrete NPC în dialog (25 disponibile, alocate per NPC în config) |
| `Icons/` | Iconițe inventar HUD (12 disponibile, 9 folosite) |
| `Papers/` | Background panel dialog (RegularPaper, SpecialPaper) |

---

## 🌐 Deploy pe Netlify

```bash
npm run build          # generează dist/
```

1. Drag & drop folderul `dist/` pe [app.netlify.com/drop](https://app.netlify.com/drop).
2. Copiezi URL-ul (ex: `regatul-mesajului.netlify.app`) și îl distribui elevilor.
3. Funcționează în orice browser — desktop, tabletă, telefon (landscape).

**Variantă offline (lab fără internet):** copiază `dist/` pe stick USB și deschide
`index.html` direct în browser — Phaser e inclus complet în bundle.

---

## 🎯 Idei de evaluare

- **Observare directă:** urmărești la ce quest-uri se blochează elevii — indică unde trebuie
  reluat conceptul teoretic.
- **Screenshot final:** elevul îți arată scena `EndingScene` ca dovadă că a trimis mesajul.
- **Grilă propusă:** 9 quest-uri × 1 punct + 1 punct din oficiu = **10 puncte**.
- **Bonus:** un scor de „eficiență" bazat pe numărul de încercări per quest poate fi adăugat
  în viitor pentru a genera competiție în clasă.
- **Rubrică diferențiată:** quest-urile teoretice (Email, Etiquette) verifică cunoașterea;
  cele practice (Folders, Attach, Firewall) verifică aplicarea.

---

## 🔮 Extensii posibile

### Funcționalitate

- [ ] **Sunete și muzică** — muzică ambientală medievală (loop) + SFX per acțiune.
  Surse recomandate: [freesound.org](https://freesound.org), [opengameart.org](https://opengameart.org) (CC0).
- [ ] **Dificultate variabilă** — 3 niveluri de dificultate per quest (întrebări / timp diferit).
- [ ] **Mini-map** — hartă mică în colțul dreapta-sus pentru orientare.
- [ ] **Scor și statistici** — număr de încercări per quest, timp total.

### Conținut curricular

- [ ] **Quest Telefonie IP / Video-conferință** — dialog video stilizat cu un NPC din Regatul Roșu.
- [ ] **Quest Rețele sociale** — concepte: profil public/privat, bullying online, drepturi de autor.
- [ ] **Modul „Profesor"** — dashboard cu progresul tuturor elevilor (necesită backend / Firebase).

### Tehnic

- [ ] **PWA (Progressive Web App)** — adaugă `manifest.json` pentru instalare pe ecranul principal al telefonului.
- [ ] **Mod accesibilitate** — text mai mare, contrast crescut, navigare doar cu tastatură.
- [ ] **Localizare** — suport multi-limbă (română / engleză) pentru utilizare mai largă.

---

## 📄 Licențe

- **Asset pack:** [Tiny Swords by Pixel Frog](https://pixelfrog-assets.itch.io/tiny-swords) —
  verifică licența pe pagina autorului (uz non-comercial educațional).
- **Cod sursă:** MIT — liber de utilizat și adaptat în scop educațional.
- **Design quest-uri și texte:** © Muraru Silviu-Andrei, 2026.

---

## 🙏 Mulțumiri

Asset-uri de la **Pixel Frog** (Tiny Swords).
Proiect realizat pentru elevii **Colegiului Tehnic de Căi Ferate „Unirea"**, Pașcani.

> *„Mesajul nu pleaca singur — trebuie sa-l ajutam noi sa traverseze regatul!"* 🏰✉️
