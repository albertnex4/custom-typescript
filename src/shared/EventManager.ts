import mp from "../client/ui/utils/mp-sage";
/**
 * EventManager Centralizado
 * Proporciona un sistema de eventos type-safe para toda la aplicación
 */

type EventCallback<T = any> = (data: T) => void;
type Unsubscribe = () => void;

//TODO -> Ejemplo de patron suscripción, falta probar y implementar
interface EventMap {
  // Cliente -> Servidor
  "client:helloWorld": string;
  "client:playerAction": { action: string; data: any };
  "cif:testNew": string;
  
  // Servidor -> Cliente
  "server:notification": { title: string; message: string };
  "server:playerUpdate": { playerId: number; health: number };
  
  // Interno UI
  "ui:languageChanged": string;
  "ui:browserToggled": boolean;
}
class EventManager {
  private events = new Map<string, Set<EventCallback>>();
  private listeners = new Map<string, Set<EventCallback>>();
  private executer:any;

  public constructor(executer = null) {
    this.executer = executer;
  }

  public execute(event:string, params:any) {
    this.executer(event, params);
  }

  /**
   * Suscribirse a un evento
   * @param event Nombre del evento
   * @param callback Función a ejecutar
   * @returns Función para desuscribirse
   */
  on<K extends keyof EventMap>(event: K, callback: EventCallback<EventMap[K]>
  ): Unsubscribe {
    if (!this.events.has(event as string)) {
      this.events.set(event as string, new Set());
      mp.events.add(event, callback);
    }
    
    this.events.get(event as string)!.add(callback);
    
    return () => {
      this.events.get(event as string)!.delete(callback);
    };
  }

  /**
   * Suscribirse una única vez
   */
  once<K extends keyof EventMap>(event: K, callback: EventCallback<EventMap[K]>
  ): Unsubscribe {
    const unsubscribe = this.on(event, (data: EventMap[K]) => {
      callback(data);
      unsubscribe();
    });
    return unsubscribe;
  }

  /**
   * Emitir un evento
   */
  emit<K extends keyof EventMap>(event: K, data: EventMap[K]) {
    this.events.get(event as string)?.forEach(callback => {
      try {
        //mp.trigger(event, data);
        //callback(data);
      } catch (error) {
        console.error(`Error en evento ${String(event)}:`, error);
      }
    });
    
    // Notificar a listeners
    this.listeners.get("*")?.forEach(callback => {
      try {
        callback({ event, data });
      } catch (error) {
        console.error(`Error en listener global:`, error);
      }
    });
  }

  /**
   * Debug: Escuchar todos los eventos
   */
  onAny(callback: EventCallback) {
    if (!this.listeners.has("*")) {
      this.listeners.set("*", new Set());
    }
    this.listeners.get("*")!.add(callback);
  }

  /**
   * Obtener número de listeners de un evento
   */
  getListenerCount<K extends keyof EventMap>(event: K): number {
    return this.events.get(event as string)?.size ?? 0;
  }

  /**
   * Limpiar todos los eventos
   */
  clear() {
    this.events.clear();
    this.listeners.clear();
  }
}

export const eventManager = new EventManager();
export const eventManagerClass = EventManager;
export type { EventCallback, Unsubscribe, EventMap };
