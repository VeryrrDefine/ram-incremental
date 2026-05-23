import { player } from "./player";

export function ramL() {
  if (player.lstatus) return player.r_ram;
  return player.ram;
}
export function pL() {
  if (player.lstatus) return player.r_points;
  return player.points;
}
