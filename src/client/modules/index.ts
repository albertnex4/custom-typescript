import { initializePlayerManagement } from './player/playerManagement';
import TranslationManager from "../../shared/TranslationManager";

//import en from "../ui/public/translations/en.json";
import es from "../ui/public/translations/es.json";
import { initializeRaycast } from './player/raycast';
import { initializeOnPlayerDisconnect } from './events/onPlayerDisconnect';
import { initializeOnPlayerEnterVehicle } from './events/onPlayerEnterVehicle';
import { initializeOnPlayerConnect } from './events/onPlayerConnect';
import { initializeVehicleManagement } from './events/serverDataHandler';
import { initializeShotRange } from './miniGames/shotRange';

// Inicializar el módulo del jugador
TranslationManager.instance.setTranslations('es', es);
TranslationManager.instance.loadLanguage("es");

//const txt = TranslationManager.instance.t('system.error.notFound');
//mp.gui.chat.push(`${txt}`);

//UIManager.instance.toggle();

// Inicializar eventos Jugador 
initializeOnPlayerDisconnect();
initializeOnPlayerEnterVehicle();
initializeOnPlayerConnect();
initializeVehicleManagement();
initializeShotRange();


initializePlayerManagement();
initializeRaycast();