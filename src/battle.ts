import Decimal from "break_eternity.js";
import { delay } from "./await";
import { displayNumber } from "./display";
import { stepsLinear } from "./geometry";
import { player } from "./player";
import { TEMP } from "./temp";
export const battle_tips = [
  "当你攻击敌人时，你有15%的概率会施展暴击。\n这会帮你赢得这场战斗。",
  "当你攻击敌人时，你有10%的概率会施展暴击。\n这会帮你输掉这场战斗。",
  "当你失败时，你不会被硬重置，只需要重新加载游戏。",
];
export const enemies = [
  {
    name: "门",
    totalRam: new Decimal(16492674416640),
  },
  {
    name: "门",
    totalRam: new Decimal(32985348833280),
  },
  {
    name: "Endless_e308",
    totalRam: new Decimal("e1.425e8"),
  },
];
export const BATTLE = {
  playerAttackTick: 0,
  enemyAttackTick: 0,
  ram: new Decimal(8192),
  enemyram: new Decimal(16492674416640),
  enemyTotalram: new Decimal(16492674416640),
  enemyName: "啊",
  enemyid: 0,
  interact: 0,
  win: false,
  failed: false,
  afterBattle() {},
  async winBattle() {
    if (BATTLE.win) {
      await stepsLinear((x) => (TEMP.battle_animation = x), 100, 0, 1112);
      BATTLE.win = false;
      TEMP.battle_animation = 0;
      BATTLE.interact = 0;
      TEMP.interact = 0;
      BATTLE.afterBattle();
    }
  },
  async startBattle() {
    TEMP.interact = 1;
    TEMP.newspapercontent = 0;
    player.generatorOpen = false;
    BATTLE.enemyram = enemies[BATTLE.enemyid].totalRam;
    BATTLE.enemyTotalram = enemies[BATTLE.enemyid].totalRam;
    BATTLE.enemyName = enemies[BATTLE.enemyid].name;
    await stepsLinear((x) => (TEMP.battle_animation = x), 0, 100, 1112);
    BATTLE.ram = player.ram;
    console.log("I no money, I no money, No kill me, No kill me");
    console.log("I will kill you!!!");
  },
  async playerAttack() {
    if (BATTLE.interact) return;
    BATTLE.interact = 1;
    TEMP.battle_tips =
      battle_tips[Math.floor(Math.random() * battle_tips.length)];
    await stepsLinear((x) => (BATTLE.playerAttackTick = x), 0, 100, 1112);
    BATTLE.playerAttackTick = 0;
    let atk = BATTLE.calculatePlayerAttack();
    TEMP.attack_ram = atk;
    BATTLE.enemyram = BATTLE.enemyram.sub(atk).clampMin(0);
    await stepsLinear((x) => (TEMP.battle_animation = x), 200, 300, 1112);
    TEMP.battle_animation = 100;

    if (BATTLE.enemyram.gte(8192)) {
      BATTLE.enemyAttack();
    } else {
      let pt = BATTLE.enemyPointGain();
      player.points = player.points.add(pt);
      TEMP.battle_tips =
        "你赢了！ 你获得了" + displayNumber(pt) + " 点数.\n点击继续。";
      BATTLE.win = true;
    }
  },
  enemyPointGain() {
    return new Decimal(1e9).add(Math.random() * 1e9);
  },
  async enemyAttack() {
    await delay(300 + Math.random() * 500);

    let delayP = Math.random() + 1;
    await stepsLinear(
      (x) => (BATTLE.enemyAttackTick = x),
      0,
      100 * delayP,
      1112 * delayP,
    );

    BATTLE.enemyAttackTick = 0;
    let atk = BATTLE.calculateEnemyAttack();
    TEMP.attack_ram = atk;
    BATTLE.ram = BATTLE.ram.sub(atk).clampMin(0);
    if (BATTLE.ram.lt(8192)) {
      BATTLE.failed = true;
    }
    await stepsLinear((x) => (TEMP.battle_animation = x), 400, 500, 1112);
    TEMP.battle_animation = 100;
    if (BATTLE.ram.gte(8192)) {
      BATTLE.interact = 0;
    } else {
      TEMP.battle_tips =
        "你失败了。 该游戏会在5秒后重新加载。\n（不像RBNR抹杀那样）";
      await stepsLinear((x) => (TEMP.endless_e19728_animation = x), 0, 5, 5000);
      BATTLE.failed = true;
      location.reload();
    }
  },
  calculateEnemyAttack(): Decimal {
    let atk = BATTLE.enemyTotalram
      .div(50)
      .log10()
      .add(Math.random() * 0.5 - 0.25)
      .pow10();

    if (Math.random() < 0.1) {
      atk = atk.mul(30);
    }
    return atk;
  },
  calculatePlayerAttack(): Decimal {
    let atk = BATTLE.ram
      .div(50)
      .log10()
      .add(Math.random() * 0.5 - 0.25)
      .pow10();

    if (Math.random() < 0.15) {
      atk = atk.mul(35);
    }
    return atk;
  },
};

// declare global {
//   interface Window {
//     BATTLE: typeof BATTLE;
//     TEMP: typeof TEMP;
//   }
// }
// window.BATTLE = BATTLE;

// window.TEMP = TEMP;
