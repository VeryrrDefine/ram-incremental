import { TEMP } from "./temp";

export const DIALOGUE = {
  conversation: 0,
  UItick: 0,
  messages: ["- Test Dialogue"],
  stillInteraction: false,
  startConversation() {
    this.conversation = 1;
    TEMP.interact = 1;
    this.UItick = Date.now();
  },
  waitUntilDialogueDone() {
    return new Promise(function (res) {
      let q = setInterval(function () {
        if (DIALOGUE.conversation == 0) {
          clearInterval(q);
          res(true);
        }
      }, 100);
    });
  },
  endConversation() {
    this.conversation = 0;
    this.UItick = 0;
    if (!DIALOGUE.stillInteraction) TEMP.interact = 0;
    DIALOGUE.stillInteraction = false;
    DIALOGUE.afterConversation();
    DIALOGUE.afterConversation = function () {};
  },
  afterConversation() {},
};

// declare global {
//   interface Window {
//     DIALOGUE: typeof DIALOGUE;
//   }
// }
// window.DIALOGUE = DIALOGUE;
