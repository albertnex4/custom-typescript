# 📊 DIAGRAMS - Diagramas de Arquitectura y Flujos

## 1️⃣ Arquitectura General

```
┌─────────────────────────────────────────────────────────────────┐
│                    RAGE:MP Server (dist/)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────┐  ┌─────────────────────┐ │
│  │  Client Scripts (Rollup)         │  │  UI (Vite + React)  │ │
│  │  dist/client_packages/index.js   │  │  dist/client_...ui/ │ │
│  │                                  │  │                     │ │
│  │  ├─ player-management.ts         │  │  ├─ App.tsx         │ │
│  │  ├─ UIManager.ts                 │  │  ├─ RichText.tsx    │ │
│  │  └─ Vehicle, Inventory, etc      │  │  └─ Views/          │ │
│  │                                  │  │                     │ │
│  └──────────────────────────────────┘  └─────────────────────┘ │
│           ↑                                      ↑               │
│           │                                      │               │
│           └──────────────────────────────────────┘               │
│                  EventManager (Shared)                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
         ↑                                        ↑
         │ Client Events                         │ Server Events
         │                                        │
         └────────────────────────────────────────┘
              RAGE:MP MP Object
```

---

## 2️⃣ Flujo de Inicialización

```
App Starts
    ↓
[main.tsx]
    ├─ Importar LanguageProvider
    ├─ Importar App
    └─ Renderizar React
        ↓
    [LanguageProvider]
        ├─ Leer localStorage (idioma guardado)
        └─ Llamar TranslationManager.loadLanguage()
            ↓
        [App.tsx]
            ├─ useEffect → inicializar player module
            ├─ mp.events.add("playerReady", ...)
            └─ eventManager.on("cif:helloWorld", ...)
                ↓
            [player-management.ts]
                ├─ logger.info("Inicializando...")
                ├─ setupKeyBindings()
                ├─ setupEventListeners()
                └─ ✅ Sistema listo
```

---

## 3️⃣ Flujo de Evento (React → RAGE:MP)

```
User Interaction
    ↓
React Button onClick
    ↓
eventManager.emit("client:action", data)
    ├─ Type Check ✅ (TypeScript valida)
    └─ Validar data contra EventMap
        ↓
Todos los listeners notificados
    ├─ player-management.ts handler
    ├─ logger.debug() output
    └─ mp.trigger("server:action", ...)
        ↓
    Server recibe evento
        ↓
    ✅ Completado
```

---

## 4️⃣ Flujo de Traducción (i18n)

```
Boot
    ↓
LanguageContext leer localStorage
    ↓
TranslationManager.loadLanguage("es")
    ├─ fetch("/translations/es.json")
    └─ Cache en Map
        ↓
useTranslation("es") hook en componente
    ├─ Conectar a TranslationManager listener
    └─ Re-renderizar si idioma cambia
        ↓
RichText recibe idioma del Context
    ├─ Traducir: t("key", params)
    └─ Render traducción
```

### Cambiar Idioma en Runtime

```
User clicks "Cambiar a Francés"
    ↓
setLang("fr")
    ├─ localStorage.setItem("app_lang", "fr")
    ├─ TranslationManager.loadLanguage("fr")
    └─ Notificar listeners
        ↓
    Todos los componentes que usan useTranslation()
        └─ Re-renderizar con nuevo idioma
            ↓
        ✅ Todo el UI actualizado instantáneamente
```

---

## 5️⃣ Flujo de Error Handling

```
Operación (fetch, event, etc)
    ↓
Try Block
    ├─ ✅ Éxito → logger.info(), continuar
    └─ ❌ Error
        ↓
    Catch Block
        ├─ logger.error(message, error)
        ├─ Error aparece en consola
        ├─ Error guardado en Logger.history
        └─ Opcionalmente: enviar a servidor
            ↓
        ✅ Logueo completo, usuario notificado
```

---

## 6️⃣ Arquitectura de Servicios Compartidos

```
┌────────────────────────────────────────┐
│        src/shared/                      │
├────────────────────────────────────────┤
│                                        │
│  ┌──────────────────────────────────┐ │
│  │    EventManager                   │ │
│  │  • Type-safe events              │ │
│  │  • Centraliza comunicación        │ │
│  │  • Observer pattern               │ │
│  └──────────────────────────────────┘ │
│           ↓         ↓        ↓         │
│   Usado en UI    Usado en    Usado en  │
│   Componentes    Modules     Tests     │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │    Logger                         │ │
│  │  • Logging con niveles            │ │
│  │  • Historial                      │ │
│  │  • Export a JSON                  │ │
│  └──────────────────────────────────┘ │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │    TranslationManager             │ │
│  │  • Cargar idiomas                 │ │
│  │  • Plurales                       │ │
│  │  • Parámetros                     │ │
│  └──────────────────────────────────┘ │
│                                        │
└────────────────────────────────────────┘
    ↓              ↓              ↓
src/client/   src/client/    Tests
modules/      ui/
```

---

## 7️⃣ Ciclo de Vida de UIManager

```
Boot
    ↓
uiManager = new UIManager() [Singleton]
    ├─ isShowing = false
    ├─ browser = null
    └─ observers = Set
        ↓
User presiona tecla E
    ↓
uiManager.toggle()
    ├─ isShowing = false → show()
    │   ├─ browser = mp.browsers.new(URL)
    │   ├─ mp.gui.cursor.show(true, true)
    │   ├─ notifyObservers(true)
    │   └─ ✅ UI visible
    │
    └─ isShowing = true → hide()
        ├─ browser.destroy()
        ├─ mp.gui.cursor.show(false, false)
        ├─ notifyObservers(false)
        └─ ✅ UI oculta
```

---

## 8️⃣ Build Process Pipeline

```
Source Code
├─ src/client/ui/        (React + TS)
├─ src/client/modules/   (TS)
└─ src/shared/           (TS)

    ↓

Build Tools
├─ Vite (UI)           →  dist/client_packages/ui/
├─ Rollup (Modules)    →  dist/client_packages/index.js
└─ Copy Static         →  dist/

    ↓

dist/ folder (completo)
├─ client_packages/
│   ├─ index.js         (Cliente scripts)
│   └─ ui/              (HTML + CSS + JS React)
├─ client_packages.meta/
├─ RAGE.Meta
└─ ... (resto de server)

    ↓

RAGE:MP Server
├─ Sirve index.js en cliente
├─ Sirve UI en navegador CEF
└─ ✅ Juego ejecutándose

```

---

## 9️⃣ Type Safety Flow

```
EventMap Interface (src/shared/EventManager.ts)
├─ "client:action": { type: string; data: any }
├─ "server:update": { id: number; value: string }
└─ ... (todos los eventos)

    ↓

emit() y on() usan generics
    ├─ emit<K extends keyof EventMap>("event", data: EventMap[K])
    └─ on<K extends keyof EventMap>("event", cb: (data: EventMap[K]) => void)

    ↓

TypeScript valida

eventManager.emit("client:action", { type: "test" })
    ✅ OK

eventManager.emit("client:action", "invalid")
    ❌ Error: Type 'string' is not assignable to type '{ type: string; data: any }'

```

---

## 🔟 Memory Leaks Prevention

```
Component Mount
    ↓
useEffect(() => {
    ├─ Suscribirse a evento
    │   const unsubscribe = eventManager.on(...)
    │   
    └─ Return cleanup function
        └─ () => unsubscribe()
        })
    ↓
Component Unmount
    ├─ Cleanup function ejecutada
    └─ Evento desuscrito
        ↓
    ✅ Sin memory leaks
```

### Sin cleanup (❌ MALO)

```
Component Mount
    ├─ eventManager.on(...) x1
    ↓
Component Unmount
    ├─ Nada (listener sigue activo)
    ↓
Component Mount again
    ├─ eventManager.on(...) x2 (ahora hay 2 listeners)
    ↓
Acumular listeners → Memory leak
```

---

## 1️⃣1️⃣ Component Hierarchy con Context

```
<html>
  └─ <React StrictMode>
      └─ <LanguageProvider>  ← Raíz global de idioma
          ├─ language = "es"
          └─ setLanguage(lang)
              ↓
              └─ <App />
                  ├─ useLanguage() → { lang: "es", setLang }
                  ├─ useTranslation("es") → { t, ready }
                  └─ <RichText k="..." />
                      ├─ useLanguage() → { lang: "es", setLang }
                      └─ Renderiza en español
                  └─ <VehicleList />
                      ├─ useLanguage() → { lang: "es", setLang }
                      └─ Renderiza en español
                  └─ <Settings>
                      └─ <LanguageSwitcher />
                          ├─ onClick={() => setLang("en")}
                          └─ ✅ Todos los componentes actualizados
```

---

## 1️⃣2️⃣ Request/Response Pattern

```
UI Component
    ↓
eventManager.emit("player:getStats", { playerId: 123 })
    ↓
player-management.ts escucha
    ├─ logger.info("Get stats solicitado")
    ├─ Obtener stats del jugador
    └─ eventManager.emit("ui:statsReceived", stats)
        ↓
UI Component escucha
    ├─ setStats(stats)
    └─ Re-renderizar con nuevos stats
```

---

## 1️⃣3️⃣ Testability Structure

```
Service Layer (Fácil de testear)
├─ EventManager.ts
│   └─ .on(), .emit(), .once()
│       ↓
│       Testeable (sin dependencias de RAGE:MP)
│
├─ Logger.ts
│   └─ .info(), .error(), .debug()
│       ↓
│       Testeable (sin dependencias externas)
│
└─ TranslationManager.ts
    └─ .t(), .tp(), .loadLanguage()
        ↓
        Testeable (mock de fetch)

    ↓

Component Layer (Difícil de testear)
├─ React Components
│   ├─ Presentation logic (fácil)
│   └─ DOM rendering (difícil)
│
└─ RAGE:MP Modules
    ├─ Lógica pura (fácil)
    └─ mp.* API (difícil/no testeable)
```

---

## 1️⃣4️⃣ Deployment Timeline

```
Desarrollo Local (Dev Mode)
└─ npm run dev
    ├─ Vite en hot-reload
    ├─ Rollup en watch mode
    ├─ Logger en DEBUG level
    └─ Source maps completos
        ↓ (usuario presiona build)

Build para Producción
└─ npm run build
    ├─ Vite minificado
    ├─ Rollup minificado
    ├─ Logger en INFO level
    ├─ Source maps remoto (opcional)
    └─ Genera dist/ final
        ↓

Deploy al Servidor RAGE
└─ Copiar dist/ al servidor
    ├─ Client recibe index.js
    ├─ CEF carga UI desde dist/client_packages/ui
    └─ ✅ Juego vive en producción
```

---

## 1️⃣5️⃣ Data Flow Diagram (Completo)

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  Player/Client RAGE:MP                                       │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                                                         │ │
│  │  ┌──────────────────┐           ┌──────────────────┐   │ │
│  │  │  CEF Browser     │           │  Game Client     │   │ │
│  │  │  (React UI)      │           │  (Scripts)       │   │ │
│  │  │                  │           │                  │   │ │
│  │  │  ┌────────────┐  │           │  ┌────────────┐  │   │ │
│  │  │  │ App.tsx    │  │           │  │ player-mgmt│  │   │ │
│  │  │  │ RichText   │  │           │  │ UIManager  │  │   │ │
│  │  │  └────────────┘  │           │  └────────────┘  │   │ │
│  │  │        ↓         │           │         ↓        │   │ │
│  │  │  EventManager ────────────────→ EventManager   │   │ │
│  │  │        ↓         │           │         ↓        │   │ │
│  │  │  Logger ←──────────────────── Logger           │   │ │
│  │  │                  │           │                  │   │ │
│  │  └──────────────────┘           └──────────────────┘   │ │
│  │         ↓                                 ↓             │ │
│  │   mp.trigger("event")  ←──→  mp.events.add("event")   │ │
│  │                                                         │ │
│  └──────────────────────┬──────────────────────────────────┘ │
│                         │                                    │
└──────────────────────────┼────────────────────────────────────┘
                           │
                        Network
                           │
                ┌──────────┴──────────┐
                ↓                     ↓
        ┌─────────────┐        ┌────────────┐
        │   Server    │        │  Database  │
        │  (Node.js)  │────────│  (SQLite)  │
        └─────────────┘        └────────────┘
```

---

**Estos diagramas visualizan cómo los componentes interactúan y se comunican en la arquitectura mejorada.**

Generado: 25 Nov 2025
