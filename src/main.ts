import { Block, PLAYERBLOCK, WALL } from "./blocks";
import { blockDataToBlock, type GameMap } from "./parsemap";
import { player, save } from "./player";
import "./style.css";
// import "./deduct.ts";
let canvas: HTMLCanvasElement;
let assets: HTMLImageElement;
let ctx: CanvasRenderingContext2D;

const GRIDSIZE = 80;
let mouseX = 0;
let mouseY = 0;

let [mouseXb, mouseYb] = [0, 0];
let configurations: [string, keyof typeof player][] = [
  ["Editing", "editing"],
  ["Openmenu", "openedMenu"],
  ["ArrowButton", "addArrowButton"],
];

const map: GameMap = [
  [0, 0, "WALL"],
  [0, 1, "WALL"],
  [0, 2, "WALL"],
  [0, 3, "WALL"],
  [1, 3, "WALL"],
  [2, 3, "WALL"],
  [3, 3, "WALL"],
  [4, 3, "WALL"],
  [4, 2, "WALL"],
  [4, 0, "WALL"],
  [3, 0, "WALL"],
  [2, 0, "WALL"],
  [1, 0, "WALL"],
  [2, 1, "TEXT?欢迎来到\ntest-game"],
  [2, 2, "TEXT?按上下左右键移动"],
  [3, 2, "TEXT?白色方块是墙"],
  [3, 1, "TEXT?黑色方块可以通行"],
  [5, 0, "WALL"],
  [6, 0, "WALL"],
  [7, 0, "WALL"],
  [8, 0, "WALL"],
  [5, 2, "WALL"],
  [6, 2, "WALL"],
  [7, 2, "WALL"],
  [9, 2, "WALL"],
  [10, 2, "WALL"],
  [12, 2, "WALL"],
  [11, 2, "WALL"],
  [12, 0, "WALL"],
  [11, 0, "WALL"],
  [10, 0, "WALL"],
  [9, 0, "WALL"],
  [12, 3, "WALL"],
  [14, 2, "WALL"],
  [14, 3, "WALL"],
  [15, 2, "WALL"],
  [15, 0, "WALL"],
  [14, 0, "WALL"],
  [14, -1, "WALL"],
  [12, -1, "WALL"],
  [12, -2, "WALL"],
  [12, -3, "WALL"],
  [12, -4, "WALL"],
  [14, -4, "WALL"],
  [14, -3, "WALL"],
  [14, -2, "WALL"],
  [16, 0, "WALL"],
  [16, 2, "WALL"],
  [12, 4, "WALL"],
  [14, 4, "WALL"],
  [17, 2, "WALL"],
  [17, 0, "WALL"],
  [14, 5, "WALL"],
  [12, 5, "WALL"],
  [13, 1, "TEXT?这里是一个\n十字路口"],
  [13, 2, "TEXT?先去下方"],
  [13, -4, "DOOR?UP"],
  [18, 0, "WALL"],
  [18, 2, "WALL"],
  [19, 2, "WALL"],
  [19, 0, "WALL"],
  [20, 0, "WALL"],
  [20, 2, "WALL"],
  [20, 1, "DOOR?RIGHT"],
  [12, 6, "WALL"],
  [12, 7, "WALL"],
  [12, 8, "WALL"],
  [14, 6, "WALL"],
  [14, 7, "WALL"],
  [14, 8, "WALL"],
  [12, 9, "WALL"],
  [12, 10, "WALL"],
  [14, 9, "WALL"],
  [15, 9, "WALL"],
  [16, 9, "WALL"],
  [17, 9, "WALL"],
  [12, 11, "WALL"],
  [12, 12, "WALL"],
  [12, 13, "WALL"],
  [12, 14, "WALL"],
  [12, 15, "WALL"],
  [13, -3, "TEXT?寻找物品\n以打开此门"],
  [19, 1, "TEXT?寻找物品\n以打开此门"],
  [13, 10, "FEAT?获得1点数?point"],
  [9, 3, "WALL"],
  [9, 4, "WALL"],
  [9, 5, "WALL"],
  [9, 7, "WALL"],
  [9, 6, "WALL"],
  [7, 3, "WALL"],
  [7, 4, "WALL"],
  [7, 5, "WALL"],
  [7, 6, "WALL"],
  [7, 7, "WALL"],
  [7, 8, "WALL"],
  [7, 9, "WALL"],
  [9, 8, "WALL"],
  [9, 9, "WALL"],
  [10, 9, "WALL"],
  [11, 9, "WALL"],
  [6, 9, "WALL"],
  [5, 9, "WALL"],
  [5, 10, "WALL"],
  [5, 11, "WALL"],
  [5, 12, "WALL"],
  [5, 13, "WALL"],
  [6, 13, "WALL"],
  [7, 13, "WALL"],
  [8, 13, "WALL"],
  [9, 13, "WALL"],
  [10, 13, "WALL"],
  [11, 13, "WALL"],
  [11, 8, "WALL"],
  [10, 8, "WALL"],
  [10, 7, "WALL"],
  [11, 7, "WALL"],
  [11, 6, "WALL"],
  [10, 6, "WALL"],
  [10, 5, "WALL"],
  [11, 5, "WALL"],
  [11, 4, "WALL"],
  [10, 4, "WALL"],
  [10, 3, "WALL"],
  [11, 3, "WALL"],
  [8, 2, "TEXT?下方可以去设置"],
  [6, 12, "HARDRESET"],
  [-55, -56, "TEXT?确认硬重置？"],
  [-57, -57, "WALL"],
  [-57, -56, "WALL"],
  [-57, -55, "WALL"],
  [-56, -55, "WALL"],
  [-56, -54, "WALL"],
  [-55, -54, "WALL"],
  [-54, -54, "WALL"],
  [-54, -55, "WALL"],
  [-53, -55, "WALL"],
  [-53, -56, "WALL"],
  [-53, -57, "WALL"],
  [-54, -57, "WALL"],
  [-55, -57, "WALL"],
  [-56, -57, "WALL"],
  [-54, -56, "TP?不?6?11"],
  [-55, -55, "HARDRESET2"],
  [14, 10, "POINTS"],
  [13, 11, "WALL"],
  [14, 11, "WALL"],
  [15, 11, "WALL"],
  [16, 11, "WALL"],
  [17, 11, "WALL"],
  [15, 10, "TEXT?点数是游戏内\n的主要资源"],
  [18, 9, "WALL"],
  [19, 9, "WALL"],
  [19, 10, "WALL"],
  [19, 11, "WALL"],
  [19, 12, "WALL"],
  [19, 13, "WALL"],
  [17, 12, "WALL"],
  [17, 13, "WALL"],
  [17, 14, "WALL"],
  [19, 14, "WALL"],
  [19, 15, "WALL"],
  [17, 15, "WALL"],
  [17, 16, "WALL"],
  [19, 16, "WALL"],
  [19, 17, "WALL"],
  [17, 17, "WALL"],
  [17, 18, "WALL"],
  [19, 18, "WALL"],
  [19, 19, "WALL"],
  [17, 19, "WALL"],
  [17, 20, "WALL"],
  [19, 20, "WALL"],
  [19, 21, "WALL"],
  [17, 21, "WALL"],
  [17, 22, "WALL"],
  [19, 22, "WALL"],
  [17, 23, "WALL"],
  [17, 24, "WALL"],
  [17, 25, "WALL"],
  [17, 26, "WALL"],
  [19, 23, "WALL"],
  [19, 24, "WALL"],
  [19, 25, "WALL"],
  [19, 26, "WALL"],
];
function getBlock(x: number, y: number) {
  let blockData2 = player.replaces.filter((t) => t[0] == x && t[1] == y);
  if (blockData2.length >= 1) return blockDataToBlock(blockData2.at(-1)![2]);
  let blockData = map.filter((t) => t[0] == x && t[1] == y);
  if (blockData.length == 0) return null;
  return blockDataToBlock(blockData[0][2]);
}

function passable(x: number, y: number) {
  return !(getBlock(x, y)?.solid?.() ?? false);
}

function numberTostring(num: number): string {
  if (num < 0) return "-" + numberTostring(-num);
  if (num == 0) return "0";
  if (num == Infinity) return "∞";
  return num.toFixed(3);
}
const HEIGHT = 21;
function drawText(x: number, y: number, str: string) {
  let text = str;
  let curheight = HEIGHT;

  let parts = text.split("\n");
  let width = Math.max(...parts.map((x) => ctx.measureText(x).width));
  while (width > GRIDSIZE) {
    curheight -= 0.5;
    ctx.font = `${curheight}px sans-serif`;
    width = Math.max(...parts.map((x) => ctx.measureText(x).width));
  }
  for (let i = 0; i < parts.length; i++) {
    ctx.fillText(
      parts[i],
      x + (GRIDSIZE - width) / 2,
      y +
        (GRIDSIZE - HEIGHT) / 2 +
        HEIGHT -
        3 +
        i * HEIGHT -
        (parts.length - 1) * HEIGHT * 0.5,
    );
  }

  ctx.font = `${HEIGHT}px sans-serif`;
}
// function drawNumber(x: number, y: number, num: number) {
//   return drawText(x, y, numberTostring(num));
// }
function drawBlock(block: Block, x: number, y: number) {
  ctx.fillStyle = block.color;
  ctx.fillRect(x, y, GRIDSIZE, GRIDSIZE);
  ctx.fillStyle = block.textcolor;
  if (block.contentDynamic) {
    drawText(x, y, block.contentDynamic());
  } else drawText(x, y, block.content);
  ctx.fillStyle = "#000000";
  // drawNumber(x, y, 9.6e97);
}
function drawPosLine(x: number, y: number) {
  ctx.beginPath();
  ctx.moveTo(0, y * GRIDSIZE);
  ctx.lineTo(720, y * GRIDSIZE);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x * GRIDSIZE, 0);
  ctx.lineTo(x * GRIDSIZE, 720);
  ctx.stroke();
}

/**地图绝对位置转换成canvas的相对位置 */
function relPlayer(
  plx: number,
  ply: number,
  mpx: number,
  mpy: number,
): [number, number] {
  return [-plx + 4 + mpx, -ply + 4 + mpy];
}
/**anvas的相对位置转换成地图绝对位置 */
function absPlayer(
  plx: number,
  ply: number,
  cax: number,
  cay: number,
): [number, number] {
  return [cax - 4 + plx, cay - 4 + ply];
}
function logicCycle() {
  let diff = (Date.now() - player.lastTick) / 1000;

  player.lastTick = Date.now();
}
function lifeCycle() {
  ctx.fillStyle = "#000000";
  ctx.strokeStyle = "#ffffff";
  ctx.fillRect(0, 0, 2000, 2000);

  ctx.fillStyle = "#000000";
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      let [relx, rely] = absPlayer(player.x, player.y, i, j);
      let block = getBlock(relx, rely);
      if (block === null || block === undefined) continue;
      else drawBlock(block, i * GRIDSIZE, j * GRIDSIZE);
    }
  }

  drawBlock(PLAYERBLOCK, 320, 320);

  //坐标轴
  ctx.fillStyle = "#008cffff";

  drawPosLine(...relPlayer(player.x, player.y, 0, 0));

  ctx.fillStyle = "#008cffff";

  // ctx.fillText(
  //   `player${player.x},${player.y}|${absPlayer(player.x, player.y, mouseXb, mouseYb)}`,
  //   0,
  //   30,
  // );
  ctx.fillText(`player${player.x},${player.y}|${mouseX} ${mouseY}`, 0, 30);
  ctx.drawImage(assets, 0, 0, 32, 32, 720 - 32, 720 - 32, 32, 32);
  if (player.openedMenu) {
    ctx.fillStyle = "#8a8a8a";
    ctx.fillRect(650, 600, 70 - 2, 120 - 32 - 2);
    ctx.font = "10px sans-serif";
    ctx.fillStyle = "#ffffff";
    let conf = configurations[player.configurationOrder];

    ctx.fillText(conf[0] + (player[conf[1]] ? "1" : "0"), 650, 600 + 10);
    ctx.drawImage(assets, 0, 32, 16, 16, 652, 652, 16, 16);
    ctx.drawImage(assets, 0, 48, 16, 16, 670, 652, 16, 16);
    ctx.drawImage(assets, 16, 32, 16, 16, 688, 652, 16, 16);
  }
  if (player.addArrowButton) {
    ctx.drawImage(assets, 32, 0, 64, 64, 64, 512, 64, 64); // up
    ctx.drawImage(assets, 32, 64, 64, 64, 0, 512 + 64, 64, 64); //left
    ctx.drawImage(assets, 160, 0, 64, 64, 64, 512 + 64, 64, 64); // down
    ctx.drawImage(assets, 96, 0, 64, 64, 128, 512 + 64, 64, 64); // right
  }
}
function inArea(
  x: number,
  y: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
) {
  return x1 <= x && x <= x2 && y1 <= y && y <= y2;
}
function clicked(mouseX: number, mouseY: number) {
  if (inArea(mouseX, mouseY, 720 - 32, 720 - 32, 720, 720)) {
    player.openedMenu = !player.openedMenu;
    return;
  }
  if (player.addArrowButton) {
    if (inArea(mouseX, mouseY, 64, 512, 64 + 64, 512 + 64)) {
      direction("ArrowUp");
      return;
    }
    if (inArea(mouseX, mouseY, 0, 512 + 64, 64, 512 + 64 + 64)) {
      direction("ArrowLeft");
      return;
    }
    if (inArea(mouseX, mouseY, 64, 512 + 64, 64 + 64, 512 + 64 + 64)) {
      direction("ArrowDown");
      return;
    }
    if (inArea(mouseX, mouseY, 128, 512 + 64, 128 + 64, 512 + 64 + 64)) {
      direction("ArrowRight");
      return;
    }
  }
  if (player.openedMenu) {
    let conf = configurations[player.configurationOrder];
    if (inArea(mouseX, mouseY, 652, 652, 652 + 16, 652 + 16)) {
      if (typeof player[conf[1]] == "boolean") {
        let w = !player[conf[1]];
        // @ts-ignore
        player[conf[1]] = w;
        return;
      }
    }
    if (inArea(mouseX, mouseY, 688, 652, 688 + 16, 652 + 16)) {
      player.configurationOrder++;
      if (player.configurationOrder >= configurations.length) {
        player.configurationOrder = 0;
        return;
      }
    }
  }
  if (player.editing) {
    map.push([mouseXb, mouseYb, "WALL"]);
  }
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
  let block = getBlock(player.x, player.y);
  if (block) {
    if (block.onTouch()[0]) {
      player.replaces.push([player.x, player.y, "NULL"]);
    }
  }
}
document.addEventListener("DOMContentLoaded", function () {
  canvas = document.querySelector<HTMLCanvasElement>("canvas")!;
  assets = document.querySelector<HTMLImageElement>("img")!;
  canvas.addEventListener("mousemove", (e) => {
    mouseX = e.offsetX;
    mouseY = e.offsetY;
    [mouseXb, mouseYb] = absPlayer(
      player.x,
      player.y,
      Math.floor(mouseX / GRIDSIZE),
      Math.floor(mouseY / GRIDSIZE),
    );
  });
  canvas.addEventListener("click", () => {
    clicked(mouseX, mouseY);
  });
  console.log(canvas);

  ctx = canvas.getContext("2d")!;
  ctx.font = `${HEIGHT}px sans-serif`;
  setInterval(lifeCycle, 50);

  setInterval(save, 1000);

  setInterval(logicCycle, 50);
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

// @ts-ignore
window.map = map;
// @ts-ignore
window.player = player;
