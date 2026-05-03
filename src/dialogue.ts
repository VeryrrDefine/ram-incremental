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
