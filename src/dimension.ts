import Decimal from "break_eternity.js";
import { player } from "./player";

export function dimensionCost(x: number): Decimal {
  if (player.dimensions[x][1].eq(0) && x == 0) {
    return new Decimal(0);
  }
  if (
    player.dimensions[x][1].gte(4) &&
    player.dimensions[x][1].lte(20) &&
    x == 0
  ) {
    return player.dimensions[0][1].sub(4).pow_base(1.1).mul(9216);
  }
  if (player.dimensions[x][1].gt(20) && x == 0) {
    return new Decimal(1 / 0);
  }
  if (player.dimensions[x][1].gt(57) && x == 1) {
    return new Decimal(1 / 0);
  }
  if (x == 1) {
    return player.dimensions[1][1].pow_base(1.1).mul(10240);
  }
  if (player.dimensions[x][1].gte(3) && x == 2) return new Decimal(1 / 0);
  if (player.dimensions[x][1].gte(1) && x == 3) return new Decimal(1 / 0);
  if (player.dimensions[x][1].eq(0) && x == 3) return new Decimal(53687091200);
  return player.dimensions[x][1]
    .add(x * 4)
    .pow_base(x + 2)
    .mul(1000);
}
export function dimensionMult(x: number): Decimal {
  return player.dimensions[x][1].pow_base(1.2).clampMax(75);
}
export function buyDimensions(x: number) {
  let cost = dimensionCost(x);
  if (player.ram.gte(cost)) {
    player.ram = player.ram.sub(cost.sub(8192)).clampMin(0);
    player.dimensions[x][1] = player.dimensions[x][1].add(1);
    player.dimensions[x][0] = player.dimensions[x][0].add(1);
  }
}

export function dimLoop(seconds: number) {
  player.ram =
    // Math.min(
    // 21990232555520,
    player.ram.add(player.dimensions[0][0].mul(dimensionMult(0)).mul(seconds));
  // );
  for (let i = 1; i < 4; i++) {
    player.dimensions[i - 1][0] = player.dimensions[i - 1][0]
      .add(player.dimensions[i][0].mul(dimensionMult(i)).mul(seconds))
      .clampMax(1e9);
  }
}
