import { setServerData } from "../vehicles/vehicle";

//Detecta cada vez que el servidor modifica o añade valores al objecto ServerVars de Player
//Detecta entity para saber que actualizar correctamente

export function initializeVehicleManagement(){
  mp.events.addDataHandler('ServerVars', (entity:EntityMp, value:any) => {
      if (isVehicle(entity)) {
        return vehicleData(entity, value); // TS ya sabe que es VehicleMp
      }
      if (isPlayer(entity)) {
        return playerData(entity, value);
      }

      mp.console.logInfo(`El type es : ${entity.type}`);
  });
}

function isVehicle(entity: EntityMp): entity is VehicleMp {
  return entity.type === RageEnums.EntityType.VEHICLE;
}

function isPlayer(entity: EntityMp): entity is PlayerMp {
  return entity.type === RageEnums.EntityType.PLAYER;
}

function vehicleData(entity:VehicleMp, value:any){
    setServerData(entity,value);
}

function playerData(entity:PlayerMp, value:any){
    mp.console.logInfo(`El type es Player!!`);
}