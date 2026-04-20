import {
  Block,
  genDoor as genDoorBlock,
  genFeature,
  genTextBlock,
  genTP,
  WALL,
} from "./blocks";
import { displayNumber, displayRAM } from "./display";
import { NOTIFY } from "./notify";
import { hardReset, player } from "./player";
import { UPGRADES } from "./upgrades";

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
    let t = x.split("?");
    if (t[0] === "FEAT") return writeToCache(genFeature(t), x);
    else {
      if (t[2] == "runprog") {
        return newBlockAndCache(() => {
          return new (class extends Block {
            color = "#00ffffff";
            content = t[1];
            textcolor = "#000000";
            onTouch(): [remove: boolean] {
              NOTIFY.expires = Date.now() + 1000;
              NOTIFY.content = "运行程序失败";
              return [false];
            }
          })();
        }, x);
      }
    }
  }

  if (x.startsWith("TP")) {
    return writeToCache(genTP(x.split("?")), x);
  }
  if (x == "EXPORT") {
    return newBlockAndCache(() => {
      return new (class extends Block {
        color = "rgba(255, 0, 230, 1)";
        content = "导出";
        textcolor = "#000000";
        solid() {
          return false;
        }
      })();
    }, x);
  }
  if (x == "IMPORT") {
    return newBlockAndCache(() => {
      return new (class extends Block {
        color = "rgba(0, 255, 76, 1)";
        content = "导入";
        textcolor = "#000000";
        solid() {
          return false;
        }
      })();
    }, x);
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
  if (x.startsWith("UPGRADE")) {
    let part = x.slice(8);
    return newBlockAndCache(() => {
      return new (class extends Block {
        color = "#00ff51ff";
        textcolor = "#000000";
        contentDynamic(): string {
          let cost = UPGRADES[part].cost();
          return (
            UPGRADES[part].content +
            "\n" +
            (cost == 1 / 0
              ? "已购买"
              : "价格:" +
                displayNumber(UPGRADES[part].cost()) +
                UPGRADES[part].currency)
          );
        }
        onTouch(): [remove: boolean, replaceTo?: string] {
          UPGRADES[part].onBuy();
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
          return displayNumber(player.points);
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
          return displayRAM(player.ram);
        }
        textcolor = "#ffffff";
      })();
    }, x);
  }
}
