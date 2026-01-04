/** Tipos de modificación de vehículo (modType) */
export enum VehicleModType {
  Spoilers       = 0,
  FrontBumper    = 1,
  RearBumper     = 2,
  SideSkirt      = 3,
  Exhaust        = 4,
  Frame          = 5,
  Grille         = 6,
  Hood           = 7,
  Fender         = 8,
  RightFender    = 9,
  Roof           = 10,
  Engine         = 11,
  Brakes         = 12,
  Transmission   = 13,
  Horns          = 14,
  Suspension     = 15,
  Armor          = 16,
  Turbo          = 18,
  Xenon          = 22,
  FrontWheels    = 23,
  BackWheels     = 24, // solo motos, según la wiki :contentReference[oaicite:1]{index=1}
  PlateHolders   = 25,
  TrimDesign     = 27,
  Ornaments      = 28,
  DialDesign     = 30,
  SteeringWheel  = 33,
  ShiftLever     = 34,
  Plaques        = 35,
  Hydraulics     = 38,
  Boost          = 40,
  Livery         = 48,
  WindowTint     = 55,
  Plate          = 53,
  Colour1        = 66,
  Colour2        = 67,
}

/** Sub‑tipos / valores para ciertos modTypes */

/** Horns (modType = 14) */
export enum HornType {
  HORN_STOCK          = -1,
  HORN_TRUCK          = 0,
  HORN_POLICE         = 1,
  HORN_CLOWN          = 2,
  HORN_MUSICAL1       = 3,
  HORN_MUSICAL2       = 4,
  HORN_MUSICAL3       = 5,
  HORN_MUSICAL4       = 6,
  HORN_MUSICAL5       = 7,
  HORN_SADTROMBONE    = 8,
  HORN_CLASSICAL1     = 9,
  HORN_CLASSICAL2     = 10,
  HORN_CLASSICAL3     = 11,
  HORN_CLASSICAL4     = 12,
  HORN_CLASSICAL5     = 13,
  HORN_CLASSICAL6     = 14,
  HORN_CLASSICAL7     = 15,
  HORN_SCALE_DO       = 16,
  HORN_SCALE_RE       = 17,
  HORN_SCALE_MI       = 18,
  HORN_SCALE_FA       = 19,
  HORN_SCALE_SOL      = 20,
  HORN_SCALE_LA       = 21,
  HORN_SCALE_TI       = 22,
  HORN_SCALE_DO_HIGH  = 23,
  HORN_JAZZ1          = 24,
  HORN_JAZZ2          = 25,
  HORN_JAZZ3          = 26,
  HORN_JAZZ_LOOP      = 27,
  HORN_STARSPANG_BAN1 = 28,
  HORN_STARSPANG_BAN2 = 29,
  HORN_STARSPANG_BAN3 = 30,
  HORN_STARSPANG_BAN4 = 31,
  HORN_CLASSICAL_LOOP1 = 32,
  HORN_CLASSICAL8      = 33,
  HORN_CLASSICAL_LOOP2 = 34,
}

/** Engine upgrades (modType = 11) */
export enum EngineMod {
  StandardEngine     = -1,
  EMS_Improvement1   = 0,
  EMS_Improvement2   = 1,
  EMS_Improvement3   = 2,
  EMS_Improvement4   = 3,
}

/** Brake upgrades (modType = 12) */
export enum BrakeMod {
  StandardBrakes = -1,
  StreetBrakes   = 0,
  SportBrakes    = 1,
  RaceBrakes     = 2,
}

/** Transmission upgrades (modType = 13) */
export enum TransmissionMod {
  StandardTransmission = -1,
  StreetTransmission   = 0,
  SportTransmission    = 1,
  RaceTransmission     = 2,
}

/** Suspension upgrades (modType = 15) */
export enum SuspensionMod {
  StandardSuspension = -1,
  LowerSuspension    = 0,
  StreetSuspension   = 1,
  SportSuspension    = 2,
  RaceSuspension     = 3,
}

/** Armor upgrades (modType = 16) */
export enum ArmorMod {
  NoArmor   = -1,
  Armor20   = 0,
  Armor40   = 1,
  Armor60   = 2,
  Armor80   = 3,
  Armor100  = 4,
}

/** Turbo (modType = 18) */
export enum TurboMod {
  NoTurbo     = -1,
  TurboTuning = 0,
}

/** Xenon Headlights (modType = 22) */
export enum XenonMod {
  StandardLights  = -1,
  XenonHeadlights = 0,
}

/** Window tint (modType = 55) */
export enum WindowTintMod {
  None        = -1,
  LightSmoke  = 0,
  DarkSmoke   = 1,
  Limousine   = 2,
}

/** Plate types (modType = 53) */
export enum PlateMod {
  BlueOnWhite2 = 0,
  BlueOnWhite3 = 1,
  YellowOnBlue = 2,
  YellowOnBlack= 3,
  Plate4       = 4,
  Plate5       = 5,
}

/** Boost / Nitro (modType = 40) */
export enum BoostMod {
  None       = -1,
  Nitro20    = 0,
  Nitro60    = 1,
  Nitro100   = 2,
  RamBoost   = 3,
}
