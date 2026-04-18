export { player } from "./player";
// 全局地图引用（稍后从 map.ts 导入并设置）
import { map as staticMap } from "./map";
export let dynamicMap = staticMap; // 允许运行时修改（如编辑模式）

// 辅助：更新地图（例如编辑模式添加方块）
export function addMapBlock(x: number, y: number, type: string) {
  dynamicMap.push([x, y, type]);
}
