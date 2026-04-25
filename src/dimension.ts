import { player } from "./player";

export function dimensionCost(x: number) {
  return (x + 2) ** (player.dimensions[x][1] + x * 4) * 1000;
}
export function dimensionMult(x: number) {
  return 1.2 ** player.dimensions[x][1];
}
export function buyDimensions(x: number) {
  let cost = dimensionCost(x);
  if (player.ram >= cost) {
    player.ram -= cost - 8192;
    player.dimensions[x][1]++;
    player.dimensions[x][0] += 1;
  }
}

export function dimLoop(seconds: number) {
  player.ram += player.dimensions[0][0] * dimensionMult(0) * seconds;
  for (let i = 1; i < 4; i++) {
    player.dimensions[i - 1][0] +=
      player.dimensions[i][0] * dimensionMult(i) * seconds;
  }
}
