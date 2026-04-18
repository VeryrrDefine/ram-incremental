import { map, map_parallel } from "./map";
import { player } from "./player";

export function getReplaceMapOfUniverse(x: number) {
  if (x == -1) return player.replaces;
  return player.replaces_Universe[x];
}

export function getMapOfUniverse(x: number) {
  if (x == -1) return map;
  return map_parallel[x];
}
