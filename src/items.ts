import { hardReset, player } from "./player";
import { TEMP } from "./temp";

export function openItem() {
  if (TEMP.interact == 1) return;
  if (TEMP.openeditem) {
    TEMP.openeditem = false;
    TEMP.interact = 0;
    return;
  }
  TEMP.openeditem = true;
  TEMP.interact = 2;
}

export const ITEMS = ["purplecrystal", "generator"];

export let informations: any = {
  purplecrystal: "使用后存档将被硬重置",
  generator: "可生产RAM",
};

export function useItem2(item: string) {
  if (item == "purplecrystal") {
    if (confirm("确实要硬重置！？？"))
      if (confirm("确实要硬重置！？？？")) hardReset();
  }
  if (item == "generator") {
    player.generatorOpen = true;
    TEMP.interact = 0;
    TEMP.openeditem = false;
  }
}
export function useItem1(item: string) {
  let conf = confirm("确定要使用物品" + item + "吗？");
  if (conf) {
    useItem2(item);
  }
}
