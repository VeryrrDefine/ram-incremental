// collision.ts
import type { Block } from "./blocks";
import { blockDataToBlock } from "./parsemap";
import { player } from "./gameState";
import { getMapOfUniverse, getReplaceMapOfUniverse } from "./universe";

export function getBlockData(x: number, y: number): string | undefined | null {
  // 先检查是否有临时替换（例如门被打开后替换为 NULL）
  const replaced = getReplaceMapOfUniverse(player.universe).find(
    ([rx, ry]) => rx === x && ry === y,
  );
  if (replaced) {
    return replaced[2];
  }

  // 再查静态地图
  const mapEntry = getMapOfUniverse(player.universe).find(
    ([mx, my]) => mx === x && my === y,
  );
  if (!mapEntry) return "NULL";
  return mapEntry[2];
}
/**
 * 获取指定坐标的方块（优先使用 replaces 中的临时替换）
 */
export function getBlock(x: number, y: number): Block | null | undefined {
  let bl = getBlockData(x, y);
  if (!bl) return null;
  return blockDataToBlock(bl);
}

/**
 * 判断某个坐标是否可通行（不是固体，且没有不可通行的特殊属性）
 */
export function passable(x: number, y: number): boolean {
  const block = getBlock(x, y);
  if (!block) return true; // 空气可通行
  // 如果方块有 solid 方法且返回 true 则不可通行
  if (typeof block.solid === "function") {
    return !block.solid();
  }
  // 默认方块不可通行（安全起见，但正常所有方块都应实现 solid）
  return false;
}
