# ❓ FAQ - Preguntas Frecuentes

## 🎯 Preguntas Generales

### P: ¿En qué estado está el proyecto actualmente?
**A**: El proyecto tiene **buena base**, pero necesita mejoras en:
- Centralización de eventos
- Manejo de idiomas dinámico
- Gestión de recursos (CEF Browser)
- Logging consistente

Ver: `ANALISIS_Y_MEJORAS.md` para detalles.

---

### P: ¿Cuánto tiempo lleva implementar las mejoras?
**A**: 
- Lectura de documentación: **30 min**
- Implementación básica: **2-3 horas**
- Testing y validación: **1 hora**
- **Total: 1 día de trabajo**

---

### P: ¿Es obligatorio implementar todas las mejoras?
**A**: No. Puedes hacer esto por fases:
1. **ALTA PRIORIDAD** (Semana 1): EventManager + LanguageContext + UIManager
2. **MEDIA PRIORIDAD** (Semana 2): Logger + Refactoring
3. **BAJA PRIORIDAD** (Semana 3): Tests + Documentación

---

### P: ¿Afecta a mi código existente?
**A**: No directamente. Los servicios nuevos son **aditivos**:
- ✅ Tu código viejo sigue funcionando
- ✅ Puedes migrar gradualmente
- ✅ Los archivos `.improved.ts` coexisten

Recomendación: Crear rama de git antes de cambios.

---

## 🛠️ Preguntas Técnicas

### P: ¿Cómo actualizo App.tsx?
**A**: Ver paso 1 en `MIGRATION_GUIDE.md`. Cambios principales:
```typescript
// Agregar
import { eventManager } from "../../shared/EventManager";
import { logger } from "../../shared/Logger";

// Mover mp.events.add() a useEffect con cleanup
useEffect(() => {
  const unsub = eventManager.on("event", handler);
  return () => unsub();
}, []);
```

---

### P: ¿Cómo cambio idiomas dinámicamente?
**A**: 
```typescript
const { lang, setLang } = useLanguage();

// Cambiar a español
setLang("es");

// Cambiar a inglés
setLang("en");

// Todos los componentes se actualizan automáticamente
```

---

### P: ¿Qué pasa con las traducciones en client scripts?
**A**: 
```typescript
// En player-management.ts
import TranslationManager from "../../../shared/TranslationManager";

TranslationManager.instance.loadLanguage("es");
const msg = TranslationManager.instance.t("ui.welcome", { name: "Pepe" });
```

**Importante**: Los scripts NO tienen cambios dinámicos de idioma (no son React).

---

### P: ¿Cómo evito memory leaks?
**A**: 
1. **En React**: Siempre limpiar en useEffect
   ```typescript
   useEffect(() => {
     const unsub = eventManager.on("event", handler);
     return () => unsub(); // ← IMPORTANTE
   }, []);
   ```

2. **En Modules**: Destruir UIManager
   ```typescript
   export function destroy() {
     uiManager.destroy();
   }
   ```

---

### P: ¿Cómo logueo eventos?
**A**: 
```typescript
import { logger } from "../../../shared/Logger";

// Debug (solo en dev)
logger.debug("Mensaje debug", { data });

// Info (importante)
logger.info("Acción realizada", { actionId: 123 });

// Warn (cuidado)
logger.warn("Valor inusual", { value });

// Error (problema)
logger.error("Fallo crítico", error as Error);
```

---

### P: ¿Cómo agrego nuevos eventos?
**A**: 
1. Editar `EventMap` en `src/shared/EventManager.ts`:
   ```typescript
   interface EventMap {
     "my:event": { param1: string; param2: number };
   }
   ```

2. TypeScript validará automáticamente:
   ```typescript
   eventManager.emit("my:event", { param1: "test", param2: 42 }); // ✅
   eventManager.emit("my:event", "invalid"); // ❌ Error
   ```

---

### P: ¿Qué es UIManager?
**A**: Clase singleton que gestiona el navegador CEF:
```typescript
import { uiManager } from "../modules/ui/UIManager";

// Mostrar
uiManager.show();

// Ocultar
uiManager.hide();

// Toggle
uiManager.toggle();

// Llamar función en la UI
uiManager.callUI("updateStats", { health: 100 });

// Suscribirse a cambios
uiManager.onChange((isShowing) => {
  console.log(isShowing ? "UI abierta" : "UI cerrada");
});
```

---

### P: ¿Cómo testeo mi código?
**A**: Instalar vitest:
```bash
npm install -D vitest @testing-library/react
```

Crear archivo `__tests__/MyCode.test.ts`:
```typescript
import { describe, it, expect } from "vitest";
import { myFunction } from "../myCode";

describe("myFunction", () => {
  it("debería hacer algo", () => {
    const result = myFunction();
    expect(result).toBe(expected);
  });
});
```

Ejecutar:
```bash
npm run test
```

---

## 🚀 Preguntas sobre Build

### P: ¿Cómo compilo para producción?
**A**: 
```bash
npm run build
```

Genera:
- `dist/client_packages/index.js` (scripts minificados)
- `dist/client_packages/ui/` (UI minificada)

---

### P: ¿Cómo compilo solo la UI?
**A**: 
```bash
npm run build:ui
```

---

### P: ¿Cómo compilo solo los módulos?
**A**: 
```bash
npm run build:client
```

---

### P: ¿Qué pasa si falta una traducción?
**A**: 
- En desarrollo: La key aparece como text (ej: "ui.welcome")
- En producción: Lo mismo (fallback)
- Usar `RichText` con `fallback` prop para manejar:
  ```typescript
  <RichText 
    k="ui.welcome" 
    fallback="Bienvenido" 
  />
  ```

---

### P: ¿Cómo genero types de traducciones?
**A**: 
```bash
npm run i18n:types
```

Actualiza `src/shared/translation.types.ts` automáticamente.

---

## 🔐 Preguntas sobre Seguridad

### P: ¿Puedo guardar tokens aquí?
**A**: **NO**. Este es código client-side. Nunca guardes:
- ❌ API Keys
- ❌ JWT Tokens
- ❌ Contraseñas
- ❌ Información sensible

**Solución**: Guardar en servidor, recibir por eventos:
```typescript
// En servidor
eventManager.emit("auth:tokenReceived", { token: "..." });

// En cliente
eventManager.on("auth:tokenReceived", (data) => {
  // Usar solo en esta sesión, no persitir
});
```

---

### P: ¿Es segura la comunicación cliente-servidor?
**A**: RAGE:MP proporciona encriptación por defecto. 
Recomendaciones:
- ✅ Validar datos en servidor
- ✅ No confiar en datos del cliente
- ✅ Implementar autenticación
- ✅ Usar HTTPS si es posible

---

## 📦 Preguntas sobre Dependencies

### P: ¿Debo instalar vitest?
**A**: Solo si quieres tests. No es obligatorio para desarrollo.

---

### P: ¿Qué versiones de React/TypeScript usas?
**A**: 
- React: 19.2.0
- TypeScript: 5.9.3
- Vite: 7.2.4
- Rollup: 3.29.5

Ver `package.json` para detalles.

---

### P: ¿Puedo usar otras librerías?
**A**: Sí, pero:
- ✅ Para UI: React utilities, date libs, etc
- ⚠️ Para estado: Considera si vale la pena (ya hay Context)
- ❌ Para RAGE:MP: NO (la API es específica)

---

## 🎨 Preguntas sobre Styling

### P: ¿Cómo agrego estilos?
**A**: 
1. **CSS tradicional**: `src/client/ui/styles.css`
   ```css
   .my-component {
     color: red;
   }
   ```

2. **CSS Modules**: `Component.module.css`
   ```typescript
   import styles from "./Component.module.css";
   <div className={styles.container}>...</div>
   ```

3. **Tailwind**: Agregar dependencia e importar

---

### P: ¿Soporta Tailwind CSS?
**A**: Sí, pero no está configurado por defecto. Para agregar:
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Luego importar en `main.tsx`:
```typescript
import "tailwindcss/tailwind.css";
```

---

## 🐛 Preguntas sobre Debugging

### P: ¿Cómo debuggeo eventos?
**A**: Usa `logger` y developer tools:
```typescript
// Ver todos los eventos
eventManager.onAny((data) => {
  console.log("Evento:", data);
});

// Ver listeners de un evento
console.log(eventManager.getListenerCount("my:event"));

// Ver historial de logs
logger.getHistory();
```

---

### P: ¿Cómo debuggeo en CEF?
**A**: 
1. Abrir Chrome DevTools
2. F12 o Ctrl+Shift+I
3. Ver Console para logger output
4. Ver Network para fetch requests
5. Ver Sources para debugging

---

### P: ¿Cómo veo los logs en archivo?
**A**: 
```typescript
// Exportar logs a JSON
const logsJSON = logger.export();

// Enviar al servidor
fetch("/api/logs", {
  method: "POST",
  body: logsJSON
});
```

---

## 💡 Preguntas sobre Mejores Prácticas

### P: ¿Cuándo usar Type vs Interface?
**A**: 
- **Type**: Definiciones simples, union types
- **Interface**: Objetos complejos, extensible

```typescript
// Type
type PlayerId = number;
type Status = "online" | "offline";

// Interface
interface Player {
  id: PlayerId;
  name: string;
  status: Status;
}
```

---

### P: ¿Cómo escribo componentes limpios?
**A**: 
1. Un responsabilidad por componente
2. Extraer lógica a hooks custom
3. Pasar datos via props
4. Usar TypeScript para tipos

```typescript
// ❌ MALO: Demasiada responsabilidad
function PlayerPanel() {
  // fetch, render, event handling, styling...
}

// ✅ BIEN: Separado
function PlayerCard({ player }: { player: Player }) {
  return <div>{player.name}</div>;
}

function PlayerList() {
  const players = usePlayerData();
  return players.map(p => <PlayerCard key={p.id} player={p} />);
}
```

---

### P: ¿Cómo evito prop drilling?
**A**: Usar Context API:
```typescript
// ❌ MALO: Pasar props por múltiples niveles
<App theme={theme}>
  <Header theme={theme} />
    <Nav theme={theme} />
      <Button theme={theme} />

// ✅ BIEN: Usar Context
const ThemeContext = createContext();
<ThemeProvider>
  <App>
    <Header> ← Accede via useTheme()
      <Nav> ← Accede via useTheme()
        <Button> ← Accede via useTheme()
```

---

## 📚 Preguntas sobre Documentación

### P: ¿Dónde está toda la documentación?
**A**: 
| Documento | Contenido |
|-----------|-----------|
| `RESUMEN_EJECUTIVO.md` | Visión general |
| `ANALISIS_Y_MEJORAS.md` | 10 problemas encontrados |
| `ARCHITECTURE.md` | Estructura del proyecto |
| `BEST_PRACTICES.md` | 12 guías de código |
| `MIGRATION_GUIDE.md` | Pasos para implementar |
| `DIAGRAMS.md` | Diagramas visuales |
| `.github/copilot-instructions.md` | Para AI agents |

---

### P: ¿Cuál documento debo leer primero?
**A**: Orden recomendado:
1. `RESUMEN_EJECUTIVO.md` (5 min overview)
2. `ARCHITECTURE.md` (entender estructura)
3. `MIGRATION_GUIDE.md` (implementar cambios)
4. `BEST_PRACTICES.md` (escribir código limpio)

---

## 🆘 Troubleshooting

### P: EventManager dice "Cannot find module"
**A**: Verificar `tsconfig.json`:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "src/*": ["src/*"]
    }
  }
}
```

---

### P: LanguageContext falla en useEffect
**A**: Verificar que `main.tsx` envuelve `App` en `LanguageProvider`.

---

### P: UIManager no muestra el navegador
**A**: Verificar:
```typescript
// Debe estar en RAGE:MP client context
uiManager.show();

// Verificar URL es correcta
const UI_URL = "http://package/ui/index.html";

// Verificar permisos del navegador
mp.gui.cursor.show(true, true);
```

---

### P: Memory leak warning en consola
**A**: Asegurar cleanup en useEffect:
```typescript
useEffect(() => {
  const unsub = eventManager.on("event", handler);
  return () => unsub(); // ← NO OLVIDES ESTO
}, []);
```

---

### P: Tests no ejecutan
**A**: Instalar vitest:
```bash
npm install -D vitest
npm run test
```

---

## 📞 Soporte

### P: ¿A quién contacto si algo no funciona?
**A**: 
1. Revisar documentación relevante
2. Revisar troubleshooting arriba
3. Revisar `MIGRATION_GUIDE.md` paso a paso
4. Revisar `DIAGRAMS.md` para flujo esperado

---

### P: ¿Cómo reporto un bug?
**A**: 
1. Verificar que no es error de usuario (ver FAQ arriba)
2. Reproducir el bug paso a paso
3. Ver `logger.getHistory()` para información
4. Crear issue con detalles

---

## 📈 Preguntas sobre Escalabilidad

### P: ¿Cómo agrego nuevos módulos?
**A**: 
1. Crear `src/client/modules/mymodule/index.ts`
2. Agregar tipos en `EventMap` si es necesario
3. Importar en `src/client/modules/index.ts`
4. Registrar listeners en `initializeMyModule()`

Ver `player-management.improved.ts` como ejemplo.

---

### P: ¿Cómo manejo múltiples idiomas?
**A**: 
```typescript
// 1. Agregar traducciones
// src/shared/translations/fr.json
{ "ui.welcome": "Bienvenue" }

// 2. Regenerar tipos
npm run i18n:types

// 3. Cambiar idioma
const { setLang } = useLanguage();
setLang("fr");
```

---

### P: ¿Cómo implemento persistencia?
**A**: 
```typescript
// En localStorage
localStorage.setItem("player_data", JSON.stringify(data));
const data = JSON.parse(localStorage.getItem("player_data"));

// En servidor
eventManager.emit("save:playerData", data);
```

---

**¿Necesitas más ayuda? Revisa la sección relevante de documentación o crea un issue en GitHub.**

Generado: 25 Nov 2025
