export function displayNumber(x: number) {
  if (x >= 1e3) {
    let exp = Math.floor(Math.log10(x));
    let exp10 = 10 ** exp;
    let mant = x / exp10;
    return `${mant.toFixed(3)}e${exp}`;
  }
  return x.toFixed(3);
}

export function displayRAM(x: number) {
  if (x > 1073741824) {
    return displayNumber(x / 1073741824) + "\nGB";
  }
  if (x > 1048576) {
    return displayNumber(x / 1048576) + "\nMB";
  }
  return displayNumber(x / 1024) + "\nKB";
}
