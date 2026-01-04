import { useEffect, useCallback, useRef } from "react";

/**
 * Hook para escuchar eventos globales en `window` de manera estable.
 * Protegido contra doble registro en React Strict Mode.
 *
 * @param events - Array de nombres de eventos del navegador.
 * @param handler - Función que se ejecuta cuando se dispara un evento.
 * @param options - Opciones de `addEventListener` (passive, capture, once, etc.).
 */
export function useGlobalWindowEvents(
  events: string[],
  handler: (event: Event) => void,
  options?: boolean | AddEventListenerOptions
) {
  const stabilizedHandler = useCallback(handler, [handler]);

  // Ref para evitar registrar múltiples veces en Strict Mode
  const registeredRef = useRef(false);

  useEffect(() => {
    if (!events || events.length === 0) return;
    if (registeredRef.current) return; // ya registrado, salir

    registeredRef.current = true;

    // Registrar todos los eventos
    events.forEach((eventName) => {
      window.addEventListener(eventName, stabilizedHandler, options);
    });

    // Cleanup: eliminar listeners y resetear ref
    return () => {
      events.forEach((eventName) => {
        window.removeEventListener(eventName, stabilizedHandler, options);
      });
      registeredRef.current = false;
    };
  }, [events, stabilizedHandler, options]);
}
