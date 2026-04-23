export function delay(x: number) {
  return new Promise((r) => {
    setTimeout(function () {
      r(x);
    }, x);
  });
}
