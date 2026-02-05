# Instructional Button Manager

Sistema de gestión de botones instructivos para GTA V RAGE:MP que muestra información de controles en la parte inferior de la pantalla, con soporte para teclado/ratón y gamepad.

## Características

- ✨ Soporte dinámico para teclado y gamepad (Xbox)
- 🎮 Detección automática del dispositivo de entrada
- 🔄 Actualización automática de botones al cambiar de dispositivo
- 📝 Sistema de Scaleform nativo de GTA V
- ⌨️ Vinculación de teclas personalizada
- 🎨 Estilos horizontal y vertical

## Instalación

```typescript
import { 
    InstructionalButtonsDynamic, 
    destroyInstructionalButtonsDynamic,
    TypeDinamicButton 
} from './path/to/InstructionalButtonManager';
```

## Uso Básico

### Crear Botones Dinámicos

```typescript
const buttons: TypeDinamicButton = {
    keyboard: [
        {
            id: 191,              // Control ID (ENTER)
            title: "Confirmar",
            action: () => {
                console.log("Confirmado!");
            },
            keyBind: "0x0D"       // Código hexadecimal de la tecla (opcional)
        },
        {
            id: 194,              // Control ID (BACKSPACE)
            title: "Cancelar",
            action: () => {
                console.log("Cancelado!");
            }
        }
    ],
    gamepad: [
        {
            id: 201,              // Control ID (A button)
            title: "Confirmar",
            action: () => {
                console.log("Confirmado!");
            }
        },
        {
            id: 202,              // Control ID (B button)
            title: "Cancelar",
            action: () => {
                console.log("Cancelado!");
            }
        }
    ]
};

// Inicializar
InstructionalButtonsDynamic(buttons);
```

### Botones Combinados (Gamepad)

```typescript
const buttons: TypeDinamicButton = {
    keyboard: [
        {
            id: 191,
            title: "Abrir Menu",
            action: () => openMenu()
        }
    ],
    gamepad: [
        {
            id: 201,              // A button
            title: "Abrir Menu",
            action: () => openMenu(),
            combinedKeys: 44      // Mantener presionado RB (44) + A
        }
    ]
};
```

### Destruir Botones

```typescript
// Limpiar y destruir todos los botones
destroyInstructionalButtonsDynamic();
```

## API

### Types

#### `TypeDinamicButton`

```typescript
type TypeDinamicButton = {
    keyboard: TypeKeyboardButton[];
    gamepad: TypeGamepadButton[];
}
```

#### `TypeKeyboardButton`

```typescript
type TypeKeyboardButton = {
    id: number;              // Control ID de GTA V
    title: string;           // Texto a mostrar
    action: () => void;      // Función a ejecutar
    translation?: string;    // Clave de traducción (opcional)
    icon?: string;           // Icono personalizado (opcional)
    keyBind?: string;        // Código hex de la tecla (ej: "0x0D" para ENTER)
}
```

#### `TypeGamepadButton`

```typescript
type TypeGamepadButton = {
    id: number;              // Control ID de GTA V
    title: string;           // Texto a mostrar
    action: () => void;      // Función a ejecutar
    translation?: string;    // Clave de traducción (opcional)
    icon?: string;           // Icono personalizado (opcional)
    combinedKeys?: number;   // Control ID que debe mantenerse presionado
}
```

### Funciones Principales

#### `InstructionalButtonsDynamic(buttons: TypeDinamicButton): void`

Inicializa el sistema de botones instructivos con soporte para teclado y gamepad.

**Parámetros:**
- `buttons`: Objeto con las configuraciones de botones para keyboard y gamepad

**Características:**
- Detecta automáticamente si el jugador usa teclado o gamepad
- Cambia automáticamente entre conjuntos de botones
- Vincula teclas automáticamente para keyboard
- Mapea controles automáticamente usando `ragemp_vk_map.json`

#### `destroyInstructionalButtonsDynamic(): void`

Destruye todos los botones y limpia los recursos.

**Realiza:**
- Elimina todos los botones
- Destruye los eventos render
- Desvincula las teclas del teclado
- Limpia el intervalo de detección de dispositivo
- Libera recursos del scaleform

### Clase InstructionalButtonManager

#### Constructor

```typescript
const manager = new InstructionalButtonManager(style: number, bgColor: any);
```

**Parámetros:**
- `style`: `-1` para vista horizontal, `1` para vista vertical
- `bgColor`: Color de fondo en formato HEX (`"#RRGGBB"`) o RGBA (`[R, G, B, A]`)

#### Métodos Principales

##### `addButton(title: string, controlID: number): void`

Añade un botón individual.

```typescript
manager.addButton("Saltar", 22); // Spacebar
```

##### `addButtons(buttons: TypeGamepadButton[] | TypeKeyboardButton[]): void`

Añade múltiples botones a la vez.

```typescript
manager.addButtons([
    { id: 191, title: "Aceptar", action: () => {} },
    { id: 194, title: "Cancelar", action: () => {} }
]);
```

##### `removeButton(titleOrControlID: string | number): void`

Elimina un botón por título o Control ID.

```typescript
manager.removeButton("Saltar");
manager.removeButton(22);
```

##### `removeButtons(): void`

Elimina todos los botones.

##### `toggleHud(state: boolean): void`

Muestra u oculta el HUD de botones.

```typescript
manager.toggleHud(true);  // Mostrar
manager.toggleHud(false); // Ocultar
```

##### `changeStyle(style: number): void`

Cambia el estilo de visualización.

```typescript
manager.changeStyle(-1); // Horizontal
manager.changeStyle(1);  // Vertical
```

##### `setBackgroundColor(bgColor: string | number[]): void`

Cambia el color de fondo.

```typescript
manager.setBackgroundColor("#FF0000");           // Rojo
manager.setBackgroundColor([255, 0, 0, 128]);   // Rojo semi-transparente
```

##### `restore(): void`

Restaura los botones según el dispositivo actual detectado.

##### `destroy(): void`

Destruye completamente el manager y libera recursos.

## Enumeraciones

### `XboxInputIndex`

Enumeración completa de todos los controles de gamepad Xbox (0-360).

```typescript
XboxInputIndex.A_18
XboxInputIndex.B_45
XboxInputIndex.X_22
XboxInputIndex.Y_23
// ... etc
```

### `QwertyInputIndex`

Enumeración completa de todos los controles de teclado QWERTY (0-360).

```typescript
QwertyInputIndex.ENTER_191
QwertyInputIndex.BACKSPACE_194
QwertyInputIndex.SPACEBAR_22
// ... etc
```

## Ejemplo Completo

```typescript
// Definir botones para un menú de interacción
const menuButtons: TypeDinamicButton = {
    keyboard: [
        {
            id: 191,
            title: "Abrir Inventario",
            keyBind: "0x0D",
            action: () => {
                mp.events.call("openInventory");
            }
        },
        {
            id: 194,
            title: "Cerrar",
            keyBind: "0x08",
            action: () => {
                mp.events.call("closeMenu");
                destroyInstructionalButtonsDynamic();
            }
        },
        {
            id: 46,
            title: "Usar Item",
            action: () => {
                mp.events.call("useSelectedItem");
            }
        }
    ],
    gamepad: [
        {
            id: 201,
            title: "Abrir Inventario",
            action: () => {
                mp.events.call("openInventory");
            }
        },
        {
            id: 202,
            title: "Cerrar",
            action: () => {
                mp.events.call("closeMenu");
                destroyInstructionalButtonsDynamic();
            }
        },
        {
            id: 203,
            title: "Usar Item",
            combinedKeys: 206, // Mantener RB presionado
            action: () => {
                mp.events.call("useSelectedItem");
            }
        }
    ]
};

// Inicializar
InstructionalButtonsDynamic(menuButtons);

// ... cuando el jugador cierre el menú
destroyInstructionalButtonsDynamic();
```

## Características Técnicas

### Detección Automática de Dispositivo

El sistema detecta automáticamente cada 700ms si el jugador está usando:
- Teclado/Ratón: `mp.game.controls.isInputDisabled(0) === true`
- Gamepad: `mp.game.controls.isInputDisabled(0) === false`

Cuando detecta un cambio, actualiza automáticamente los botones mostrados.

### Mapeo Automático de Teclas

Si no se proporciona un `keyBind`, el sistema automáticamente busca el mapeo en `ragemp_vk_map.json` y asigna el código virtual de la tecla correspondiente.

### Scaleform Nativo

Utiliza el scaleform `instructional_buttons` nativo de GTA V para mostrar los botones de forma consistente con el juego.

## Control IDs Comunes

### Cámara / Vista

| ID | Acción (INPUT) | Teclado / Mouse | Xbox | Descripción |
|----|----------------|------------------|------|-------------|
| 0 | INPUT_NEXT_CAMERA | V | BACK | Cambiar a la siguiente cámara |
| 1 | INPUT_LOOK_LR | Mouse derecha | Stick derecho | Mirar izquierda / derecha |
| 2 | INPUT_LOOK_UD | Mouse abajo | Stick derecho | Mirar arriba / abajo |
| 3 | INPUT_LOOK_UP_ONLY | — | Stick derecho | Mirar solo arriba |
| 4 | INPUT_LOOK_DOWN_ONLY | Mouse abajo | Stick derecho | Mirar solo abajo |
| 5 | INPUT_LOOK_LEFT_ONLY | — | Stick derecho | Mirar solo izquierda |
| 6 | INPUT_LOOK_RIGHT_ONLY | Mouse derecha | Stick derecho | Mirar solo derecha |
| 7 | INPUT_CINEMATIC_SLOWMO | — | R3 | Cámara lenta cinematográfica |


### Movimiento del Personaje

| ID | Acción | Teclado | Xbox | Descripción |
|----|--------|---------|------|-------------|
| 21 | INPUT_SPRINT | Shift Izq | A | Esprintar |
| 22 | INPUT_JUMP | Espacio | X | Saltar |
| 30 | INPUT_MOVE_LR | D | Stick izquierdo | Movimiento lateral |
| 31 | INPUT_MOVE_UD | S | Stick izquierdo | Movimiento adelante / atrás |
| 32 | INPUT_MOVE_UP_ONLY | W | Stick izquierdo | Avanzar |
| 33 | INPUT_MOVE_DOWN_ONLY | S | Stick izquierdo | Retroceder |
| 34 | INPUT_MOVE_LEFT_ONLY | A | Stick izquierdo | Mover a la izquierda |
| 35 | INPUT_MOVE_RIGHT_ONLY | D | Stick izquierdo | Mover a la derecha |
| 36 | INPUT_DUCK | Ctrl Izq | L3 | Agacharse |
| 55 | INPUT_DIVE | Espacio | RB | Zambullirse |

### Combate / Armas

| ID | Acción | Teclado | Xbox | Descripción |
|----|--------|---------|------|-------------|
| 24 | INPUT_ATTACK | Click Izq | RT | Atacar / Disparar |
| 25 | INPUT_AIM | Click Der | LT | Apuntar |
| 37 | INPUT_SELECT_WEAPON | TAB | LB | Seleccionar arma |
| 38 | INPUT_PICKUP | E | LB | Recoger objeto |
| 44 | INPUT_COVER | Q | RB | Cubrirse |
| 45 | INPUT_RELOAD | R | B | Recargar |
| 50 | INPUT_ACCURATE_AIM | Rueda abajo | R3 | Apuntado preciso |
| 58 | INPUT_THROW_GRENADE | G | D-Pad Izq | Lanzar granada |

### Habilidades Especiales

| ID | Acción | Teclado | Xbox | Descripción |
|----|--------|---------|------|-------------|
| 28 | INPUT_SPECIAL_ABILITY | — | L3 | Activar habilidad especial |
| 29 | INPUT_SPECIAL_ABILITY_SECONDARY | B | R3 | Habilidad especial secundaria |
| 171 | INPUT_SPECIAL_ABILITY_PC | Caps Lock | — | Habilidad especial (PC) |

### Vehículos – Conducción

| ID | Acción | Teclado | Xbox | Descripción |
|----|--------|---------|------|-------------|
| 71 | INPUT_VEH_ACCELERATE | W | RT | Acelerar |
| 72 | INPUT_VEH_BRAKE | S | LT | Frenar |
| 73 | INPUT_VEH_DUCK | X | A | Agacharse en vehículo |
| 75 | INPUT_VEH_EXIT | F | Y | Salir del vehículo |
| 76 | INPUT_VEH_HANDBRAKE | Espacio | RB | Freno de mano |
| 79 | INPUT_VEH_LOOK_BEHIND | C | R3 | Mirar atrás |
| 85 | INPUT_VEH_RADIO_WHEEL | Q | D-Pad Izq | Rueda de radio |
| 86 | INPUT_VEH_HORN | E | L3 | Bocina |

### Vehículos Aéreos

| ID | Acción | Teclado | Xbox | Descripción |
|----|--------|---------|------|-------------|
| 87 | INPUT_VEH_FLY_THROTTLE_UP | W | RT | Aumentar potencia |
| 88 | INPUT_VEH_FLY_THROTTLE_DOWN | S | LT | Reducir potencia |
| 89 | INPUT_VEH_FLY_YAW_LEFT | A | LB | Girar a la izquierda |
| 90 | INPUT_VEH_FLY_YAW_RIGHT | D | RB | Girar a la derecha |
| 114 | INPUT_VEH_FLY_ATTACK | Click Der | A | Atacar |
| 121 | INPUT_VEH_FLY_ATTACK_CAMERA | Insert | R3 | Cámara de ataque |

### Teléfono Móvil

| ID | Acción | Teclado | Xbox | Descripción |
|----|--------|---------|------|-------------|
| 27 | INPUT_PHONE | Flecha arriba / rueda | D-Pad Arriba | Abrir teléfono |
| 172 | INPUT_CELLPHONE_UP | Flecha arriba | D-Pad Arriba | Móvil: arriba |
| 173 | INPUT_CELLPHONE_DOWN | Flecha abajo | D-Pad Abajo | Móvil: abajo |
| 174 | INPUT_CELLPHONE_LEFT | Flecha izquierda | D-Pad Izq | Móvil: izquierda |
| 175 | INPUT_CELLPHONE_RIGHT | Flecha derecha | D-Pad Der | Móvil: derecha |
| 176 | INPUT_CELLPHONE_SELECT | Enter / Click Izq | A | Aceptar |
| 177 | INPUT_CELLPHONE_CANCEL | Backspace / Esc | B | Cancelar |

### Menús / Interfaz

| ID | Acción | Teclado | Xbox | Descripción |
|----|--------|---------|------|-------------|
| 199 | INPUT_FRONTEND_PAUSE | P | START | Pausa |
| 201 | INPUT_FRONTEND_ACCEPT | Enter | A | Aceptar |
| 202 | INPUT_FRONTEND_CANCEL | Backspace / Esc | B | Cancelar |
| 203 | INPUT_FRONTEND_X | Espacio | X | Acción X |
| 204 | INPUT_FRONTEND_Y | TAB | Y | Acción Y |
| 212 | INPUT_FRONTEND_SOCIAL_CLUB | Home | BACK | Social Club |

### Replay / Editor

| ID | Acción | Teclado | Xbox | Descripción |
|----|--------|---------|------|-------------|
| 288 | INPUT_REPLAY_START_STOP_RECORDING | F1 | A | Iniciar / detener grabación |
| 298 | INPUT_REPLAY_PAUSE | Espacio | A | Pausar replay |
| 300 | INPUT_REPLAY_FFWD | Flecha arriba | RB | Avance rápido |
| 307 | INPUT_REPLAY_BACK | Flecha izquierda | D-Pad Izq | Retroceder |
| 318 | INPUT_REPLAY_SAVE | F5 | START | Guardar replay |

## Notas Importantes

⚠️ **Gestión de Recursos**: Siempre llama a `destroyInstructionalButtonsDynamic()` cuando ya no necesites los botones para liberar recursos.

⚠️ **Control IDs**: Asegúrate de usar Control IDs válidos (0-356).

⚠️ **KeyBinds**: Los códigos de teclas deben estar en formato hexadecimal (ej: `"0x0D"` para ENTER).

## Referencias

- [RAGE:MP Controls](https://wiki.rage.mp/wiki/Controls)
- [GTA V Instructional Buttons (FiveM Docs)](https://docs.fivem.net/docs/game-references/instructional-buttons/)