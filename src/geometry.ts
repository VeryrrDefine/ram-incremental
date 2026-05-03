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

export function stepsLinear(
  setFunc: (x: number) => void,
  from: number,
  to: number,
  time: number,
) {
  return new Promise((res) => {
    if (time <= 0) setFunc(to);
    let cur = from;
    let ticks = Math.floor(time / 50);
    let q = setInterval(() => {
      cur += (to - from) / ticks;
      setFunc(cur);
    }, 50);

    setTimeout(() => {
      clearInterval(q);
      setFunc(to);
    }, time);

    setTimeout(function () {
      res("");
    }, time + 1);
  });
}

// window.stepsLinear = stepsLinear;
