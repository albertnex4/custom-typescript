// src/client/modules/player/player-management.improved.ts
/**
 * Player Management Mejorado
 * Ejemplo de cómo usar EventManager y Logger centralizados
 */


import { eventManager } from "../../../shared/EventManager";
import TranslationManager from "../../../shared/TranslationManager";
import { UIManager } from "../ui/UIManager";
import { WeaponData } from "../../../shared/types/weaponTypes";
import { applyDriftHandling } from "../utils/vehicleFixHandling";
import { deleteObjects, deleteWeapons } from "../events/onPlayerDisconnect";
import { WeaponPool } from "../weapons/weaponPool";
import { destroyColshapes, initializeColshapes } from "../creationTools/raceCreatorManager";
import { initNoClip } from "../creationTools/noClipCam";
import { vehicleManager } from "../events/onPlayerConnect";

// Cargar traducciones
//TranslationManager.instance.setTranslations('es', es);
//TranslationManager.instance.loadLanguage("es");
//const txt = TranslationManager.instance.t('ui.welcome', { name: 'Pepe' });

/**
 * Inicializar módulo de jugador
 */
export function initializePlayerManagement() {
  //logger.info("Inicializando Player Management");

  

  mp.keys.bind(0x78, true, () => {  // F9 Show Cursor
    mp.gui.cursor.show(false, true);
  });

  // Escuchar eventos de servidor
  initNoClip();
  mp.events.add("client:helloWorld", handleHelloWorld);

  mp.events.add("client:initializeColshapes", initializeColshapes);
  mp.events.add("client:destroyColshapes", destroyColshapes);

  /*mp.keys.bind(0x71, true, () => { // F2 key
    destroyColshapes();
  });*/

  // Suscribirse a eventos internos
  //eventManager.on("ui:browserToggled", handleBrowserToggled);

  // Binding de teclado mejorado
  //setupKeyBindings();
  setupDebugMode();

  //logger.info("Player Management inicializado");
  mp.events.add("playerCommand", (command:string) => {
    const args = command.split(/[ ]+/);
    const commandName = args[0];
    const param1 = args[1];

    args.shift();

    switch(commandName){
      case 'delObj': 
        mp.gui.chat.push(`Delete ${param1}`);
        if(param1){
          WeaponPool.instance.deleteWeaponObject(Number(param1));
        }else{
          WeaponPool.instance.deleteAll();
        }
        break;
      case 'removObj':
          mp.gui.chat.push(`Remove `);
          WeaponPool.instance.removeAll();
          break;
      case 'default':
        mp.gui.chat.push(`default!`);
    }
  });
}

/**
 * Manejo de evento helloWorld
 */
function handleHelloWorld(message: string) {
  try {
    //logger.debug("Evento helloWorld recibido", { message });
    const txt = TranslationManager.instance.t(message, { name: 'Pepe' });
    mp.gui.chat.push(`🎮 ${txt}`);

  } catch (error) {
    //logger.error("Error en handleHelloWorld", error as Error);
  }
}

/**
 * Manejo de cambio de visibilidad de browser
 */
function handleBrowserToggled(isShowing: boolean) {
  //logger.info(`Browser ${isShowing ? "mostrado" : "ocultado"}`);
  
  if (isShowing) {
    mp.gui.chat.push("💬 UI abierta");
  } else {
    mp.gui.chat.push("💬 UI cerrada");
  }
}


//Para evitar pulsar simultaniamente un boton
//Al principio de la funcion se pone un if que si es true no ejecuta el codigo
//Al final del codigo establecemos la variable a true
//Ejecutamos un setTimeout para establecer la variable a false al pasar x segundos 
var toggleLock = false;
/**
 * Configurar bindings de teclado
 */
function setupKeyBindings() {
  // Tecla H para toggle de UI
  mp.keys.bind(0x48, true, async () => {
    if (toggleLock) return;
    try {
      mp.console.logInfo("Pulsamos EEE");
      //logger.debug("Tecla E presionada");
      UIManager.instance.toggleAsync();
      //UIManager.instance.callUI("client:helloWorld", "ui.inventory.title");  
      UIManager.instance.callUI("cif:testNew");  
      mp.console.logInfo("Ejecutamos callUI");
    } catch (error) {
      mp.console.logInfo("Error en binding de tecla E");
    }
    toggleLock = true;
    setTimeout(() => (toggleLock = false), 1000); // bloquea brevemente
  });

  mp.events.add("playerChat", (text) => {
     if (text === "t") {
        UIManager.instance.changeUrl('/acerca/RageMpChangeView');
     }
  });
}

function setupDebugMode() {
   mp.keys.bind(0x48, true, async () => { //H key 0x48
    if (toggleLock) return;
    try {
      mp.console.logInfo("Pulsamos EEE");
      //logger.debug("Tecla E presionada");
      UIManager.instance.changeUrl('/debug');
      UIManager.instance.toggleAsync();
      //UIManager.instance.callUI("cif:testNew");  
    } catch (error) {
      mp.console.logInfo("Error en binding de tecla E");
    }
    toggleLock = true;
    setTimeout(() => (toggleLock = false), 1000); // bloquea brevemente
  });

  type typeDebugSpawnVehicleParams = {
    carModel:string;
    carColor:Array3d;
    carPlate:string;
    carPosition:Array3d;
    isWorldPosition:boolean;
    setDriftTest:boolean;
  }
  type typeVehicleOptions = {
      alpha?: number;
			color?: [Array2d, Array2d] | [RGB, RGB];
			dimension?: number;
			engine?: boolean;
			heading?: number;
			locked?: boolean;
			numberPlate?: string;
  }

  //Funcion para generar vehiculos en client
  //Util para tiendas
  mp.events.add("debugSpawnVehicle", async (stringObj:string) => {
    const obj:typeDebugSpawnVehicleParams = JSON.parse(stringObj);
    const objPrint = JSON.stringify(obj);
    mp.console.logInfo(`Weapon object ${objPrint}`);

    const playerPos = mp.players.local.position;
    const carModelGameId = mp.game.joaat(obj.carModel);
    //mp.gui.chat.push(`${carModelGameId}`);

    //Cargamos el modelo del vehiculo antes de generar vehiculo
    if(!mp.game.streaming.hasModelLoaded(carModelGameId)){
      mp.gui.chat.push("Cargando modelo...");
      await mp.game.streaming.requestModelAsync(carModelGameId);
    }

    const [x,y,z] = obj.carPosition;
    let vehiclePosition = null;
    if(!obj.isWorldPosition){
      vehiclePosition = new mp.Vector3(
        playerPos.x + x,
        playerPos.y + y,
        playerPos.z + z
      );
    }else{
      vehiclePosition = new mp.Vector3(x,y,z);
    }
    
    //Generamos vehiculo 
    let vehicleOptions:typeVehicleOptions = {};
    if(obj.carPlate) vehicleOptions.numberPlate = obj.carPlate;
    if(obj.carColor) vehicleOptions.color = [obj.carColor,obj.carColor];
    mp.console.logInfo(`vehiclePosition ${vehiclePosition}`);
    if(vehicleManager){
      let vehicle = vehicleManager.create(carModelGameId,vehiclePosition,{...vehicleOptions});

      const carData = vehicleManager.getData(vehicle);

      mp.gui.chat.push(`Car data -> ${carData?.testText}`);
      
      // Esperamos un tick para asegurar que la entidad existe físicamente
      while (!vehicle.handle) await mp.game.waitAsync(10);

      if(obj.setDriftTest){
        applyDriftHandling(vehicle);
      }

      mp.console.logInfo(`carModel ${obj.carModel}`);
      mp.console.logInfo(`carPlate ${obj.carPlate}`);
      //mp.console.logInfo(`CarPosition ${obj.carPosition[0]} : ${obj.carPosition[1]} : ${obj.carPosition[2]}`);
      }
    //let vehicle = mp.vehicles.new(carModelGameId,vehiclePosition,{...vehicleOptions});
  });
}

function applyDriftHandling2(vehicle:VehicleMp) {
    if (!vehicle) return;

    vehicle.toggleMod(18, true); // Turbo
    vehicle.setMod(11, 3); //Motor (Nivel 4) - Aumenta la aceleración base
    vehicle.setMod(13, 2); //Transmisión (Nivel 4) - Mejora ligeramente el tiempo de cambio
    vehicle.setMod(12, 2); //Frenos (Nivel 4)
    vehicle.setDriftTyresEnabled(true);
    // 1. ÁNGULO DE GIRO (Steering Lock)
    // Los coches normales tienen 35-40 grados. Un coche de drift necesita 50-60.
    //mp.console.logInfo(`Original Value fSteeringLock : ${vehicle.getHandling("fSteeringLock")}`);
    vehicle.setHandling("fSteeringLock", 90 * 0.017453292); // Convertimos a radianes
    vehicle.setHandling("fMass", 2000.0);

    vehicle.setHandling("fTractionCurveMax", 1.45);
    vehicle.setHandling("fTractionCurveMin", 1.95);
}

/**
 * Limpiar recursos al descargar
 */
export function destroyPlayerManagement() {
  mp.events.remove("client:helloWorld", handleHelloWorld);
  //uiManager.destroy();
  //logger.info("Player Management destruido");
}




mp.events.addDataHandler("currentWeaponComponents2", async function (player, value) {
    //TODO -> Crear Singelton para gestionar los objectos
    const obj:WeaponData = JSON.parse(value);
    const result = new Map();
    let {x, y, z} = mp.players.local.position;

    if (typeof obj.GameId === "string") {
      obj.GameId = Number(obj.GameId);
    }
    const weaponModelHash = mp.game.weapon.getWeapontypeModel(obj.GameId);
    
    await mp.game.streaming.requestModelAsync(weaponModelHash).then((loaded) => {
        if (loaded) mp.console.logInfo('model loaded');
    });
    //TODO -> Para este tipo de objetos se tiene que hacer la gestion en client con una pool propia
    // Ya que la pool de rage no funciona bien con estos objectos de armas
    const weaponObject = {
      weaponHash: obj.GameId,
      ammoCount: 0,
      position : new mp.Vector3(x, y, z),
      showWorldModel: true,
      scale: 1,
      p7: 0,
      p8: 0,
      p9: 0
    }
    //const weaponHandle = mp.game.weapon.createWeaponObject(obj.GameId,0,x,y,z,true,1,0,0,0);
    const weaponHandle = WeaponPool.instance.createWeaponObject(weaponObject);
    mp.game.weapon.giveToPed(player.handle, obj.GameId, 111, true, true);

    mp.console.logInfo(`Weapon parseInt(weaponHash): ${obj.GameId}`);
    mp.console.logInfo(`Weapon Object Handle: ${weaponModelHash}`);
    
    //UIManager.instance.dispatchFunctions('setData',{info:{}, data:obj});
    //UIManager.instance.callUI('ui:setData', JSON.stringify({loaded:true,loadedData:true}),JSON.stringify(obj));

    const info = {
      type: "Weapon Shop"
    }
    UIManager.instance.callUI('ui:setData',JSON.stringify({data:obj,info:info}));
    UIManager.instance.callUI("client:helloWorld", "ui.inventory.title");  
});