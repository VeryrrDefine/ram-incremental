import Decimal from "break_eternity.js";
import { player } from "./player";
import type { DecimalSource } from "break_eternity.js";
import type { UIopt } from "./ui";
import { Rect } from "./rect";
import { displayNumber } from "./display";

// player.generatorUpgrades 的类型为 Record<number, Decimal>
// 存储每个生成器升级的当前等级（或数量）

/**
 * 可用货币的名称（可根据需要扩展）
 */
type CurrencyName = keyof typeof CURRENCIES; // 此处为 'POINTS'

/**
 * 货币操作接口：获取当前值、设置新值
 */
interface CurrencyHandler {
  get: () => Decimal;
  set: (x: DecimalSource) => Decimal;
  display: (x: Decimal) => string;
  name: string;
}

/**
 * 升级项的结构：描述、花费、使用的货币类型
 */
interface Upgrade {
  description: () => string;
  cost: () => Decimal;
  currency: CurrencyName; // 使用具体的货币名称字面量
}

/**
 * 游戏中的货币定义
 * 每个货币需要有 getter 和 setter，操作 player 对象上的对应字段
 */
export const CURRENCIES = {
  POINTS: {
    get() {
      return player.points;
    },
    set(x: DecimalSource) {
      return (player.points = new Decimal(x));
    },
    display: displayNumber,
    name: "点数",
  },
} satisfies Record<string, CurrencyHandler>; // 满足索引签名，允许通过字符串访问

/**
 * 所有普通升级的配置列表
 */
export const UPGRADES: Upgrade[] = [
  {
    description() {
      return "移除维度的所有硬上限";
    },
    cost() {
      return GENERATOR_UPGRADES.upgradeAmount(0).gte(1)
        ? Decimal.dInf
        : new Decimal("5e9");
    },
    currency: "POINTS", // 类型安全，只能是 'POINTS'
  },
  // 后续可添加更多升级
];

/**
 * 生成器升级（可叠加升级）的操作集合
 * 管理 player.generatorUpgrades 中每个升级的数量
 */
export const GENERATOR_UPGRADES = {
  /**
   * 获取指定升级的当前数量
   * @param upgrade_id 升级的 ID（数组索引）
   * @returns 当前数量（Decimal 类型），若未初始化则设为 0 并返回
   */
  upgradeAmount(upgrade_id: number): Decimal {
    if (!(player.generatorUpgrades[upgrade_id] instanceof Decimal)) {
      // 首次访问，初始化为 0
      player.generatorUpgrades[upgrade_id] = new Decimal(0);
    }
    return player.generatorUpgrades[upgrade_id];
  },

  /**
   * 更新指定升级的数量
   * @param upgrade_id 升级 ID
   * @param newAmount 新的数量（Decimal）
   * @returns 更新后的数量
   */
  updateUpgradeAmount(upgrade_id: number, newAmount: Decimal): Decimal {
    return (player.generatorUpgrades[upgrade_id] = newAmount);
  },

  /**
   * 尝试购买一个生成器升级
   * @param upgrade_id 要购买的升级 ID
   * @returns 是否购买成功（true=成功，false=货币不足）
   * @throws 如果升级 ID 不存在则抛出错误
   */
  buyUpgrade(upgrade_id: number): boolean {
    // 检查升级是否存在
    const upgradeObject = UPGRADES[upgrade_id];
    if (upgradeObject === undefined) {
      throw new Error(`Upgrade with id ${upgrade_id} does not exist`);
    }

    // 获取该升级所需的货币类型
    const currencyName = upgradeObject.currency;
    // 通过货币名称获取对应的操作对象（类型安全，因为 currencyName 是 'POINTS'）
    const currencyObj = CURRENCIES[currencyName];
    const currentCurrency: Decimal = currencyObj.get();
    const cost: Decimal = upgradeObject.cost();

    // 检查货币是否足够
    if (cost.gt(currentCurrency)) {
      return false;
    }

    // 扣除货币
    currencyObj.set(currentCurrency.sub(cost));

    // 增加该升级的数量（购买一次数量 +1）
    const currentAmount = this.upgradeAmount(upgrade_id);
    this.updateUpgradeAmount(upgrade_id, currentAmount.add(1));

    return true;
  },
};

export function upgradeComponent(x: number, cx: number, cy: number): UIopt[] {
  let inrect = [45 + cx * 170 + 2, 227 + cy * 170 + 2, 168 - 2, 168 - 2];
  return [
    {
      type: "rect",
      rect: new Rect(45 + cx * 170, 227 + cy * 170, 168, 168),
      fore: "#ffffff",
    },
    {
      type: "rect",
      rect: new Rect(45 + cx * 170 + 2, 227 + cy * 170 + 2, 168 - 4, 168 - 4),
      fore: "#000000",
      onClick() {
        GENERATOR_UPGRADES.buyUpgrade(x);
      },
    },
    {
      type: "text",
      rect: new Rect(inrect[0], inrect[1] + 2, inrect[2], inrect[3]),
      text() {
        return UPGRADES[x].description();
      },
      fore: "#ffffff",
      size: 21,
      align: ["center", "top"],
    },
    {
      type: "text",
      rect: new Rect(inrect[0], inrect[1] + 100, inrect[2], inrect[3] - 100),
      text() {
        return `价格: ${CURRENCIES[UPGRADES[x].currency].display(UPGRADES[x].cost())}${CURRENCIES[UPGRADES[x].currency].name}`;
      },
      fore: "#ffffff",
      size: 21,
      align: "center",
    },
  ];
}
