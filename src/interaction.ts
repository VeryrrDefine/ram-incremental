// interaction.ts
import { player, addMapBlock } from "./gameState";
import { canvasToWorld, isInRect, GRIDSIZE } from "./geometry";
import { getBlock, passable } from "./collision"; // 下面定义
import { getReplaceMapOfUniverse } from "./universe";
import { TEMP } from "./temp";
import { configurations } from "./configurations";
import { openItem, useItem1 } from "./items";
import { itemsUI } from "./ui";
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
  const menuIconRect = [720 - 32, 720 - 32, 720, 720] as [
    number,
    number,
    number,
    number,
  ];
  if (isInRect(canvasX, canvasY, ...menuIconRect)) {
    player.openedMenu = !player.openedMenu;
    return;
  }
  if (
    isInRect(canvasX, canvasY, 672, 0, 720, 48) &&
    player.features.includes("item")
  ) {
    openItem();
    return;
  }

  if (player.addArrowButton) {
    if (isInRect(canvasX, canvasY, 64, 512, 128, 576)) tryMove(0, -1);
    else if (isInRect(canvasX, canvasY, 0, 576, 64, 640)) tryMove(-1, 0);
    else if (isInRect(canvasX, canvasY, 64, 576, 128, 640)) tryMove(0, 1);
    else if (isInRect(canvasX, canvasY, 128, 576, 192, 640)) tryMove(1, 0);
  }
  if (TEMP.openeditem) {
    let t = itemsUI(ctx).but;
    for (let i = 0; i < t.length; i++) {
      if (
        isInRect(
          canvasX,
          canvasY,
          t[i][0],
          t[i][1],
          t[i][0] + t[i][2],
          t[i][1] + t[i][3],
        )
      ) {
        useItem1(t[i][4]);
      }
    }
  }
  if (player.openedMenu) {
    const idx = player.configurationOrder;
    const [_, key] = configurations[idx];
    if (isInRect(canvasX, canvasY, 652, 652, 668, 668)) {
      // @ts-ignore
      player[key] = !player[key];
      return;
    } else if (isInRect(canvasX, canvasY, 688, 652, 704, 668)) {
      player.configurationOrder =
        (player.configurationOrder + 1) % configurations.length;
      return;
    }
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
