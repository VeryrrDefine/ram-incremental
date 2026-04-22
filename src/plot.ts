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
    "+ 什么？ 马上斩杀！",
    // "%STILL INTERACTION",
  ];
  DIALOGUE.stillInteraction = true;
  DIALOGUE.startConversation();
  DIALOGUE.afterConversation = Endless_e19728_trap3;
}
export function Endless_e19728_trap3() {
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
  setTimeout(function () {
    TEMP.endless_e19728_animation = 0;
    player.x = 272;
    player.y = 35;
    player.features.push("25_1_done");
    TEMP.interact = 0;
    player.thief_points = player.points;
    player.points = 0;
    player.thief_rams = player.ram - 8192;
    player.ram = 8192;
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
