// render.ts
import { canvasToWorld, GRIDSIZE, isInRect, worldToCanvas } from "./geometry";
import { getBlock } from "./collision"; // 后面会定义
import { player } from "./gameState";
import { Block, genTextBlock, PLAYERBLOCK } from "./blocks";
import { FONT } from "./font";
import { DIALOGUE } from "./dialogue";
import { TEMP } from "./temp";
import { displayNumber, displayRAM } from "./display";
import { drawUI, itemsUI, UI } from "./ui";
import { assets } from "./assets";
import { TextDrawer } from "./text";
import { Rect } from "./rect";

const nothingness = genTextBlock("那边什么都没有\n别看了");

export let ctx: CanvasRenderingContext2D;

export function initRenderer(canvas: HTMLCanvasElement, img: HTMLImageElement) {
  ctx = canvas.getContext("2d")!;
  assets.image = img;
  ctx.font = `21px ${FONT}`; // HEIGHT = 21
}

const HEIGHT = 21;
function drawText(x: number, y: number, str: string, fs: string) {
  let drawer = new TextDrawer(str, 21, fs, "center");
  drawer.autoChangeSize = true;
  drawer.drawInRect(new Rect(x, y, GRIDSIZE, GRIDSIZE), ctx);

  // let text = str;
  // let curheight = HEIGHT;

  // let parts = text.split("\n");
  // let width = Math.max(...parts.map((x) => ctx.measureText(x).width));
  // while (width > GRIDSIZE) {
  //   curheight -= 0.5;
  //   ctx.font = `${curheight}px  ${FONT}`;
  //   width = Math.max(...parts.map((x) => ctx.measureText(x).width));
  // }
  // for (let i = 0; i < parts.length; i++) {
  //   ctx.fillText(
  //     parts[i],
  //     x + (GRIDSIZE - width) / 2,
  //     y +
  //       (GRIDSIZE - HEIGHT) / 2 +
  //       HEIGHT -
  //       3 +
  //       i * HEIGHT -
  //       (parts.length - 1) * HEIGHT * 0.5,
  //   );
  // }

  ctx.font = `${HEIGHT}px  ${FONT}`;
}

function drawBlock(block: Block, x: number, y: number) {
  ctx.fillStyle = block.color;
  ctx.fillRect(x, y, GRIDSIZE, GRIDSIZE);
  ctx.fillStyle = block.textcolor;
  const content = block.contentDynamic ? block.contentDynamic() : block.content;
  drawText(x, y, content, block.textcolor);
}
export function renderGame() {
  ctx.font = `21px ${FONT}`; // HEIGHT = 21
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
      if (block) {
        drawBlock(block, i * GRIDSIZE, j * GRIDSIZE);
        for (let q = 0; q < TEMP.attack_effect.length; q++) {
          if (
            TEMP.attack_effect[q][0] == wx &&
            TEMP.attack_effect[q][1] == wy
          ) {
            if (Date.now() - TEMP.attack_effect[q][2] >= 1000) break;
            ctx.fillStyle =
              "rgba(255,0,0," +
              (Date.now() - TEMP.attack_effect[q][2]) / 1000 +
              ")";
            ctx.fillRect(i * GRIDSIZE, j * GRIDSIZE, GRIDSIZE, GRIDSIZE);
          }
          /**
             * 
        ctx.fillStyle = "rgba(255,0,0,0.5)";
        ctx.fillRect(i * GRIDSIZE, j * GRIDSIZE, GRIDSIZE, GRIDSIZE);
             */
        }
      }
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

  for (const ui of UI) {
    drawUI(ui, ctx);
  }

  if (player.features.includes("item")) {
    ctx.drawImage(assets.image, 0, 128, 48, 48, 720 - 48, 0, 48, 48);
    ctx.fillStyle = "#ffffff";
    ctx.font = "15px " + FONT;
    let meas = ctx.measureText("Items");
    ctx.fillText("Items", 720 - 48 + (48 - meas.width) / 2, 28);
  }
  if (TEMP.openeditem) {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(48, 48, 624, 624);
    ctx.fillStyle = "#000000";
    ctx.fillRect(50, 50, 620, 620);
    ctx.fillStyle = "#ffffff";
    ctx.font = "20px " + FONT;
    let rows = [
      "Player Status",
      "Points: " + displayNumber(player.points),
      "RAM: " + displayRAM(player.ram),
      "Last Save: " + new Date(TEMP.lastSave).toUTCString(),
    ];
    for (let i = 0; i < rows.length; i++) {
      ctx.fillText(rows[i], 48, 48 + 20 * (i + 1));
    }

    let q = itemsUI(ctx);
    let u = q.ui;
    // let w = q.but;
    // ctx.fillStyle = "#ff0000";
    // for (let i = 0; i < w.length; i++) {
    //   ctx.fillRect(w[i][0], w[i][1], w[i][2], w[i][3]);
    // }
    ctx.fillStyle = "#ffffff";
    for (let i = 0; i < u.length; i++) {
      ctx.fillText(u[i][0], u[i][1], u[i][2]);
    }
    // rows = [];

    // for (let j = 0; j < ITEMS.length; j++) {
    //   if (player.items[ITEMS[j]]) {
    //     rows.push(`${ITEMS[j]}: ${player.items[ITEMS[j]]}`);
    //   }
    // }
    // for (let i = 0; i < rows.length; i++) {
    //   let meas = ctx.measureText(rows[i]);
    //   ctx.fillText(rows[i], 48, 320 + 20 * (i + 1));
    //   ctx.fillText("Use", 48 + meas.width + 10, 320 + 20 * (i + 1));
    // }
  }
  if (DIALOGUE.conversation) {
    let dialogueTick = Date.now() - DIALOGUE.UItick;
    if (dialogueTick >= 600) {
      ctx.fillStyle = "#fff700";
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
        "按Enter或点击继续对话，按Shift或双击结束对话",
      );
      ctx.fillText(
        "按Enter或点击继续对话，按Shift或双击结束对话",
        689 - right2.width,
        690,
      );
    } else if (dialogueTick >= 0) {
      let heightPercent = dialogueTick / 600;
      ctx.fillStyle = "#fff700";
      ctx.fillRect(20, 500, 680, 200 * heightPercent);
      ctx.fillStyle = "#000";
      if (200 * heightPercent - 8 > 0) {
        ctx.fillRect(24, 504, 672, 200 * heightPercent - 8);
      }
    }
  }

  if (TEMP.endless_e19728_animation) {
    ctx.fillStyle = "rgba(0, 0, 0, " + TEMP.endless_e19728_animation / 5 + ")";
    ctx.fillRect(0, 0, 720, 720);
  }
  // if (NOTIFY.expires > Date.now()) {
  //   ctx.fillStyle = "#fff";
  //   ctx.fillRect(200, 20, 360, 40);
  //   ctx.fillStyle = "#000";
  //   ctx.font = "30px " + FONT;
  //   let measure = ctx.measureText(NOTIFY.content);
  //   ctx.fillText(NOTIFY.content, 200 + (360 - measure.width) / 2, 20 + 30);
  // }
}
