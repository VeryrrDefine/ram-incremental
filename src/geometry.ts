// geometry.ts
export const GRIDSIZE = 80;

/** 地图绝对位置 -> canvas 相对位置（9x9 视口，玩家居中） */
export function worldToCanvas(
  playerX: number,
  playerY: number,
  worldX: number,
  worldY: number,
): [number, number] {
  return [worldX - playerX + 4, worldY - playerY + 4];
}

/** canvas 相对位置 -> 地图绝对位置 */
export function canvasToWorld(
  playerX: number,
  playerY: number,
  canvasCol: number,
  canvasRow: number,
): [number, number] {
  return [canvasCol - 4 + playerX, canvasRow - 4 + playerY];
}

export { isInRect } from "./rect.ts";
