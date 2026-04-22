import { DIALOGUE } from "./dialogue";
import { player } from "./player";
import { Endless_e19728_trap, Endless_e19728_trap2 } from "./plot";
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
    return true;
  };
  bl.onTouch = () => {
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
    if (bl.data == "19_-4_U0") {
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

export function genEvent(x: string) {
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
            "+ 你获得了0.001 点数。\n+ 这NPC身价这么低？",
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
