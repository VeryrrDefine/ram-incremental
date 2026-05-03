import Decimal from "break_eternity.js";
import { dimLoop } from "./dimension";
import { player } from "./player";

export function ramGain(): Decimal {
  let base = new Decimal(0);
  if (player.features.includes("auto1")) {
    base = base.add(1);
  }
  if (player.upgrades["17_7"]) {
    base = base.add(player.upgrades["17_7"] ?? 0);
  }
  if (player.upgrades["19_7"]) {
    base = base.add(player.points.pow(0.5));
  }
  if (player.upgrades["20_7"]) {
    base = base.add(player.ram.div(1024).pow(0.3).clampMin(1));
  }
  return base;
}

export function pointGain(): Decimal {
  let base = new Decimal(0);
  if (player.upgrades["16_7"]) {
    base = base.add(player.upgrades["16_7"] ?? 0);
  }
  if (player.upgrades["17_7"]) {
    base = base.add(player.upgrades["17_7"] ?? 0);
  }
  if (player.upgrades["20_8"]) {
    base = base.mul(player.ram.clampMin(1).log10().clampMin(1));
    // base *= Math.max(1, Math.log10(Math.max(player.ram, 1)));
  }
  return base;
}
export function loop() {
  player.editing = false;
  let ticks = (Date.now() - player.lastTick) / 1000;
  if (ticks < 0) {
    player.lastTick = Date.now();
    ticks = (Date.now() - player.lastTick) / 1000;
  }
  if (player.upgrades["16_7"] || player.upgrades["17_7"]) {
    let pGain = pointGain();
    player.points = player.points.add(pGain.mul(ticks));
  }
  let gain = ramGain();
  if (gain.gt(0)) {
    player.ram = player.ram.add(gain.mul(ticks));
  }
  if (player.features.includes("25_1") && player.x == 26 && player.y == 1) {
    player.replaces.push([25, -1, "NULL"]);
    player.replaces.push([25, 1, "NPC?Endless_e19728"]);
  }
  if (player.features.includes("25_1") && player.x == 27 && player.y == 1) {
    player.replaces.push([25, 1, "NULL"]);
    player.replaces.push([26, 1, "NPC?Endless_e19728"]);
  }
  if (player.features.includes("25_1") && player.y == 1)
    for (let i = 28; i <= 36; i++) {
      if (player.x == i) {
        player.replaces.push([i - 2, 1, "NULL"]);
        player.replaces.push([i - 1, 1, "NPC?Endless_e19728"]);
      }
    }

  let block_Replaces: string[] = [];
  for (let i = player.replaces.length - 1; i >= 0; i--) {
    let repl = player.replaces[i];
    // debugger;
    let mid = repl[0] + "," + repl[1];
    if (block_Replaces.includes(mid)) {
      player.replaces.splice(i, 1);
    } else {
      block_Replaces.push(mid);
    }
  }
  dimLoop(ticks);
  player.lastTick = Date.now();
}
