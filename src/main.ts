// main.ts
import "./style.css";
import { initRenderer, renderGame } from "./render";
import { handleClick, tryMove } from "./interaction";
import { save } from "./player";
import { loop } from "./loop";
import { mouse } from "./mouse";
import { DIALOGUE } from "./dialogue";
// import { BATTLE } from "./battle";

let canvas: HTMLCanvasElement;
let assets: HTMLImageElement;
document.addEventListener("DOMContentLoaded", () => {
  canvas = document.querySelector("canvas")!;
  assets = document.querySelector("img")!;
  initRenderer(canvas, assets);

  let mouseX = 0,
    mouseY = 0;
  canvas.addEventListener("mousemove", (e) => {
    mouseX = e.offsetX;
    mouseY = e.offsetY;
    mouse.mouseX = e.offsetX;
    mouse.mouseY = e.offsetY;
  });
  canvas.addEventListener("click", () => {
    nextConversation();

    handleClick(mouseX, mouseY);
  });

  canvas.addEventListener("dblclick", () => {
    skipConversation();
  });
  setInterval(() => renderGame(), 50);
  setInterval(() => save(), 1000);
  setInterval(() => loop(), 50);
});

function nextConversation() {
  if (!(DIALOGUE.conversation && Date.now() - DIALOGUE.UItick >= 600)) return;
  if (DIALOGUE.conversation + 1 > DIALOGUE.messages.length) {
    DIALOGUE.endConversation();
  } else {
    DIALOGUE.conversation++;
  }
  return;
}
function skipConversation() {
  if (!(DIALOGUE.conversation && Date.now() - DIALOGUE.UItick >= 600)) return;
  DIALOGUE.endConversation();
  return;
}
let lastMove = Date.now();
document.addEventListener("keydown", (e) => {
  const key = e.key;
  if (DIALOGUE.conversation && Date.now() - DIALOGUE.UItick >= 600) {
    if (e.key == "Shift") {
      skipConversation();
    }
    if (e.key == "Enter") {
      nextConversation();
    }
  }
  if ((e.key == "I" || e.key == "i") && player.features.includes("item")) {
    openItem();
    return;
  }
  if (Date.now() - lastMove < 100) return;
  lastMove = Date.now();
  const moveMap = {
    ArrowUp: [0, -1],
    w: [0, -1],
    W: [0, -1],
    ArrowDown: [0, 1],
    s: [0, 1],
    S: [0, 1],
    ArrowLeft: [-1, 0],
    a: [-1, 0],
    A: [-1, 0],
    ArrowRight: [1, 0],
    d: [1, 0],
    D: [1, 0],
  };
  // @ts-ignore
  const move: any = moveMap[key];
  if (move) tryMove(move[0], move[1]);
});

// 调试用
import { player } from "./player";
// @ts-ignore
window.player = player;
// import { map } from "./map";
import { openItem } from "./items";
// @ts-ignore
// window.map = map;
// setTimeout(BATTLE.startBattle, 100);
