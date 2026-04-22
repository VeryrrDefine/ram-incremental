import { informations, ITEMS } from "./items";
import { player } from "./player";

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
