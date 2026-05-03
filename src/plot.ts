import Decimal from "break_eternity.js";
import { delay } from "./await";
import { BATTLE } from "./battle";
import { DIALOGUE } from "./dialogue";
import { displayNumber } from "./display";
import { player } from "./player";
import { TEMP } from "./temp";

export function Endless_e19728_trap() {
  DIALOGUE.messages = [
    "- 你即将被斩杀!",
    "+ 我怎么中陷阱了!",
    "- 哈哈哈，你已经被我的队长\n- AntiDim19728的手下，捕获了!",
    "+ ......",
    "+ 你到底想干什么！？",
    "- ...哈哈哈...",
    "- 我马上就能得到1 点数了，\n- 哈哈哈...",
    "+ 你家队长点数那么少？\n+ 我都有" +
      displayNumber(player.points) +
      " 点数了。",
    "- 什么？ 马上斩杀！",
    // "%STILL INTERACTION",
  ];
  DIALOGUE.stillInteraction = true;
  DIALOGUE.startConversation();
  DIALOGUE.afterConversation = Endless_e19728_trap3;
}

function fadein() {
  setTimeout(function () {
    TEMP.endless_e19728_animation = 1;
  }, 570);
  setTimeout(function () {
    TEMP.endless_e19728_animation = 2;
  }, 570 * 2);
  setTimeout(function () {
    TEMP.endless_e19728_animation = 3;
  }, 570 * 3);
  setTimeout(function () {
    TEMP.endless_e19728_animation = 4;
  }, 570 * 4);
  setTimeout(function () {
    TEMP.endless_e19728_animation = 5;
  }, 570 * 5);
}
export function seeing_Endless_e19728() {
  setTimeout(function () {
    TEMP.endless_e19728_animation = 5;
  }, 500);
  setTimeout(function () {
    TEMP.endless_e19728_animation = 0;
    player.replaces.push([279, 45, "NPC?Endless_e19728"]);
    player.replaces.push([278, 45, "NPC?guard1"]);

    DIALOGUE.messages = [
      "- 就是你是吧。",
      "+ 啊。",
      "- 你不知道你自己干了什么事？",
      "+ 什么？",
      "- AntiDim19728怀疑你\n- 在黑市买了东西。",
      "+ 什么黑市？",
      "- 有没有遇见两个人？\n- 其中一个要100 TB 什么的？",
      "+ 啊？那是黑市？",
      "- 由于你在黑市买了东西，\n- 你已经被关押在监狱里。",
      "- 要等NaN年后才能出来。",
      // "%STILL INTERACTION",
      "+ 那我？",
      "+ 我也不知道那是什么黑市啊？",
      "- 我说黑市就是黑市，少废话。",
      "+ (...)\n+ (不行，必须对付这个\n+ Endless_e19728...)",
      "+ (啥时候多了8GB RAM...?)\n- 怎么，不服气？",
      "+ (有了...)\n+ (把Endless_e19728鲨了...)",
      `+ 我的名字是${player.playername}。`,
      "- 怎么，你知道你名字了？",
      `- ${player.playername}这个名字很美丽。`,
      "- “可惜”，它马上要消失了。",
      "+ 看招！",
    ];
    DIALOGUE.stillInteraction = true;
    DIALOGUE.afterConversation = function () {
      TEMP.attack_effect.push([279, 45, Date.now()]);
      setTimeout(seeing_Endless_e19728_2, 1000);
    };
    setTimeout(function () {
      DIALOGUE.startConversation();
    }, 1500);
    // DIALOGUE.afterConversation = Endless_e19728_trap3;
  }, 5500);
}
export function jail_breaking_door() {
  TEMP.attack_effect.push([279, 44, Date.now()]);
  setTimeout(function () {
    player.replaces.push([279, 44, "NULL"]);
    player.ram = player.ram.sub(134_217_728);
    player.points = player.points.add(1.293e9);
    DIALOGUE.messages = [
      "+ (你获得了 1.293e9 点数.\n+ 你消耗了 128.00 MB RAM.)",
      "+ 点数好多。",
    ];
    setTimeout(function () {
      DIALOGUE.startConversation();
    }, 500);
  }, 1000);
}
export function jail_breaking_door_282_40() {
  TEMP.attack_effect.push([282, 40, Date.now()]);
  setTimeout(function () {
    player.replaces.push([282, 40, "NULL"]);
    player.ram = player.ram.sub(31457280);
    player.points = player.points.add(3.4e8 + 0.0001);
    DIALOGUE.messages = [
      "+ 你获得了 3.400e8 点数.\n+ 你消耗了 30.00 MB RAM.",
      "- 你把门拆了？那么强？谢谢。",
      "+ 不用谢。我把抓我的\n+ Endless_e19728解决掉了。",
      "- 我要报答你！",
      "+ (你获得了 0.0001 点数.)",
    ];
    setTimeout(function () {
      DIALOGUE.startConversation();
    }, 500);
  }, 1000);
}
export function seeing_Endless_e19728_2() {
  player.replaces.push([279, 45, "NULL"]);
  player.ram = player.ram.sub(2_182_917_128);
  player.points = player.points.add(12.002);
  DIALOGUE.messages = [
    "+ (你获得了 12.002 点数.\n+ 你消耗了 2.033 GB RAM.)",
    "- 你敢鲨人？",
    "+ 你也似！",
  ];
  DIALOGUE.stillInteraction = true;
  DIALOGUE.afterConversation = function () {
    TEMP.attack_effect.push([278, 45, Date.now()]);
    setTimeout(seeing_Endless_e19728_3, 1000);
  };
  setTimeout(function () {
    DIALOGUE.startConversation();
  }, 500);
}
export function seeing_Endless_e19728_3() {
  player.replaces.push([278, 45, "NULL"]);
  player.ram = player.ram.sub(137_604_628);
  player.points = player.points.add(0.203);
  DIALOGUE.messages = [
    "+ 你获得了 0.203 点数.\n+ 你消耗了 131.23 MB RAM.",
    "+ 好了，解决了。",
  ];
  player.features.push("JAIL_PLAYER_KILLED2");
  setTimeout(function () {
    DIALOGUE.startConversation();
  }, 500);
}
export function bed1_dreaming_1(into = true) {
  fadein();
  setTimeout(function () {
    TEMP.endless_e19728_animation = 4;
    if (into) {
      player.x = -1048576;
      player.y = -1048576;
    } else {
      player.x = 279;
      player.y = 42;
      player.ram = player.ram.add(8_589_934_592);
      player.replaces.push([279, 45, "NPC?guard1"]);
    }
    setTimeout(function () {
      TEMP.endless_e19728_animation = 3;
    }, 570 * 1);
    setTimeout(function () {
      TEMP.endless_e19728_animation = 2;
    }, 570 * 2);
    setTimeout(function () {
      TEMP.endless_e19728_animation = 1;
    }, 570 * 3);
    setTimeout(function () {
      TEMP.endless_e19728_animation = 0;
      TEMP.interact = 0;
    }, 570 * 4);
  }, 5700);
}
export function Endless_e19728_trap3() {
  fadein();
  setTimeout(function () {
    TEMP.endless_e19728_animation = 0;
    player.x = 272;
    player.y = 35;
    player.features.push("25_1_done");
    TEMP.interact = 0;
    player.thief_points = player.points;
    player.points = new Decimal(0);
    player.thief_rams = player.ram.sub(8192);
    player.ram = new Decimal(8192);
  }, 5700);
}
export function Endless_e19728_trap2() {
  player.replaces.push([36, 1, "WALL"]);
  player.replaces.push([37, 0, "WALL"]);
  player.replaces.push([38, 0, "WALL"]);
  player.replaces.push([38, 1, "WALL"]);
  player.replaces.push([38, 2, "WALL"]);
  player.replaces.push([37, 2, "WALL"]);
}

export async function Endless_e19728_trap4() {
  await delay(1000);
  player.features.push("293_32");
  player.replaces.push([293, 31, "WALL"]);
  player.replaces.push([293, 33, "WALL"]);
  await delay(1000);

  DIALOGUE.messages = ["- 很明显，", "- 有人越狱了。"];
  DIALOGUE.stillInteraction = true;
  DIALOGUE.startConversation();
  await DIALOGUE.waitUntilDialogueDone();
  await delay(1000);
  player.replaces.push([293, 28, "NPC?Endless_e308"]);
  await delay(1000);
  player.replaces.push([293, 28, "NULL"]);
  player.replaces.push([293, 29, "NPC?Endless_e308"]);
  await delay(1000);
  player.replaces.push([293, 29, "NULL"]);
  player.replaces.push([293, 30, "NPC?Endless_e308"]);
  await delay(1000);
  DIALOGUE.messages = [
    "- 你就是把Endless_e19728\n- 打似的那个？。",
    "+ 对，怎么了？",
    "- 你还有脸说“怎么了？”",
    "- 你要么被判亖形，要么被我打亖",
    "+ ...",
  ];
  DIALOGUE.stillInteraction = true;
  DIALOGUE.startConversation();
  await DIALOGUE.waitUntilDialogueDone();
  BATTLE.enemyid = 2;
  BATTLE.startBattle();

  // alert("test");
  // DIALOGUE.afterConversation = Endless_e19728_trap5;
}
