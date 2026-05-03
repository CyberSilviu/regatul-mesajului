export const GAME_WIDTH = 1280;
export const GAME_HEIGHT = 720;
export const WORLD_WIDTH = 3200;
export const WORLD_HEIGHT = 2400;
export const PLAYER_SPEED = 160;
export const INTERACTION_RADIUS = 95;
export const SAVE_KEY = 'regatul_mesajului_save';

export const BUILDING_DATA = {
  castle:    { key: 'castle-blue',    w: 320, h: 256 },
  house1:    { key: 'house1-blue',    w: 128, h: 192 },
  house2:    { key: 'house2-blue',    w: 128, h: 192 },
  house3:    { key: 'house3-blue',    w: 128, h: 192 },
  monastery: { key: 'monastery-blue', w: 192, h: 320 },
  tower:     { key: 'tower-blue',     w: 128, h: 256 },
  barracks:  { key: 'barracks-blue',  w: 192, h: 256 },
  archery:   { key: 'archery-blue',   w: 192, h: 256 }
};

export const NPC_CONFIG = {
  rege: {
    name: 'Regele Albastru',
    sprite: 'warrior-blue-idle',
    questId: 'quest_email',
    x: 1600, y: 490,
    avatarKey: 'avatar-01',
    building: 'castle',
    buildingX: 1600, buildingY: 280
  },
  scrib: {
    name: 'Scribul',
    sprite: 'pawn-blue-idle',
    questId: 'quest_address',
    x: 500, y: 690,
    avatarKey: 'avatar-03',
    building: 'house1',
    buildingX: 500, buildingY: 550
  },
  bibliotecara: {
    name: 'Bibliotecara',
    sprite: 'monk-blue-idle',
    questId: 'quest_folders',
    x: 820, y: 880,
    avatarKey: 'avatar-06',
    building: 'house2',
    buildingX: 820, buildingY: 740
  },
  trimis: {
    name: 'Trimisul Curierat',
    sprite: 'pawn-blue-idle',
    questId: 'quest_attach',
    x: 1300, y: 760,
    avatarKey: 'avatar-05',
    building: 'house3',
    buildingX: 1300, buildingY: 620
  },
  calugar: {
    name: 'Calugar Criptograf',
    sprite: 'monk-blue-idle',
    questId: 'quest_crypto',
    x: 350, y: 1330,
    avatarKey: 'avatar-08',
    building: 'monastery',
    buildingX: 350, buildingY: 1100
  },
  strajer: {
    name: 'Strajerul',
    sprite: 'lancer-blue-idle',
    questId: 'quest_firewall',
    x: 2550, y: 640,
    avatarKey: 'avatar-10',
    building: 'tower',
    buildingX: 2550, buildingY: 460
  },
  sergent: {
    name: 'Sergentul',
    sprite: 'warrior-blue-idle',
    questId: 'quest_etiquette',
    x: 2100, y: 1070,
    avatarKey: 'avatar-12',
    building: 'barracks',
    buildingX: 2100, buildingY: 900
  },
  arcas: {
    name: 'Arcasul',
    sprite: 'archer-blue-idle',
    questId: 'quest_chat',
    x: 1750, y: 1410,
    avatarKey: 'avatar-14',
    building: 'archery',
    buildingX: 1750, buildingY: 1260
  },
  cioban: {
    name: 'Ciobanul',
    sprite: 'pawn-blue-idle',
    questId: 'quest_search',
    x: 750, y: 1600,
    avatarKey: 'avatar-16',
    building: null,
    buildingX: null, buildingY: null
  }
};

export const QUEST_REWARDS = {
  quest_email:     { item: 'scrisoare_regala',   name: 'Scrisoarea Regala',   icon: 'icon-01' },
  quest_address:   { item: 'adresa_corecta',     name: 'Adresa Corecta',      icon: 'icon-02' },
  quest_folders:   { item: 'mail_sortat',        name: 'Mailul Sortat',       icon: 'icon-03' },
  quest_attach:    { item: 'fisier_atasat',       name: 'Fisierul Atasat',     icon: 'icon-04' },
  quest_crypto:    { item: 'cifru_si_stampila',  name: 'Cifru si Stampila',   icon: 'icon-05' },
  quest_firewall:  { item: 'pana_firewall',      name: 'Pana Firewall',       icon: 'icon-06' },
  quest_etiquette: { item: 'manual_eticheta',    name: 'Manual Eticheta',     icon: 'icon-07' },
  quest_chat:      { item: 'lista_smileys',      name: 'Lista Smileys',       icon: 'icon-08' },
  quest_search:    { item: 'referat_documentat', name: 'Referatul Documentat', icon: 'icon-09' }
};
