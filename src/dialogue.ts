import { TEMP } from "./temp";

export const DIALOGUE = {
  conversation: 0,
  UItick: 0,
  messages: ["- Test Dialogue"],
  startConversation() {
    this.conversation = 1;
    TEMP.interact = 1;
    this.UItick = Date.now();
  },
  endConversation() {
    this.conversation = 0;
    this.UItick = 0;
    TEMP.interact = 0;
  },
};

declare global {
  interface Window {
    DIALOGUE: typeof DIALOGUE;
  }
}
window.DIALOGUE = DIALOGUE;
