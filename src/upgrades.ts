import { player } from "./player";

export const UPGRADES = {
  "16_7": {
    content: "每秒点数+1",
    cost() {
      return ((player.upgrades["16_7"] ?? 0) + 1) ** 2;
    },
    onBuy() {
      if (UPGRADES["16_7"].cost() <= player.points) {
        player.points -= UPGRADES["16_7"].cost();
        player.upgrades["16_7"] = (player.upgrades["16_7"] ?? 0) + 1;
      }
    },
    currency: "点数",
  },
  "17_7": {
    content: "每秒RAM总量+1B",
    cost() {
      return ((player.upgrades["17_7"] ?? 0) + 1) ** 2.3;
    },
    onBuy() {
      if (UPGRADES["17_7"].cost() <= player.points) {
        player.points -= UPGRADES["17_7"].cost();
        player.upgrades["17_7"] = (player.upgrades["17_7"] ?? 0) + 1;
      }
    },
    currency: "点数",
  },
  "19_7": {
    content: "基于总点数\n增加RAM总量\n每秒获取",
    cost() {
      return player.upgrades["19_7"] ? 1 / 0 : 1536;
    },
    onBuy() {
      if (UPGRADES["19_7"].cost() <= player.points) {
        player.points -= 1536;
        player.upgrades["19_7"] = 1;
      }
    },
    currency: "点数",
  },
  "20_7": {
    content: "基于RAM总量\n增加RAM总量\n每秒获取",
    cost() {
      return player.upgrades["20_7"] ? 1 / 0 : 30720;
    },
    onBuy() {
      if (UPGRADES["20_7"].cost() <= player.ram) {
        player.ram -= 22528;
        player.upgrades["20_7"] = 1;
      }
    },
    currency: "RAM",
  },
  "20_8": {
    content: "基于总点数\n增加点数\n每秒获取",
    cost() {
      return player.upgrades["20_8"] ? 1 / 0 : 81920;
    },
    onBuy() {
      if (UPGRADES["20_8"].cost() <= player.ram) {
        player.upgrades["20_8"] = 1;
      }
    },
    currency: "RAM",
  },
} as any;
