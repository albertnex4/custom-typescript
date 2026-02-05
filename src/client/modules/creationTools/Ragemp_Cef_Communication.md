# 📡 Comunicación RAGE:MP Client ↔ React UI (CEF)

Este documento explica cómo funciona la comunicación bidireccional entre el cliente de RAGE:MP (TypeScript) y la interfaz de usuario React (CEF - Chromium Embedded Framework).

---

## 🏗️ Arquitectura de Comunicación

```
┌─────────────────────┐         ┌─────────────────────┐
│   RAGE:MP Client    │         │    React UI (CEF)   │
│   (TypeScript)      │ ◄─────► │   (TypeScript)      │
└─────────────────────┘         └─────────────────────┘
         │                               │
         │  mp.events.call()             │  mp.trigger()
         │  UIManager.callUI()           │  mp.events.add()
         │                               │
         └───────────────────────────────┘
```

---

## 🔄 Flujo de Comunicación

### 📤 **Cliente → UI (React)**

El cliente envía datos a la UI usando `UIManager.instance.callUI()`:

```typescript
// client-side (RAGE:MP)
UIManager.instance.callUI('ui:updateRacePositionElement', uiElementJson);
UIManager.instance.callUI("ui:addRacePositionElement", JSON.stringify(checkpoint));
```

### 📥 **UI (React) → Cliente**

La UI envía comandos al cliente usando `mp.trigger()`:

```typescript
// React UI (CEF)
mp.trigger("client:initializeColshapes");
mp.trigger("client:addRacePositionElement", JSON.stringify(position));
mp.trigger("client:updateRacePosition", jsonString);
```

---

## 🎯 Casos de Uso Específicos

### 1️⃣ **Inicialización del Sistema**

#### **React UI → Cliente**
```typescript
// SideMenu.tsx (React)
useEffect(() => {
  mp.trigger("client:initializeColshapes"); // ✅ Iniciar sistema
  
  return () => {
    mp.trigger("client:destroyColshapes"); // 🔴 Cleanup al desmontar
  };
}, []);
```

#### **Cliente escucha el evento**
```typescript
// client-side
mp.events.add("client:addRacePositionElement", 
  (position: ScaledPosition) => addRacePositionElement(position, false)
);
```

---

### 2️⃣ **Agregar Checkpoint**

#### **Flujo completo:**

```
┌──────────┐    B key     ┌────────────┐  callUI()  ┌──────────┐
│ Usuario  │  ──────────► │  Cliente   │ ─────────► │ React UI │
└──────────┘              └────────────┘            └──────────┘
                                │                         │
                                │ Crear checkpoint        │ Añadir a lista
                                │ en el mundo 3D          │ y renderizar
```

**Paso 1: Usuario presiona tecla B**
```typescript
// client-side
mp.keys.bind(0x42, false, getPosition); // B key

function getPosition() {
  const objectPos = calcularPosicionDelante();
  addRacePositionElement({
    id: 0, 
    position: objectPos, 
    scale: finalScale 
  });
}
```

**Paso 2: Cliente crea checkpoint localmente**
```typescript
function addRacePositionElement(position: ScaledPosition, notifyCef: boolean = true) {
  const checkpoint: ScaledPosition = {
    id: nextCheckpointId++,
    position: position.position,
    scale: position.scale,
  };

  racePositions.set(id, checkpoint);
  raceOrder.push(id);

  // ✅ Notificar a la UI
  if (notifyCef) {
    UIManager.instance.callUI(
      "ui:addRacePositionElement",
      JSON.stringify(checkpoint)
    );
  }
}
```

**Paso 3: React UI recibe y actualiza**
```typescript
// SideMenu.tsx (React)
mp.events.add("ui:addRacePositionElement", (position: any) => 
  addRacePositionElement(position)
);

const addRacePositionElement = (positionElement?: ScaledPosition | string) => {
  const data: ScaledPosition = 
    typeof positionElement === "string" 
      ? JSON.parse(positionElement) 
      : positionElement;
  
  createCheckpoint({
    id: data.id,
    position: data.position,
    scale: data.scale,
    enabled: true
  });
}
```

---

### 3️⃣ **Actualizar Checkpoint**

#### **Flujo:**

```
┌──────────┐  Click btn   ┌──────────┐  trigger()  ┌────────────┐
│ React UI │ ───────────► │ Cliente  │ ──────────► │ Actualizar │
└──────────┘              └──────────┘             │  Posición  │
     │                                             └────────────┘
     │                                                   │
     └─────────────────── callUI() ◄─────────────────────┘
```

**Paso 1: Usuario edita desde UI**
```typescript
// SideMenu.tsx (React)
<button onClick={() => {
  const jsonString = JSON.stringify({
    positionElement: {
      position: selected.position, 
      scale: selected.scale
    }, 
    keyPosition: selected.id
  });
  
  mp.trigger("client:updateRacePosition", jsonString);
}}>
  Actualizar
</button>
```

**Paso 2: Cliente actualiza datos**
```typescript
// client-side
mp.events.add("client:updateRacePosition", 
  (elementUpdate: TypeUpdateEvent | string) => {
    updateRacePosition(elementUpdate);
  }
);

function updateRacePosition(elementUpdate: TypeUpdateEvent | string) {
  const data: TypeUpdateEvent =
    typeof elementUpdate === "string" 
      ? JSON.parse(elementUpdate) 
      : elementUpdate;

  const cp = racePositions.get(data.keyPosition);
  if (!cp) return;

  racePositions.set(data.keyPosition, { 
    ...cp, 
    ...data.positionElement
  });
  
  actualPositionIndex = data.keyPosition;
  actualPosition = data.positionElement;
}
```

---

### 4️⃣ **Eliminar Checkpoint**

**Paso 1: UI solicita eliminación**
```typescript
// SideMenu.tsx (React)
<button onClick={() => {
  // Eliminar de la UI
  setCheckpointsMap(prev => {
    const copy = new Map(prev);
    copy.delete(selected.id);
    return copy;
  });

  // Notificar al cliente
  mp.trigger("client:deleteRacePosition", selected.id);
}}>
  Eliminar
</button>
```

**Paso 2: Cliente elimina**
```typescript
// client-side
mp.events.add("client:deleteRacePosition", 
  (keyPosition: number) => {
    deleteRacePosition(keyPosition);
  }
);

function deleteRacePosition(keyPosition: number) {
  if (!racePositions.has(keyPosition)) return;
  
  racePositions.delete(keyPosition);
  actualPosition = null;
  actualPositionIndex = 0;
}
```

---

### 5️⃣ **Guardar Checkpoint (C key)**

**Paso 1: Usuario presiona C**
```typescript
// client-side
mp.keys.bind(0x43, true, savePositionColshape);

function savePositionColshape() {
  if (actualPositionIndex === null) return;
  
  const cp = racePositions.get(actualPositionIndex);
  if (!cp) return;
  
  const uiElement: TypeUpdateEvent = {
    positionElement: cp,
    keyPosition: actualPositionIndex
  };

  // ✅ Enviar actualización a UI
  UIManager.instance.callUI(
    'ui:updateRacePositionElement', 
    JSON.stringify(uiElement)
  );
}
```

**Paso 2: React actualiza internamente**
```typescript
// SideMenu.tsx (React)
mp.events.add("ui:updateRacePositionElement", 
  (clientElement: TypeUpdateEvent) => {
    updateRacePositionElement(clientElement);
  }
);

const updateRacePositionElement = (clientElement: TypeUpdateEvent | string) => {
  const elementObject: TypeUpdateEvent = 
    typeof clientElement === "string"
      ? JSON.parse(clientElement)
      : clientElement;
  
  setSelectedIndex(elementObject.keyPosition);
  updateSelected(elementObject.positionElement, elementObject.keyPosition);
}
```

---

## 📋 Tabla de Eventos

### **Cliente → UI**

| Evento | Descripción | Datos |
|--------|-------------|-------|
| `ui:addRacePositionElement` | Agregar checkpoint a la lista | `ScaledPosition (JSON)` |
| `ui:updateRacePositionElement` | Actualizar checkpoint existente | `TypeUpdateEvent (JSON)` |

### **UI → Cliente**

| Evento | Descripción | Datos |
|--------|-------------|-------|
| `client:initializeColshapes` | Inicializar sistema de checkpoints | - |
| `client:destroyColshapes` | Destruir sistema (cleanup) | - |
| `client:addRacePositionElement` | Crear nuevo checkpoint | `ScaledPosition (JSON)` |
| `client:updateRacePosition` | Actualizar posición | `TypeUpdateEvent (JSON)` |
| `client:editModeRacePosition` | Entrar en modo edición | `number (id)` |
| `client:deleteRacePosition` | Eliminar checkpoint | `number (id)` |
| `client:showOnlySelectedElement` | Mostrar solo seleccionado | `boolean` |
| `client:errorFromUi` | Reportar error desde UI | `string` |

---

## ⚠️ Buenas Prácticas

### ✅ **DO:**

1. **Serializar siempre a JSON** cuando envías objetos complejos:
   ```typescript
   mp.trigger("evento", JSON.stringify(data));
   ```

2. **Validar tipo de datos** al recibir:
   ```typescript
   const data = typeof input === "string" ? JSON.parse(input) : input;
   ```

3. **Manejar errores de parsing**:
   ```typescript
   try {
     const data = JSON.parse(clientElement);
   } catch (error) {
     mp.trigger("client:errorFromUi", "Error parsing JSON");
   }
   ```

4. **Usar eventos específicos** (prefijos `client:` y `ui:`):
   ```typescript
   mp.events.add("client:updateRacePosition", ...);
   mp.events.add("ui:addRacePositionElement", ...);
   ```

### ❌ **DON'T:**

1. **No enviar objetos sin serializar**:
   ```typescript
   // ❌ MAL
   mp.trigger("evento", objetoComplejo);
   
   // ✅ BIEN
   mp.trigger("evento", JSON.stringify(objetoComplejo));
   ```

2. **No olvidar cleanup en React**:
   ```typescript
   useEffect(() => {
     mp.trigger("client:initializeColshapes");
     
     return () => {
       mp.trigger("client:destroyColshapes"); // ✅ Importante
     };
   }, []);
   ```

3. **No asumir que los datos llegan en el formato correcto**:
   ```typescript
   // ❌ MAL
   const data = JSON.parse(input); // Puede fallar
   
   // ✅ BIEN
   const data = typeof input === "string" ? JSON.parse(input) : input;
   ```

---

## 🧪 Testing de Comunicación

### **Desde la consola del navegador:**

Debug con window functions:
```typescript
// SideMenu.tsx
(window as any).uiAddRacePositionElement = (position: ScaledPosition) => 
  addRacePositionElement(position);

(window as any).uiUpdateRacePositionElement = (clientElement: TypeUpdateEvent) => 
  updateRacePositionElement(clientElement);
```

Luego en consola del navegador:
```javascript
window.uiAddRacePositionElement({
  id: 1, 
  position: {x: 0, y: 0, z: 0}, 
  scale: 5
});
```

---

## 🎓 Resumen

1. **Cliente → UI**: Usa `UIManager.instance.callUI(eventName, jsonData)`
2. **UI → Cliente**: Usa `mp.trigger(eventName, data)`
3. **Escuchar eventos**: Usa `mp.events.add(eventName, callback)`
4. **Siempre serializar**: Convierte objetos a JSON con `JSON.stringify()`
5. **Siempre validar**: Verifica el tipo antes de parsear
6. **Cleanup importante**: Usa `return ()` en `useEffect()` para destruir eventos

---

## 📚 Recursos Adicionales

- [RAGE:MP Client-side API](https://wiki.rage.mp/index.php?title=Client-side_functions)
- [CEF Communication Guide](https://wiki.rage.mp/index.php?title=Working_with_CEF)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)

---

**Autor**: Sistema de carreras RAGE:MP  
**Última actualización**: 2026
