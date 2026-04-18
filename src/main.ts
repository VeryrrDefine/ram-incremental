// main.ts
import "./style.css";
import { player } from "./gameState";
import { initRenderer, renderGame } from "./render";
import { handleClick, tryMove } from "./interaction";
import { save } from "./player";
import { map, map_parallel } from "./map";
import { loop } from "./loop";

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
  });
  canvas.addEventListener("click", () => handleClick(mouseX, mouseY));

  setInterval(() => renderGame(), 50);
  setInterval(() => save(), 1000);
  setInterval(() => loop(), 50);
});

document.addEventListener("keydown", (e) => {
  const key = e.key;
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
// @ts-ignore
window.map = map;
// @ts-ignore
window.player = player;
// @ts-ignore
window.par = map_parallel;
