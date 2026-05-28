import Decimal from "break_eternity.js";
import type { GameMap } from "./map";
import { TEMP } from "./temp";
import { isInRect } from "./rect";

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
    points: new Decimal(0),
    saveCreateTime: Date.now(),
    lastTick: Date.now(),
    ram: new Decimal(8192),
    upgrades: {} as Record<string, number>,
    items: {
      purplecrystal: 1,
      doorkey_1: 0,
    } as Record<string, number>,
    thief_points: new Decimal(0),
    thief_rams: new Decimal(0),
    playername: "Player",
    generatorOpen: false,
    lastwork: 0,
    // 0: Current, 1: Bought
    dimensions: [
      [new Decimal(0), new Decimal(0)],
      [new Decimal(0), new Decimal(0)],
      [new Decimal(0), new Decimal(0)],
      [new Decimal(0), new Decimal(0)],
    ],
    generatorUpgrades: {
      0: new Decimal(0),
    } as Record<number, Decimal>,
    changedColor: 0,
    l_points: new Decimal(0),
    l_ram: new Decimal(8192),
    r_points: new Decimal(0),
    r_ram: new Decimal(8192),
    lstatus: false,
    saveID: Math.floor(Math.random() * 2147483648),
    playerID: Math.floor(Math.random() * 2147483648),
    playerday: 0,
    worked: false,
  };
}

export let player = initialPlayer();
const SAVE_ID = "test-game-2";
export function save(info?: string) {
  if (TEMP.interact == 1 && info !== "force") return;
  player.features = [...new Set(player.features)];
  localStorage.setItem(SAVE_ID, JSON.stringify(player));
  TEMP.lastSave = Date.now();
}

export function deepCopyProps(source: any, target: any) {
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      // 如果源对象的属性是对象或数组，则递归复制
      if (
        typeof source[key] === "object" &&
        !(source[key] instanceof Decimal) &&
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
        if (target[key] instanceof Decimal) {
          target[key] = new Decimal(source[key]);
        }
        // 如果属性不是对象或数组，则直接复制
        else target[key] = source[key];
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
  if (
    isInRect(player.x, player.y, 37, -74, 250, 89) &&
    player.universe == -1 &&
    !isInRect(player.x, player.y, 37, -2, 42, 5) &&
    player.lstatus == false &&
    !TEMP.lstatus_check.detected
  ) {
    player.x = 37;
    player.y = 1;
  }
}

load();
export function hardReset() {
  Object.assign(player, initialPlayer());
  save("force");
  location.reload();
}
