import { delay } from "./await";
import { gamegTime } from "./gamegTime";
import { stepsLinear } from "./geometry";
import { player } from "./player";
import { TEMP } from "./temp";

function stepsToInfinity(
  setFunc: (x: number) => void,
  from: number,
  time: number,
) {
  return new Promise((res) => {
    if (time <= 0) setFunc(Infinity);
    let cur = from;
    let dt = Date.now();
    // let ticks = Math.floor(time / 50);
    let q = setInterval(() => {
      cur = from + 1000 / (1 - (Date.now() - dt) / time) - 1000;
      setFunc(cur);
    }, 50);

    setTimeout(() => {
      clearInterval(q);
      setFunc(Infinity);
    }, time);

    setTimeout(function () {
      res("");
    }, time + 1);
  });
}

export const TIME_GOES_BY = {
  time_goes_by_animation: 0,
  time_goes_by_days: 0,
  start_tgb_tick: Date.now(),
  async runTimeGoesBy(days: number, ticks: number = 30000) {
    TIME_GOES_BY.start_tgb_tick = Date.now();
    await stepsLinear(
      (x) => (TIME_GOES_BY.time_goes_by_animation = x),
      0,
      100,
      3000,
    );
    await delay(500);

    await stepsLinear(
      (x) => (TIME_GOES_BY.time_goes_by_days = x),
      0,
      days,
      ticks,
    );
    TIME_GOES_BY.start_tgb_tick = Date.now();
    TIME_GOES_BY.time_goes_by_days = 0;
    player.playerday += days;
    await stepsLinear(
      (x) => (TIME_GOES_BY.time_goes_by_animation = x),
      100,
      0,
      3000,
    );
  },

  forevermode: false,
  async runTimeGoesByForever() {
    TIME_GOES_BY.start_tgb_tick = Date.now();
    await stepsLinear(
      (x) => (TIME_GOES_BY.time_goes_by_animation = x),
      0,
      100,
      3000,
    );
    await delay(500);
    TIME_GOES_BY.forevermode = true;
    await stepsToInfinity(
      (x) => (TIME_GOES_BY.time_goes_by_days = x * 100),
      0,
      60000,
    );

    await stepsLinear((x) => (TEMP.endless_e19728_animation = x), 0, 5, 5000);
    location.reload();
    // await stepsLinear(
    //   (x) => (TIME_GOES_BY.time_goes_by_days = x),
    //   0,
    // );
  },
  getDateDisplay() {
    let gamegTime2 = gamegTime(
      player.playerday +
        (TIME_GOES_BY.time_goes_by_days <= 0.00005787037037037037
          ? (Date.now() - TIME_GOES_BY.start_tgb_tick) / 86400e3
          : 0) +
        TIME_GOES_BY.time_goes_by_days,
    );
    if (!isFinite(gamegTime2)) return "???";
    if (TIME_GOES_BY.forevermode && gamegTime2 >= 32503651200000) {
      return Math.floor(
        gamegTime2 / 31536000e3 + (3000 - 1030.6840182648402),
      ).toString();
    }
    return new Date(gamegTime2).toLocaleString();
  },
};
