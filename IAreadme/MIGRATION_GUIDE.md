# 🔄 MIGRATION_GUIDE - Guía de Migración

## 📚 Índice
1. [Preparación](#preparación)
2. [Paso 1: Actualizar App.tsx](#paso-1-actualizar-apptsx)
3. [Paso 2: Actualizar main.tsx](#paso-2-actualizar-maintsx)
4. [Paso 3: Migrar player-management.ts](#paso-3-migrar-player-managementts)
5. [Paso 4: Actualizar RichText.tsx](#paso-4-actualizar-richtext)
6. [Paso 5: Verificación](#paso-5-verificación)

---

## Preparación

### 1. Hacer backup
```bash
git add .
git commit -m "backup: before migration"
```

### 2. Crear rama de migración
```bash
git checkout -b refactor/centralize-services
```

### 3. Verificar que todo compila
```bash
npm run build
```

---

## Paso 1: Actualizar App.tsx

### Antes
```typescript
import logo from "./assets/logo.png";
import React, { useState, useEffect } from "react";
import mp from "./utils/mp-sage";
import { RichText } from "./components/base/RichText";

export const App = () => {
    const [counter, setCounter] = useState(0);
    const [text, setText] = useState("null");

    const handleIncrement = () => {
        onClickFunction();
        setText("holaa boton!!");
    }

    mp.events.add("cif:helloWorld", () => {
        setText("hola des de cliente!!");
        mp.trigger("client:helloWorld", "Abrimos CIF React!!");
    });
    
    return (
        <div>
            <h1>Hello, React + TypeScript</h1>
            <button onClick={handleIncrement}>Enviar evento a RAGEMP</button>
            <h2>Counter : {text}</h2>
            <img src={logo} alt="Logo" />
            <RichText k="client.vehicle.speed" params={{ speed: "55" }} />
        </div>
    );
};
```

### Después
```typescript
import logo from "./assets/logo.png";
import React, { useState, useEffect } from "react";
import mp from "./utils/mp-sage";
import { RichText } from "./components/base/RichText";
import { eventManager } from "../../shared/EventManager";
import { logger } from "../../shared/Logger";

export const App = () => {
    const [counter, setCounter] = useState(0);
    const [text, setText] = useState("null");

    // Escuchar eventos con EventManager
    useEffect(() => {
        const unsubscribe = eventManager.on("cif:helloWorld", () => {
            logger.debug("Evento cif:helloWorld recibido");
            setText("hola des de cliente!!");
            eventManager.emit("client:helloWorld", "Abrimos CIF React!!");
        });

        return () => unsubscribe();
    }, []);

    const handleIncrement = () => {
        try {
            logger.info("Click en botón Enviar evento");
            onClickFunction();
            setText("holaa boton!!");
        } catch (error) {
            logger.error("Error en handleIncrement", error as Error);
        }
    }
    
    return (
        <div>
            <h1>Hello, React + TypeScript</h1>
            <button onClick={handleIncrement}>Enviar evento a RAGEMP</button>
            <h2>Counter : {text}</h2>
            <img src={logo} alt="Logo" />
            <RichText k="client.vehicle.speed" params={{ speed: "55" }} />
        </div>
    );
};
```

**Cambios principales**:
- ✅ Importar `eventManager` y `logger`
- ✅ Mover `mp.events.add()` a `useEffect`
- ✅ Usar `eventManager.on()` en lugar de `mp.events.add()`
- ✅ Agregar cleanup con `useEffect` return
- ✅ Agregar logging

---

## Paso 2: Actualizar main.tsx

### Antes
```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App.tsx'
import { startEvents } from './App.tsx'
import './styles.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

startEvents();
```

### Después
```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App.tsx'
import { LanguageProvider } from './contexts/LanguageContext.tsx'
import './styles.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </React.StrictMode>,
)
```

**Cambios principales**:
- ✅ Importar `LanguageProvider`
- ✅ Envolver `<App />` en `<LanguageProvider>`
- ✅ Remover `startEvents()` (ahora en App.tsx)

---

## Paso 3: Migrar player-management.ts

### Antes
```typescript
import TranslationManager from "../../../shared/TranslationManager";
import en from "../../../client/ui/public/translations/en.json";

TranslationManager.cache.set('en', en);
TranslationManager.instance.loadLanguage('en');
const msg = TranslationManager.instance.t("ui.welcome", { name: "Pepe!" });

let showCif = false;
let brow: BrowserMp;

mp.events.add("client:helloWorld", (mgs:string) => {
    mp.gui.chat.push(`Evento Mensaje RageMP: ${mgs}`);
});

mp.keys.bind(0x45, true, () => { // Tecla E
    showCif = !showCif;
    mp.gui.chat.push(msg);
    if(showCif){
        brow = mp.browsers.new("http://package/ui/index.html");
        brow.call("cif:helloWorld", false);
        mp.gui.cursor.show(true, true);
    }else{
        brow.destroy();
        mp.gui.cursor.show(false, false);
    }
});
```

### Después (usar player-management.improved.ts)
```typescript
import { eventManager } from "../../../shared/EventManager";
import { logger } from "../../../shared/Logger";
import TranslationManager from "../../../shared/TranslationManager";
import en from "../../ui/public/translations/en.json";
import { uiManager } from "../ui/UIManager";

// Cargar traducciones
TranslationManager.cache.set("en", en);
TranslationManager.instance.loadLanguage("en");

export function initializePlayerManagement() {
  logger.info("Inicializando Player Management");

  // Usar EventManager en lugar de mp.events.add()
  eventManager.on("client:helloWorld", handleHelloWorld);

  // Escuchar cambios en UI
  eventManager.on("ui:browserToggled", handleBrowserToggled);

  // Configurar keybindings
  setupKeyBindings();

  logger.info("Player Management inicializado");
}

function handleHelloWorld(message: string) {
  try {
    logger.debug("Evento helloWorld recibido", { message });
    mp.gui.chat.push(`🎮 ${message}`);
    
    eventManager.emit("client:playerAction", {
      action: "hello",
      data: { message },
    });
  } catch (error) {
    logger.error("Error en handleHelloWorld", error as Error);
  }
}

function handleBrowserToggled(isShowing: boolean) {
  logger.info(`Browser ${isShowing ? "mostrado" : "ocultado"}`);
  
  if (isShowing) {
    const msg = TranslationManager.instance.t("ui.welcome", { name: "Pepe!" });
    mp.gui.chat.push(msg);
  }
}

function setupKeyBindings() {
  // Tecla E para toggle UI
  mp.keys.bind(0x45, true, () => {
    try {
      logger.debug("Tecla E presionada");
      uiManager.toggle();
    } catch (error) {
      logger.error("Error en binding E", error as Error);
    }
  });
}

export function destroyPlayerManagement() {
  uiManager.destroy();
  logger.info("Player Management destruido");
}
```

**Cambios principales**:
- ✅ Usar `eventManager.on()` en lugar de `mp.events.add()`
- ✅ Usar `uiManager.toggle()` en lugar de controlar manualmente
- ✅ Agregar logging con `logger`
- ✅ Mejor estructura con funciones separadas

**Cómo reemplazar**:
```bash
# Opción 1: Renombrar archivo
mv src/client/modules/player/player-management.ts src/client/modules/player/player-management.old.ts
mv src/client/modules/player/player-management.improved.ts src/client/modules/player/player-management.ts

# Opción 2: Copiar contenido mejorado
# Manualmente copiar el contenido de player-management.improved.ts
```

---

## Paso 4: Actualizar RichText.tsx

### Antes
```typescript
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
```

### Después
```typescript
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
```

**Cambios principales**:
- ✅ Importar `useLanguage`
- ✅ Usar `lang` del Context en lugar de hardcodeado
- ✅ Agregar fallback handling
- ✅ Agregar className prop

---

## Paso 5: Verificación

### 5.1 Verificar compilación
```bash
npm run build
```

Debe completarse sin errores.

### 5.2 Verificar tipos
```bash
npx tsc --noEmit
```

Debe haber 0 errores.

### 5.3 Verificar en desarrollo
```bash
npm run dev:ui
```

Abre http://localhost:5173 y verifica que:
- ✅ UI se carga sin errores
- ✅ Logger muestra mensajes en consola
- ✅ Componentes RichText funcionan

### 5.4 Tests (opcional)
```bash
npm install -D vitest
npm run test
```

---

## 🎯 Checklist de Migración

```
Preparación
[ ] Backup actual (git commit)
[ ] Nueva rama (git checkout -b)
[ ] Compilación OK

Paso 1: App.tsx
[ ] Importar eventManager
[ ] Importar logger
[ ] Mover mp.events.add() a useEffect
[ ] Agregar cleanup

Paso 2: main.tsx
[ ] Importar LanguageProvider
[ ] Envolver App en LanguageProvider
[ ] Remover startEvents()

Paso 3: player-management.ts
[ ] Usar EventManager
[ ] Usar UIManager
[ ] Agregar logging
[ ] Exportar initializePlayerManagement
[ ] Actualizar index.ts si es necesario

Paso 4: RichText.tsx
[ ] Importar useLanguage
[ ] Usar lang del Context
[ ] Agregar fallback handling
[ ] Agregar className prop

Verificación
[ ] npm run build (sin errores)
[ ] npx tsc --noEmit (sin errores)
[ ] npm run dev:ui (funciona)
[ ] Tests pasan (opcional)

Finalización
[ ] git add .
[ ] git commit -m "refactor: centralize services"
[ ] git push origin refactor/centralize-services
[ ] Crear Pull Request para review
```

---

## 🐛 Troubleshooting

### Error: "Cannot find module 'src/shared/EventManager'"
**Solución**: Verificar paths en tsconfig.json. Debe estar configurado.

### Error: "useLanguage debe usarse dentro de LanguageProvider"
**Solución**: Asegurar que main.tsx envuelve App en LanguageProvider.

### UIManager se muestra pero no se oculta
**Solución**: Verificar que mp.gui.cursor.show() está siendo llamado.

### Traducciones no cargan
**Solución**: Verificar que LanguageProvider.tsx carga correctamente.

### Memory leak en useEffect
**Solución**: Verificar que `cleanup function` está retornando `unsubscribe()`.

---

## 📊 Métricas Post-Migración

Después de completar la migración, esperar:

| Métrica | Antes | Después |
|---------|-------|---------|
| Warnings en build | 2-3 | 0 |
| Bundle size | X KB | X KB |
| Dev server time | 3s | 2s |
| Logger output | ❌ | ✅ |
| Type errors | - | 0 |

---

## 🔄 Rollback

Si algo falla, volver al estado anterior:

```bash
# Opción 1: Deshacer commit
git reset --hard HEAD~1

# Opción 2: Descartar cambios
git checkout .

# Opción 3: Volver a rama anterior
git checkout main
```

---

## ✅ Post-Migración

1. **Actualizar documentación** en el equipo
2. **Hacer un pull request** para revisión
3. **Agregar tests** para nuevas funciones
4. **Comunicar cambios** en el equipo

---

**Tiempo estimado**: 2-3 horas  
**Dificultad**: ⭐⭐ (Fácil a Moderada)  
**Riesgo**: Bajo (cambios aditivos)

Generado: 25 Nov 2025
