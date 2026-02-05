# 🎨 UIManager - Sistema de Gestión de UI (CEF) en RAGE:MP

El **UIManager** es una clase Singleton que gestiona la creación, visualización y comunicación con la interfaz de usuario basada en CEF (Chromium Embedded Framework) en RAGE:MP.

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Arquitectura Singleton](#-arquitectura-singleton)
- [Inicialización y Ciclo de Vida](#-inicialización-y-ciclo-de-vida)
- [Métodos Principales](#-métodos-principales)
- [Comunicación Client ↔ UI](#-comunicación-client--ui)
- [Ejemplos Prácticos](#-ejemplos-prácticos)
- [Eventos del Navegador](#-eventos-del-navegador)
- [Buenas Prácticas](#-buenas-prácticas)
- [API Reference](#-api-reference)

---

## ✨ Características

- ✅ **Patrón Singleton**: Solo una instancia en toda la aplicación
- ✅ **Gestión automática del ciclo de vida** del navegador CEF
- ✅ **Sistema de promesas** para esperar la carga del DOM
- ✅ **Control de visibilidad** con show/hide
- ✅ **Comunicación bidireccional** Client ↔ UI
- ✅ **Navegación entre vistas** con hash routing
- ✅ **Sistema de observadores** para cambios de visibilidad
- ✅ **Gestión de cursor** automática

---

## 🏗️ Arquitectura Singleton

### ¿Qué es un Singleton?

El patrón Singleton garantiza que **solo exista una instancia** de la clase en toda la aplicación.

```typescript
// ✅ CORRECTO - Siempre la misma instancia
const ui1 = UIManager.instance;
const ui2 = UIManager.instance;
console.log(ui1 === ui2); // true

// ❌ INCORRECTO - Constructor privado
const ui3 = new UIManager(); // Error: Constructor is private
```

### Ventajas del Singleton

1. **Control centralizado**: Un solo punto de gestión de la UI
2. **Estado compartido**: Todos acceden a la misma instancia
3. **Prevención de duplicados**: Imposible crear múltiples navegadores
4. **Fácil acceso global**: `UIManager.instance` desde cualquier parte

---

## 🔄 Inicialización y Ciclo de Vida

### Diagrama de Estados

```
┌──────────────┐
│  Instancia   │
│   Creada     │
└──────┬───────┘
       │
       │ showAsync()
       ▼
┌──────────────┐
│   Browser    │ ◄──── mp.browsers.new()
│   Creado     │
└──────┬───────┘
       │
       │ Event: browserDomReady
       ▼
┌──────────────┐
│  DOM Ready   │ ◄──── Resuelve ready()
│ (Listo para  │
│   comunicar) │
└──────┬───────┘
       │
       │ hide()
       ▼
┌──────────────┐
│   Oculto     │ ◄──── Navegador sigue activo
│ (No visible) │
└──────┬───────┘
       │
       │ destroy()
       ▼
┌──────────────┐
│  Destruido   │ ◄──── Navegador eliminado
└──────────────┘
```

### Flujo de Creación

```typescript
// 1. Obtener instancia
const uiManager = UIManager.instance;

// 2. Mostrar UI (crea navegador si no existe)
await uiManager.showAsync();

// 3. Esperar a que DOM esté listo (si necesitas garantía)
await uiManager.ready();

// 4. Comunicar con UI
uiManager.callUI("ui:addRacePositionElement", JSON.stringify(data));

// 5. Ocultar UI (navegador sigue activo)
uiManager.hide();

// 6. Destruir completamente (opcional)
UIManager.destroyInstance();
```

---

## 🛠️ Métodos Principales

### 1. `showAsync()` - Mostrar UI

Muestra la interfaz de usuario. Si el navegador no existe, lo crea.

```typescript
async showAsync(): Promise<void>
```

**Comportamiento:**
- ✅ Crea el navegador si es la primera vez
- ✅ Espera a que el DOM esté listo
- ✅ Muestra el cursor
- ✅ Dispara evento `open-app` en la UI
- ✅ Restaura la vista anterior (`actualView`)

**Ejemplo:**
```typescript
// Mostrar UI al presionar F1
mp.keys.bind(0x70, true, async () => {
  await UIManager.instance.showAsync();
});
```

---

### 2. `hide()` - Ocultar UI

Oculta la interfaz pero **NO destruye** el navegador.

```typescript
hide(): void
```

**Comportamiento:**
- ✅ Oculta el cursor
- ✅ Dispara evento `close-app` en la UI
- ✅ Notifica a observadores
- ✅ El navegador sigue activo en segundo plano

**Ejemplo:**
```typescript
// Ocultar UI al presionar ESC
mp.keys.bind(0x1B, true, () => {
  UIManager.instance.hide();
});
```

---

### 3. `toggleAsync()` - Alternar visibilidad

Muestra u oculta según el estado actual.

```typescript
async toggleAsync(): Promise<void>
```

**Ejemplo:**
```typescript
// Alternar UI al presionar F2
mp.keys.bind(0x71, true, async () => {
  await UIManager.instance.toggleAsync();
});
```

---

### 4. `callUI()` - Ejecutar función en UI

Llama a un evento registrado con `mp.events.add()` en la UI React.

```typescript
callUI(functionName: string, ...args: any[]): void
```

**Ejemplo Client → UI:**

```typescript
// Client-side (RAGE:MP)
const checkpoint = {
  id: 1,
  position: { x: 100, y: 200, z: 30 },
  scale: 5
};

UIManager.instance.callUI(
  "ui:addRacePositionElement", 
  JSON.stringify(checkpoint)
);
```

```typescript
// React UI (CEF)
mp.events.add("ui:addRacePositionElement", (checkpointJson: string) => {
  const checkpoint = JSON.parse(checkpointJson);
  console.log("Checkpoint recibido:", checkpoint);
  // Añadir a la lista de checkpoints...
});
```

---

### 5. `ready()` - Esperar DOM listo

Devuelve una promesa que se resuelve cuando el DOM está cargado.

```typescript
async ready(): Promise<void>
```

**Uso típico:**
```typescript
await UIManager.instance.showAsync();
await UIManager.instance.ready(); // Garantiza que DOM está listo

// Ahora puedes comunicar con seguridad
UIManager.instance.callUI("ui:initialize", "data");
```

**Timeout de seguridad:** Si el DOM no carga en 10 segundos, la promesa se rechaza.

---

### 6. `changeUrl()` - Cambiar vista (routing)

Cambia la ruta hash de la UI (para navegación entre vistas).

```typescript
changeUrl(url: string, params?: string): void
```

**Ejemplo:**
```typescript
// Navegar a vista de inventario
UIManager.instance.changeUrl("#/inventory");

// Navegar a vista de checkpoint
UIManager.instance.changeUrl("#/checkpoint-editor");
```

**En React Router:**
```tsx
// App.tsx
import { HashRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/checkpoint-editor" element={<CheckpointEditor />} />
      </Routes>
    </HashRouter>
  );
}
```

---

### 7. `dispatchEvent()` - Disparar evento nativo JS

Dispara un evento nativo del navegador usando `window.dispatchEvent()`.

```typescript
dispatchEvent(eventName: string, params?: Object): void
```

**Implementación interna:**
```typescript
// UIManager.ts
dispatchEvent(eventName: string, params?: Object): void {
  const jsCommand = `window.dispatchEvent(new Event("${eventName}"));`
  this.execute(jsCommand);
}
```

**Eventos predefinidos del sistema:**
- `open-app` - Se dispara cuando se muestra la UI
- `close-app` - Se dispara cuando se oculta la UI
- `toggle-app` - Se dispara al alternar visibilidad

---

#### 🎯 Implementación en React (UI)

Para escuchar estos eventos en React, se recomienda usar el **hook `useGlobalWindowEvents`**:

**Hook personalizado:**
```typescript
// hooks/useGlobalWindowEvents.ts
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
    if (registeredRef.current) return; // Ya registrado, salir

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
```

**Uso en Root component:**
```tsx
// main.tsx o index.tsx
const Root = () => {
  const visible = useUIStore((s) => s.visible);
  const toggleVisible = useUIStore((s) => s.toggleVisible);
  const show = useUIStore((s) => s.show);
  const hide = useUIStore((s) => s.hide);

  // ✅ Escuchar eventos del sistema
  useGlobalWindowEvents(
    ["toggle-app", "open-app", "close-app"],
    (e) => {
      if (e.type === "toggle-app") toggleVisible();
      if (e.type === "open-app") show();
      if (e.type === "close-app") hide();
    },
    { passive: true } // Opciones del window listener
  );

  return (
    <React.StrictMode>
      <LanguageProvider>
        <div className={`app-container ${visible ? "" : "app-hidden"}`}>
          <HashRouter basename='/'>
            <App />
          </HashRouter>
        </div>
      </LanguageProvider>
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(<Root />);
```

**Flujo completo:**
```
┌─────────────────┐                    ┌──────────────────┐
│  Client-side    │  dispatchEvent()   │   React UI       │
│  (RAGE:MP)      │  ─────────────────►│   (CEF)          │
└─────────────────┘                    └──────────────────┘
        │                                      │
        │ showAsync()                          │
        │ ───────────────────────────►         │
        │                                      │
        │ dispatchEvent("open-app")            │
        │ ───────────────────────────►         │
        │                                      │
        │                              ┌───────▼────────┐
        │                              │ window.         │
        │                              │ dispatchEvent() │
        │                              └───────┬────────┘
        │                                      │
        │                              ┌───────▼────────┐
        │                              │ useGlobalWindow│
        │                              │ Events hook    │
        │                              └───────┬────────┘
        │                                      │
        │                              ┌───────▼────────┐
        │                              │ show()         │
        │                              │ visible = true │
        │                              └────────────────┘
```

**Ventajas del hook `useGlobalWindowEvents`:**
- ✅ **Protegido contra React Strict Mode** (evita doble registro)
- ✅ **Cleanup automático** al desmontar componente
- ✅ **Handler estable** con `useCallback`
- ✅ **Múltiples eventos** en un solo hook
- ✅ **Opciones personalizables** (passive, capture, etc.)

---

#### 📝 Ejemplo: Crear evento personalizado

**Client-side:**
```typescript
// Disparar evento personalizado con datos
UIManager.instance.execute(`
  window.dispatchEvent(
    new CustomEvent("player-data-updated", {
      detail: { health: 100, armor: 50 }
    })
  );
`);
```

**React UI:**
```tsx
useGlobalWindowEvents(
  ["player-data-updated"],
  (e) => {
    const customEvent = e as CustomEvent;
    console.log("Player data:", customEvent.detail);
    // { health: 100, armor: 50 }
  }
);
```

---

### 8. `isVisible()` - Verificar estado

Devuelve si la UI está visible actualmente.

```typescript
isVisible(): boolean
```

**Ejemplo:**
```typescript
if (UIManager.instance.isVisible()) {
  console.log("UI está abierta");
} else {
  console.log("UI está cerrada");
}
```

---

### 9. `onChange()` - Observar cambios de visibilidad

Suscribe un callback que se ejecuta cuando cambia la visibilidad.

```typescript
onChange(callback: (isShowing: boolean) => void): () => void
```

**Ejemplo:**
```typescript
// Suscribirse
const unsubscribe = UIManager.instance.onChange((isVisible) => {
  if (isVisible) {
    console.log("UI mostrada");
    // Pausar gameplay, etc.
  } else {
    console.log("UI ocultada");
    // Reanudar gameplay
  }
});

// Desuscribirse después
unsubscribe();
```

---

### 10. `destroy()` - Destruir instancia

Destruye el navegador y limpia todos los recursos.

```typescript
destroy(): void
```

**Uso:**
```typescript
// Desde dentro de la clase
const destroy = UIManager.destroyInstance;
Promise.resolve().then(() => destroy());

// Desde fuera
UIManager.destroyInstance();
```

**⚠️ Advertencia:** Después de destruir, se creará una nueva instancia al volver a acceder a `UIManager.instance`.

---

## 📡 Comunicación Client ↔ UI

### Cliente → UI: 3 Métodos Disponibles

El UIManager ofrece **3 formas diferentes** de comunicar desde el cliente a la UI. Cada una tiene casos de uso específicos:

---

#### 🔵 Método 1: `callUI()` - Eventos de mp.events ✅ **(Recomendado)**

**Uso:** Comunicación estructurada con datos serializados.

**¿Cuándo usarlo?**
- ✅ Enviar datos complejos (objetos, arrays)
- ✅ Comunicación bidireccional
- ✅ Cuando necesitas pasar múltiples argumentos
- ✅ Para mantener código organizado y tipado

**Client-side:**
```typescript
const checkpoint = {
  id: 1,
  position: { x: 100, y: 200, z: 30 },
  scale: 5
};

UIManager.instance.callUI(
  "ui:addCheckpoint", 
  JSON.stringify(checkpoint)
);
```

**React UI:**
```typescript
mp.events.add("ui:addCheckpoint", (checkpointJson: string) => {
  const checkpoint = JSON.parse(checkpointJson);
  console.log("Checkpoint recibido:", checkpoint);
  addCheckpointToMap(checkpoint);
});
```

**Implementación interna:**
```typescript
// UIManager.ts
callUI(functionName: string, ...args: any[]): void {
  if (!this.browser) return;
  this.browser.call(functionName, ...args);
}
```

---

#### 🟢 Método 2: `dispatchEvent()` - Eventos nativos del navegador

**Uso:** Señales simples sin datos, control de visibilidad.

**¿Cuándo usarlo?**
- ✅ Eventos de sistema (abrir/cerrar UI)
- ✅ Señales sin datos asociados
- ✅ Cuando necesitas listeners múltiples
- ✅ Integración con bibliotecas que escuchan eventos DOM

**Client-side:**
```typescript
// Eventos predefinidos del sistema
UIManager.instance.dispatchEvent("open-app");
UIManager.instance.dispatchEvent("close-app");
UIManager.instance.dispatchEvent("toggle-app");

// Evento personalizado
UIManager.instance.dispatchEvent("custom-event");
```

**React UI - Con hook `useGlobalWindowEvents`:**
```tsx
const Root = () => {
  const show = useUIStore((s) => s.show);
  const hide = useUIStore((s) => s.hide);

  useGlobalWindowEvents(
    ["open-app", "close-app", "custom-event"],
    (e) => {
      if (e.type === "open-app") show();
      if (e.type === "close-app") hide();
      if (e.type === "custom-event") handleCustom();
    },
    { passive: true }
  );

  return <App />;
}
```

**Implementación interna:**
```typescript
// UIManager.ts
dispatchEvent(eventName: string, params?: Object): void {
  const jsCommand = `window.dispatchEvent(new Event("${eventName}"));`
  this.execute(jsCommand);
}
```

---

#### 🟡 Método 3: `execute()` - Código JavaScript directo (Privado)

**Uso:** Ejecutar código JavaScript arbitrario en el contexto de la UI.

**¿Cuándo usarlo?**
- ⚠️ Solo para casos avanzados
- ⚠️ Manipulación directa del DOM
- ⚠️ Llamar funciones globales en window
- ⚠️ Debugging y testing

**⚠️ IMPORTANTE:** Este método es **privado** en UIManager. Solo se usa internamente.

**Uso interno:**
```typescript
// UIManager.ts (INTERNO)
private execute(jsCode: string, cached: boolean = false): void {
  if (!this.browser) return;
  
  if (cached) {
    this.browser.executeCached(jsCode);
  } else {
    this.browser.execute(jsCode);
  }
}

// Ejemplo de uso interno en changeUrl()
changeUrl(url: string, params?: string) {
  this.actualView = url;
  if (this.isDomReady) {
    const jsCommand = `window.location.hash = "${this.actualView}";`;
    this.execute(jsCommand); // ← Uso interno
  }
}
```

**Si necesitas ejecutar JS directo, usa `dispatchFunctions()` en su lugar:**
```typescript
// UIManager.ts
dispatchFunctions(functionName: string, data: {info: object, data: object}) {
  const jsCommand = `window.${functionName}(${JSON.stringify(data.info)}, ${JSON.stringify(data.data)})`
  this.execute(jsCommand);
}
```

**Ejemplo con función en window:**
```typescript
// React UI - Exponer función global
(window as any).updatePlayerData = (info: any, data: any) => {
  console.log("Info:", info);
  console.log("Data:", data);
};
```

```typescript
// Client-side
UIManager.instance.dispatchFunctions("updatePlayerData", {
  info: { playerId: 123 },
  data: { health: 100, armor: 50 }
});
```

---

### 📊 Comparativa de Métodos

| Método | Uso Principal | Datos | Complejidad | Recomendación |
|--------|---------------|-------|-------------|---------------|
| `callUI()` | Comunicación estructurada | ✅ Soporta objetos complejos | Media | ⭐⭐⭐⭐⭐ Usar siempre que sea posible |
| `dispatchEvent()` | Señales de sistema | ❌ Solo evento sin datos* | Baja | ⭐⭐⭐⭐ Para eventos simples |
| `execute()` | Código JS directo | ✅ Cualquier cosa | Alta | ⭐⭐ Solo casos avanzados |

_* Puedes pasar datos con `CustomEvent`, pero `callUI()` es más limpio._

---

### 🎯 Casos de Uso Recomendados

**Usa `callUI()` para:**
```typescript
// ✅ Enviar datos de checkpoints
UIManager.instance.callUI("ui:addCheckpoint", JSON.stringify(checkpoint));

// ✅ Actualizar inventario
UIManager.instance.callUI("ui:updateInventory", JSON.stringify(items));

// ✅ Enviar configuración
UIManager.instance.callUI("ui:loadConfig", JSON.stringify(config));
```

**Usa `dispatchEvent()` para:**
```typescript
// ✅ Abrir/cerrar UI
UIManager.instance.dispatchEvent("open-app");

// ✅ Señales de sistema
UIManager.instance.dispatchEvent("player-died");

// ✅ Triggers simples
UIManager.instance.dispatchEvent("refresh-ui");
```

**Evita `execute()` directo, usa alternativas:**
```typescript
// ❌ NO HAGAS ESTO
UIManager.instance['execute']('console.log("test")');

// ✅ HAZ ESTO EN SU LUGAR
UIManager.instance.callUI("ui:log", "test");
```

---

### UI → Cliente

Desde la UI React, usa `mp.trigger()`:

```typescript
// React UI
mp.trigger("client:savePosition", JSON.stringify(position));
```

```typescript
// Client-side
mp.events.add("client:savePosition", (positionJson: string) => {
  const position = JSON.parse(positionJson);
  savePositionToDatabase(position);
});
```

---

## 🎯 Ejemplos Prácticos

### Ejemplo 1: Sistema de Checkpoints Completo

**1. Abrir editor de checkpoints**
```typescript
// Client-side
mp.keys.bind(0x71, true, async () => { // F2
  await UIManager.instance.showAsync();
  UIManager.instance.changeUrl("#/checkpoint-editor");
});
```

**2. Agregar checkpoint al presionar B**
```typescript
// Client-side
mp.keys.bind(0x42, false, () => { // B key
  const position = mp.players.local.position;
  const checkpoint = {
    id: nextCheckpointId++,
    position: { x: position.x, y: position.y, z: position.z },
    scale: 5
  };

  // Agregar localmente
  racePositions.set(checkpoint.id, checkpoint);

  // Notificar a UI
  UIManager.instance.callUI(
    "ui:addRacePositionElement",
    JSON.stringify(checkpoint)
  );
});
```

**3. UI recibe y muestra checkpoint**
```typescript
// React UI (SideMenu.tsx)
mp.events.add("ui:addRacePositionElement", (checkpointJson: string) => {
  const checkpoint = JSON.parse(checkpointJson);
  
  setCheckpointsMap(prev => {
    const map = new Map(prev);
    map.set(checkpoint.id, {
      id: checkpoint.id,
      position: checkpoint.position,
      scale: checkpoint.scale,
      enabled: true
    });
    return map;
  });
});
```

**4. Actualizar checkpoint desde UI**
```typescript
// React UI
<button onClick={() => {
  const updateData = {
    positionElement: {
      position: selected.position,
      scale: selected.scale
    },
    keyPosition: selected.id
  };

  mp.trigger("client:updateRacePosition", JSON.stringify(updateData));
}}>
  Actualizar
</button>
```

**5. Cliente aplica actualización**
```typescript
// Client-side
mp.events.add("client:updateRacePosition", (updateJson: string) => {
  const update = JSON.parse(updateJson);
  const checkpoint = racePositions.get(update.keyPosition);
  
  if (checkpoint) {
    racePositions.set(update.keyPosition, {
      ...checkpoint,
      ...update.positionElement
    });
  }
});
```

---

### Ejemplo 2: Inventario con Drag & Drop

**1. Abrir inventario**
```typescript
// Client-side
mp.keys.bind(0x49, true, async () => { // I key
  await UIManager.instance.showAsync();
  UIManager.instance.changeUrl("#/inventory");
  
  // Enviar items del inventario
  const inventory = getPlayerInventory();
  UIManager.instance.callUI("ui:loadInventory", JSON.stringify(inventory));
});
```

**2. Usar item desde UI**
```typescript
// React UI
function InventorySlot({ item }: { item: Item }) {
  const handleUseItem = () => {
    mp.trigger("client:useItem", item.id);
  };

  return (
    <div onClick={handleUseItem}>
      {item.name} x{item.quantity}
    </div>
  );
}
```

**3. Cliente ejecuta uso del item**
```typescript
// Client-side
mp.events.add("client:useItem", (itemId: number) => {
  const item = inventory.find(i => i.id === itemId);
  
  if (item) {
    useItem(item);
    
    // Actualizar UI
    UIManager.instance.callUI(
      "ui:updateInventory",
      JSON.stringify(getPlayerInventory())
    );
  }
});
```

---

### Ejemplo 3: Sistema de Notificaciones

**Cliente envía notificación a UI**
```typescript
// Client-side
function showNotification(message: string, type: 'success' | 'error' | 'info') {
  UIManager.instance.callUI("ui:showNotification", JSON.stringify({
    message,
    type,
    duration: 3000
  }));
}

// Uso
showNotification("Checkpoint guardado", "success");
```

**UI muestra notificación**
```typescript
// React UI
mp.events.add("ui:showNotification", (dataJson: string) => {
  const { message, type, duration } = JSON.parse(dataJson);
  
  toast(message, {
    type: type,
    autoClose: duration
  });
});
```

---

## 🔔 Eventos del Navegador

El UIManager escucha 3 eventos críticos del navegador:

### 1. `browserCreated`

Se dispara cuando el navegador CEF es creado.

```typescript
private onBrowserCreated(browser: BrowserMp) {
  if (browser !== this.browser) return;
  console.log("Browser creado!");
}
```

### 2. `browserDomReady`

Se dispara cuando el DOM HTML está completamente cargado.

```typescript
private onBrowserDomReady(browser: BrowserMp) {
  if (browser !== this.browser) return;
  
  this.isDomReady = true;
  this.resolveReady(); // Resuelve promesas de ready()
  
  console.log("DOM Ready!");
}
```

### 3. `browserLoadingFailed`

Se dispara si la carga de la UI falla.

```typescript
private onBrowserLoadingFailed(browser: BrowserMp) {
  if (browser !== this.browser) return;
  console.error("Error cargando UI");
}
```

---

## ✅ Buenas Prácticas

### 1. Siempre espera `showAsync()` antes de comunicar

```typescript
// ❌ MAL
UIManager.instance.showAsync();
UIManager.instance.callUI("ui:data", data); // Puede fallar

// ✅ BIEN
await UIManager.instance.showAsync();
UIManager.instance.callUI("ui:data", data);
```

### 2. Serializa objetos complejos a JSON

```typescript
// ❌ MAL
UIManager.instance.callUI("ui:update", complexObject);

// ✅ BIEN
UIManager.instance.callUI("ui:update", JSON.stringify(complexObject));
```

### 3. Valida que la UI esté visible

```typescript
// ✅ BIEN
if (UIManager.instance.isVisible()) {
  UIManager.instance.callUI("ui:update", data);
} else {
  console.warn("UI no está visible");
}
```

### 4. Desuscribe observadores cuando no los necesites

```typescript
// ✅ BIEN
const unsubscribe = UIManager.instance.onChange((isVisible) => {
  console.log("Estado:", isVisible);
});

// Más tarde...
unsubscribe();
```

### 5. Usa `ready()` para operaciones críticas

```typescript
// ✅ BIEN - Garantiza que DOM está listo
await UIManager.instance.showAsync();
await UIManager.instance.ready();

UIManager.instance.callUI("ui:criticalOperation", data);
```

### 6. Maneja errores en comunicación

```typescript
// ✅ BIEN
try {
  await UIManager.instance.showAsync();
  UIManager.instance.callUI("ui:data", JSON.stringify(data));
} catch (error) {
  console.error("Error comunicando con UI:", error);
}
```

---

## 📚 API Reference

### Propiedades

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `instance` | `UIManager` | Instancia singleton (estática) |
| `browser` | `BrowserMp \| null` | Referencia al navegador CEF |
| `isDomReady` | `boolean` | Si el DOM está completamente cargado |
| `isShowing` | `boolean` | Si la UI está visible actualmente |
| `actualView` | `string \| null` | Vista actual (hash routing) |

### Métodos Públicos

| Método | Retorno | Descripción |
|--------|---------|-------------|
| `showAsync()` | `Promise<void>` | Muestra la UI |
| `hide()` | `void` | Oculta la UI |
| `toggleAsync()` | `Promise<void>` | Alterna visibilidad |
| `ready()` | `Promise<void>` | Espera a que DOM esté listo |
| `callUI(name, ...args)` | `void` | Llama evento en UI |
| `changeUrl(url, params?)` | `void` | Cambia ruta hash |
| `dispatchEvent(name, params?)` | `void` | Dispara evento nativo JS |
| `isVisible()` | `boolean` | Devuelve estado de visibilidad |
| `onChange(callback)` | `() => void` | Suscribe a cambios de visibilidad |

### Métodos Estáticos

| Método | Retorno | Descripción |
|--------|---------|-------------|
| `UIManager.instance` | `UIManager` | Obtiene instancia singleton |
| `UIManager.destroyInstance()` | `void` | Destruye instancia completamente |

---

## 🐛 Debugging

### Ver estado del UIManager

```typescript
// En consola F8 de RAGE:MP
const ui = UIManager.instance;

console.log("Visible:", ui.isVisible());
console.log("DOM Ready:", ui['isDomReady']);
console.log("Browser:", ui['browser'] ? "Existe" : "No existe");
```

### Test de comunicación

```typescript
// Client-side
mp.keys.bind(0x54, true, () => { // T key
  UIManager.instance.callUI("ui:test", "Hola desde cliente");
});
```

```typescript
// React UI
mp.events.add("ui:test", (message: string) => {
  console.log("Recibido:", message);
  alert(message);
});
```

---

## 🪝 React Hooks Recomendados

### `useGlobalWindowEvents` - Escuchar eventos del sistema

**Ubicación:** `hooks/useGlobalWindowEvents.ts`

Hook personalizado para escuchar eventos de `window.dispatchEvent()` de forma segura en React.

**Código completo:**
```typescript
import { useEffect, useCallback, useRef } from "react";

/**
 * Hook para escuchar eventos globales en `window` de manera estable.
 * Protegido contra doble registro en React Strict Mode.
 */
export function useGlobalWindowEvents(
  events: string[],
  handler: (event: Event) => void,
  options?: boolean | AddEventListenerOptions
) {
  const stabilizedHandler = useCallback(handler, [handler]);
  const registeredRef = useRef(false);

  useEffect(() => {
    if (!events || events.length === 0) return;
    if (registeredRef.current) return;

    registeredRef.current = true;

    events.forEach((eventName) => {
      window.addEventListener(eventName, stabilizedHandler, options);
    });

    return () => {
      events.forEach((eventName) => {
        window.removeEventListener(eventName, stabilizedHandler, options);
      });
      registeredRef.current = false;
    };
  }, [events, stabilizedHandler, options]);
}
```

**Uso típico:**
```tsx
function App() {
  const [isOpen, setIsOpen] = useState(false);

  useGlobalWindowEvents(
    ["open-app", "close-app"],
    (e) => {
      setIsOpen(e.type === "open-app");
    },
    { passive: true }
  );

  return <div className={isOpen ? "visible" : "hidden"}>...</div>;
}
```

**Características:**
- ✅ Previene doble registro en React Strict Mode
- ✅ Cleanup automático al desmontar
- ✅ Handler estabilizado con `useCallback`
- ✅ Soporta múltiples eventos simultáneamente
- ✅ Opciones personalizables de `addEventListener`

---

## 🔗 Recursos Relacionados

- [RAGEMP_CEF_COMMUNICATION.md](./RAGEMP_CEF_COMMUNICATION.md) - Guía completa de comunicación Client ↔ UI
- [RAGE:MP CEF Documentation](https://wiki.rage.mp/index.php?title=Working_with_CEF)
- [RAGE:MP Browsers API](https://wiki.rage.mp/index.php?title=Browsers)
- [React useEffect Hook](https://react.dev/reference/react/useEffect)
- [Window: dispatchEvent() method](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent)

---

**Versión**: 0.0.1