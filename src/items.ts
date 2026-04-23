import { DIALOGUE } from "./dialogue";
import { hardReset, save } from "./player";
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

export const ITEMS = ["purplecrystal"];

export let informations: any = {
  purplecrystal: "使用后存档将被硬重置",
};

export function useItem2(item: string) {
  if (item == "purplecrystal") {
    hardReset();
  }
}
export function useItem1(item: string) {
  let conf = confirm("确定要使用物品" + item + "吗？");
  if (conf) {
    useItem2(item);
  }
}
