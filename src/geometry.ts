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

/** 点是否在矩形区域内 */
export function isInRect(
  px: number,
  py: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): boolean {
  return px >= x1 && px <= x2 && py >= y1 && py <= y2;
}
