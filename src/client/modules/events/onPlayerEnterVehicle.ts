import { BlipsPool } from "../weapons/weaponPool";
import { UIManager } from "../ui/UIManager";
import { fixVehicleDeformation } from '../vehicles/vehicleDeformation';

//Gestiona los eventos a crear a partir de que el jugador entra en un vehiculo
//Ej
// playerEnterVehicleHandler -> Al entrar en el vehiculo intenta obtener una variable establecida por el servidor
// playerLeaveVehicleHandler -> Cuando el jugador sale del vehiculo, se manda la orden de eliminar el componente velocimetro
export function initializeOnPlayerEnterVehicle() {

   mp.events.add("playerEnterVehicle", playerEnterVehicleHandler);
   mp.events.add("playerStartEnterVehicle", playerStartEnterVehicleHandler);
   mp.events.add("playerLeaveVehicle", playerLeaveVehicleHandler);
        

   mp.keys.bind(0x00, true, () => { // Key E

      const playerPos = mp.players.local.position;
      playerPos.x + 5;
      playerPos.y + 5;

      const vehicleTest = mp.vehicles.new(
         mp.game.joaat('comet2'),
         playerPos, {color : [[255,0,0],[0,0,255]]}
      );

      mp.game.wait(0);

      if (vehicleTest) {
         //fixVehicleDeformation(vehicleTest);
      }

      /*setInterval(() => {
         const damageData = captureVehicleDamage(vehicleTest);
         mp.console.logInfo(JSON.stringify(damageData.deformationPoints));
      }, 1000)*/

   })

}

function sendInfoToUI({actualSpeed, vehicleFuel, vehicleHeal}:any){
   //const sendInfoToUI = JSON.stringify({actualSpeed, vehicleFuel, vehicleHeal});
   //mp.console.logInfo(`Vehicle sendInfoToUI object ${sendInfoToUI}`);
   UIManager.instance.callUI("ui:updateSpeedometer", JSON.stringify({
      actualSpeed: actualSpeed.toFixed(2),
      vehicleFuel: vehicleFuel.toFixed(2),
      vehicleHeal: vehicleHeal.toFixed(2)
   }));
}

function showSpeedometer({maxSpeed, vehicleFuel, vehicleHeal}:any){
   //const showSpeed = JSON.stringify({maxSpeed, vehicleFuel, vehicleHeal});
   //mp.console.logInfo(`Vehicle showSpeed object ${showSpeed}`);
   
   UIManager.instance.callUI("ui:showSpeedometer", JSON.stringify({
      //maxSpeed: maxSpeed = (maxSpeed * 3.6).toFixed(0), //Convertir a km/h 
      maxSpeed: maxSpeed.toFixed(2),
      vehicleFuel: vehicleFuel.toFixed(2),
      vehicleHeal: vehicleHeal.toFixed(2)
   }));
}

function hideSpeedometer(){
   //mp.console.logInfo(`call hideSpeedometer`);
   UIManager.instance.callUI("ui:hideSpeedometer");
}

let setIntervalRef: number | null = null;

function playerEnterVehicleHandler(vehicle:VehicleMp, seat:Number) {
   //mp.game.graphics.notify(`You got into the car with ID: ${vehicle.id}. Seat: ${seat}`);

   /*if(mp.players.local.localVars?.vMgr){
     const carData = mp.players.local.localVars.vMgr.getData(vehicle);
     mp.game.graphics.notify(`La info del coche es la siguiente : ${carData?.testText}`);

   }*/

   //mp.console.logInfo(`Tenemos valor en ServerVars : ${vehicle.hasVariable('ServerVars')}`);
   //mp.console.logInfo(`Tenemos valor en ServerVars : ${vehicle.getVariable('ServerVars')}`);
   const weaponPrint = JSON.stringify(vehicle.getVariable('ServerVars'));
   //mp.console.logInfo(`Vehicle ServerVars object ${weaponPrint}`);
   //mp.console.logInfo(`Tenemos valor en test : ${vehicle.hasVariable('test')}`);
   

   const serverVars = vehicle.getVariable('ServerVars');
   
   

   //Obtener el maxSpeed del vehiculo
   //const maxSpeed = mp.game.vehicle.getVehicleModelMaxSpeed(vehicle.model);
   //Dar un poco mas de valor para que no llege al maximo (queda mal visualmente)
   const maxSpeed = 120;
   //mp.console.logInfo(`Vehicle maxSpeed ${maxSpeed*3.6}`); //Convertir a km/h
   if(serverVars){
      showSpeedometer({maxSpeed: maxSpeed, vehicleFuel: serverVars.Fuel, vehicleHeal: serverVars.EngineHealth});
   }else{
      showSpeedometer({maxSpeed: maxSpeed, vehicleFuel: 100, vehicleHeal: 100});
   }

   mp.events.add("render", () =>{
      const speed = vehicle.getSpeed();
      const actualSpeed = Math.ceil(speed * (speed / 20) * 2);
      //mp.console.logInfo(`Vehicle actualSpeed ${actualSpeed}`);
      //Actualizar UI
      if(serverVars){
         sendInfoToUI({maxSpeed: maxSpeed, actualSpeed: vehicle.rpm* 100, vehicleFuel: serverVars.Fuel, vehicleHeal: serverVars.EngineHealth});
      }else{
         sendInfoToUI({maxSpeed: maxSpeed, actualSpeed: vehicle.rpm* 100, vehicleFuel: 100, vehicleHeal: 100});
      }
   });

   
}

function playerStartEnterVehicleHandler(vehicle:VehicleMp, seat:Number) {
   const vehicleID = vehicle.id;

   mp.game.graphics.notify(`You started StartEnterVehicleHandler car ID: ${vehicleID}. Seat: ${seat}`);
}

function playerLeaveVehicleHandler(vehicle:VehicleMp, seat:Number) {
   if(!vehicle) return;

   mp.console.logInfo(`Vehicle exit!!`);
   setIntervalRef && clearInterval(setIntervalRef);
   setIntervalRef = null;
   hideSpeedometer();

   /* Para eliminar el icono del mapa mapa a partir de referencia
    if(seat == -1){
     BlipsPool.instance.deleteBlip('car_'+vehicle.id);
   }*/

   /* Para crear un icono en el mapa al salir del coche
   const vehicleID = vehicle.id;
   mp.game.graphics.notify(`You leave the car ID: ${vehicleID}. Seat: ${seat}`);
   //Si es conductor
   if(seat == -1){
      const blip = {
        code: 'car_'+vehicle.id,
        sprite: 595,
        position: mp.players.local.position,
        options: {
            color: 2,
            name: "Car Blip",
            shortRange: true,
        }
      }
      BlipsPool.instance.createBlip(blip);
   }*/
}


