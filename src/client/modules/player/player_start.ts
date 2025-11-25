

export function initializePlayerModule() {

    // Aquí es donde se registran los eventos de RAGEMP
    mp.events.add("playerReady", () => {
        mp.gui.chat.push("El módulo Player está activo y el jugador está listo.");
    });
}