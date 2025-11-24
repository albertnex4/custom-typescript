// mp-safe.ts
const mpSafe = (window as any).mp ?? {
  trigger: (...args: any[]) => {
    console.log("[mp.trigger MOCK]", ...args);
  },
  events: {
    add: (...args: any[]) => {
      console.log("[mp.events.add MOCK]", ...args);
    }
  }
};

export default mpSafe;
