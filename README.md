# Instalación Front

El **Front** contiene 2 partes:

1. **UI** → React + TypeScript + Vite para generar HTML y JS  
2. **Modules** → Scripts de RageMP + TypeScript + Rollup para generar JS

---

## 📁 Estructura de carpetas

- **Carpeta `dist/`** (si no existe, crear).
- En la carpeta `dist` se debe pegar todo el contenido de **ragemp server-files**  
  `C:\RAGEMP\server-files`

### 📦 Builds generados

- **Build JS de RageMP client-side:**  
  `dist/client_packages/index.js`

- **Build de UI (React):**  
  `dist/client_packages/ui`
  - `index.html`
  - `index.js`
  - `index.js.map`
  - `assets/` (css / images)

---

## ⚙️ Configuración

### Vite
- `vite build --watch --config vite.config.ts`  
  Detecta cambios y genera el build en la carpeta `dist`.

- `vite dev --mode development`  
  Arranca un servidor local para debugear la parte React.

### Rollup
- `rollup -c rollup.client.config.cjs -w`  
  Detecta cambios y genera el build en `dist`.

- `rollup -c rollup.client.config.cjs`  
  Genera el build en `dist`.

---

## 🧪 Desarrollo

### Dev React en navegador local (No CEF RageMP)
- Al arrancar solo React, la ejecución de eventos RageMP **no funciona**, fallará por no interpretar las variables.
- Con `ui/utils/mp-sage.ts` se solucionan estos problemas generando **eventos sintéticos** para simular la llamada a eventos.

### Dev RageMP en navegador local (No Game)
- Actualmente **no esta implementado debugear la lógica del client RageMP**.

---

## 🚀 Start / Scripts

- `npm run dev`  
  Arranca el proyecto en modo desarrollo.  
  Iniciar/Reiniciar `ragemp-server.exe`  
  Detectará cambios en UI + client para compilar si los hay.

- `npm run dev:ui`  
  Arranca servidor local para debugear React.

- `npm run build`  
  Genera la build de UI + client en la carpeta `dist`.

- `npm run i18n:types`  
  Genera Translation.types.ts con todas las keys de las traduciones /shared/translations/*.json
