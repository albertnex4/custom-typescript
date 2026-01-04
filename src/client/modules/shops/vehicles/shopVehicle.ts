
//TODO -> Para implmentar poder eliminar partes del vehiculo
// Eliminar puertas -> setDoorBroken (incluye capo y maletero)
// Eliminar neumaticos -> setTyreBurst
// Eliminar ruedas -> breakOffWheel ? Provar!!
// Eliminar los parachoques -> breakOffBumper ? Provar!!
// Buscar las funciones contrarias para reparar las partes eliminadas

//TODO -> Para modificar la ruedas del vehiculo
// Modificar la inclinacion de las ruedas -> setWheelCamber
// Modificar la distancia entre ruedas -> setWheelTrackWidth
// Modificar la altura del vehiculo -> setSuspensionHeight
// Ver mas funciones....

import { EntityWrapper } from "../../utils/entityWrapper";
import { VehicleModType } from "./enums";

type TypeVehicleServerOptions = {
    category: string;
    type: string;
    seats: number;
    wheelType: string;
    wheelCount: number;
    brand: string;
    price: number;
    maxSpeed: number;
    acceleration: number;
    maxTraction: number;
    maxBraking: number;
    agility: number;
    hasSirens: boolean;
    hasConvertibleRoof: boolean;
    hasArmoredTyres: boolean;
    hasArmoredBody: boolean;
    hasArmoredWindows: boolean;
    defaultBodyHealth: number;
}

type TypeVehicleCreateOptions = {
    alpha?: number;
    color?: [Array2d, Array2d] | [RGB, RGB];
    dimension?: number;
    engine?: boolean;
    heading?: number;
    locked?: boolean;
    numberPlate?: string;
}

type TypeVehicleComponent = Map<number, number>;

//Al extender de EntityWrapper podemos accerder a las propiedades
// de VehicleMp directamente
class Vehicle extends EntityWrapper<VehicleMp>{
    private vehicleComponents: null | TypeVehicleComponent = null;

    constructor(
        model: string,
        position: Vector3 | number[],
        options?: TypeVehicleCreateOptions,
        serverOptions?: TypeVehicleServerOptions,
        modifications?: TypeVehicleComponent
    ) {
        if (Array.isArray(position)) {
            position = new Vector3(position[0], position[1], position[2]);
        }

        const gameVehicle = mp.vehicles.new(model, position, options);
        super(gameVehicle);

        if(modifications) this.setModGroup(modifications);
        
    }
    
    private loadComponentsModInfo(){
        this.vehicleComponents = new Map;

        for(let key in VehicleModType){
            const modType = VehicleModType[key as keyof typeof VehicleModType];
            const numMods = this.getNumMods(modType);
            if(numMods > 0){
                this.vehicleComponents.set(modType, numMods)
            }
        }
        
        return this.vehicleComponents;
    }

    getComponentsModInfo(){
        if(this.vehicleComponents === null){
            return this.loadComponentsModInfo();
        }
        return this.vehicleComponents;
    }

    setModGroup(modifications:TypeVehicleComponent){
        modifications.forEach((value, key)=>{
            this.setMod(key, value)
        });
    }

    //Crear funcion para poder guardar informacion del vehiculo en back

}
interface Vehicle extends VehicleMp {}

class ShopVehicle {
    /*private id: number;
    private name: string;
    private vehicleCategory: string[]; //Modificar por ENUM
    private shopCategory: string[]; //Modificar por ENUM
    private vehicleList: Vehicle[];
    private showroomLocation : Vector3;
    private vehicleSpawnLocation : Vector3;*/

    //TODO -> Functions
    //Bloquear controles del jugador
    //Bloquear camara
    //Mostrar leyenda de botones tienda

    public destroy() {
        //Eliminamos todo lo relacionado con la clase y eventos
    }
}

export const shopVehicle = new ShopVehicle();