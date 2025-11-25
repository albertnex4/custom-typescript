import type { TranslationKey } from "./translation.types";

type TemplateValues = Record<string, string | number>;

class TranslationManager {
  private static _instance: TranslationManager;
  static get instance() {
    return this._instance ?? (this._instance = new TranslationManager());
  }

  private currentLang = "en";
  static cache = new Map<string, any>();
  private listeners = new Set<() => void>();

  private constructor() {}

  /**
   * Carga un idioma.
   * En React/CEF usa fetch, en RAGE scripts usa require/fs
   */
  async loadLanguage(lang: string) {
    if (!TranslationManager.cache.has(lang)) {
      let dict;

      if (typeof window !== "undefined") {
        // React/CEF
        const isDev = location.port === "5173";
        const path = isDev
          ? `/translations/${lang}.json`
          : `./translations/${lang}.json`;
        const res = await fetch(path);
        dict = await res.json();
      } else {
        // RAGE scripts (Node environment)

        //dict = await import(`./translations/${lang}.json`);

        /*const fs = require("fs");
        const path = require("path");
        const filePath = path.resolve(__dirname, "translations", `${lang}.json`);
        const raw = fs.readFileSync(filePath, "utf-8");
        dict = JSON.parse(raw);*/
      }

      TranslationManager.cache.set(lang, dict);
    }

    this.currentLang = lang;
    this.notify();
  }

  /**
   * Traduce una key con valores opcionales
   */
  t(key: TranslationKey, params?: TemplateValues): string {
    const dict = TranslationManager.cache.get(this.currentLang);
    if (!dict) return key;

    let text = dict[key];
    if (!text) return key;

    if (params) {
      for (const k in params) {
        text = text.replace(new RegExp(`{{${k}}}`, "g"), String(params[k]));
      }
    }

    return text;
  }

  /**
   * Plurales opcionales
   */
  tp(singularKey: TranslationKey, pluralKey: TranslationKey, amount: number): string {
    const key = amount === 1 ? singularKey : pluralKey;
    return this.t(key, { amount });
  }

  /**
   * Suscribirse a cambios (React)
   */
  onChange(cb: () => void) {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  private notify() {
    for (const cb of this.listeners) cb();
  }
}

export default TranslationManager;
