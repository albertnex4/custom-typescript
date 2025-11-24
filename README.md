# INSTALACION FRONT
--Front contiene 2 partes
    -- UI -> React + TypeScritp + Vite para generar html y js
    -- Modules -> Scripts de RageMP + TypeScript + rollup para generar js

--Carpeta dist / si no existe crear
    --En la carpeta dist pegaremos todo el contenido de ragemp server-files -> C:\RAGEMP\server-files
    --El build js de ragemp client-side se guarda en -> dist\client_packages\index.js
    --El build de ui React se guarda en -> dist\client_packages\ui 
        --index.html
        --index.js
        --index.js.map
        --assets -> css/images


--Config
    --Vite
        --vite build --watch --config vite.config.ts -> Detectar cambios y generar build en la carpeta dist
        --vite dev --mode development -> Arrancar servidor local para debugar parte react
    --Rollup
        --rollup -c rollup.client.config.cjs -w -> Detectar cambios y generar build en la carpeta dist
        --rollup -c rollup.client.config.cjs -> Generar build en carpeta dist
    --Dev React en navegador local (no CIF RAGEMP)
        --Al arrancar solo react la ejecucion de eventos RageMP no funciona y fallara por no interpretar las variables
        --Con ui/utils/mp-sage.ts solucionamos este problema generando eventos sinteticos para que no fallen y simulen la llamada al evento
    --Dev Ragemp en navegador local (no Game)
        --Actualmente no hay forma de poder debugar la logica del client RageMP

--Start
    --npm run dev -> Arrancar el proyecto en modo desarrollo 
        --Arrancar/Reinicia servidor ragemp-server.exe y detectara cambios en ui + client para compilar si hay cambios
    --npm run dev:ui -> Arrancar servidor local para debugar parte react
    --npm run build -> Genera la build de ui + client en la carpeta dist
