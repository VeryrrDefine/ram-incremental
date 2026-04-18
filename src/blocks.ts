import { player } from "./player";

export class Block {
  color = "#ffff00";
  content = "1e98";
  textcolor = "#000000";
  data: any;
  solid() {
    return false;
  }
  onTouch(): [remove: boolean] {
    return [false];
  }
}
export const WALL = new Block();
WALL.color = "#ffffff";
WALL.content = "";
WALL.solid = () => true;

export const POINT_GENERATOR = new Block();
POINT_GENERATOR.color = "#00ffffff";
POINT_GENERATOR.content = "Point generator";

export const PLAYERBLOCK = new Block();
PLAYERBLOCK.color = "#008cffff";
PLAYERBLOCK.content = "Player";

export function genTextBlock(x: string) {
  let bl = new Block();
  bl.color = "#000000";
  bl.content = x;
  bl.textcolor = "#ffffff";
  return bl;
}

export function genDoor(x: string) {
  let bl = new Block();
  bl.color = "#ffff00ff";
  bl.content = "门";
  bl.textcolor = "#000000";
  bl.data = x;

  bl.solid = () => true;

  return bl;
}

export function genFeature(x: string[]) {
  let bl = new Block();
  bl.color = "#00ffffff";
  bl.content = x[1];
  bl.data = x[2];
  bl.textcolor = "#000000";
  bl.onTouch = function () {
    player.features.push(bl.data);
    switch (bl.data) {
      case "point":
        player.points += 1;
        break;
    }
    return [true];
  };
  return bl;
}

export function genTP(x: string[]) {
  let bl = new Block();
  bl.color = "rgba(0, 0, 255, 1)";
  bl.content = x[1] || "传送门";
  bl.data = [x[2], x[3]];
  bl.textcolor = "#ffffff";
  bl.onTouch = function () {
    player.x = +bl.data[0];
    player.y = +bl.data[1];
    return [false];
  };
  return bl;
}
