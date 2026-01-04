// src/client/modules/player/player-management.ts
/*import TranslationManager from "../../../shared/TranslationManager";
//Xapu!! Con esto funcionan las trducciones en el cliente pero no son dinamicas
import en from "../../../client/ui/public/translations/en.json";

TranslationManager.cache.set('en', en);
TranslationManager.instance.loadLanguage('en');
const msg = TranslationManager.instance.t("ui.welcome", { name: "Pepe!" });

let showCif = false;
let brow: BrowserMp;


mp.events.add("client:helloWorld", (mgs:string) => {
    mp.gui.chat.push(`Evento Mensaje RageMP: ${mgs}`);
});

// Binding de Teclado
mp.keys.bind(0x45, true, () => { // Tecla E
    showCif = !showCif;
    //const msg = TranslationManager.instance.t("ui.welcome", { name: "Pepe!" });
    mp.gui.chat.push(msg);
    if(showCif){
        brow = mp.browsers.new("http://package/ui/index.html");
        brow.call("cif:helloWorld", false);
        mp.gui.cursor.show(true, true);
    }else{
        brow.destroy();
        mp.gui.cursor.show(false, false);
    }
});*/
