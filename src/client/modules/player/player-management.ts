// src/client/modules/player/player-management.ts

export function initializePlayerModule() {

    let showCif = false;
    let brow: BrowserMp;
    
    // Aquí es donde se registran los eventos de RAGEMP
    mp.events.add("playerReady", () => {
        mp.gui.chat.push("El módulo Player está activo y el jugador está listo.");
    });

    mp.events.add("client:helloWorld", (mgs:string) => {
        mp.gui.chat.push(`Evento Mensaje RageMP: ${mgs}`);
    });

    // Binding de Teclado
    mp.keys.bind(0x45, true, () => { // Tecla E
        showCif = !showCif;
        if(showCif){
            brow = mp.browsers.new("http://package/ui/index.html");
            brow.call("cif:helloWorld", false);
            mp.gui.cursor.show(true, true);
        }else{
            brow.destroy();
            mp.gui.cursor.show(false, false);
        }
    });
}