import type { GameMap } from "./map";
import { TEMP } from "./temp";

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
    upgrades: {} as Record<string, number>,
    items: {
      purplecrystal: 1,
      doorkey_1: 0,
    } as Record<string, number>,
    thief_points: 0,
    thief_rams: 0,
    playername: "Player",
    generatorOpen: false,
  };
}

export let player = initialPlayer();
const SAVE_ID = "test-game-2";
export function save(info?: string) {
  if (TEMP.interact == 1 && info !== "force") return;
  localStorage.setItem(SAVE_ID, JSON.stringify(player));
  TEMP.lastSave = Date.now();
}

export function deepCopyProps(source: any, target: any) {
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      // 如果源对象的属性是对象或数组，则递归复制
      if (
        typeof source[key] === "object" &&
        // !(source[key] instanceof PowiainaNum) &&
        source[key] !== null
      ) {
        // 如果目标对象没有这个属性，或者属性是null，则创建一个新的
        if (
          !target.hasOwnProperty(key) ||
          target[key] == null ||
          Array.isArray(source[key]) !== Array.isArray(target[key])
        ) {
          target[key] = Array.isArray(source[key]) ? [] : {};
        }
        // 递归复制属性
        deepCopyProps(source[key], target[key]);
      } else {
        // 如果属性不是对象或数组，则直接复制
        target[key] = source[key];
      }
    }
  }
}

export function load() {
  let target = localStorage.getItem(SAVE_ID);
  if (target === null) {
  } else {
    deepCopyProps(JSON.parse(target), player);
    // Object.assign(player, JSON.parse(target));
  }
}

load();
export function hardReset() {
  Object.assign(player, initialPlayer());
  save("force");
  location.reload();
}
