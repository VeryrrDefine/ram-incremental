import { assets } from "./assets";
import { BATTLE } from "./battle";
import { configurations } from "./configurations";
import { DIALOGUE } from "./dialogue";
import { buyDimensions, dimensionCost, dimensionMult } from "./dimension";
import { displayNumber, displayRAM } from "./display";
import { canvasToWorld } from "./geometry";
import { removeArrayElement, tryMove } from "./interaction";
import { informations, ITEMS, useItem1 } from "./items";
import { mouse } from "./mouse";
import { player } from "./player";
import { Rect } from "./rect";
import { ctx } from "./render";
import { TEMP } from "./temp";
import { TextDrawer, type Align, type VerticialAlign } from "./text";

export function executeUI(
  x: UIopt,
  mouseX: number,
  mouseY: number,
  ctx: CanvasRenderingContext2D,
) {
  let rect = rectizeUI(x, ctx);
  if (!rect) return;
  if (rect.collidepoint(mouseX, mouseY)) {
    if (x.type == "group") {
      for (const ui of x.group()) {
        executeUI(ui, mouseX, mouseY, ctx);
      }
      return;
    }
    console.log("I have been executed: ", x);
    x.onClick?.();
  }
}
export function rectizeUI(
  x: UIopt,
  ctx: CanvasRenderingContext2D,
): Rect | null {
  switch (x.type) {
    case "text":
      let drawer = new TextDrawer(
        x.text(),
        x.size,
        x.fore ?? "#ffffff",
        "left",
      );
      drawer.align = typeof x.align == "string" ? x.align : x.align[0];
      if (Array.isArray(x.align)) drawer.verticialAlign = x.align[1];

      return drawer.toRect(x.rect, ctx);

    case "group":
      if (x.condition()) {
        let rects: Rect[] = [];
        for (const ui of x.group()) {
          let r = rectizeUI(ui, ctx);
          if (r) rects.push(r);
        }
        return rects.reduce((prev, cur) => prev.union(cur));
      } else {
        return null;
      }
    case "rect":
      return x.rect;
    case "image":
      return new Rect(
        x.canvas_left,
        x.canvas_top,
        x.canvas_width ?? x.image_width,
        x.canvas_height ?? x.image_height,
      );
  }
}
export function drawUI(x: UIopt, ctx: CanvasRenderingContext2D) {
  switch (x.type) {
    case "text":
      let drawer = new TextDrawer(
        x.text(),
        x.size,
        x.fore ?? "#ffffff",
        "left",
      );
      drawer.align = typeof x.align == "string" ? x.align : x.align[0];
      if (Array.isArray(x.align)) drawer.verticialAlign = x.align[1];

      drawer.drawInRect(x.rect, ctx);
      break;
    case "group":
      if (x.condition()) {
        for (const ui of x.group()) {
          drawUI(ui, ctx);
        }
      }
      break;
    case "rect":
      ctx.fillStyle = x.fore;
      ctx.fillRect(x.rect.left, x.rect.top, x.rect.width, x.rect.height);
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
  | ((
      | {
          type: "text";
          rect: Rect;
          text(): string;
          fore?: string;
          back?: string;
          size: number;
          align: [Align, VerticialAlign] | Align;
        }
      | {
          type: "rect";
          rect: Rect;
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
        }
    ) & {
      onClick?(): void;
    })
  | {
      type: "group";
      condition(): boolean;
      group(): UIopt[];
    };
export const UI = [
  {
    type: "image",
    image_left: 0,
    image_top: 0,
    image_width: 32,
    image_height: 32,
    canvas_left: 720 - 32,
    canvas_top: 720 - 32,
    onClick() {
      player.openedMenu = !player.openedMenu;
    },
  },
  // menu
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
          rect: new Rect(650, 600, 68, 86),
        },
        {
          type: "text",
          size: 10,
          rect: new Rect(650, 570, 100, 100),
          // left: 650,
          // bottom: 610,
          align: "left",
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
          onClick() {
            const idx = player.configurationOrder;
            const [_, key] = configurations[idx];
            // @ts-ignore
            player[key] = !player[key];
          },
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
          onClick() {
            player.configurationOrder =
              (player.configurationOrder + 1) % configurations.length;
          },
        },
      ];
    },
  },
  // arrow button
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
          onClick() {
            tryMove(0, -1);
          },
        },
        {
          type: "image",
          image_left: 32,
          image_top: 64,
          image_width: 64,
          image_height: 64,
          canvas_left: 0,
          canvas_top: 576,
          onClick() {
            tryMove(-1, 0);
          },
        },
        {
          type: "image",
          image_left: 160,
          image_top: 0,
          image_width: 64,
          image_height: 64,
          canvas_left: 64,
          canvas_top: 576,
          onClick() {
            tryMove(0, 1);
          },
        },
        {
          type: "image",
          image_left: 96,
          image_top: 0,
          image_width: 64,
          image_height: 64,
          canvas_left: 128,
          canvas_top: 576,
          onClick() {
            tryMove(1, 0);
          },
        },
      ];
    },
  },
  // generator
  {
    type: "group",
    condition() {
      return player.generatorOpen;
    },
    group() {
      return [
        {
          type: "rect",
          fore: "#fff",
          rect: new Rect(32, 32, 688 - 32, 688 - 32),
        },
        {
          type: "rect",
          fore: "#000",
          rect: new Rect(34, 34, 686 - 34, 686 - 34),
        },
        {
          type: "image",
          image_left: 48,
          image_top: 128,
          image_width: 48,
          image_height: 48,
          canvas_left: 34,
          canvas_top: 34,
          onClick() {
            player.generatorOpen = false;
          },
        },
        {
          type: "text",
          rect: new Rect(216, 50, 200, 30),
          text() {
            return displayRAM(player.ram, false);
          },
          align: "left",
          size: 21,
        },
        {
          type: "group",
          condition() {
            return !player.features.includes("JOHN_BAIXIE_VISITED");
          },
          group(): UIopt[] {
            return [
              {
                type: "text",
                fore: "#fff",
                rect: new Rect(34, 34, 686 - 34, 686 - 34),
                text() {
                  return "缺了点啥...?";
                },
                align: "center",
                size: 21,
              },
            ];
          },
        },
        {
          type: "group",
          condition() {
            return (
              player.features.includes("JOHN_BAIXIE_VISITED") &&
              !player.features.includes("REAL_3")
            );
          },
          group(): UIopt[] {
            return [
              {
                type: "rect",
                fore: "#fff",
                rect: new Rect(148, 255, 372, 197),
              },
              {
                type: "text",
                fore: "#000",
                rect: new Rect(148, 255, 372, 197),
                text() {
                  return "我需要重置...我的点数和RAM...还有升级...";
                },
                align: "center",
                size: 21,
                onClick() {
                  player.points = 0;
                  player.ram = 8192;
                  player.upgrades["20_8"] = 0;
                  player.upgrades["20_7"] = 0;
                  player.upgrades["17_7"] = 0;
                  player.upgrades["16_7"] = 0;
                  player.upgrades["19_7"] = 0;
                  removeArrayElement(player.features, "collram");
                  removeArrayElement(player.features, "auto1");
                  player.features.push("REAL_3");
                },
              },
            ];
          },
        },
        {
          type: "group",
          condition() {
            return player.features.includes("REAL_3");
          },
          group(): UIopt[] {
            let res: UIopt[] = [];
            for (let i = 0; i < 4; i++) {
              let r1 = new Rect(48, 60 + i * 23, 600, 100);
              res.push({
                type: "text",
                rect: r1,
                text() {
                  return (
                    "RAM Dim. " +
                    i +
                    "   +" +
                    displayNumber(player.dimensions[i][0]) +
                    ` *${displayNumber(dimensionMult(i))} [${displayNumber(player.dimensions[i][1])}]`
                  );
                },
                fore: "#ffffff",
                size: 21,
                align: "left",
              });
              res.push({
                type: "text",
                rect: r1,
                text() {
                  return "[Cost: " + displayRAM(dimensionCost(i), false) + "]";
                },
                fore: "#ffffff",
                size: 21,
                align: "right",
                onClick() {
                  buyDimensions(i);
                },
              });
            }
            return res;
          },
        },
      ];
    },
  },
  // items
  {
    type: "group",
    condition() {
      return TEMP.openeditem;
    },
    group() {
      let rows = [];
      for (let j = 0; j < ITEMS.length; j++) {
        if (player.items[ITEMS[j]]) {
          rows.push([`${ITEMS[j]}: ${player.items[ITEMS[j]]}`, ITEMS[j]]);
        }
      }
      let res: UIopt[] = [];
      for (let i = 0; i < rows.length; i++) {
        // let usemeas = ctx.measureText("Use");

        let q: UIopt = {
          type: "text",
          rect: new Rect(48, 320 + 20 * i, 720, 50),
          text() {
            return rows[i][0] + " " + informations[rows[i][1]];
          },
          size: 20,
          align: "left",
          fore: "#ffffff",
        };
        res.push(q);

        res.push({
          type: "text",
          rect: new Rect(
            48 + rectizeUI(q, ctx)!.width + 10,
            320 + 20 * i,
            720,
            50,
          ),
          text() {
            return "Use";
          },
          size: 20,
          align: "left",
          fore: "#ffffff",
          onClick() {
            useItem1(rows[i][1]);
          },
        });
        // texts.push([
        //   rows[i][0] + " " + informations[rows[i][1]],
        //   48,
        //   320 + 20 * (i + 1),
        // ]);
        // texts.push(["Use", 48 + meas.width + 10, 320 + 20 * (i + 1)]);
        // buttons.push([
        //   48 + meas.width + 10,
        //   320 + 20 * (i + 1) - 20,
        //   usemeas.width,
        //   20,
        //   rows[i][1],
        // ]);
      }
      return res;
    },
  },
  // mask
  {
    type: "group",
    condition() {
      return TEMP.battle_animation > 0;
    },
    group(): UIopt[] {
      return [
        {
          type: "rect",
          fore: `rgba(0, 0, 0, ${TEMP.battle_animation / 100})`,
          rect: new Rect(0, 0, 720, 720),
          onClick() {
            BATTLE.winBattle();
          },
        },
      ];
    },
  },
  {
    type: "group",
    condition() {
      return TEMP.battle_animation >= 100;
    },
    group(): UIopt[] {
      return [
        {
          type: "text",
          rect: new Rect(0, 50, 720, 120),
          text() {
            return `敌人 ${BATTLE.enemyName}${BATTLE.enemyAttackTick ? "[" + (BATTLE.enemyAttackTick / 20).toFixed(2) + "]" : ""}\nRAM ${displayRAM(BATTLE.enemyram, false)}/${displayRAM(BATTLE.enemyTotalram, false)}`;
          },
          align: "center",
          fore: "#fff",
          size: 21,
        },
        {
          type: "group",
          condition() {
            return TEMP.battle_animation <= 300 && TEMP.battle_animation >= 200;
          },
          group() {
            return [
              {
                type: "text",
                rect: new Rect(
                  0,
                  150 -
                    Math.sin(
                      ((TEMP.battle_animation - 200) / 100) * 3.1415926,
                    ) *
                      50,
                  720,
                  120,
                ),
                text() {
                  return "-" + displayRAM(TEMP.attack_ram, false);
                },
                align: "center",
                fore: "#f00",
                size: 23,
              },
            ];
          },
        },
        {
          type: "group",
          condition() {
            return TEMP.battle_animation <= 500 && TEMP.battle_animation >= 400;
          },
          group() {
            return [
              {
                type: "text",
                rect: new Rect(
                  0,
                  580 -
                    Math.sin(
                      ((TEMP.battle_animation - 400) / 100) * 3.1415926,
                    ) *
                      50,
                  720,
                  120,
                ),
                text() {
                  return "-" + displayRAM(TEMP.attack_ram, false);
                },
                align: "center",
                fore: "#f00",
                size: 23,
              },
            ];
          },
        },
        {
          type: "text",
          rect: new Rect(0, 600, 720, 120),
          text() {
            return `玩家 ${player.playername}${BATTLE.playerAttackTick ? "[" + (BATTLE.playerAttackTick / 20).toFixed(2) + "]" : ""}\nRAM ${displayRAM(BATTLE.ram, false)}/${displayRAM(player.ram, false)}`;
          },
          fore: "#fff",
          align: "center",
          size: 21,
        },
        {
          type: "rect",
          rect: new Rect(80, 324, 560, 200),
          fore: "#fff",
        },
        {
          type: "rect",
          rect: new Rect(82, 326, 556, 196),
          fore: "#000",
        },
        {
          type: "text",
          rect: new Rect(82, 326, 556, 196),
          fore: "#fff",
          text() {
            return BATTLE.interact == 1
              ? "Waiting..." + "\n" + TEMP.battle_tips
              : "Attack";
          },
          onClick() {
            BATTLE.playerAttack();
          },
          align: ["left", "top"],
          size: 21,
        },
      ];
    },
  },
  {
    type: "text",
    size: 21,
    rect: new Rect(0, 10, 720, 720),
    fore: "#008cff",
    align: ["left", "top"],
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
] as const satisfies UIopt[];
