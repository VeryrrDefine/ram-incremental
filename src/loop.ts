import { player } from "./player";

export function loop() {
  let ticks = (Date.now() - player.lastTick) / 1000;
  if (ticks < 0) {
    player.lastTick = Date.now();
    ticks = (Date.now() - player.lastTick) / 1000;
  }
  if (player.features.includes("auto1")) {
    player.ram += 1 * ticks;
  }
  if (player.upgrades["16_7"]) {
    player.points += (player.upgrades["16_7"] ?? 0) * ticks;
  }
  if (player.upgrades["17_7"]) {
    player.ram += (player.upgrades["17_7"] ?? 0) * ticks;
  }
  if (player.upgrades["19_7"]) {
    player.ram += player.points * 0.07 * ticks;
  }
  player.lastTick = Date.now();
}
