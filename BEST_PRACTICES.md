# ⚡ BEST PRACTICES - Guía de Mejores Prácticas

## 1. 🎯 Principios del Proyecto

### SOLID
- **S**ingle Responsibility: Una clase = una responsabilidad
- **O**pen/Closed: Abierto a extensión, cerrado a modificación
- **L**iskov: Las subclases pueden reemplazar su clase base
- **I**nterface Segregation: Interfaces específicas, no genéricas
- **D**ependency Inversion: Depender de abstracciones, no implementaciones

### DRY (Don't Repeat Yourself)
```typescript
// ❌ MALO: Código repetido
function loadLanguage1() { /* ... */ }
function loadLanguage2() { /* ... */ }

// ✅ BIEN: Lógica reutilizable
class TranslationManager {
  async loadLanguage(lang: string) { /* ... */ }
}
```

---

## 2. 📝 Convenciones de Código

### Nombres de Variables/Funciones

```typescript
// ❌ MALO
const u = getUserData();
function process(d) { /* ... */ }
const x = 42;

// ✅ BIEN
const userData = getUserData();
function processPlayerData(data: PlayerData) { /* ... */ }
const maxPlayers = 42;
```

### Constantes
```typescript
// ❌ MALO
const timeout = 30000;

// ✅ BIEN
const PLAYER_SPAWN_TIMEOUT_MS = 30000;
```

### Booleans
```typescript
// ❌ MALO
const active = true;

// ✅ BIEN
const isPlayerActive = true;
const hasPermission = false;
const shouldShowUI = true;
```

---

## 3. 🔐 Tipado TypeScript

### Nunca Usar `any`
```typescript
// ❌ MALO
const data: any = fetchData();

// ✅ BIEN
interface PlayerData {
  id: number;
  name: string;
}
const data: PlayerData = fetchData();
```

### Types vs Interfaces
```typescript
// Usar Type para definiciones simples
type PlayerId = number;
type EventData = { event: string; data: any };

// Usar Interface para objetos complejos
interface Player {
  id: PlayerId;
  name: string;
  health: number;
}
```

### Strict Mode
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true
  }
}
```

---

## 4. 📦 Estructura de Imports

### Orden de Imports
```typescript
// 1. Dependencias externas
import React, { useState } from "react";
import { defineConfig } from "vite";

// 2. Tipos compartidos
import type { PlayerData } from "../types";

// 3. Módulos del proyecto
import { eventManager } from "../shared/EventManager";
import { logger } from "../shared/Logger";

// 4. Componentes/Utilidades locales
import { RichText } from "./components/RichText";
import { formatCurrency } from "./utils/format";
```

---

## 5. ❌ Error Handling

### Siempre Maneja Errores

```typescript
// ❌ MALO: Sin try/catch
async function loadData() {
  const res = await fetch("/api/data");
  const data = await res.json();
  return data;
}

// ✅ BIEN: Con error handling
async function loadData() {
  try {
    const res = await fetch("/api/data");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data;
  } catch (error) {
    logger.error("Error cargando datos", error as Error);
    throw error;
  }
}
```

### Validación de Entrada

```typescript
// ✅ BIEN: Validar parámetros
function calculateDamage(baseAttack: number, weaponBonus: number): number {
  if (baseAttack < 0) throw new Error("Attack no puede ser negativo");
  if (weaponBonus < 0) throw new Error("Bonus no puede ser negativo");
  
  return baseAttack + weaponBonus;
}
```

---

## 6. 🎯 Eventos - Patrones

### Suscribirse a Eventos

```typescript
// ✅ BIEN: Siempre guardar unsubscribe
const unsubscribe = eventManager.on("player:spawn", (data) => {
  logger.info("Jugador spawneado", data);
});

// Limpiar al desmontar componente
onUnmount(() => unsubscribe());
```

### Emitir Eventos Type-Safe

```typescript
// Definir tipos en EventMap
interface EventMap {
  "player:kill": { killer: PlayerId; victim: PlayerId; weapon: string };
}

// Emitir con tipos validados
eventManager.emit("player:kill", {
  killer: 1,
  victim: 2,
  weapon: "AK47",
  // extra: "dato" ← Error de TypeScript
});
```

---

## 7. 🎨 React - Patrones

### Componentes Funcionales

```typescript
// ✅ BIEN: FC con tipos explícitos
interface PlayerCardProps {
  playerId: number;
  name: string;
  level: number;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  playerId,
  name,
  level,
}) => {
  return <div>{name} - Lvl {level}</div>;
};
```

### Hooks - Orden de Dependencias

```typescript
// ❌ MALO: Dependencia faltante causa bugs
useEffect(() => {
  console.log(userId); // userId no está en dependencias
}, []);

// ✅ BIEN: Todas las dependencias incluidas
useEffect(() => {
  console.log(userId);
}, [userId]);

// ✅ BIEN: Sin dependencias = solo una vez
useEffect(() => {
  initializeApp();
}, []);
```

### Custom Hooks

```typescript
// ✅ BIEN: Encapsular lógica reutilizable
export function usePlayerData(playerId: number) {
  const [data, setData] = useState<PlayerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadPlayer();
  }, [playerId]);

  const loadPlayer = async () => {
    try {
      setLoading(true);
      const res = await fetchPlayer(playerId);
      setData(res);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error };
}

// Usar en componentes
const { data, loading } = usePlayerData(123);
```

---

## 8. 🧹 Testing

### Estructura de Tests

```typescript
describe("EventManager", () => {
  beforeEach(() => {
    eventManager.clear();
  });

  it("debería emitir eventos", () => {
    // Arrange
    let received = false;
    eventManager.on("test:event", () => {
      received = true;
    });

    // Act
    eventManager.emit("test:event", null);

    // Assert
    expect(received).toBe(true);
  });
});
```

### Qué Testear

✅ **Testear**:
- Lógica empresarial (EventManager, Logger, TranslationManager)
- Funciones puras
- Casos edge (valores nulos, arrays vacíos)

❌ **No testear**:
- Componentes de presentación simple
- Librerías externas
- Implementación interna

---

## 9. 📊 Performance

### Memoization

```typescript
// ❌ MALO: Se recalcula siempre
const List = ({ items }: Props) => {
  const sorted = items.sort(); // Recalcula cada render
  return <ul>{sorted.map(...)}</ul>;
};

// ✅ BIEN: Solo cuando items cambia
import { useMemo } from "react";

const List = ({ items }: Props) => {
  const sorted = useMemo(() => items.sort(), [items]);
  return <ul>{sorted.map(...)}</ul>;
};
```

### Lazy Loading

```typescript
// ✅ BIEN: Cargar módulos bajo demanda
import { lazy, Suspense } from "react";

const InventoryView = lazy(() => import("./views/Inventory"));

export const App = () => (
  <Suspense fallback={<div>Cargando...</div>}>
    <InventoryView />
  </Suspense>
);
```

---

## 10. 📝 Comentarios

### Cuándo Comentar

```typescript
// ❌ MALO: Comentario obvio
const age = 25; // La edad es 25

// ✅ BIEN: Explicar el POR QUÉ
// Los jugadores menores de 18 años no pueden acceder a zonas PvP
const MIN_AGE_FOR_PVP = 18;

// ✅ BIEN: Documentar decisiones complejas
// Se usa Map en lugar de Object para permitir claves no-string
private events = new Map<string, Set<EventCallback>>();

// ✅ BIEN: Marcar TODOs
// TODO: Implementar persistencia en BD
async function savePlayerData(player: PlayerData) {
  // Actualmente solo en memoria
}
```

---

## 11. 🔍 Debugging

### Usar Logger en Puntos Críticos

```typescript
// ✅ BIEN: Logger estratégico
eventManager.on("player:spawn", (data) => {
  logger.debug("Player spawning", { playerId: data.id });
  try {
    spawnPlayer(data);
    logger.info("Player spawned successfully", { playerId: data.id });
  } catch (error) {
    logger.error("Failed to spawn player", error as Error);
  }
});
```

### No Dejar console.log

```typescript
// ❌ MALO: console.log directo
console.log("Debug info:", data);

// ✅ BIEN: Usar logger
logger.debug("Debug info", data);
```

---

## 12. 🔄 Versionado

### Semantic Versioning

```
MAJOR.MINOR.PATCH
1.2.3

- MAJOR: Breaking changes (1.0.0 → 2.0.0)
- MINOR: Nuevas features (1.0.0 → 1.1.0)
- PATCH: Bug fixes (1.0.0 → 1.0.1)
```

### Actualizar package.json

```json
{
  "version": "1.0.0",
  "description": "RAGE:MP Custom Server with React UI"
}
```

---

## 📋 Checklist Pre-Commit

Antes de hacer commit:

```
[ ] Código compila sin errores (npm run build)
[ ] Sin console.log (usar logger)
[ ] Sin `any` types
[ ] Tests pasan (npm run test)
[ ] Nombres descriptivos
[ ] Error handling presente
[ ] Imports organizados
[ ] Comentarios útiles
[ ] Performance considerado
```

---

## 🚀 Pasos para Contribuir

1. **Crear rama**: `git checkout -b feature/my-feature`
2. **Código limpio**: Seguir estas prácticas
3. **Tests**: Agregar tests para lógica nueva
4. **Build**: `npm run build` sin errores
5. **Commit**: Mensaje descriptivo
6. **Push**: `git push origin feature/my-feature`
7. **Pull Request**: Descripción clara

---

**Última actualización**: 25 Nov 2025
