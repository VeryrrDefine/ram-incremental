import { player } from "./player";

export class Block {
  color = "#ffff00";
  content = "1e98";
  textcolor = "#000000";
  data: any;
  solid() {
    return false;
  }
  onTouch(): [remove: boolean, replaceTo?: string] {
    return [false];
  }
  contentDynamic?(): string;
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
  //TP?PSEUDO?17?23?1?1
  bl.solid = () => {
    if (bl.data == "1327" && player.ram >= 8.25 * 1024) {
      return false;
    }
    if (bl.data == "1723" && player.ram >= 9.5 * 1024) {
      return false;
    }
    return true;
  };
  bl.onTouch = () => {
    if (bl.data == "1327" && player.ram >= 8.25 * 1024) {
      return [true];
    }
    if (bl.data == "1723" && player.ram >= 9.5 * 1024) {
      return [true, "TP?PSEUDO?17?23?0"];
    }
    return [false];
  };
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

export function genTP(x: string[], pseudo2 = false) {
  let pseudo = x[1] == "PSEUDO" || pseudo2;
  let bl = new Block();
  bl.color = pseudo ? "#000000" : "rgba(0, 0, 255, 1)";
  bl.content = x[1] || (pseudo ? "" : "传送门");
  bl.data = [x[2], x[3], x[4]];
  bl.textcolor = pseudo ? "#000000" : "#ffffff";
  bl.onTouch = function () {
    player.x = +bl.data[0];
    player.y = +bl.data[1];
    console.log(bl.data[2]);
    if (bl.data[2]) {
      player.universe = +bl.data[2];
    }
    return [false];
  };
  return bl;
}
