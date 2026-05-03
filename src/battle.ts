import { delay } from "./await";
import { stepsLinear } from "./geometry";
import { player } from "./player";
import { TEMP } from "./temp";
export const battle_tips = [
  "When you 砰砰砰 with\nenemy, you sometimes attacks with 暴击(15%).\nIt will help you win this battle.",
  "When enemy 砰砰砰 with\nyou, enemy sometimes attacks with 暴击(10%)。\nIt will help you lost this battle.",
  "The game won't hard reset when you lost.\nYou just reload the game.",
];
export const BATTLE = {
  playerAttackTick: 0,
  enemyAttackTick: 0,
  ram: 8192,
  enemyram: 16492674416640,
  enemyTotalram: 16492674416640,
  interact: 0,
  win: false,
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
    BATTLE.enemyram = Math.max(0, BATTLE.enemyram - atk);
    await stepsLinear((x) => (TEMP.battle_animation = x), 200, 300, 1112);
    TEMP.battle_animation = 100;

    if (BATTLE.enemyram >= 8192) {
      BATTLE.enemyAttack();
    } else {
      TEMP.battle_tips = "You win! Click to complete.";
      BATTLE.win = true;
    }
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
    BATTLE.ram = Math.max(0, BATTLE.ram - atk);
    await stepsLinear((x) => (TEMP.battle_animation = x), 400, 500, 1112);
    TEMP.battle_animation = 100;
    if (BATTLE.ram >= 8192) {
      BATTLE.interact = 0;
    } else {
      TEMP.battle_tips =
        "You lost. The game will reload after 5 seconds.\n(Not obliverate like RBNR)";
      await stepsLinear((x) => (TEMP.endless_e19728_animation = x), 0, 5, 5000);
      location.reload();
    }
  },
  calculateEnemyAttack() {
    let atk =
      10 **
      (Math.log10(BATTLE.enemyTotalram / 50) + (Math.random() * 0.5 - 0.25));

    if (Math.random() < 0.1) {
      atk *= 30;
    }
    return atk;
  },
  calculatePlayerAttack() {
    let atk =
      10 ** (Math.log10(BATTLE.ram / 50) + (Math.random() * 0.5 - 0.25));

    if (Math.random() < 0.15) {
      atk *= 35;
    }
    return atk;
  },
};

declare global {
  interface Window {
    BATTLE: typeof BATTLE;
    TEMP: typeof TEMP;
  }
}
window.BATTLE = BATTLE;

window.TEMP = TEMP;
