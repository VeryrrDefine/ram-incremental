// render.ts
import { canvasToWorld, GRIDSIZE, isInRect, worldToCanvas } from "./geometry";
import { getBlock } from "./collision"; // 后面会定义
import { player } from "./gameState";
import { Block, genTextBlock, PLAYERBLOCK } from "./blocks";
import { NOTIFY } from "./notify";
import { mouse } from "./mouse";
import { FONT } from "./font";
import { DIALOGUE } from "./dialogue";
import { TEMP } from "./temp";

const nothingness = genTextBlock("那边什么都没有\n别看了");

let ctx: CanvasRenderingContext2D;
let assets: HTMLImageElement;

export function initRenderer(canvas: HTMLCanvasElement, img: HTMLImageElement) {
  ctx = canvas.getContext("2d")!;
  assets = img;
  ctx.font = `21px ${FONT}`; // HEIGHT = 21
}

const HEIGHT = 21;
function drawText(x: number, y: number, str: string) {
  let text = str;
  let curheight = HEIGHT;

  let parts = text.split("\n");
  let width = Math.max(...parts.map((x) => ctx.measureText(x).width));
  while (width > GRIDSIZE) {
    curheight -= 0.5;
    ctx.font = `${curheight}px  ${FONT}`;
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

  ctx.font = `${HEIGHT}px  ${FONT}`;
}

function drawBlock(block: Block, x: number, y: number) {
  ctx.fillStyle = block.color;
  ctx.fillRect(x, y, GRIDSIZE, GRIDSIZE);
  ctx.fillStyle = block.textcolor;
  const content = block.contentDynamic ? block.contentDynamic() : block.content;
  drawText(x, y, content);
}
export function renderGame() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, 2000, 2000);

  let antiCheckafter = isInRect(player.x, player.y, 6, 10, 11, 12);
  // 绘制 9x9 地图块
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const [wx, wy] = canvasToWorld(player.x, player.y, i, j);
      if (wx >= 13 && antiCheckafter) {
        if (wx == 13 && wy == 11) {
          drawBlock(nothingness, i * GRIDSIZE, j * GRIDSIZE);
        }
        continue;
      }
      const block = getBlock(wx, wy);
      if (block) drawBlock(block, i * GRIDSIZE, j * GRIDSIZE);
    }
  }

  // 绘制玩家
  drawBlock(PLAYERBLOCK, 320, 320);

  // 绘制坐标轴线（可选）
  ctx.strokeStyle = "#fff";
  ctx.beginPath();
  const [cx, cy] = worldToCanvas(player.x, player.y, 0, 0);
  ctx.moveTo(0, cy * GRIDSIZE);
  ctx.lineTo(720, cy * GRIDSIZE);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx * GRIDSIZE, 0);
  ctx.lineTo(cx * GRIDSIZE, 720);
  ctx.stroke();

  // 显示坐标信息
  ctx.fillStyle = "#008cff";
  ctx.fillText(
    `player ${player.x},${player.y},${player.universe}|${mouse.mouseX},${mouse.mouseY}|${TEMP.interact}|${DIALOGUE.conversation}|${DIALOGUE.UItick}`,
    0,
    30,
  );

  // 右下角菜单图标
  ctx.drawImage(assets, 0, 0, 32, 32, 720 - 32, 720 - 32, 32, 32);

  // 菜单 UI
  if (player.openedMenu) {
    ctx.font = "10px " + FONT;
    ctx.fillStyle = "#8a8a8a";
    ctx.fillRect(650, 600, 68, 86);
    ctx.fillStyle = "#fff";
    const configurations = [
      ["Editing", "editing"],
      ["Openmenu", "openedMenu"],
      ["ArrowButton", "addArrowButton"],
    ];
    const conf = configurations[player.configurationOrder];
    // @ts-ignore
    ctx.fillText(conf[0] + (player[conf[1]] ? "1" : "0"), 650, 610);
    ctx.drawImage(assets, 0, 32, 16, 16, 652, 652, 16, 16);
    ctx.drawImage(assets, 0, 48, 16, 16, 670, 652, 16, 16);
    ctx.drawImage(assets, 16, 32, 16, 16, 688, 652, 16, 16);
  }

  // 方向按钮
  if (player.addArrowButton) {
    ctx.drawImage(assets, 32, 0, 64, 64, 64, 512, 64, 64); // up
    ctx.drawImage(assets, 32, 64, 64, 64, 0, 576, 64, 64); // left
    ctx.drawImage(assets, 160, 0, 64, 64, 64, 576, 64, 64); // down
    ctx.drawImage(assets, 96, 0, 64, 64, 128, 576, 64, 64); // right
  }
  if (DIALOGUE.conversation) {
    let dialogueTick = Date.now() - DIALOGUE.UItick;
    if (dialogueTick >= 600) {
      ctx.fillRect(20, 500, 680, 200);
      ctx.fillStyle = "#000";
      ctx.fillRect(24, 504, 672, 192);
      ctx.fillStyle = "#fff";
      ctx.font = "37px " + FONT;
      let msg = DIALOGUE.messages[DIALOGUE.conversation - 1];
      let msgs = msg.split("\n");
      for (let i = 0; i < msgs.length; i++) {
        ctx.fillText(msgs[i], 32, 545 + i * 39);
      }
      ctx.font = "10px " + FONT;
      let right2 = ctx.measureText(
        "Press enter to next, shift to skip all dialogue",
      );
      ctx.fillText(
        "Press enter to next, shift to skip all dialogue",
        689 - right2.width,
        690,
      );
    } else if (dialogueTick >= 0) {
      let heightPercent = dialogueTick / 600;
      ctx.fillRect(20, 500, 680, 200 * heightPercent);
      ctx.fillStyle = "#000";
      if (200 * heightPercent - 8 > 0) {
        ctx.fillRect(24, 504, 672, 200 * heightPercent - 8);
      }
    }
  }
  if (NOTIFY.expires > Date.now()) {
    ctx.fillStyle = "#fff";
    ctx.fillRect(200, 20, 360, 40);
    ctx.fillStyle = "#000";
    ctx.font = "30px " + FONT;
    let measure = ctx.measureText(NOTIFY.content);
    ctx.fillText(NOTIFY.content, 200 + (360 - measure.width) / 2, 20 + 30);
  }
}
