import { delay } from "./await";
import { DIALOGUE } from "./dialogue";
import { player } from "./player";
import {
  bed1_dreaming_1,
  Endless_e19728_trap,
  Endless_e19728_trap2,
  jail_breaking_door,
  jail_breaking_door_282_40,
  seeing_Endless_e19728,
} from "./plot";
import { TEMP } from "./temp";

export class Block {
  color = "#ffff00";
  content = "1e98";
  textcolor = "#000000";
  data: any;
  solid() {
    return false;
  }
  onTouch(): [remove: boolean, replaceTo?: string] {
    return [false];
  }
  solidInteractionable() {
    return false;
  }
  contentDynamic?(): string;
}
export const WALL = new Block();
WALL.color = "#ffffff";
WALL.content = "";
WALL.solid = () => true;

export const POINT_GENERATOR = new Block();
POINT_GENERATOR.color = "#00ffffff";
POINT_GENERATOR.content = "Point generator";

export const PLAYERBLOCK = new Block();
PLAYERBLOCK.color = "#008cffff";
PLAYERBLOCK.content = "Player";
PLAYERBLOCK.contentDynamic = function () {
  return player.playername;
};

export function genTextBlock(x: string) {
  let bl = new Block();
  bl.color = "#000000";
  bl.content = x;
  bl.textcolor = "#ffffff";
  return bl;
}

export function genDoor(x: string) {
  let bl = new Block();
  bl.color = "#ffff00ff";
  bl.content = "门";
  bl.textcolor = "#000000";
  bl.data = x;
  //TP?PSEUDO?17?23?1?1
  bl.solid = () => {
    if (bl.data == "19_-4_U0") {
      if (player.features.includes("19_-4_U0") && player.ram >= 409600) {
        return false;
      }
      return true;
    }
    if (bl.data == "1327" && player.ram >= 8.25 * 1024) {
      return false;
    }
    if (bl.data == "1723" && player.ram >= 9.5 * 1024) {
      return false;
    }
    if (bl.data == "1913_U0" && player.ram >= 204800) {
      return false;
    }
    if (bl.data == "RIGHT" && player.items.doorkey_1) {
      return false;
    }
    if (
      bl.data == "JAIL_PLAYER" &&
      player.features.includes("JAIL_PLAYER_1") &&
      player.ram >= 153600
    ) {
      return false;
    }
    return true;
  };
  bl.onTouch = () => {
    if (bl.data == "293_44") {
      DIALOGUE.messages = [
        "+ 这个门上写着\n+ “涉*关押区...”",
        "+ 我需要至少20.000 TB打开...",
      ];

      DIALOGUE.startConversation();
      return [false];
    }
    if (bl.data == "282_40") {
      DIALOGUE.messages = ["+ 帮别人“越狱”，emmm\n+ 算不算...?", "+ 管他呢"];
      DIALOGUE.stillInteraction = true;
      DIALOGUE.afterConversation = function () {
        jail_breaking_door_282_40();
      };

      DIALOGUE.startConversation();
      return [false];
    }
    if (bl.data == "279_44" && player.features.includes("bed1_dreaming")) {
      if (player.features.includes("JAIL_PLAYER_KILLED2")) {
        DIALOGUE.messages = [
          "+ Endless_e19728解决了。",
          "+ 不过AntiDim19728手下应该还有人。",
          "+ 把这个门解决掉先。",
          "+ 这个是监狱的“加固门”，用RAM解决\n+ 可以得到很多点数...",
        ];
        DIALOGUE.stillInteraction = true;
        DIALOGUE.afterConversation = function () {
          jail_breaking_door();
        };

        DIALOGUE.startConversation();
        return [false];
      } else {
        DIALOGUE.messages = [
          "- 例行检查。",
          "- 你最好知道你是谁。",
          "+ ......",
          "- 你怎么出来了？\n- 不应该在里面吗？",
          "+ (不好)\n。",
          "- 去见Endless_e19728，待会儿就会来。",
          "+ (...)",
        ];
        DIALOGUE.stillInteraction = true;
        DIALOGUE.afterConversation = function () {
          seeing_Endless_e19728();
        };
        DIALOGUE.startConversation();
      }
      return [false];
    }
    if (bl.data == "JAIL_PLAYER") {
      if (!player.features.includes("JAIL_PLAYER_1")) {
        DIALOGUE.messages = [
          "+ 这个门太难开了。",
          "+ 我至少需要150 KB才能破开...",
          "- 又有人被抓进去了？",
          "+ 谁？",
          "- 我是John Baixie。",
          "- F**k, 2880分钟前有个人，\n- 说我买了黑市里的东西，\n- 把我抓了",
          "- 他们还说什么，\n- AntiDim19728，\n- 还没等我解释就把我抓进去了",
          "+ ......",
        ];
        player.features.push("JAIL_PLAYER_1");
      } else if (player.ram <= 153600) {
        DIALOGUE.messages = [
          "+ 这个门太难开了。",
          "+ 我至少需要150 KB才能破开...",
        ];
      } else {
        player.ram -= 145408;
        return [true];
      }
      DIALOGUE.startConversation();
      return [false];
    }
    if (bl.data == "RIGHT" && player.items.doorkey_1) {
      player.items.doorkey_1 = 0;
      return [true];
    }
    if (bl.data == "19_-4_U0") {
      if (player.features.includes("19_-4_U0") && player.ram >= 409600) {
        player.features.push("19_-4_U0_OPENED");
        return [true];
      }
      DIALOGUE.messages = [
        "+ 这里有一个门。",
        "+ 上面写着: 辛巴巴八路比呀\n+ 以及“该门需要400 KB 开启”。",
      ];
      DIALOGUE.startConversation();
      player.features.push("19_-4_U0");
      return [false];
    }
    if (bl.data == "1327" && player.ram >= 8.25 * 1024) {
      return [true];
    }
    if (bl.data == "1723" && player.ram >= 9.5 * 1024) {
      return [true, "TP?PSEUDO?17?23?0"];
    }
    if (bl.data == "1913_U0" && player.ram >= 204800) {
      return [true];
    }
    return [false];
  };
  bl.solidInteractionable = () => {
    if (
      bl.data == "19_-4_U0" ||
      bl.data == "JAIL_PLAYER" ||
      bl.data == "282_40" ||
      bl.data == "293_44"
    ) {
      return true;
    }
    if (bl.data == "279_44" && player.features.includes("bed1_dreaming")) {
      return true;
    }
    return false;
  };
  return bl;
}

export function genFeature(x: string[]) {
  let bl = new Block();
  bl.color = "#00ffffff";
  bl.content = x[1];
  bl.data = x[2];
  bl.textcolor = "#000000";
  bl.onTouch = function () {
    player.features.push(bl.data);
    switch (bl.data) {
      case "point":
        player.points += 1;
        break;
    }
    return [true];
  };
  return bl;
}

export function genItem(x: string[]) {
  let bl = new Block();
  bl.color = "#00ffffff";
  bl.content = x[1];
  bl.data = x[2];
  bl.textcolor = "#000000";
  bl.onTouch = function () {
    if (!player.items[bl.data]) {
      player.items[bl.data] = 1;
    } else player.items[bl.data] += 1;
    return [true];
  };
  return bl;
}

export function genTP(x: string[], pseudo2 = false) {
  let pseudo = x[1] == "PSEUDO" || pseudo2;
  let bl = new Block();
  bl.color = pseudo ? "#000000" : "rgba(0, 0, 255, 1)";
  bl.content = x[1] || (pseudo ? "" : "传送门");
  bl.data = [x[2], x[3], x[4]];
  bl.textcolor = pseudo ? "#000000" : "#ffffff";
  bl.onTouch = function () {
    player.x = +bl.data[0];
    player.y = +bl.data[1];
    console.log(bl.data[2]);
    if (bl.data[2]) {
      player.universe = +bl.data[2];
    }
    return [false];
  };
  return bl;
}
function validateName(x: string) {
  if (x.length <= 2) return false;
  let lowerc = x.toLowerCase();
  if (lowerc.includes("anti")) return false;
  if (lowerc.includes("dim")) return false;
  if (lowerc.includes("197")) return false;
  if (lowerc.includes("728")) return false;
  if (lowerc.includes("endless")) return false;
  if (lowerc.includes("RBNR")) return false;
  if (lowerc.includes("RBNR")) return false;
  if (lowerc.includes("棍母")) return false;
  if (lowerc.includes("滚木")) return false;
  if (lowerc.includes("num")) return false;
  if (lowerc.includes("rorum")) return false;
  if (lowerc.includes("damo")) return false;
  if (lowerc.includes("frost")) return false;
  if (lowerc.includes("david") && lowerc.includes("loves")) return false;
  if (lowerc.includes("etoh") && lowerc.includes("loves")) return false;
  if (lowerc.length >= 13) return false;
  return true;
}
export function genEvent(x: string) {
  if (x == "whoami") {
    return new (class extends Block {
      color = "#00000000";
      textcolor: string = "#ffffff";
      content = "Who am I?";
      onTouch(): [remove: boolean, replaceTo?: string] {
        let mynameis = prompt("My name is...", "Player");
        if (!mynameis) return [false];
        if (!validateName(mynameis)) return [false];
        player.playername = mynameis;
        return [false];
      }
    })();
  }
  if (x == "iknow") {
    return new (class extends Block {
      color = "#00000000";
      textcolor: string = "#ffffff";
      contentDynamic(): string {
        if (player.playername === "Player") return "";
        return "I know.";
      }
      onTouch(): [remove: boolean, replaceTo?: string] {
        if (player.playername === "Player") return [false];
        bed1_dreaming_1(false);
        return [false];
      }
    })();
  }
  if (x == "25_1") {
    return new (class extends Block {
      color = "#00000000";
      textcolor: string = "#ffffff";
      content = "t";
      onTouch(): [remove: boolean, replaceTo?: string] {
        if (!player.features.includes("25_1")) {
          DIALOGUE.messages = [
            "- 你好。",
            "+ 你是谁？",
            "- 我是Endless_e19728。",
            "- 右边是一片美好的地方。",
            "- 如果你想去，我可以帮你。",
            "+ 好的，谢谢。",
          ];
          DIALOGUE.startConversation();
          player.features.push("25_1");
        }
        return [false];
      }
    })();
  }
  if (x == "37_1") {
    return new (class extends Block {
      color = "#00000000";
      textcolor: string = "#ffffff";
      content = "t";
      onTouch(): [remove: boolean, replaceTo?: string] {
        if (!player.features.includes("37_1")) {
          TEMP.interact = 1;
          player.features.push("37_1");
          setTimeout(Endless_e19728_trap2, 500);
          setTimeout(Endless_e19728_trap, 1000);
        }
        return [false];
      }
    })();
  }
  return null;
}
export function genNPC(x: string) {
  if (x == "John_Baixie") {
    return new (class extends Block {
      color = "#fff700ff";
      content = "John Baixie";
      onTouch(): [remove: boolean, replaceTo?: string] {
        DIALOGUE.stillInteraction = true;
        DIALOGUE.messages = ["- 谢谢。"];
        DIALOGUE.afterConversation = async function () {
          player.x = 279;
          await delay(100);
          player.y = 36;
          await delay(200);
          player.replaces.push([277, 35, "NULL"]);
          player.replaces.push([278, 35, "NPC?John_Baixie"]);
          await delay(300);
          player.replaces.push([278, 35, "NULL"]);
          player.replaces.push([279, 35, "NPC?John_Baixie"]);
          await delay(300);
          player.replaces.push([279, 35, "NULL"]);
          player.replaces.push([280, 35, "NPC?John_Baixie"]);
          await delay(300);
          player.replaces.push([280, 35, "NULL"]);
          player.replaces.push([280, 36, "NPC?John_Baixie"]);
          await delay(300);
          player.replaces.push([280, 36, "NULL"]);
          player.replaces.push([280, 37, "NPC?John_Baixie"]);
          await delay(300);
          player.replaces.push([280, 37, "NULL"]);
          player.replaces.push([280, 38, "NPC?John_Baixie"]);
          await delay(300);
          player.replaces.push([280, 38, "NULL"]);
          player.replaces.push([280, 39, "NPC?John_Baixie"]);
          await delay(300);
          player.replaces.push([280, 39, "NULL"]);
          player.replaces.push([281, 39, "NPC?John_Baixie"]);
          await delay(300);
          player.replaces.push([281, 39, "NULL"]);
          player.replaces.push([282, 39, "NPC?John_Baixie"]);
          await delay(300);
          player.replaces.push([282, 39, "NULL"]);
          player.replaces.push([282, 40, "NPC?John_Baixie"]);
          await delay(300);
          player.replaces.push([282, 40, "NULL"]);
          TEMP.interact = 0;
        };
        DIALOGUE.startConversation();
        return [false];
      }
      solid(): boolean {
        return true;
      }
      solidInteractionable(): boolean {
        return true;
      }
    })();
  }
  if (x == "guard1") {
    return new (class extends Block {
      color = "#fff700ff";
      content = "???";
      onTouch(): [remove: boolean, replaceTo?: string] {
        return [false];
      }
      solid(): boolean {
        return true;
      }
      solidInteractionable(): boolean {
        return true;
      }
    })();
  }
  if (x == "Endless_e19728") {
    return new (class extends Block {
      color = "#fff700ff";
      content = "Endless_\ne19728";
      onTouch(): [remove: boolean, replaceTo?: string] {
        // DIALOGUE.messages = ["- 你好。"];
        // DIALOGUE.startConversation();
        return [false];
      }
      solid(): boolean {
        return true;
      }
      solidInteractionable(): boolean {
        return true;
      }
    })();
  }
  if (x == "15_-5_U0") {
    return new (class extends Block {
      color = "#fff700ff";
      content = "作者";
      onTouch(): [remove: boolean, replaceTo?: string] {
        DIALOGUE.messages = [
          "- 您好！！！我是这个游戏\n- 的作者！！！/bx/bx/bx",
          "- 肥肠感谢您能玩到这里！！！",
          "- 不出意外的话新手教程就结束了。",
          "- 左上角有个传送门，可以继续玩。",
        ];
        DIALOGUE.startConversation();
        return [false];
      }
      solid(): boolean {
        return true;
      }
      solidInteractionable(): boolean {
        return true;
      }
    })();
  }
  if (x == "20_-8_U0") {
    return new (class extends Block {
      color = "#fff700ff";
      content = "NPC";
      onTouch(): [remove: boolean, replaceTo?: string] {
        if (player.features.includes("19_-4_U0_OPENED_2")) return [false];
        if (
          player.features.includes("19_-4_U0_OPENED") &&
          !player.features.includes("19_-4_U0_OPENED_2")
        ) {
          DIALOGUE.messages = [
            "- 谢谢你...",
            "+ (你获得了0.001 点数。)\n+ 这NPC身价这么低？",
          ];
          DIALOGUE.startConversation();
          player.points += 0.001;
          player.features.push("19_-4_U0_OPENED_2");
        } else {
          DIALOGUE.messages = [
            "- 你好，我只是一个普通的NPC",
            "- 左边有个门，我开不了。",
            "- 如果你帮我开启，我会给你报酬",
          ];
        }
        DIALOGUE.startConversation();
        return [false];
      }
      solid(): boolean {
        return true;
      }
      solidInteractionable(): boolean {
        return true;
      }
    })();
  }
  if (x == "22_-8_U0") {
    return new (class extends Block {
      color = "#fff700ff";
      content = "NPC";
      onTouch(): [remove: boolean, replaceTo?: string] {
        DIALOGUE.messages = [
          "- 你好，我只是一个普通的NPC",
          "- 我的右边有扇门，\n- 只要你能给我100 TB RAM，\n- 就能开启。",
          "+ 这NPC这么贪婪吗？\n+ 还是说后面有大宝藏？",
        ];
        DIALOGUE.startConversation();
        return [false];
      }
      solid(): boolean {
        return true;
      }
      solidInteractionable(): boolean {
        return true;
      }
    })();
  }
  return null;
}
