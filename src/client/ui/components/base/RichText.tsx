// src/client/ui/components/base/RichText.improved.tsx
/**
 * RichText Mejorado
 * Ahora usa LanguageContext para cambios dinámicos de idioma
 */

import { useLanguage } from "../../contexts/LanguageContext";
import { useTranslation } from "../../hooks/useTranslation";
import type { TranslationKey } from "../../../../shared/translation.types";

type Props = {
  k: TranslationKey;
  params?: Record<string, string | number>;
  fallback?: string;
  className?: string;
};

export function RichText({ k, params, fallback, className }: Props) {
  const { lang } = useLanguage();
  const { t, ready } = useTranslation(lang);

  if (!ready) {
    return <div className={className}>Cargando idioma...</div>;
  }

  const translation = t(k, params);
  
  // Si la traducción no se encuentra y hay fallback
  if (translation === k && fallback) {
    return <div className={className}>{fallback}</div>;
  }

  return <div className={className}>{translation}</div>;
}
