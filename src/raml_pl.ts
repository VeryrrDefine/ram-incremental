import { player } from "./player";
import { TEMP } from "./temp";

export function ramL() {
  if (player.lstatus) return player.r_ram;
  return player.ram;
}
export function pL() {
  if (player.lstatus) return player.r_points;
  return player.points;
}

export function lstatus() {
  if (TEMP.interact == 1) return;
  if (TEMP.openeditem) return;
  if (!player.lstatus) {
    player.r_points = player.points;
    player.r_ram = player.ram;

    player.points = player.l_points;
    player.ram = player.l_ram;
  } else {
    player.points = player.r_points;
    player.ram = player.r_ram;
  }
  player.lstatus = !player.lstatus;
}
