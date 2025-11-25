import { useEffect, useState, useSyncExternalStore } from "react";
import TranslationManager from "../../../shared/TranslationManager";
import type { TranslationKey } from "../../../shared/translation.types";

export function useTranslation(lang: string = "en") {
  const [ready, setReady] = useState(false);

  // Cargar el idioma
  useEffect(() => {
    TranslationManager.instance.loadLanguage(lang).then(() => setReady(true));
  }, [lang]);

  // Suscribirse a cambios de TranslationManager
  const manager = useSyncExternalStore(
    (callback) => TranslationManager.instance.onChange(callback),
    () => TranslationManager.instance
  );

  const t = (key: TranslationKey, params?: Record<string, string | number>) =>
    manager.t(key, params);

  return { t, ready };
}
