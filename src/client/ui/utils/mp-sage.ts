// mp-safe.ts
const mpSafe = (window as any).mp ?? {
  trigger: (...args: any[]) => {
    console.log("[mp.trigger MOCK]", ...args);
  },
  events: {
    add: (...args: any[]) => {
      console.log("[mp.events.add MOCK]", ...args);
    },
    remove: (...args: any[]) => {
      console.log("[mp.events.remove MOCK]", ...args);
    }
  },
  gui: {
    chat: {
      push: (...args: any[]) => {
        console.log("[mp.gui.chat.push MOCK]", ...args);
      }
    }
  }
};

export default mpSafe;