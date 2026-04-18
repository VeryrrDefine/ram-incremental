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
  player.lastTick = Date.now();
}
