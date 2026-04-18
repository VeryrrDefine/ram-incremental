import { Block, genDoor as genDoorBlock, genTextBlock, WALL } from "./blocks";

const blockDataCache: Map<string, Block> = new Map();
export type GameMap = [x: number, y: number, block: string][];

function writeToCache(block: Block, x: string) {
  blockDataCache.set(x, block);
  return block;
}

export function blockDataToBlock(x: string) {
  if (x === "WALL") return WALL;
  if (blockDataCache.has(x)) return blockDataCache.get(x);

  if (x.startsWith("TEXT")) {
    return writeToCache(genTextBlock(x.slice(5)), x);
  }
  if (x.startsWith("DOOR")) {
    return writeToCache(genDoorBlock(x.slice(5)), x);
  }
}
