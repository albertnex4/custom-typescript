export type ComponentGroup =
  | "GROUP_MAGAZINE"
  | "GROUP_SCOPE"
  | "GROUP_BARREL"
  | "GROUP_GRIP"
  | "GROUP_SKIN"
  | "GROUP_RAIL"
  | "GROUP_RISER"
  | string; // fallback

export type AmmoType =
  | "AMMO_SHOTGUN"
  | "AMMO_PISTOL"
  | "AMMO_RIFLE"
  | null;


export interface WeaponData {
    //TODO -> Fix back!!
  GameId: string|number;
  Description: string;
  Group: string;  // Ej: "GROUP_SNIPER"
  DefaultClipSize: number;
  AmmoType: AmmoType; // Ej: "AMMO_SHOTGUN"
  Components: WeaponComponent[];
  Tints: WeaponTint[];
  LiveryColors: WeaponTint[];
}

export interface WeaponComponent {
    //TODO -> Fix back!!
  GameId: string|number;
  Description: string;
  IsTint: boolean;
  IsDefault: boolean;
  Group: ComponentGroup;     // Ej: "GROUP_MAGAZINE", "GROUP_SCOPE"
  AmmoType: AmmoType;
}

export interface WeaponTint {
  NameGXT: string; // Ej: "WM_TINT2"
  Name: string;    // Ej: "Gold tint"
}
