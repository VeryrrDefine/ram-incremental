export class Block {
  color = "#ffff00";
  content = "1e98";
  textcolor = "#000000";
  data: any;
  solid() {
    return false;
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
