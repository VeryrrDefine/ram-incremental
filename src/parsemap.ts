import {
  Block,
  genDoor as genDoorBlock,
  genFeature,
  genTextBlock,
  genTP,
  WALL,
} from "./blocks";
import { hardReset, player } from "./player";

const blockDataCache: Map<string, Block> = new Map();

function writeToCache(block: Block, x: string) {
  blockDataCache.set(x, block);
  return block;
}
function newBlockAndCache(block: () => Block, x: string) {
  let q = block();
  blockDataCache.set(x, q);
  return q;
}

export function blockDataToBlock(x: string) {
  if (x === "WALL") return WALL;
  if (x === "NULL") return null;
  if (blockDataCache.has(x)) return blockDataCache.get(x);

  if (x.startsWith("TEXT")) {
    return writeToCache(genTextBlock(x.slice(5)), x);
  }
  if (x.startsWith("DOOR")) {
    return writeToCache(genDoorBlock(x.slice(5)), x);
  }
  if (x.startsWith("FEAT")) {
    return writeToCache(genFeature(x.split("?")), x);
  }
  if (x.startsWith("TP")) {
    return writeToCache(genTP(x.split("?")), x);
  }
  if (x == "HARDRESET") {
    return newBlockAndCache(() => {
      return new (class extends Block {
        color = "rgba(255, 0, 0, 1)";
        content = "硬重置";
        textcolor = "#000000";
        solid() {
          return false;
        }
        onTouch(): [remove: boolean] {
          player.x = -56;
          player.y = -56;
          return [false];
        }
      })();
    }, x);
  }
  if (x == "HARDRESET2") {
    return newBlockAndCache(() => {
      return new (class extends Block {
        color = "rgba(255, 0, 0, 1)";
        content = "是";
        textcolor = "#000000";
        solid() {
          return false;
        }
        onTouch(): [remove: boolean] {
          hardReset();
          return [false];
        }
      })();
    }, x);
  }
  if (x == "POINTS") {
    return newBlockAndCache(() => {
      return new (class extends Block {
        color = "#000000";
        contentDynamic() {
          return player.points.toFixed(3);
        }
        textcolor = "#ffffff";
      })();
    }, x);
  }
  if (x == "RAM") {
    return newBlockAndCache(() => {
      return new (class extends Block {
        color = "#000000";
        contentDynamic() {
          return "8 KB";
        }
        textcolor = "#ffffff";
      })();
    }, x);
  }
}
