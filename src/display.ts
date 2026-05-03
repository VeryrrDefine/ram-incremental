import type Decimal from "break_eternity.js";

export function displayNumber(x: Decimal): string {
  // return x.toString();
  if (x.lt(0)) {
    return "-" + displayNumber(x.abs());
  }
  if (x.eq(1 / 0)) {
    return "∞";
  }
  if (x.gte("e1e6")) {
    let exp = x.log10();
    return `e${displayNumber(exp)}`;
  }
  if (x.gte(1e3)) {
    let exp = x.log10().floor();
    let exp10 = exp.pow10();
    let mant = x.div(exp10);
    return `${mant.toNumber().toFixed(3)}e${exp}`;
  }
  return x.toNumber().toFixed(3);
}

export function displayRAM(x: Decimal, withln = true) {
  if (x.gte(2 ** 60)) {
    return displayNumber(x) + (withln ? "\n" : "") + "B";
  }
  if (x.gte(2 ** 50)) {
    return displayNumber(x.div(2 ** 50)) + (withln ? "\n" : "") + "PB";
  }
  if (x.gte(2 ** 40)) {
    return displayNumber(x.div(2 ** 40)) + (withln ? "\n" : "") + "TB";
  }
  if (x.gte(2 ** 30)) {
    return displayNumber(x.div(2 ** 30)) + (withln ? "\n" : "") + "GB";
  }
  if (x.gte(2 ** 20)) {
    return displayNumber(x.div(2 ** 20)) + (withln ? "\n" : "") + "MB";
  }
  return displayNumber(x.div(2 ** 10)) + (withln ? "\n" : "") + "KB";
}
