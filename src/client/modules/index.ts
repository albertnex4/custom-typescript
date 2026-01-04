//2 ejemplos de módulos importados
import './player/player_management';
import { initializePlayerModule } from './player/player_start';
import { initializePlayerManagement } from './player/player_management';
import TranslationManager from "../../shared/TranslationManager";
import { UIManager } from "./ui/UIManager";

import en from "../ui/public/translations/en.json";
import es from "../ui/public/translations/es.json";
import { initializeRaycast } from './player/raycast';

// Inicializar el módulo del jugador
TranslationManager.instance.setTranslations('es', es);
TranslationManager.instance.loadLanguage("es");

const txt = TranslationManager.instance.t('system.error.notFound');
mp.gui.chat.push(`${txt}`);

//UIManager.instance.toggle();

initializePlayerModule();
initializePlayerManagement();
initializeRaycast();