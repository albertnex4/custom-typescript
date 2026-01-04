import type { TranslationKey } from "./translation.types";

type TemplateValues = Record<string, string | number>;

type TranslationsDict = Record<string, string>;

class TranslationManager {
  private static _instance: TranslationManager;
  static get instance() {
    return this._instance ?? (this._instance = new TranslationManager());
  }

  private currentLang = "en";
  // cache: lang -> flat map of key -> text
  private static cache = new Map<string, TranslationsDict>();
  private listeners = new Set<() => void>();

  private constructor() {}

  /**
   * Indica si un idioma está cargado en cache
   */
  has(lang: string) {
    return TranslationManager.cache.has(lang);
  }

  /**
   * Inserta las traducciones manualmente (útil para RAGE:MP donde no hay fetch)
   */
  setTranslations(lang: string, dict: TranslationsDict) {
    TranslationManager.cache.set(lang, dict);
    // If setting the current language, notify listeners
    if (this.currentLang === lang) this.notify();
  }

  /**
   * Limpia la cache de traducciones
   */
  clearCache() {
    TranslationManager.cache.clear();
  }

  /**
   * Carga un idioma.
   * - En React/CEF usa fetch (con path dev/prod)
   * - En RAGE intenta usar `require`/`globalThis.require` si existe
   * Si no se puede cargar automáticamente, el caller puede usar `setTranslations`
   */
  async loadLanguage(lang: string) {
    if (!TranslationManager.cache.has(lang)) {
      let dict: TranslationsDict | undefined;

      // Browser (React / CEF)
      if (typeof window !== "undefined") {
        try {
          const isDev = location.port === "5173" || location.hostname === "localhost";
          const path = isDev ? `/translations/${lang}.json` : `./translations/${lang}.json`;
          const res = await fetch(path);
          if (!res.ok) throw new Error(`Failed to fetch ${path}: ${res.status}`);
          dict = await res.json();
        } catch (err) {
          // If fetch fails, leave undefined — caller can provide via setTranslations
          console.error("TranslationManager: failed to fetch translations:", err);
        }
      } else {
        // Non-browser (RAGE:MP). Try require if available (bundled JSON)
        try {
          // Avoid referencing the bare `require` identifier to keep TS happy.
          const r: any = (globalThis as any).require ?? (globalThis as any).__non_webpack_require ?? undefined;
          if (typeof r === "function") {
            // NOTE: path is relative to this file at runtime after bundling
            // Try several fallbacks to locate translations
            try {
              dict = r(`./translations/${lang}.json`);
            } catch (e) {
              try {
                dict = r(`../client/ui/public/translations/${lang}.json`);
              } catch (e2) {
                // give up — caller should set translations
                console.warn("TranslationManager: require failed to load translations", e, e2);
              }
            }
          }
        } catch (err) {
          console.warn("TranslationManager: no require available to load translations", err);
        }
      }

      if (dict) {
        TranslationManager.cache.set(lang, dict);
      }
    }

    this.currentLang = lang;
    this.notify();
  }

  /**
   * Traducir una key sencilla con reemplazo de parámetros.
   * Retorna `fallback` o la key si no existe traducción.
   */
  t(key: string, params?: TemplateValues, fallback?: string): string {
    const dict = TranslationManager.cache.get(this.currentLang);
    if (!dict) return fallback ?? key;

    let text = dict[key];
    if (text == null) return fallback ?? key;

    if (params) {
      for (const k in params) {
        text = text.replace(new RegExp(`{{${k}}}`, "g"), String(params[k]));
      }
    }

    return text;
  }

  /**
   * Obtener múltiples traducciones por prefijo de grupo.
   * Ej: getGroup('ui') devuelve todas las keys que empiezan por 'ui.'
   * stripPrefix = true -> en las keys devueltas se elimina 'ui.'
   */
  getGroup(prefix: string, stripPrefix = true): TranslationsDict {
    const dict = TranslationManager.cache.get(this.currentLang) ?? {};
    const result: TranslationsDict = {};
    const p = prefix.endsWith('.') ? prefix : `${prefix}.`;
    for (const k in dict) {
      if (k.startsWith(p)) {
        const outKey = stripPrefix ? k.slice(p.length) : k;
        result[outKey] = dict[k];
      }
    }
    return result;
  }

  /**
   * Plurales opcionales: recibe la key singular y plural o un patrón
   */
  tp(singularKey: string, pluralKey: string, amount: number, params?: TemplateValues, fallback?: string): string {
    const key = amount === 1 ? singularKey : pluralKey;
    const merged = { ...(params ?? {}), amount } as TemplateValues;
    return this.t(key, merged, fallback);
  }

  /**
   * Suscribirse a cambios (React u otros) — devuelve una función para desuscribir
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
