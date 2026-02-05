// Dibuja un checkpoint personalizado en pantalla
// Muestra la distancia entre el jugador y el checkpoint
// Falta pasar a una clase para generar distintos checkpoints a partir de enum
const customCheckpoint = (position: Vector3) => {
    let renderEvent: any = null;
// Helper: formatea metros
    function formatMeters(v:any) {
        return Math.round(v) + "M";
    }

    // Render loop: dibuja UI sobre el checkpoint cada frame
    renderEvent = mp.events.add('render', () => {

        try {
            if(!position) return;
            const localPos = mp.players.local.position;
            // distancia euclidiana
            const dist = mp.game.system.vdist(localPos.x, localPos.y, localPos.z, position.x, position.y, position.z);

            // si el checkpoint no está en visión (fuera de cámara), world3dToScreen2d devuelve undefined
            position.z + 1.0;
            const screen = mp.game.graphics.world3dToScreen2d(position); // elevamos un poco para centrar en el "aire".
            if (!screen) return;

            const sx = screen.x; // 0..1
            const sy = screen.y;

            // --- DISEÑO: rectángulos azules (similares a las imágenes) ---
            // barra vertical (centro)
            const barHeight = 0.12;    // alto relativo en pantalla
            const barWidth  = 0.004;   // ancho relativo en pantalla
            // posición vertical ajustada para que quede debajo de la palabra CHECKPOINT
            mp.game.graphics.drawRect(sx, sy - 0.01, barWidth, barHeight, 12, 140, 180, 255, false);

            // cuadrado superior 
            const topLineW = 0.05;
            const topLineH = 0.04;
            mp.game.graphics.drawRect(sx, sy - 0.125, topLineW, topLineH, 182, 182, 182, 150, false);

            // pequeña barra inferior (ej. el rectángulo fino debajo del número)
            const smallBarW = 0.05;
            const smallBarH = 0.004;
            mp.game.graphics.drawRect(sx, sy - 0.103 , smallBarW, smallBarH, 12, 140, 180, 255, false);

            // Texto: distancia encima de la barra
            // Ajusta font / scale / color según necesites
            const metersText = formatMeters(dist);
            mp.game.graphics.drawText(metersText, [sx, sy - 0.145], {
                font: 4,
                color: [255, 255, 255, 255],
                scale: [0.5, 0.5],
                outline: true,
                centre: true
            });

            // Texto: palabra "CHECKPOINT" debajo del número (estilizada)
            mp.game.graphics.drawText("C H E C K P O I N T", [sx, sy - 0.10], {
                font: 4,
                color: [255, 255, 255, 255],
                scale: [0.4, 0.4],
                outline: true,
                centre: true
            });

            // Opcional: si estás cerca, cambia color / alpha
            // if (dist < 10) { ... }

            // --- LIGHT: spotlight que ilumina la posición ---
            // drawSpotLight(posX, posY, posZ, dirX, dirY, dirZ, r,g,b, distance, brightness, roundness, radius, falloff)
            // Estas constantes las puedes afinar para el aspecto deseado.
            const lx = position.x;
            const ly = position.y;
            const lz = position.z + 4.5; // altura del foco
            // dirección hacia abajo (apunta al suelo / checkpoint)
            const dirX = 0.0;
            const dirY = 0.0;
            const dirZ = -1.0;
            const r = 255, g = 0, b = 0;
            const distance = 30.0;
            const brightness = 18.0;
            const roundness = 3.0;
            const radius = 10.0;
            const falloff = 1.0;

            mp.game.graphics.drawSpotLight(lx, ly, lz, dirX, dirY, dirZ, r, g, b, distance, brightness, roundness, radius, falloff);

            // Si prefieres sombras (más costoso), usa:
            // mp.game.graphics.drawSpotLightWithShadow(...)   // similar, pero acepta target y crea shadow cone
        } catch (e) {
            // por si hay algún error inesperado
            if (typeof console !== "undefined") console.log("render checkpoint error:", e);
        }
    });

    function destroyCheckpoint() {
        if (renderEvent) {
            try { mp.events.remove('render', renderEvent); } catch(e) {}
            renderEvent = null;
        }
    }

};