# 🏗️ ARCHITECTURE.md - Arquitectura del Proyecto

## Visión General

Este es un proyecto **RAGE:MP (servidor modificable)** con una interfaz React moderna. La arquitectura está diseñada para separar preocupaciones entre lógica de juego, interfaz de usuario y servicios compartidos.

```
┌─────────────────────────────────────────────────────┐
│           SERVIDOR RAGE:MP (dist/)                   │
├─────────────────────────────────────────────────────┤
│  client_packages/                                    │
│  ├── index.js ←─── Módulos (TypeScript + Rollup)    │
│  └── ui/ ←─────── Interfaz (React + Vite)          │
└─────────────────────────────────────────────────────┘
         ↑                    ↑
         │                    │
   Client-side Scripts   UI (CEF Browser)
```

---

## 📁 Estructura de Carpetas

### `src/client/`
Código que corre **en el cliente RAGE:MP**.

```
src/client/
├── modules/              # Lógica del juego
│   ├── player/          # Gestión de jugador
│   │   ├── player_start.ts          # Inicialización
│   │   ├── player-management.ts     # Lógica principal
│   │   └── player-management.improved.ts  # Versión mejorada
│   ├── ui/
│   │   └── UIManager.ts            # Gestión de CEF Browser
│   └── index.ts         # Punto de entrada
│
├── ui/                  # Interfaz React
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.html
│   ├── components/      # Componentes React
│   │   └── base/
│   │       ├── RichText.tsx
│   │       └── RichText.improved.tsx
│   ├── hooks/           # Custom hooks
│   │   └── useTranslation.ts
│   ├── contexts/        # React Contexts
│   │   └── LanguageContext.tsx
│   ├── views/           # Páginas/vistas
│   ├── utils/           # Utilidades
│   │   └── mp-sage.ts   # Mock para desarrollo
│   └── public/
│       └── translations/
│           ├── en.json
│           └── es.json
│
└── types/
    └── global.d.ts      # Tipos globales
```

### `src/shared/`
Código **compartido** entre cliente y servidor.

```
src/shared/
├── EventManager.ts          # Sistema de eventos centralizado
├── Logger.ts                # Logging
├── TranslationManager.ts    # Gestión de traducciones
├── translation.types.ts     # Tipos generados (generado por i18n)
├── translations/
│   ├── en.json
│   └── es.json
└── __tests__/
    └── EventManager.test.ts
```

### Archivos de Configuración

```
├── vite.config.ts              # Configuración de Vite (UI)
├── rollup.client.config.cjs    # Configuración de Rollup (módulos)
├── tsconfig.json               # TypeScript general
├── tsconfig.client.json        # TypeScript para cliente
├── package.json
├── nodemon.rage.json           # Configuración de nodemon
├── conf.json                   # Configuración del servidor RAGE
└── .env.example                # Variables de entorno
```

---

## 🔄 Flujo de Datos

### 1️⃣ **Inicialización (Player Ready)**

```
RAGE:MP Server
    ↓
mp.events.add("playerReady")
    ↓
initializePlayerModule()
    ↓
eventManager setup
UIManager ready
Logger active
```

### 2️⃣ **Interacción Usuario (UI → Servidor)**

```
React Component
    ↓ onClick
mp.trigger("client:action", data)
    ↓
eventManager.emit()
    ↓
Player Module Handler
    ↓
mp.trigger("server:action", result)
```

### 3️⃣ **Cambio de Idioma (Global)**

```
LanguageProvider setLang("es")
    ↓
localStorage.setItem()
    ↓
TranslationManager.loadLanguage()
    ↓
Todos los componentes re-renderean (via useTranslation)
```

---

## 🔧 Patrones Principales

### Pattern 1: Event-Driven Architecture

**¿Por qué?** RAGE:MP funciona con eventos. Centralizarlos mejora mantenibilidad.

```typescript
// ❌ Evitar: Eventos dispersos
mp.events.add("playerReady", () => { ... });
mp.events.add("client:hello", () => { ... });

// ✅ Preferir: Centralizado con tipos
eventManager.on("client:helloWorld", (msg: string) => {
  logger.info("Hello recibido", { msg });
});
```

**Ubicación**: `src/shared/EventManager.ts`

---

### Pattern 2: Singleton + Dependency Injection

**¿Por qué?** Asegurar una única instancia de servicios.

```typescript
// En EventManager.ts
export const eventManager = new EventManager(); // Singleton

// En componentes/módulos
import { eventManager } from "src/shared/EventManager";
eventManager.on(...); // Acceso directo
```

**Ubicación**: `src/shared/`, `src/client/modules/ui/UIManager.ts`

---

### Pattern 3: Context API + Hooks

**¿Por qué?** Evitar prop drilling y permitir cambios globales.

```typescript
// Estructura
<LanguageProvider>
  <App />
    <RichText /> ← Accede a idioma via useLanguage()
</LanguageProvider>
```

**Ubicación**: `src/client/ui/contexts/LanguageContext.tsx`

---

### Pattern 4: Type-Safe Event System

**¿Por qué?** TypeScript nos protege de errores.

```typescript
interface EventMap {
  "client:helloWorld": string;
  "server:notification": { title: string; message: string };
}

// TypeScript valida el tipo automáticamente
eventManager.emit("client:helloWorld", "mensaje"); // ✅ OK
eventManager.emit("client:helloWorld", 123);      // ❌ Error
```

---

## 🚀 Flujo de Desarrollo

### Build Process

```
Source (TypeScript + React)
    ↓
Vite (UI)       Rollup (Modules)
    ↓               ↓
dist/client_packages/ui/  dist/client_packages/index.js
    ↓               ↓
────────────────────────────
    ↓
RAGE:MP CEF Browser
    ↓
Usuario ve la UI
```

### Scripts Principales

| Script | Qué Hace |
|--------|----------|
| `npm run dev` | Inicia dev completo (Vite + Rollup + Server) |
| `npm run dev:ui` | Solo UI React (http://localhost:5173) |
| `npm run build` | Build de producción |
| `npm run i18n:types` | Regenera tipos de traducciones |

---

## 📊 Capas de la Aplicación

### Capa 1: Presentación (UI)
- **Ubicación**: `src/client/ui/`
- **Tecnología**: React 19 + TypeScript
- **Responsabilidad**: Renderizar componentes, capturar interacciones del usuario
- **Ejemplos**: `App.tsx`, `RichText.tsx`, componentes

### Capa 2: Lógica (Modules)
- **Ubicación**: `src/client/modules/`
- **Tecnología**: TypeScript puro
- **Responsabilidad**: Eventos del juego, keybindings, gestión de estado
- **Ejemplos**: `player-management.ts`, `UIManager.ts`

### Capa 3: Servicios (Shared)
- **Ubicación**: `src/shared/`
- **Tecnología**: TypeScript
- **Responsabilidad**: Lógica reutilizable, gestión global
- **Ejemplos**: `EventManager.ts`, `Logger.ts`, `TranslationManager.ts`

---

## 🔌 Puntos de Integración Críticos

### 1. RageMP Client API
```typescript
// mp-sage.ts proporciona acceso mock/real
import mp from "./utils/mp-sage.ts";

mp.trigger("event", data);     // Emitir evento al servidor
mp.events.add("event", cb);    // Escuchar evento
mp.keys.bind(key, toggle, cb); // Binding de teclado
mp.browsers.new(url);          // Crear navegador CEF
mp.gui.chat.push(msg);         // Mostrar en chat
```

### 2. React ↔ RAGE:MP Communication
```typescript
// React → RAGE:MP
onClick={() => mp.trigger("client:action", data)}

// RAGE:MP → React
mp.events.add("client:action", (data) => {
  browser.call("updateUI", data); // Llamar función en React
});
```

### 3. TranslationManager Global
```typescript
// Cargar traducciones
TranslationManager.instance.loadLanguage("es");

// Traducir
const text = TranslationManager.instance.t("ui.welcome", { name: "Juan" });

// En React
const { t, ready } = useTranslation("es");
```

---

## 🛡️ Consideraciones de Seguridad

⚠️ **Importante**: Este es código client-side. **NO guardes secretos aquí**.

- ✅ Lógica de UI segura
- ✅ Eventos de RAGE:MP sin autenticación
- ❌ API Keys
- ❌ Contraseñas
- ❌ Tokens JWT

```typescript
// ❌ MAL
const API_KEY = "super-secret-key";

// ✅ BIEN
// Guardar en servidor, recibir por evento
mp.events.add("server:apiKeyReceived", (key) => {
  // Usar solo para esta sesión
});
```

---

## 📈 Scalability

### Para Agregar Nuevo Módulo:

1. **Crear carpeta en `src/client/modules/`**
   ```
   src/client/modules/inventory/
   ├── index.ts
   ├── InventoryManager.ts
   └── __tests__/
   ```

2. **Registrar en `src/client/modules/index.ts`**
   ```typescript
   import "./inventory";
   ```

3. **Usar EventManager**
   ```typescript
   eventManager.on("inventory:open", handleOpen);
   ```

4. **Agregar componentes React en `src/client/ui/views/`**

---

## 🧪 Testing

### Estrategia de Tests

```
Unit Tests
├── EventManager.test.ts
├── Logger.test.ts
└── TranslationManager.test.ts

Integration Tests
├── Player + UI interaction
└── Traducciones + Context
```

### Ejecutar Tests
```bash
npm install -D vitest
npm run test
```

---

## 📚 Referencias Externas

- [RAGE:MP Documentation](http://rage.mp/wiki/)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/)
- [Vite Guide](https://vitejs.dev/)
- [Rollup Guide](https://rollupjs.org/)

---

**Última actualización**: 25 Nov 2025  
**Versión**: 1.0  
**Mantenedor**: Proyecto Custom TypeScript
