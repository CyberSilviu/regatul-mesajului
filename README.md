# 🏰 Regatul Mesajului — joc educațional 2D

> Joc sandbox 2D pentru clasa a 9-a TIC, capitolul **„Comunicarea prin Internet"**.
> Elevul se află într-un regat (castel + sat) și trebuie să rezolve task-uri
> pentru a putea trimite un e-mail criptat și semnat digital către un regat îndepărtat.

**Autor:** Muraru Silviu-Andrei — Colegiul Tehnic de Căi Ferate „Unirea", Pașcani
**Stack:** Phaser 3 + Vite + JavaScript
**Audiență:** clasa a 9-a, TIC

---

## 📜 Cuprins

1. [Concept și gameplay](#-concept-și-gameplay)
2. [Maparea task-urilor pe programa școlară](#-maparea-task-urilor-pe-programa-școlară)
3. [Asset pack (Tiny Swords) — inventar](#-asset-pack-tiny-swords--inventar)
4. [Structura proiectului](#-structura-proiectului)
5. [Instalare și rulare](#-instalare-și-rulare)
6. [Implementare pas cu pas](#-implementare-pas-cu-pas)
7. [Configurare animații (sprite-sheets)](#-configurare-animații-sprite-sheets)
8. [Sistem de quest-uri](#-sistem-de-quest-uri)
9. [Interfață utilizator](#-interfață-utilizator)
10. [Salvare progres](#-salvare-progres)
11. [Distribuire către elevi](#-distribuire-către-elevi)
12. [TODO și extensii](#-todo-și-extensii)

---

## 🎮 Concept și gameplay

**Setting:** Elevul este un mesager în **Regatul Albastru** (Pașcani-stilizat 🤓).
Trebuie să trimită o scrisoare oficială regelui din **Regatul Roșu**, dar nu o poate face
până nu rezolvă o serie de probleme pe care i le dau locuitorii regatului — fiecare
problemă învață un concept din capitolul *Comunicarea prin Internet*.

**Loop-ul de bază:**

1. Elevul controlează un **Pawn albastru** (`Pawn_Idle.png` / `Pawn_Run.png`) cu WASD/săgeți.
2. Se plimbă prin sat și interacționează cu NPC-uri (alți Pawn / Warrior / Monk / Archer / Lancer) apăsând `E`.
3. Fiecare NPC dă un **quest** (mini-task interactiv într-un dialog/UI papyrus).
4. La rezolvare primește un **item** (cheie, parolă, ștampilă regală, antivirus etc.) marcat în inventar.
5. Când are toate item-ele necesare, ajunge la **Castel** și poate trimite mail-ul.
6. Animație finală: un **Archer** trage o săgeată cu scrisoarea către Regatul Roșu.

**Stil de progresie:** **hibrid** — primul task (ascultarea regelui în Castel) e obligatoriu;
restul pot fi rezolvate în orice ordine. Castelul rămâne închis pentru trimitere până
toate quest-urile principale sunt rezolvate.

---

## 🗺 Maparea task-urilor pe programa școlară

Fiecare clădire / NPC din sat este asociat unui subiect din capitol. Asta îți ușurează
**evaluarea** — știi exact ce competență verifică fiecare quest.

| # | Locație în sat | NPC | Subiect din programă | Tip mini-joc |
|---|---|---|---|---|
| 1 | **Castel** (Blue) | Regele (Warrior_Idle) | Citirea / întocmirea / trimiterea unui mesaj. Programe de poștă (Outlook, Eudora, Pegasus) | Dialog teoretic + quiz cu 3 întrebări |
| 2 | **House1** | Scribul (Pawn cu pană) | Folosirea agendei de adrese + Căutarea adreselor de e-mail | Mini-joc: găsește adresa corectă într-o listă filtrabilă |
| 3 | **House2** | Bibliotecara (Monk_Idle) | Administrarea e-mail-urilor (directoare, filtre) | Drag & drop: sortează 8 mail-uri în Inbox / Spam / Trash / Important |
| 4 | **House3** | Trimisul curierat (Pawn cu sac) | Folosirea „atașare fișiere" + Redirecționarea unui mesaj | Atașează exact fișierele cerute (drag from inventory) |
| 5 | **Monastery** | Călugărul cărturar (Monk_Heal) | Criptarea transmisiei + Semnătura digitală | Cifru Cezar simplu + aplicare ștampilă regală pe scrisoare |
| 6 | **Tower** (de pază) | Străjerul (Lancer_Idle) | Apărarea împotriva virușilor + Firewall | Tower defense scurt: dă click pe virușii care vin spre castel |
| 7 | **Barracks** | Sergentul (Warrior_Guard) | Adresarea politicoasă + Legislație Internet | Quiz: alege formularea corectă în 5 situații |
| 8 | **Archery** | Arcașul (Archer_Idle) | Servicii de conversație: IRC, smileys, acronime, NetMeeting, Telefonie IP | Match emoticon ↔ semnificație + completare conversație chat |
| 9 | **Sheep enclosure** 🐑 | (oițele) | Aplicații practice: căutare info pe motoare de căutare pentru un referat | Mini-browser fictiv: caută 3 fapte despre o disciplină |

> 📝 **Notă de design:** quest-urile 2–9 pot fi făcute în orice ordine. La sfârșit,
> elevul se întoarce la rege (Castel) cu **toate item-ele** și apasă „Trimite mesajul".

---

## 🎨 Asset pack (Tiny Swords) — inventar

Pack-ul tău este **Tiny Swords by Pixel Frog** (CC0). Mai jos e mapeul exact între
asset-uri existente și utilizarea lor în joc.

### 🏘 Buildings (`Assets/Buildings/`)

5 culori (Black, Blue, Purple, Red, Yellow) × 8 clădiri.

| Fișier | Dimensiune | Folosit pentru |
|---|---|---|
| `Castle.png` | 320×256 | Castelul regatului (Blue = al jucătorului, Red = regatul îndepărtat) |
| `House1.png` | 128×192 | Casa Scribului |
| `House2.png` | 128×192 | Casa Bibliotecarei |
| `House3.png` | 128×192 | Casa Trimisului |
| `Tower.png` | 128×256 | Turn de pază (firewall / antivirus) |
| `Monastery.png` | 192×320 | Mânăstire (criptare + semnătură digitală) |
| `Archery.png` | 192×256 | Tabără arcași (chat / IRC) |
| `Barracks.png` | 192×256 | Cazarmă (politețe / legislație) |

> Folosește **Blue Buildings** pentru regatul jucătorului și **Red Buildings**
> pentru regatul îndepărtat (afișat la final / pe minimap).

### 🧑 Units (`Assets/Units/`)

5 culori × 5 unități. Fiecare unitate are sprite-sheets pe orizontală.

| Unitate | Animații disponibile | Frame size |
|---|---|---|
| **Pawn** | Idle (8f), Run (6f), Idle/Run cu Axe/Hammer/Pickaxe/Knife/Wood/Gold/Meat, Interact (6f) | 192×192 |
| **Warrior** | Idle (8f), Run (6f), Attack1 (4f), Attack2, Guard | 192×192 |
| **Archer** | Idle, Run (4f), Shoot (8f) + Arrow.png | 192×192 |
| **Monk** | Idle, Run (4f), Heal (11f) + Heal_Effect | 192×192 |
| **Lancer** | Idle (12f), Run + 8 direcții de Attack/Defence | 320×320 |

> ⚠️ **Lancer-ul are frame de 320×320** (nu 192). Atenție când încarci sprite-sheet-ul.

### 🌍 Terrain (`Assets/Terrain/`)

- **Tileset/** → `Tilemap_color1.png` … `Tilemap_color5.png` (576×384 fiecare).
  5 variante de culoare pentru iarbă/pământ. Folosește **color1** ca tile principal.
  Mai sunt: `Shadow.png`, `Water Background color.png`, `Water Foam.png`.
- **Decorations/Bushes/** → 4 tufișuri (`Bushe1.png` … `Bushe4.png`)
- **Decorations/Clouds/** → 8 nori pentru parallax
- **Decorations/Rocks/** → 4 stânci
- **Decorations/Rocks in the Water/** → 4 stânci în apă
- **Decorations/Rubber Duck/** → 🦆 (easter egg pentru elevi)
- **Resources/Gold/** → mine de aur + pietre (poți să le folosești ca „cufere de mail")
- **Resources/Meat/Sheep/** → oițe animate (Idle 6f @128px, Move 4f @128px, Grass)

### 💥 Particle FX (`Assets/Particle FX/`)

| Fișier | Folosit pentru |
|---|---|
| `Explosion_01/02.png` | Distrugerea unui virus (la quest-ul de firewall) |
| `Fire_01/02/03.png` | Lumânări la mânăstire / torțe în castel |
| `Dust_01/02.png` | Praful când Pawn-ul aleargă |
| `Water Splash.png` | La traversarea apei |

### 🖼 UI Elements (`Assets/UI Elements/UI Elements/`)

| Folder | Conținut | Uz |
|---|---|---|
| **Banners/** | `Banner.png` (448×448), `Banner_Slots.png` | Titlu meniu principal, dialog box |
| **Bars/** | BigBar / SmallBar Base+Fill | Barre de progres (energie, progres quest) |
| **Buttons/** | 16 butoane (Big/Small × Blue/Red × Round/Square × Regular/Pressed) | Toate butoanele din UI |
| **Cursors/** | 4 cursoare | Cursor custom (4 stări: idle / hover / click / pointer) |
| **Human Avatars/** | 25 portrete 256×256 | Portrete NPC în dialog |
| **Icons/** | 12 iconițe 64×64 | Icon-uri inventar (mail, cheie, scrisoare, ștampilă...) |
| **Papers/** | RegularPaper.png, SpecialPaper.png (320×320) | Background pentru dialog text |
| **Ribbons/** | Panglici decorative | Titluri quest |
| **Swords/** | Săbii decorative | Marker progres / scor |
| **Wood Table/** | Masă de lemn | Background inventar |

### 📁 Asset-uri NU avem (decizii de luat)

- ❌ **Sunete și muzică** → trebuie descărcate separat (recomand [freesound.org](https://freesound.org) sau [opengameart.org](https://opengameart.org), licență CC0). Sugestii:
  - Muzică ambientală medievală (loop)
  - SFX: pași pe iarbă, deschidere mesaj, click buton, criptare reușită
- ❌ **Iconițe specifice email/internet** (plic, @, virus, firewall) → poți folosi `Icon_01..12.png` și să le re-asociezi semantic, sau să adaugi iconițe gratuite din [Lucide](https://lucide.dev/) / [Game-Icons.net](https://game-icons.net/).
- ❌ **Font medieval** → recomand „MedievalSharp" sau „Pirata One" de pe Google Fonts (gratuite).

---

## 📂 Structura proiectului

```
regatul-mesajului/
├── README.md                 ← acest fișier
├── package.json
├── vite.config.js
├── index.html
├── public/
│   └── assets/               ← AICI muți tot conținutul folderului Assets/
│       ├── Buildings/
│       ├── Units/
│       ├── Terrain/
│       ├── Particle FX/
│       └── UI Elements/
└── src/
    ├── main.js               ← entry point Phaser
    ├── config.js             ← config global (dimensiuni frame, viteză etc.)
    ├── scenes/
    │   ├── BootScene.js      ← preload assets, loading bar
    │   ├── MenuScene.js      ← meniu principal („Începe aventura")
    │   ├── GameScene.js      ← scena principală — satul + jucătorul
    │   ├── DialogScene.js    ← UI dialog NPC (overlay)
    │   ├── QuestScene.js     ← scena pentru fiecare mini-joc
    │   └── EndingScene.js    ← animația finală cu arcașul + Regatul Roșu
    ├── entities/
    │   ├── Player.js         ← clasa jucătorului (Pawn cu mișcare WASD)
    │   ├── NPC.js            ← clasa de bază pentru NPC-uri
    │   └── Building.js       ← clădiri cu trigger zones
    ├── quests/
    │   ├── QuestManager.js   ← state machine pentru toate quest-urile
    │   ├── Quest_Email.js    ← quest 1 — Regele
    │   ├── Quest_Address.js  ← quest 2 — agendă adrese
    │   ├── Quest_Folders.js  ← quest 3 — sortare mail
    │   ├── Quest_Attach.js   ← quest 4 — atașare fișiere
    │   ├── Quest_Crypto.js   ← quest 5 — criptare + semnătură
    │   ├── Quest_Firewall.js ← quest 6 — tower defense viruși
    │   ├── Quest_Etiquette.js← quest 7 — politețe + legislație
    │   ├── Quest_Chat.js     ← quest 8 — emoticons / IRC
    │   └── Quest_Search.js   ← quest 9 — motor căutare
    ├── ui/
    │   ├── Inventory.js      ← inventar (item-e adunate)
    │   ├── DialogBox.js      ← componenta de dialog (papyrus + portret)
    │   └── HUD.js            ← bară progres, mini-map
    └── data/
        ├── npcs.json         ← textele NPC-urilor
        ├── quests.json       ← config quest-uri
        └── emails.json       ← exemple de mail-uri pentru sortare
```

---

## 🚀 Instalare și rulare

### Cerințe

- **Node.js** ≥ 18
- **npm** (vine cu Node)
- Un browser modern (Chrome, Firefox, Edge)

### Pași

```bash
# 1. Creează folderul proiectului
mkdir regatul-mesajului && cd regatul-mesajului

# 2. Inițializează proiectul cu Vite (template vanilla JS)
npm create vite@latest . -- --template vanilla

# 3. Instalează Phaser 3
npm install phaser

# 4. Copiază asset-urile
mkdir -p public/assets
cp -r /cale/catre/Assets/* public/assets/

# 5. Pornește serverul de dev
npm run dev
```

Vite va deschide jocul la `http://localhost:5173`.

### Pentru build de producție (deploy pe Netlify)

```bash
npm run build
# folderul `dist/` conține tot ce trebuie urcat pe Netlify
```

---

## 🛠 Implementare pas cu pas

Recomand să implementezi în această ordine — fiecare etapă e demonstrabilă.

### Etapa 1 — Skeleton (zilele 1–2)
- [ ] `BootScene` cu loading bar (folosește `BigBar_Base.png` + `BigBar_Fill.png`)
- [ ] `MenuScene` cu titlu pe `Banner.png` și buton „Începe" (`BigBlueButton_Regular.png`)
- [ ] `GameScene` minimal: harta cu `Tilemap_color1.png` + Pawn-ul jucătorului care se mișcă

### Etapa 2 — Sat și NPC-uri (zilele 3–4)
- [ ] Plasează cele 8 clădiri din **Blue Buildings**
- [ ] Adaugă 8 NPC-uri statice (sprite Idle al unității asociate)
- [ ] Implementează **trigger zones** + prompt „Apasă E pentru a vorbi"

### Etapa 3 — Sistem dialog (zilele 5–6)
- [ ] `DialogScene` cu `RegularPaper.png` ca background
- [ ] Avatar NPC din `Human Avatars/` în colțul stânga-sus
- [ ] Text typewriter (litere afișate progresiv)
- [ ] Buton „Continuă" (`SmallBlueRoundButton_Regular.png`)

### Etapa 4 — Inventar și quest tracker (zilele 7–8)
- [ ] HUD jos cu `Wood Table` ca background
- [ ] Slot-uri inventar cu iconițe (`Icon_01..12.png`)
- [ ] Marker quest deasupra NPC-urilor active (un `!` sau un mic banner)

### Etapa 5 — Quest-urile (zilele 9–18)
- [ ] Implementează quest-urile 1–9 (cca. 1 zi/quest, vezi sec. *Sistem de quest-uri*)

### Etapa 6 — Final și polish (zilele 19–20)
- [ ] `EndingScene` — arcașul trage săgeata, camera urmărește săgeata până la Castelul Roșu
- [ ] Particule (foc la torțe, praf la mers, splash în apă)
- [ ] Sunete și muzică
- [ ] Salvare progres în `localStorage`

---

## 🎞 Configurare animații (sprite-sheets)

Toate sprite-urile Tiny Swords sunt **sprite-sheets pe orizontală**. Tabel rapid:

| Animație | Frame size | Nr. frame-uri | FPS recomandat |
|---|---|---|---|
| Pawn_Idle | 192×192 | 8 | 8 |
| Pawn_Run | 192×192 | 6 | 12 |
| Pawn_Interact_*  | 192×192 | 6 | 10 |
| Warrior_Idle | 192×192 | 8 | 8 |
| Warrior_Run | 192×192 | 6 | 12 |
| Warrior_Attack1 | 192×192 | 4 | 10 |
| Archer_Run | 192×192 | 4 | 10 |
| Archer_Shoot | 192×192 | 8 | 12 |
| Monk_Heal | 192×192 | 11 | 12 |
| Lancer_Idle | **320×320** | 12 | 10 |
| Sheep_Idle | 128×128 | 6 | 6 |
| Sheep_Move | 128×128 | 4 | 10 |

### Exemplu de încărcare în Phaser (BootScene.js)

```js
preload() {
  // Pawn jucător (albastru)
  this.load.spritesheet('pawn-blue-idle',
    'assets/Units/Blue Units/Pawn/Pawn_Idle.png',
    { frameWidth: 192, frameHeight: 192 });

  this.load.spritesheet('pawn-blue-run',
    'assets/Units/Blue Units/Pawn/Pawn_Run.png',
    { frameWidth: 192, frameHeight: 192 });

  // Lancer (atenție: 320, nu 192!)
  this.load.spritesheet('lancer-blue-idle',
    'assets/Units/Blue Units/Lancer/Lancer_Idle.png',
    { frameWidth: 320, frameHeight: 320 });

  // Clădiri (imagini single, nu sprite-sheets)
  this.load.image('castle-blue', 'assets/Buildings/Blue Buildings/Castle.png');
  this.load.image('house1-blue', 'assets/Buildings/Blue Buildings/House1.png');
  // ... etc.
}

create() {
  // Definirea animațiilor o singură dată
  this.anims.create({
    key: 'pawn-idle',
    frames: this.anims.generateFrameNumbers('pawn-blue-idle', { start: 0, end: 7 }),
    frameRate: 8,
    repeat: -1,
  });

  this.anims.create({
    key: 'pawn-run',
    frames: this.anims.generateFrameNumbers('pawn-blue-run', { start: 0, end: 5 }),
    frameRate: 12,
    repeat: -1,
  });

  this.scene.start('MenuScene');
}
```

---

## 📜 Sistem de quest-uri

### Structură de date (`src/data/quests.json`)

```json
{
  "quest_email": {
    "id": "quest_email",
    "title": "Misiunea Regelui",
    "subject": "Citirea si trimiterea unui mesaj",
    "npc": "rege",
    "location": "castle",
    "required": true,
    "reward_item": "scrisoare_regala",
    "next": ["quest_address","quest_folders","quest_attach","quest_crypto","quest_firewall","quest_etiquette","quest_chat","quest_search"]
  },
  "quest_address": {
    "id": "quest_address",
    "title": "Agenda Scribului",
    "subject": "Folosirea agendei de adrese",
    "npc": "scrib",
    "location": "house1",
    "required": false,
    "reward_item": "adresa_corecta"
  }
}
```

### Item-e necesare pentru a trimite mail-ul (final)

Un mail poate fi trimis doar dacă jucătorul are **toate** item-ele:

| Item | Provine de la | Reprezintă |
|---|---|---|
| `scrisoare_regala` | Rege | Mesajul de bază |
| `adresa_corecta` | Scrib | Adresa destinatarului |
| `mail_sortat` | Bibliotecară | Inbox curat |
| `fisier_atasat` | Trimis | Atașament |
| `cifru_si_stampila` | Călugăr | Criptare + semnătură |
| `pana_firewall` | Străjer | Protecție viruși |
| `manual_eticheta` | Sergent | Adresare politicoasă |
| `lista_smileys` | Arcaș | Cunoaștere chat |
| `referat_documentat` | Oițe (cercetare) | Conținut verificat |

---

## 🖥 Interfață utilizator

Ghid scurt pentru aplicarea consistentă a UI-ului:

| Element | Asset | Note |
|---|---|---|
| Background dialog | `Papers/RegularPaper.png` | Pentru text NPC obișnuit |
| Background quest important | `Papers/SpecialPaper.png` | Pentru quest-uri date de Rege |
| Buton primary | `Buttons/BigBlueButton_Regular.png` | „Continuă", „Acceptă" |
| Buton danger / cancel | `Buttons/BigRedButton_Regular.png` | „Renunță", „Închide" |
| Avatar NPC | `Human Avatars/Avatars_XX.png` | 256×256 — alocă unul fix per NPC |
| Cursor | `Cursors/Cursor_01.png` | Setează prin CSS `cursor: url(...)` |
| Iconițe inventar | `Icons/Icon_01..12.png` | 64×64 — alocă semnificații în config |

### Mapare iconițe → semnificație (sugestie)

Decide tu cu ce iconiță reprezinți fiecare item după ce te uiți la `Icon_01..12.png`,
apoi documentează în `src/data/icons.json`:

```json
{
  "scrisoare_regala": "Icon_01",
  "adresa_corecta": "Icon_02",
  "mail_sortat": "Icon_03",
  "fisier_atasat": "Icon_04",
  "cifru_si_stampila": "Icon_05",
  "pana_firewall": "Icon_06",
  "manual_eticheta": "Icon_07",
  "lista_smileys": "Icon_08",
  "referat_documentat": "Icon_09"
}
```

---

## 💾 Salvare progres

Folosește `localStorage` (consistent cu abordarea ta din alte proiecte web).

```js
// salvare
localStorage.setItem('regatul_mesajului_save', JSON.stringify({
  questsCompleted: ['quest_email', 'quest_address'],
  inventory: ['scrisoare_regala', 'adresa_corecta'],
  playerPos: { x: 400, y: 300 },
  timestamp: Date.now()
}));

// încărcare la pornire
const save = JSON.parse(localStorage.getItem('regatul_mesajului_save') || 'null');
```

> 💡 Adaugă în meniul principal un buton „Reia jocul" (vizibil doar dacă există save)
> și „Joc nou" (care șterge save-ul cu o confirmare).

---

## 🌐 Distribuire către elevi

Stă perfect pe **Netlify** (cum ai și celelalte proiecte). Pași:

1. `npm run build` → generează `dist/`
2. Drag & drop folderul `dist/` pe [app.netlify.com](https://app.netlify.com/drop)
3. Primești un URL gen `regatul-mesajului.netlify.app`
4. URL-ul îl dai elevilor — funcționează în orice browser, fără instalare

**Variantă lab fără internet:** copiază `dist/` pe stick USB și deschide `index.html`
(funcționează offline după build, pentru că Phaser e inclus în bundle).

---

## 🎯 Idei de evaluare a elevilor

- **Pe parcurs:** observă în direct la ce quest-uri se blochează (probabil ai nevoie să verifici
  acel concept din capitol din nou).
- **La final:** elevul îți arată screenshot-ul cu mail-ul trimis (scena `EndingScene`).
- **Scor:** poți afișa un scor bazat pe „număr de încercări per quest" pentru competiție clasă.
- **Rubrică propusă:** 9 quest-uri × 1 punct + 1 punct din oficiu = 10.

---

## 🔮 TODO și extensii

### Must-have (pentru v1)
- [ ] Toate cele 9 quest-uri funcționale
- [ ] Salvare progres
- [ ] Animație finală (arcaș + Regatul Roșu)
- [ ] Texte în română **fără diacritice** (consistent cu materialele tale de clasă)

### Nice-to-have (pentru v1.1+)
- [ ] **Multi-jucător local** (Among Us-style — exact ca proiectul tău anterior 😉) — un elev e „virusul" și trebuie să interfereze cu ceilalți
- [ ] **Modul „Profesor"** — dashboard cu progresul tuturor elevilor (necesită backend)
- [ ] **Dificultate variabilă** — quest-urile au 3 niveluri de dificultate (texte/întrebări diferite)
- [ ] **Voice-over** pentru NPC-uri (TTS în română)
- [ ] **Mod accesibilitate** — text mai mare, contrast crescut, navigare doar cu tastatură

### Extensii la programa școlară
- [ ] Adaugă quest pentru **Telefonie IP** (dialog video stilizat cu un NPC din Regatul Roșu)
- [ ] Adaugă quest pentru **Video conferință** (NetMeeting → Discord/Meet în vremurile noastre)
- [ ] Easter egg: 🦆 **Rubber Duck** ascuns în sat (referință la rubber duck debugging)

---

## 📄 Licențe

- **Asset pack:** [Tiny Swords by Pixel Frog](https://pixelfrog-assets.itch.io/tiny-swords) — verifică licența pe pagina autorului (în general permite uz non-comercial educațional gratuit).
- **Cod:** alege tu (recomand MIT pentru proiecte educaționale).
- **Texte și quest design:** © Muraru Silviu-Andrei, 2026.

---

## 🙏 Mulțumiri

Asset-uri de la **Pixel Frog** (Tiny Swords).
Proiect realizat pentru elevii Colegiului Tehnic de Căi Ferate „Unirea", Pașcani.

> *„Mesajul nu pleaca singur — trebuie sa-l ajutam noi sa traverseze regatul!"* 🏰✉️
