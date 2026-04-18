// interaction.ts
import { player, addMapBlock } from "./gameState";
import { canvasToWorld, isInRect, GRIDSIZE } from "./geometry";
import { getBlock, passable } from "./collision"; // 下面定义
import { getReplaceMapOfUniverse } from "./universe";

// 移动逻辑
export function tryMove(dx: number, dy: number) {
  const newX = player.x + dx;
  const newY = player.y + dy;
  if (passable(newX, newY)) {
    player.x = newX;
    player.y = newY;
  } else {
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

  if (player.addArrowButton) {
    if (isInRect(canvasX, canvasY, 64, 512, 128, 576)) tryMove(0, -1);
    else if (isInRect(canvasX, canvasY, 0, 576, 64, 640)) tryMove(-1, 0);
    else if (isInRect(canvasX, canvasY, 64, 576, 128, 640)) tryMove(0, 1);
    else if (isInRect(canvasX, canvasY, 128, 576, 192, 640)) tryMove(1, 0);
  }

  if (player.openedMenu) {
    const configurations = [
      ["Editing", "editing"],
      ["Openmenu", "openedMenu"],
      ["ArrowButton", "addArrowButton"],
    ];
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
