import Decimal from "break_eternity.js";
import {
  Block,
  genDoor as genDoorBlock,
  genDoorInvis,
  genEnemy,
  genEvent,
  genFeature,
  genItem,
  genNPC,
  genTextBlock,
  genTP,
  INVISIBLEWALL,
  WALL,
} from "./blocks";
import { DIALOGUE } from "./dialogue";
import { displayNumber, displayRAM } from "./display";
import { hardReset, player } from "./player";
import { bed1_dreaming_1, bed2_dreaming_1 as bed2_dreaming_1 } from "./plot";
import { UPGRADES } from "./upgrades";
import { TEMP } from "./temp";
import { lstatus } from "./raml_pl";

const blockDataCache: Map<string, Block | null> = new Map();

function writeToCache(block: Block, x: string) {
  blockDataCache.set(x, block);
  return block;
}
function newBlockAndCache(block: () => Block | null, x: string) {
  let q = block();
  blockDataCache.set(x, q);
  return q;
}

export function blockDataToBlock(x: string) {
  if (x === "WALL") return WALL;
  if (x === "INVISIBLEWALL") return INVISIBLEWALL;
  if (x === "NULL") return null;
  if (blockDataCache.has(x)) return blockDataCache.get(x);

  if (x.startsWith("COLORFUL")) {
    return newBlockAndCache(function () {
      return new (class extends Block {
        color = x.slice(9);
        content: string = "";
        solid(): boolean {
          return true;
        }
      })();
    }, x);
  }
  if (x.startsWith("TEXT")) {
    return writeToCache(genTextBlock(x.slice(5)), x);
  }
  console.log(x);
  if (x.startsWith("DOORINVIS")) {
    let t = x.split("?");
    if (t[1]) {
      return newBlockAndCache(() => {
        return genDoorInvis(t[1]);
      }, x);
    }
  }
  if (x.startsWith("DOOR")) {
    return writeToCache(genDoorBlock(x.slice(5)), x);
  }
  if (x.startsWith("ITEM")) {
    let t = x.split("?");
    if (t[0] === "ITEM") return writeToCache(genItem(t), x);
  }
  if (x.startsWith("ENEMY")) {
    let t = x.split("?");
    if (t[1]) {
      return newBlockAndCache(() => {
        return genEnemy(t[1]);
      }, x);
    }
  }
  if (x.startsWith("FEAT")) {
    let t = x.split("?");
    if (t[0] === "FEAT") return writeToCache(genFeature(t), x);
    else {
      if (t[0] == "FEAT3") {
        return newBlockAndCache(() => {
          return genEvent(t[2]);
        }, x);
      }
      if (t[2] == "runprog") {
        return newBlockAndCache(() => {
          return new (class extends Block {
            color = "#00ffffff";
            content = t[1];
            textcolor = "#000000";
            onTouch(): [remove: boolean] {
              if (player.ram.gte(1e30)) {
                DIALOGUE.messages = [
                  "+ 正在运行程序 news ...",
                  "- ...",
                  "- ......",
                  "- .........",
                  "- 2085年4月19日 新闻报道：",
                  "- 近日，有一人因在黑市买物被捕",
                  "- 该人拒绝配合，越狱并将\n- Endless_e19728和1守卫打亖。",
                  "- 现该人下落不明，此人已被通鸡。\n- 有线索者奖励0.125 点数。",
                  "- 该人能力至少>=10GB，除8KB\n- 外全为illegal。",
                  "- ...",
                  "- ......",
                  "- .........",
                  "- 现在，井方已将该黑市通往的通道围堵。",
                  "- ...",
                  "- ......",
                  "- .........",
                  "- 新闻部 2085年4月19日",
                  "+ ...",
                  "+ 话说为啥那个神秘人，给我留了8KB\n+ RAM?",
                  "+ 等会儿，只有两人知道我的名字。",
                  "+ 大概换个颜色他们就认不出我了。",
                  "+ 等会儿...",
                  '+ ctx.fillStyle = "#ffc800ff"',
                  "+ 我真是个天才。",
                ];
                DIALOGUE.afterConversation = function () {
                  player.changedColor = 1;
                  player.features.push("changed_color");
                };
              } else {
                DIALOGUE.messages = ["- 运行程序失败"];
              }
              DIALOGUE.startConversation();
              return [false];
            }
          })();
        }, x);
      }
      if (t[2] == "nevergonnagiveyouup") {
        return newBlockAndCache(() => {
          return new (class extends Block {
            color = "#00ffffff";
            content = t[1];
            textcolor = "#000000";
            onTouch(): [remove: boolean] {
              location.href = "https://www.bilibili.com/video/BV1UT42167xb";
              return [false];
            }
          })();
        }, x);
      }
      if (t[2] == "bed1") {
        return newBlockAndCache(() => {
          return new (class extends Block {
            color = "#00ffffff";
            content = t[1];
            textcolor = "#000000";
            onTouch(): [remove: boolean] {
              if (player.features.includes("bed1_dreaming")) return [false];
              DIALOGUE.stillInteraction = true;
              DIALOGUE.messages = ["+ 睡觉..."];
              DIALOGUE.startConversation();
              player.features.push("bed1_dreaming");
              DIALOGUE.afterConversation = function () {
                bed1_dreaming_1();
              };
              return [false];
            }
          })();
        }, x);
      }
      if (t[2] == "bed2") {
        return newBlockAndCache(() => {
          return new (class extends Block {
            color = "#00ffffff";
            content = t[1];
            textcolor = "#000000";
            onTouch(): [remove: boolean] {
              if (player.features.includes("bed2_dreaming")) return [false];
              DIALOGUE.stillInteraction = true;
              DIALOGUE.messages = ["+ 睡觉..."];
              DIALOGUE.startConversation();
              player.features.push("bed2_dreaming");
              DIALOGUE.afterConversation = function () {
                bed2_dreaming_1();
              };
              return [false];
            }
          })();
        }, x);
      }
      //bed2_exit
      if (t[2] == "bed2_exit") {
        return newBlockAndCache(() => {
          return new (class extends Block {
            color = "#00ffffff";
            content = "?????";
            textcolor = "#000000";
            onTouch(): [remove: boolean] {
              TEMP.interact = 1;
              bed2_dreaming_1(false);
              // DIALOGUE.stillInteraction = true;
              // DIALOGUE.startConversation();
              // DIALOGUE.afterConversation = function () {
              // };
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
                (UPGRADES[part].currency == "RAM"
                  ? displayRAM(new Decimal(cost), false)
                  : displayNumber(new Decimal(cost))) +
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
  if (x == "CHANGE_L_STATUS") {
    return newBlockAndCache(() => {
      return new (class extends Block {
        color = "#000000";
        contentDynamic() {
          return "Change L\n Status\n" + (player.lstatus ? "ON" : "OFF");
        }
        textcolor = "#ffffff";
        onTouch(
          _objpos: [number, number],
        ): [remove: boolean, replaceTo?: string] {
          lstatus();
          return [false];
        }
      })();
    }, x);
  }
  if (x.startsWith("NPC?")) {
    return newBlockAndCache(() => genNPC(x.slice(4)), x);
  }
}
