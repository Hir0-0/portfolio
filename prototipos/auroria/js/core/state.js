// js/core/state.js — v0.0.5
// Fonte única de verdade. Nunca modificar diretamente — usar mutadores.
//
// PATCH v0.0.5.1 (reprovação → correção):
//  [item 6] getCurrentTileDesc removida — função morta, sem uso no projeto.
//
// NOVO (v0.0.4 → v0.0.5):
//  STATE.dungeon            — rastreia a expedição em curso ({ active, depth }),
//                              sem sobrecarregar STATE.map.type com essa informação.
//  STATE.overworldSnapshot  — referência completa do overworld salva antes de
//                              entrar na dungeon; restaurada ao retornar, em vez
//                              de regenerar o overworld do zero (mundo persistente).

// [BUG-11] Fonte única de mapeamento tecla→slot de skill. Antes, engine.js (onKey)
// e hud.js (renderSkillsBar) tinham arrays Q/W/E/R hard-coded separadamente — adicionar
// uma 5ª skill exigia editar os dois arquivos manualmente. Agora ambos consomem esta
// mesma constante, dimensionada dinamicamente a partir de STATE.player.skills.length.
// Para suportar mais de 6 skills no futuro, basta estender este array.
const SKILL_KEYS = ["q", "w", "e", "r", "f", "v"];

const STATE = {
  version: "0.0.5",
  gamePhase: "MENU", // MENU | PLAYING | DEAD | WIN | PAUSE

  turn: 0,
  seed: 0,

  // [v0.0.5] Rastreia a expedição à dungeon em curso. `active=false` enquanto
  // o jogador está no overworld. `depth` é a profundidade atual (1..MAX_DEPTH)
  // quando active=true. Mantido separado de map.type para não sobrecarregar
  // um único campo com duas responsabilidades (tipo de mapa vs. progresso de expedição).
  dungeon: { active: false, depth: 0 },

  // [v0.0.5] Snapshot completo do overworld, salvo no momento em que o jogador
  // entra na dungeon pela primeira vez numa expedição. Permite restaurar o
  // overworld EXATAMENTE como estava (tiles explorados, entidades remanescentes,
  // itens no chão, posição de retorno) em vez de regenerá-lo — o mundo persiste.
  // null enquanto o jogador nunca entrou em uma dungeon nesta sessão/save.
  overworldSnapshot: null,

  map: {
    type: "overworld",
    id: "rusted_plains",
    width: 80,
    height: 60,
    tiles: [],
    entities: [],
    items: [],
    stairs: [],
    entrance: { x: 0, y: 0 }
  },

  player: {
    x: 0, y: 0,
    char: "@",
    color: "#F0E68C",
    name: "Explorador",
    level: 1,
    xp: 0,
    xpToNext: 30,
    hp: 30, maxHp: 30,
    energy: 40, maxEnergy: 40,
    attack: 3,
    defense: 1,
    equipment: { weapon: null, offhand: null }, // armazena itemId (string) ou null
    inventory: [],   // array de itemId (strings)
    maxInventory: 12,
    skills: ["solar_burst", "crystal_shield", "steam_dash", "vine_mend", "phase_blink"],
    skillCooldowns: {},
    activeShield: 0,
    floorsVisited: 0,
    kills: 0,
    itemsFound: 0
  },

  log: [],
  maxLog: 80,

  defs: { enemies: {}, items: {}, skills: {} },

  camera: { x: 0, y: 0, width: 60, height: 28 },

  ui: {
    selectedSkill: null,
    targetingMode: false,
    inventoryOpen: false,
    selectedInventoryIdx: 0,
    pauseOpen: false,
    // Tooltip do tile clicado
    tileInfo: null  // { tile, entity, item, x, y } | null
  }
};

// ── Mutadores ──────────────────────────────────────────────────────────────

function addLog(text, color = "#D5D8DC") {
  STATE.log.unshift({ text, color, turn: STATE.turn });
  if (STATE.log.length > STATE.maxLog) STATE.log.pop();
}

// CORRIGIDO: resolve o itemId para o objeto def antes de pegar o bônus
function getPlayerAttack() {
  const p = STATE.player;
  const wpnId = p.equipment.weapon;
  const wpnBonus = wpnId ? (STATE.defs.items[wpnId]?.attackBonus || 0) : 0;
  return p.attack + wpnBonus;
}

function getPlayerDefense() {
  const p = STATE.player;
  const offId = p.equipment.offhand;
  const offBonus = offId ? (STATE.defs.items[offId]?.defenseBonus || 0) : 0;
  return p.defense + offBonus;
}

function getTileAt(x, y) {
  const { map } = STATE;
  if (x < 0 || y < 0 || x >= map.width || y >= map.height) return null;
  return map.tiles[y]?.[x] || null;
}

function getEntityAt(x, y) {
  return STATE.map.entities.find(e => e.x === x && e.y === y && e.hp > 0) || null;
}

function getItemAt(x, y) {
  return STATE.map.items.find(i => i.x === x && i.y === y) || null;
}

function removeItemFromMap(x, y, itemId) {
  // Remove o primeiro item que bate no tile (ou filtra por id se fornecido)
  const idx = STATE.map.items.findIndex(i => i.x === x && i.y === y && (!itemId || i.id === itemId));
  if (idx !== -1) STATE.map.items.splice(idx, 1);
}

function removeEntity(entity) {
  const idx = STATE.map.entities.indexOf(entity);
  if (idx !== -1) STATE.map.entities.splice(idx, 1);
}

function isPassable(x, y, ignoreEntities = false) {
  const tile = getTileAt(x, y);
  if (!tile || !tile.passable) return false;
  if (!ignoreEntities && getEntityAt(x, y)) return false;
  return true;
}

function advanceTurn() {
  STATE.turn++;
  if (STATE.turn % 4 === 0 && STATE.player.energy < STATE.player.maxEnergy) {
    STATE.player.energy = Math.min(STATE.player.maxEnergy, STATE.player.energy + 1);
  }
}

function playerGainXP(amount) {
  const p = STATE.player;
  p.xp += amount;
  while (p.xp >= p.xpToNext) {
    p.xp -= p.xpToNext;
    p.level++;
    p.xpToNext = Math.floor(p.xpToNext * 1.6);
    p.maxHp += 5;
    p.hp = Math.min(p.hp + 5, p.maxHp);
    p.maxEnergy += 5;
    p.attack += 1;
    addLog(`✦ Nível ${p.level}! Poder aumentado!`, "#F1C40F");
  }
}

export {
  STATE, SKILL_KEYS, addLog, getPlayerAttack, getPlayerDefense,
  getTileAt, getEntityAt, getItemAt, removeItemFromMap,
  removeEntity, isPassable, advanceTurn, playerGainXP
};
