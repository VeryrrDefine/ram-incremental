import { assets } from "./assets";
import { configurations } from "./configurations";
import { DIALOGUE } from "./dialogue";
import { FONT } from "./font";
import { canvasToWorld } from "./geometry";
import { informations, ITEMS } from "./items";
import { mouse } from "./mouse";
import { player } from "./player";
import { TEMP } from "./temp";

export function itemsUI(ctx: CanvasRenderingContext2D) {
  let rows = [];
  let texts: [string, number, number][] = [];
  let buttons: [number, number, number, number, string][] = [];
  for (let j = 0; j < ITEMS.length; j++) {
    if (player.items[ITEMS[j]]) {
      rows.push([`${ITEMS[j]}: ${player.items[ITEMS[j]]}`, ITEMS[j]]);
    }
  }
  for (let i = 0; i < rows.length; i++) {
    let meas = ctx.measureText(rows[i][0] + " " + informations[rows[i][1]]);
    let usemeas = ctx.measureText("Use");

    texts.push([
      rows[i][0] + " " + informations[rows[i][1]],
      48,
      320 + 20 * (i + 1),
    ]);
    texts.push(["Use", 48 + meas.width + 10, 320 + 20 * (i + 1)]);
    buttons.push([
      48 + meas.width + 10,
      320 + 20 * (i + 1) - 20,
      usemeas.width,
      20,
      rows[i][1],
    ]);
  }

  return { ui: texts, but: buttons };
}

export function drawUI(x: UIopt, ctx: CanvasRenderingContext2D) {
  switch (x.type) {
    case "text":
      if (x.fore) {
        ctx.fillStyle = x.fore;
      }
      ctx.font = x.size + " " + FONT;
      ctx.fillText(x.text(), x.left, x.bottom);
      break;
    case "group":
      if (x.condition()) {
        for (const ui of x.group()) {
          drawUI(ui, ctx);
        }
      }
      break;
    case "rect":
      let top = x.top;
      let left = x.left;
      let width = 1;
      let height = 1;
      if ("right" in x && "bottom" in x) {
        width = x.right - left;
        height = x.bottom - top;
      } else {
        width = x.width;
        height = x.height;
      }
      ctx.fillStyle = x.fore;
      ctx.fillRect(left, top, width, height);
      break;
    case "image":
      let sx = x.image_left;
      let sy = x.image_top;
      let sw = x.image_width;
      let sh = x.image_height;
      let dx = x.canvas_left;
      let dy = x.canvas_top;
      let dw = x.canvas_width ?? x.image_width;
      let dh = x.canvas_height ?? x.image_height;
      ctx.drawImage(assets.image, sx, sy, sw, sh, dx, dy, dw, dh);
      return;
  }
}

export type UIopt =
  | {
      type: "text";
      left: number;
      bottom: number;
      text(): string;
      fore?: string;
      back?: string;
      size: string;
    }
  | {
      type: "group";
      condition(): boolean;
      group(): UIopt[];
    }
  | {
      type: "rect";
      left: number;
      top: number;
      right: number;
      bottom: number;
      fore: string;
    }
  | {
      type: "rect";
      left: number;
      top: number;
      width: number;
      height: number;
      fore: string;
    }
  | {
      type: "image";
      image_left: number;
      image_top: number;
      image_width: number;
      image_height: number;
      canvas_left: number;
      canvas_top: number;
      canvas_width?: number;
      canvas_height?: number;
    };
export const UI = [
  {
    type: "text",
    size: "21px",
    left: 0,
    bottom: 30,
    fore: "#008cff",
    text() {
      return `\
player ${player.x},${player.y},${player.universe}|\
${mouse.mouseX},${mouse.mouseY}|${TEMP.interact}|${DIALOGUE.conversation}|${DIALOGUE.UItick}|\
${canvasToWorld(
  player.x,
  player.y,
  Math.floor(mouse.mouseX / 80),
  Math.floor(mouse.mouseY / 80),
).join(",")}`;
    },
  },
  {
    type: "image",
    image_left: 0,
    image_top: 0,
    image_width: 32,
    image_height: 32,
    canvas_left: 720 - 32,
    canvas_top: 720 - 32,
  },
  {
    type: "group",
    condition() {
      return player.openedMenu;
    },
    group() {
      return [
        {
          type: "rect",
          fore: "#8a8a8a",
          left: 650,
          top: 600,
          width: 68,
          height: 86,
        },
        {
          type: "text",
          size: "10px",
          left: 650,
          bottom: 610,
          fore: "#ffffff",
          text() {
            const conf = configurations[player.configurationOrder];
            // @ts-ignore
            return conf[0] + (player[conf[1]] ? "1" : "0");
          },
        },
        {
          type: "image",
          image_left: 0,
          image_top: 32,
          image_width: 16,
          image_height: 16,
          canvas_left: 652,
          canvas_top: 652,
        },
        {
          type: "image",
          image_left: 0,
          image_top: 48,
          image_width: 16,
          image_height: 16,
          canvas_left: 670,
          canvas_top: 652,
        },
        {
          type: "image",
          image_left: 16,
          image_top: 32,
          image_width: 16,
          image_height: 16,
          canvas_left: 688,
          canvas_top: 652,
        },
      ];
    },
  },
  {
    type: "group",
    condition() {
      return player.addArrowButton;
    },
    group() {
      return [
        {
          type: "image",
          image_left: 32,
          image_top: 0,
          image_width: 64,
          image_height: 64,
          canvas_left: 64,
          canvas_top: 512,
        },
        {
          type: "image",
          image_left: 32,
          image_top: 64,
          image_width: 64,
          image_height: 64,
          canvas_left: 0,
          canvas_top: 576,
        },
        {
          type: "image",
          image_left: 160,
          image_top: 0,
          image_width: 64,
          image_height: 64,
          canvas_left: 64,
          canvas_top: 576,
        },
        {
          type: "image",
          image_left: 96,
          image_top: 0,
          image_width: 64,
          image_height: 64,
          canvas_left: 128,
          canvas_top: 576,
        },
      ];
    },
  },
] as const satisfies UIopt[];
