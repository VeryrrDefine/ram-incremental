import "./style.css";
// import "./deduct.ts";
let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let player = {
  x: 1,
  y: 1,
};
class Block {
  color = "#ffff00";
  content = "1e98";
}
let playerblock = new Block();
playerblock.color = "#00ffffff";
playerblock.content = "Player";
let gridsize = 80;
const WALL = new Block();
WALL.color = "#ffffff";
WALL.content = "";

const POINT_GENERATOR = new Block();
POINT_GENERATOR.color = "#00ffffff";
POINT_GENERATOR.content = "Point generator";

function getBlock(x: number, y: number) {
  if (x == 0 || y == 0) return WALL;
  if (x == 8 || y == 8) return WALL;
  if (x == 7 && y == 1) return POINT_GENERATOR;
  return null;
}

function passable(x: number, y: number) {
  return getBlock(x, y) !== WALL;
}

function numberTostring(num: number): string {
  if (num < 0) return "-" + numberTostring(-num);
  if (num == 0) return "0";
  if (num == Infinity) return "∞";
  return num.toFixed(3);
}
const HEIGHT = 20;
function drawText(x: number, y: number, str: string) {
  let text = str;
  let curheight = HEIGHT;

  let width = ctx.measureText(text).width;
  while (width > 80) {
    curheight *= 0.8;
    ctx.font = `${curheight}px sans-serif`;
    width = ctx.measureText(text).width;
  }
  ctx.fillText(text, x + (80 - width) / 2, y + (80 - HEIGHT) / 2 + HEIGHT - 3);
  ctx.font = `${HEIGHT}px sans-serif`;
}
function drawNumber(x: number, y: number, num: number) {
  return drawText(x, y, numberTostring(num));
}
function drawBlock(block: Block, x: number, y: number) {
  ctx.fillStyle = block.color;
  ctx.fillRect(x, y, gridsize, gridsize);
  ctx.fillStyle = "#000000";
  drawText(x, y, block.content);
  // drawNumber(x, y, 9.6e97);
}
function lifeCycle() {
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, 2000, 2000);

  ctx.fillStyle = "#000000";
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      let relx = i + player.x - 4;
      let rely = j + player.y - 4;
      let block = getBlock(relx, rely);
      if (block === null) continue;
      else drawBlock(block, i * 80, j * 80);
    }
  }
  drawBlock(playerblock, 320, 320);
  ctx.fillStyle = "#008cffff";
  ctx.fillText(`player${player.x},${player.y}`, 0, 30);
}
function direction(x: "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight") {
  switch (x) {
    case "ArrowRight":
      if (passable(player.x + 1, player.y)) player.x += 1;
      break;
    case "ArrowDown":
      if (passable(player.x, player.y + 1)) player.y += 1;
      break;
    case "ArrowLeft":
      if (passable(player.x - 1, player.y)) player.x -= 1;
      break;
    case "ArrowUp":
      if (passable(player.x, player.y - 1)) player.y -= 1;
      break;
  }
}
document.addEventListener("DOMContentLoaded", function () {
  canvas = document.querySelector<HTMLCanvasElement>("canvas")!;
  console.log(canvas);
  ctx = canvas.getContext("2d")!;
  ctx.font = `${HEIGHT}px sans-serif`;
  setInterval(lifeCycle, 50);
});
document.addEventListener("keydown", function (e) {
  switch (e.key) {
    case "ArrowRight":
    case "ArrowDown":
    case "ArrowLeft":
    case "ArrowUp":
      direction(e.key);
      break;
  }
});
// import typescriptLogo from './typescript.svg'
// import viteLogo from '/vite.svg'
// import { setupCounter } from "./counter.ts";

// document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
//   <div>
//     <a href="https://vite.dev" target="_blank">
//       <img src="${viteLogo}" class="logo" alt="Vite logo" />
//     </a>
//     <a href="https://www.typescriptlang.org/" target="_blank">
//       <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
//     </a>
//     <h1>Vite + TypeScript</h1>
//     <div class="card">
//       <button id="counter" type="button"></button>
//     </div>
//     <p class="read-the-docs">
//       Click on the Vite and TypeScript logos to learn more
//     </p>
//   </div>
// `

// setupCounter(document.querySelector<HTMLButtonElement>("#counter")!);
