export function displayNumber(x: number) {
  if (x == 1 / 0) {
    return "∞";
  }
  if (x >= 1e3) {
    let exp = Math.floor(Math.log10(x));
    let exp10 = 10 ** exp;
    let mant = x / exp10;
    return `${mant.toFixed(3)}e${exp}`;
  }
  return x.toFixed(3);
}

export function displayRAM(x: number, withln = true) {
  if (x > 2 ** 60) {
    return displayNumber(x) + (withln ? "\n" : "") + "B";
  }
  if (x > 2 ** 50) {
    return displayNumber(x / 2 ** 50) + (withln ? "\n" : "") + "PB";
  }
  if (x > 2 ** 40) {
    return displayNumber(x / 2 ** 40) + (withln ? "\n" : "") + "TB";
  }
  if (x > 1073741824) {
    return displayNumber(x / 1073741824) + (withln ? "\n" : "") + "GB";
  }
  if (x > 1048576) {
    return displayNumber(x / 1048576) + (withln ? "\n" : "") + "MB";
  }
  return displayNumber(x / 1024) + (withln ? "\n" : "") + "KB";
}
