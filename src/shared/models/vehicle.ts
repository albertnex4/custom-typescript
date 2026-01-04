//El as const al final de las constantes
// es para que no se pueda modificar el array en tiempo de ejecucion

//Para establecer los tipos de las modificaciones de vehiculos
//vehicle.setMod(Enum, Value); //Motor (Nivel 4) - Aumenta la aceleración base
//El valor por defecto es -1 (sin modificar)

//Export enums
export enum VehicleModType {
  Spoilers = 0,
  FrontBumper = 1,
  RearBumper = 2,
  //Guardabarros
  SideSkirt = 3,
  Exhaust = 4,
  //Barras antivuelco
  Frame = 5,
  Grille = 6,
  Hood = 7,
  Fender = 8,
  RightFender = 9,
  Roof = 10,
  Engine = 11,
  Brakes = 12,
  Transmission = 13,
  Horns = 14,
  Suspension = 15,
  Armor = 16,
  Turbo = 18,
  Xenon = 22,
  Wheels = 23,
  BackWheels = 24, // solo motocicletas
  PlateHolders = 25,
  VanityPlates = 26,
  TrimDesign = 27,
  Ornaments = 28,
  Dashboard = 29,
  //Velocimetro
  DialDesign = 30,
  DoorSpeaker = 31,
  Seats = 32,
  SteeringWheel = 33,
  ShiftLever = 34,
  Plaques = 35,
  Speakers = 36,
  Trunk = 37,
  Hydraulics = 38,
  EngineBlock = 39,
  //Aqui indica 40 pero tambien es Boost segun la wiki
  AirFilter = 999,
  //ENGINEBLOCK -> Tapas de motor
  //CHASSIS -> Estabilizador delantero
  //MISC_L | MISC_M | MISC_E | MISC_V -> Tapas correas del motor
  Boost = 40,
  //Estabilizador delantero??
  Struts = 41,
  //Luces de rally en el techo del coche
  //Para sol del coche?
  //Para tapar las luces delanteras
  ArchCover = 42,
  //Luces de rally
  //Anclajes de capo
  Aerials = 43,
  Trim = 44,
  //Radiador?
  Tank = 45,
  //WINDOW_LF -> red de proteccion de ventanas
  //DOOR_DSIDE_F -> proteccion puertas
  Windows = 46,
  Unknown47 = 47,
  Livery = 48,
  Plate = 53,
  WindowTint = 55,
  Colour1 = 66,
  Colour2 = 67,
}

export enum EngineType {
  Standard = -1,
  EMSImprovement1 = 0,
  EMSImprovement2 = 1,
  EMSImprovement3 = 2,
  EMSImprovement4 = 3,
}

export enum BrakeType {
  Standard = -1,
  Street = 0,
  Sport = 1,
  Race = 2,
}

export enum TransmissionType {
  Standard = -1,
  Street = 0,
  Sport = 1,
  Race = 2,
}

export enum SuspensionType {
  Standard = -1,
  Lower = 0,
  Street = 1,
  Sport = 2,
  Race = 3,
}

export enum ArmourType {
  NoArmour = -1,
  Armour20 = 0,
  Armour40 = 1,
  Armour60 = 2,
  Armour80 = 3,
  Armour100 = 4,
}

export enum TurboType {
  None = -1,
  TurboTuning = 0,
}

export enum XenonType {
  Standard = -1,
  Xenon = 0,
}

export enum WindowTintType {
  None = -1,
  LightSmoke = 0,
  DarkSmoke = 1,
  Limousine = 2,
}

//TODO -> Probar mas numeros
export enum PlateType {
  BlueOnWhite2 = 0,
  BlueOnWhite3 = 1,
  YellowOnBlue = 2,
  YellowOnBlack = 3,
  Unused4 = 4,
  Unused5 = 5,
}

//TODO -> Que es Ram Boost?
export enum BoostType {
  None = -1,
  Nitrous20 = 0,
  Nitrous60 = 1,
  Nitrous100 = 2,
  RamBoost = 3,
}

export enum WheelsType {
  Stock = -1,
  Sport = 0,
  Muscle = 1,
  Lowrider = 2,
  SUV = 3,
  Offroad = 4,
  Tuner = 5,
  BikeWheels = 6,
  HighEnd = 7,
  BennysOriginal = 8,
  BennysBespoke = 9,
  OpenWheel = 10,
  Street = 11,
  Track = 12,
}

export enum HornType {
  Stock = -1,
  Truck = 0,
  Police = 1,
  Clown = 2,
  Musical1 = 3,
  Musical2 = 4,
  Musical3 = 5,
  Musical4 = 6,
  Musical5 = 7,
  SadTrombone = 8,
  Classical1 = 9,
  Classical2 = 10,
  Classical3 = 11,
  Classical4 = 12,
  Classical5 = 13,
  Classical6 = 14,
  Classical7 = 15,
  ScaleDo = 16,
  ScaleRe = 17,
  ScaleMi = 18,
  ScaleFa = 19,
  ScaleSol = 20,
  ScaleLa = 21,
  ScaleTi = 22,
  ScaleDoHigh = 23,
  Jazz1 = 24,
  Jazz2 = 25,
  Jazz3 = 26,
  JazzLoop = 27,
  StarSpangled1 = 28,
  StarSpangled2 = 29,
  StarSpangled3 = 30,
  StarSpangled4 = 31,
  ClassicalLoop1 = 32,
  Classical8 = 33,
  ClassicalLoop2 = 34,
}

//Objects export
export const VehicleModTypeOptions = [
  { label: "Spoilers", value: VehicleModType.Spoilers },
  { label: "Front Bumper", value: VehicleModType.FrontBumper },
  { label: "Rear Bumper", value: VehicleModType.RearBumper },
  { label: "Side Skirt", value: VehicleModType.SideSkirt },
  { label: "Exhaust", value: VehicleModType.Exhaust },
  { label: "Frame", value: VehicleModType.Frame },
  { label: "Grille", value: VehicleModType.Grille },
  { label: "Hood", value: VehicleModType.Hood },
  { label: "Fender", value: VehicleModType.Fender },
  { label: "Right Fender", value: VehicleModType.RightFender },
  { label: "Roof", value: VehicleModType.Roof },
  { label: "Engine", value: VehicleModType.Engine },
  { label: "Brakes", value: VehicleModType.Brakes },
  { label: "Transmission", value: VehicleModType.Transmission },
  { label: "Horns", value: VehicleModType.Horns },
  { label: "Suspension", value: VehicleModType.Suspension },
  { label: "Armor", value: VehicleModType.Armor },
  { label: "Turbo", value: VehicleModType.Turbo },
  { label: "Xenon", value: VehicleModType.Xenon },
  { label: "Front Wheels", value: VehicleModType.Wheels },
  { label: "Back Wheels (Motorcycles)", value: VehicleModType.BackWheels },
  { label: "Plate Holders", value: VehicleModType.PlateHolders },
  { label: "Vanity Plates", value: VehicleModType.VanityPlates },
  { label: "Trim Design", value: VehicleModType.TrimDesign },
  { label: "Ornaments", value: VehicleModType.Ornaments },
  { label: "Dashboard", value: VehicleModType.Dashboard },
  { label: "Dial Design", value: VehicleModType.DialDesign },
  { label: "Door Speaker", value: VehicleModType.DoorSpeaker },
  { label: "Seats", value: VehicleModType.Seats },
  { label: "Steering Wheel", value: VehicleModType.SteeringWheel },
  { label: "Shift Lever", value: VehicleModType.ShiftLever },
  { label: "Plaques", value: VehicleModType.Plaques },
  { label: "Speakers", value: VehicleModType.Speakers },
  { label: "Trunk", value: VehicleModType.Trunk },
  { label: "Hydraulics", value: VehicleModType.Hydraulics },
  { label: "Engine Block", value: VehicleModType.EngineBlock },
  { label: "Air Filter", value: VehicleModType.AirFilter },
  { label: "Boost", value: VehicleModType.Boost },
  { label: "Struts", value: VehicleModType.Struts },
  { label: "ArchCover", value: VehicleModType.ArchCover },
  { label: "Aerials", value: VehicleModType.Aerials },
  { label: "Trim", value: VehicleModType.Trim },
  { label: "Tank", value: VehicleModType.Tank },
  { label: "Windows", value: VehicleModType.Windows },
  { label: "Unknown47", value: VehicleModType.Unknown47 },
  { label: "Livery", value: VehicleModType.Livery },
  { label: "Plate", value: VehicleModType.Plate },
  { label: "Window Tint", value: VehicleModType.WindowTint },
  { label: "Primary Colour", value: VehicleModType.Colour1 },
  { label: "Secondary Colour", value: VehicleModType.Colour2 },
] as const;

export const WheelsOptions = [
  { label: "Stock", value: WheelsType.Stock },
  { label: "Sport", value: WheelsType.Sport },
  { label: "Muscle", value: WheelsType.Muscle },
  { label: "Lowrider", value: WheelsType.Lowrider },
  { label: "SUV", value: WheelsType.SUV },
  { label: "Offroad", value: WheelsType.Offroad },
  { label: "Tuner", value: WheelsType.Tuner },
  { label: "Bike Wheels", value: WheelsType.BikeWheels },
  { label: "High End", value: WheelsType.HighEnd },
  { label: "Benny's Original (VWT_SUPERMOD1)", value: WheelsType.BennysOriginal },
  { label: "Benny's Bespoke (VWT_SUPERMOD2)", value: WheelsType.BennysBespoke },
  { label: "Open Wheel (VWT_SUPERMOD3)", value: WheelsType.OpenWheel },
  { label: "Street (VWT_SUPERMOD4)", value: WheelsType.Street },
  { label: "Track (VWT_SUPERMOD5)", value: WheelsType.Track },
] as const;

export const EngineOptions = [
  { label: "Standard Engine", value: EngineType.Standard },
  { label: "EMS Improvement 1", value: EngineType.EMSImprovement1 },
  { label: "EMS Improvement 2", value: EngineType.EMSImprovement2 },
  { label: "EMS Improvement 3", value: EngineType.EMSImprovement3 },
  { label: "EMS Improvement 4", value: EngineType.EMSImprovement4 },
] as const;

export const BrakeOptions = [
  { label: "Standard Brakes", value: BrakeType.Standard },
  { label: "Street Brakes", value: BrakeType.Street },
  { label: "Sport Brakes", value: BrakeType.Sport },
  { label: "Race Brakes", value: BrakeType.Race },
] as const;

export const TransmissionOptions = [
  { label: "Standard Transmission", value: TransmissionType.Standard },
  { label: "Street Transmission", value: TransmissionType.Street },
  { label: "Sport Transmission", value: TransmissionType.Sport },
  { label: "Race Transmission", value: TransmissionType.Race },
] as const;

export const SuspensionOptions = [
  { label: "Standard Suspension", value: SuspensionType.Standard },
  { label: "Lower Suspension", value: SuspensionType.Lower },
  { label: "Street Suspension", value: SuspensionType.Street },
  { label: "Sport Suspension", value: SuspensionType.Sport },
  { label: "Race Suspension", value: SuspensionType.Race },
] as const;

export const ArmourOptions = [
  { label: "No Armour", value: ArmourType.NoArmour },
  { label: "20% Armour", value: ArmourType.Armour20 },
  { label: "40% Armour", value: ArmourType.Armour40 },
  { label: "60% Armour", value: ArmourType.Armour60 },
  { label: "80% Armour", value: ArmourType.Armour80 },
  { label: "100% Armour", value: ArmourType.Armour100 },
] as const;

export const TurboOptions = [
  { label: "None", value: TurboType.None },
  { label: "Turbo Tuning", value: TurboType.TurboTuning },
] as const;

export const XenonOptions = [
  { label: "Standard Lights", value: XenonType.Standard },
  { label: "Xenon Headlights", value: XenonType.Xenon },
] as const;

export const WindowTintOptions = [
  { label: "None", value: WindowTintType.None },
  { label: "Light Smoke", value: WindowTintType.LightSmoke },
  { label: "Dark Smoke", value: WindowTintType.DarkSmoke },
  { label: "Limousine", value: WindowTintType.Limousine },
] as const;

export const BoostOptions = [
  { label: "None", value: BoostType.None },
  { label: "20% Nitrous", value: BoostType.Nitrous20 },
  { label: "60% Nitrous", value: BoostType.Nitrous60 },
  { label: "100% Nitrous", value: BoostType.Nitrous100 },
  { label: "Ram Boost", value: BoostType.RamBoost },
] as const;

//TODO -> Falta indicar muchos mas claxons
export const HornOptions = [
  { label: "Stock Horn", value: HornType.Stock },
  { label: "Truck Horn", value: HornType.Truck },
  { label: "Police Horn", value: HornType.Police },
  { label: "Clown Horn", value: HornType.Clown },
  { label: "Sad Trombone", value: HornType.SadTrombone },
] as const;

export const PlateTypeOptions = [
  { label: "Blue on White2", value: PlateType.BlueOnWhite2 },
  { label: "Blue on White3", value: PlateType.BlueOnWhite3 },
  { label: "Yellow on Blue", value: PlateType.YellowOnBlue },
  { label: "Yellow on Black", value: PlateType.YellowOnBlack },
  { label: "Unused4", value: PlateType.Unused4 },
  { label: "Unused5", value: PlateType.Unused5 },
] as const;


export const ModOptionsByType: Record<VehicleModType, readonly any[]> = {
  [VehicleModType.Spoilers] : [],
  [VehicleModType.FrontBumper] : [],
  [VehicleModType.RearBumper] : [],
  [VehicleModType.SideSkirt] : [],
  [VehicleModType.Exhaust] : [],
  [VehicleModType.Frame] : [],
  [VehicleModType.Grille] : [],
  [VehicleModType.Hood] : [],
  [VehicleModType.Fender] : [],
  [VehicleModType.RightFender] : [],
  [VehicleModType.Roof] : [],
  [VehicleModType.Engine]: EngineOptions,
  [VehicleModType.Brakes]: BrakeOptions,
  [VehicleModType.Transmission]: TransmissionOptions,
  [VehicleModType.Horns]: HornOptions,
  [VehicleModType.Suspension]: SuspensionOptions,
  [VehicleModType.Armor]: ArmourOptions,
  [VehicleModType.Turbo]: TurboOptions,
  [VehicleModType.Xenon]: XenonOptions,
  [VehicleModType.Wheels] : WheelsOptions,
  [VehicleModType.BackWheels] : [],
  [VehicleModType.PlateHolders] : [],
  [VehicleModType.VanityPlates] : [],
  [VehicleModType.TrimDesign] : [],
  [VehicleModType.Ornaments] : [],
  [VehicleModType.Dashboard] : [],
  [VehicleModType.DialDesign] : [],
  [VehicleModType.DoorSpeaker] : [],
  [VehicleModType.Seats] : [],
  [VehicleModType.SteeringWheel] : [],
  [VehicleModType.ShiftLever] : [],
  [VehicleModType.Plaques] : [],
  [VehicleModType.Speakers] : [],
  [VehicleModType.Trunk] : [],
  [VehicleModType.Hydraulics] : [],
  [VehicleModType.EngineBlock] : [],
  [VehicleModType.AirFilter] : [],
  [VehicleModType.Boost]: BoostOptions,
  [VehicleModType.Struts] : [],
  [VehicleModType.ArchCover] : [],
  [VehicleModType.Aerials] : [],
  [VehicleModType.Trim] : [],
  [VehicleModType.Tank] : [],
  [VehicleModType.Windows] : [],
  [VehicleModType.Unknown47] : [],
  [VehicleModType.Livery] : [],
  [VehicleModType.Plate] : PlateTypeOptions,
  [VehicleModType.WindowTint]: WindowTintOptions,
  [VehicleModType.Colour1] : [],
  [VehicleModType.Colour2] : [],
};