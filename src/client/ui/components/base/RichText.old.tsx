import TranslationManager from "../../../../shared/TranslationManager";
import { useTranslation } from "../../hooks/useTranslation";
import type { TranslationKey } from "../../../../shared/translation.types";

type Props = {
  k: TranslationKey;
  params?: Record<string, string | number>;
  fallback?: string;
};

export function RichText({ k, params, fallback }: Props) {
  const { t, ready } = useTranslation("es");
  if (!ready) return <div>Cargando...</div>;
  return <div>{t(k, params)}</div>;
}
