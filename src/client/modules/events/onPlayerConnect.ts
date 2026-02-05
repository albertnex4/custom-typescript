import { HistoryCache } from "../utils/historyCache";
import { VehicleManager } from "../vehicles/vehicle";

//Añadir todos los eventos de gestion cuando el jugador se conecta al servidor
//Mostrar pagina de inicio
//Cargar los datos necesarios
//ETC...

export function initializeOnPlayerConnect() {

    mp.events.add("playerReady", (player:PlayerMp) => {
        //addPlayerData();
    });
}

const addPlayerData = () => {
    if(!mp.players.local.localVars){
        mp.players.local.localVars = {};
        mp.players.local.localVars.vMgr = new VehicleManager();
        mp.players.local.localVars.vehicles = [];
        mp.players.local.localVars.weapons = [];
    }
}

//TODO -> Mejorar la gestion de crear vehiculos
export const vehicleManager = new VehicleManager();