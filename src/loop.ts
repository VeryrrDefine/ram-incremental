import { player } from "./player";

export function ramGain() {
  let base = 0;
  if (player.features.includes("auto1")) {
    base += 1;
  }
  if (player.upgrades["17_7"]) {
    base += player.upgrades["17_7"] ?? 0;
  }
  if (player.upgrades["19_7"]) {
    base += player.points ** 0.5;
  }
  if (player.upgrades["20_7"]) {
    base += Math.max(1, (player.ram / 1024) ** 0.3);
  }
  return base;
}

export function pointGain() {
  let base = 0;
  if (player.upgrades["16_7"]) {
    base += player.upgrades["16_7"] ?? 0;
  }
  if (player.upgrades["17_7"]) {
    base += player.upgrades["17_7"] ?? 0;
  }
  if (player.upgrades["20_8"]) {
    base *= Math.max(1, Math.log10(Math.max(player.ram, 1)));
  }
  return base;
}
export function loop() {
  let ticks = (Date.now() - player.lastTick) / 1000;
  if (ticks < 0) {
    player.lastTick = Date.now();
    ticks = (Date.now() - player.lastTick) / 1000;
  }
  if (player.upgrades["16_7"] || player.upgrades["17_7"]) {
    let pGain = pointGain();
    player.points += pGain * ticks;
  }
  let gain = ramGain();
  if (gain) {
    player.ram += ramGain() * ticks;
  }
  player.lastTick = Date.now();
}
