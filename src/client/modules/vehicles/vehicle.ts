type VehicleData = {
  fuel: number;
  engineHealth: number;
  bodyHealth: number;
  tireWear: number;
  testText: string;
  [key: string]: any;
};

export type Tires = {
  FrontLeft: number;
  FrontRight: number;
  RearLeft: number;
  RearRight: number;
};

export type VehicleMechanics = {
  Kilometers: number;
  Fuel: number;
  EngineHealth: number;
  BodyCondition: number;
  DirtLevel: number;
  TireCondition: Tires;
};

//Esperar a que el modelo este cargado
export const setServerData = async (entity:VehicleMp, value:VehicleMechanics) => {
  while (!entity.handle) await mp.game.waitAsync(10);
  //entity.setPetrolTankHealth(value.Fuel);
  
  //entity.setProofs(false,true,true,false,false,false,false,false);
  mp.game.vehicle.setNumberPlateText(entity.handle, "holaaa");
  //mp.game.vehicle.setDisablePetrolTankFires(entity.handle, true);
  //mp.game.vehicle.setDisableEngineFires(entity.handle, true);
  mp.game.vehicle.setCanEngineOperateOnFire(entity.handle, false);
//  mp.game.weapon.setObjectLiveryColor
  //entity.setDamage(entity.locati, yOffset, zOffset, damage, radius, focusOnModel);
  //entity.setBodyHealth(value.BodyCondition);
  entity.setDirtLevel(value.DirtLevel);
  //entity.setEngineHealth(value.EngineHealth);
}

//TODO -> Crear una clase basica de vehiculos
//Esta clase simplmente servira para poder pasar informacion del vehiculo
// Entre servidor y cliente + cef
// Este objeto se guardara en las variables del jugador

//TODO -> Crear clase que gestione los consumibles del coche
// EJ: gasolina, neumaticos, carozeria etc
// Al entrar en un coche se creara un setInterval donde se ira calculado cada x tiempo
// La gestion de los consumibles
// Estos valores se guardaran en el jugador
// Y se ejecutaran los eventos que modifiquen cef
// Para elementos que no hace falta tener tanto control como gasolina ruedas etc
// No hace falta que se vaya actualizando el cef muy amenudo
// Solo para RPM y velocidad

// Para caluclar distancia recorrida
//  Comparar anterior posicion con posicion actual
//  Calcular la posicion recorrida + la velocidad para saber metros recorridos
// Con el valor de distancia recorrida podemos generar desgaste de neumaticos y motor

export class VehicleManager {
  private vehicles: Map<number, VehicleData> = new Map();

  constructor() {}

  /**
   * Crear un vehículo con datos iniciales
   */
  public create(
    modelHash: number | string,
    pos: Vector3,
    options?: {
        alpha?: number;
        color?: [Array2d, Array2d] | [RGB, RGB];
        dimension?: number;
        engine?: boolean;
        heading?: number;
        locked?: boolean;
        numberPlate?: string;
    },
    initialData: Partial<VehicleData> = {}
  ): VehicleMp {
    const vehicle = mp.vehicles.new(modelHash, pos, options);

    // Variables personalizadas iniciales
    const defaultData: VehicleData = {
      fuel: initialData.fuel ?? 100,
      engineHealth: initialData.engineHealth ?? 1000,
      bodyHealth: initialData.bodyHealth ?? 1000,
      tireWear: initialData.tireWear ?? 0,
      testText: "holaaaa test cocheee",
      ...initialData,
    };

    this.setData(vehicle, defaultData);

    return vehicle;
  }

  /**
   * Guardar estado personalizado en internal Map
   */
  public setData(vehicle: VehicleMp, data: Partial<VehicleData>) {
    const id = vehicle.id;
    const prev = this.vehicles.get(id) ?? {} as VehicleData;
    const merged = { ...prev, ...data };

    this.vehicles.set(id, merged);
  }

  /**
   * Obtener datos personalizados
   */
  public getData(vehicle: VehicleMp): VehicleData | undefined {
    return this.vehicles.get(vehicle.id);
  }

  /**
   * Eliminar vehículo y su data
   */
  public remove(vehicle: VehicleMp) {
    if (this.vehicles.has(vehicle.id)) {
      this.vehicles.delete(vehicle.id);
    }
    if (mp.vehicles.exists(vehicle)) {
      vehicle.destroy();
    }
  }

  /**
   * Iterar sobre todos
   */
  public forEach(
    callback: (vehicle: VehicleMp, data: VehicleData) => void
  ) {
    for (const [id, data] of this.vehicles.entries()) {
      const vehicle = mp.vehicles.atRemoteId(id);
      if (vehicle) callback(vehicle, data);
    }
  }
}
