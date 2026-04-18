import type { GameMap } from "./map";

function initialPlayer() {
  return {
    x: 1,
    y: 1,
    openedMenu: false,
    editing: false,
    configurationOrder: 0,
    addArrowButton: true,
    replaces: [] as GameMap,
    replaces_Universe: [[]] as GameMap[],
    universe: -1, // -1: Main Universe, 0: Sub universe
    features: [] as string[],
    points: 0,
    saveCreateTime: Date.now(),
    lastTick: Date.now(),
    ram: 8192,
  };
}

export let player = initialPlayer();
const SAVE_ID = "test-game-2";
export function save() {
  localStorage.setItem(SAVE_ID, JSON.stringify(player));
}

export function load() {
  let target = localStorage.getItem(SAVE_ID);
  if (target === null) {
  } else {
    Object.assign(player, JSON.parse(target));
  }
}

load();
export function hardReset() {
  Object.assign(player, initialPlayer());
  save();
}
