// interaction.ts
import { player, addMapBlock } from "./gameState";
import { canvasToWorld, isInRect, GRIDSIZE } from "./geometry";
import { getBlock, passable } from "./collision"; // 下面定义
import { getReplaceMapOfUniverse } from "./universe";
import { TEMP } from "./temp";
import { openItem } from "./items";
import { executeUI, UI } from "./ui";
import { ctx } from "./render";

// 移动逻辑
export function tryMove(dx: number, dy: number) {
  if (TEMP.interact) return;
  // Limit player go left on ploting
  if (
    (dx == -1 || dy == -1) &&
    player.features.includes("25_1") &&
    !player.features.includes("25_1_done")
  )
    return;
  const newX = player.x + dx;
  const newY = player.y + dy;

  if (passable(newX, newY)) {
    player.x = newX;
    player.y = newY;
  } else {
    const block = getBlock(newX, newY);

    if (!block) return;
    if (block.solidInteractionable()) {
      block.onTouch();
    }
    return;
  }
  const block = getBlock(player.x, player.y);
  let universe = player.universe;
  let touch = block?.onTouch?.() ?? [false];
  if (touch[0]) {
    getReplaceMapOfUniverse(universe).push([
      player.x,
      player.y,
      touch[1] || "NULL",
    ]);
  }
  if (player.features.includes("collram")) player.ram += 1;
}

// 点击处理
export function handleClick(canvasX: number, canvasY: number) {
  UI.map((x) => executeUI(x, canvasX, canvasY, ctx));

  if (
    isInRect(canvasX, canvasY, 672, 0, 720, 48) &&
    player.features.includes("item")
  ) {
    openItem();
    return;
  }

  if (player.editing) {
    const [worldX, worldY] = canvasToWorld(
      player.x,
      player.y,
      Math.floor(canvasX / GRIDSIZE),
      Math.floor(canvasY / GRIDSIZE),
    );
    addMapBlock(worldX, worldY, "WALL", player.universe);
  }
}

export function removeArrayElement<T>(arr: Array<T>, ele: T) {
  let ind = -1;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] == ele) {
      ind = i;
      break;
    }
  }
  if (ind !== -1) arr.splice(ind, 1);

  return arr;
}
