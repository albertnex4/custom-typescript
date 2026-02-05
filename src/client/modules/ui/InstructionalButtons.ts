
import mapJson from '../utils/json/ragemp_vk_map.json';

//TODO!!!!! ->>> Hay una version mas moderna de instructional buttons 
//https://rage.mp/files/file/153-better-instructional-buttons/

//Clase que gestiona la interfaz de botones que aparece en la parte de abajo de la pantalla
//Indicando informacion de los botones a pulsar y sus acciones

//TODO -> Probar con un mando de ps4/ps5
export type TypeDinamicButton = {
    keyboard: TypeKeyboardButton[];
    gamepad: TypeGamepadButton[];
    //ps4Controller?: {[key: string]: number};
}

type TypeGamepadButton = {
    id : number;
    title: string;
    action : () => void;
    translation?: string;
    icon?: string;
    combinedKeys? : number;
}

type TypeKeyboardButton = TypeGamepadButton & {
    keyBind?: string
}

const validStyles: number[] = [-1, 1];

class BasicScaleform {
    handle: number = 0;
    constructor(scaleformName: string) {
        this.handle = mp.game.graphics.requestScaleformMovie(scaleformName);
        while (!mp.game.graphics.hasScaleformMovieLoaded(this.handle)) mp.game.wait(0);
    }

    // thanks kemperrr
    callFunction(functionName: string, ...args: any[]) {
        mp.game.graphics.pushScaleformMovieFunction(this.handle, functionName);

        args.forEach(arg => {
            switch (typeof arg) {
                case "string": {
                    mp.game.graphics.pushScaleformMovieFunctionParameterString(arg);
                    break;
                }

                case "boolean": {
                    mp.game.graphics.pushScaleformMovieFunctionParameterBool(arg);
                    break;
                }

                case "number": {
                    if (Number(arg) === arg && arg % 1 !== 0) {
                        mp.game.graphics.pushScaleformMovieFunctionParameterFloat(arg);
                    } else {
                        mp.game.graphics.pushScaleformMovieFunctionParameterInt(arg);
                    }
                }
            }
        });

        mp.game.graphics.popScaleformMovieFunctionVoid();
    }

    drawScaleform(x: number, y: number, width: number, height: number, red: number, green: number, blue: number, alpha: number, p9: number) {
        mp.game.graphics.drawScaleformMovie(this.handle, x, y, width, height, red, green, blue, alpha, p9);
    }

    renderFullscreen() {
        mp.game.graphics.drawScaleformMovieFullscreen(this.handle, 255, 255, 255, 255, 0);
    }

    dispose() {
        mp.game.graphics.setScaleformMovieAsNoLongerNeeded(this.handle);
    }
}

class InstructionalButtonManager {
    style: number;
    counter: number;
    hud: BasicScaleform;
    availableSlots: any[];
    render: any;
    buttons: any;
    public buttonsDynamic: TypeDinamicButton;
    state: boolean = false;

    /*
    * style: -1 for horizontal view, 1 for vertical view
    * color: HEX or RGBA [255, 255, 255, 255]
    */
    constructor(style: number, bgColor: any) { // bgColor accepts HEX and RGBA
        this.style = style;
        this.counter = 0;
        this.hud = new BasicScaleform("instructional_buttons");;
        this.render = undefined;
        this.buttons = {};
        this.buttonsDynamic = {
            keyboard:[],
            gamepad:[]
        };
        this.availableSlots = [];
        if (style) this.changeStyle(style);
        if (bgColor) this.setBackgroundColor(bgColor);
        this.resetBar();
    }

    /*
    * style: -1 for horizontal and 1 for vertical
    */
    changeStyle(style: number) {
        if (validStyles.indexOf(style) === -1) return mp.gui.chat.push("!{red}[ERROR] !{white}Invalid style. Please use styles (-1 or 1).");
        if (this.style === style) return mp.gui.chat.push("!{red}[ERROR] !{white}You're already using that style.");
        this.style = style;
        this.hud.callFunction("DRAW_INSTRUCTIONAL_BUTTONS", this.style);
    }

    /*
    * index: controlID or currentButton title. (if custom button you can type its name t_buttonName)
    * newTitle: string
    */
    changeButtonTitle(index: string, title: string) {
        switch (typeof index) {
            case "string": {
                Object.keys(this.buttons).forEach(button => {
                    if (this.buttons[button].title === index || this.buttons[button].control === index) {
                        this.hud.callFunction("SET_DATA_SLOT", parseInt(button), this.buttons[button].control, title);
                    }
                });
                break;
            }
            case "number": {
                index = getControl(index);
                Object.keys(this.buttons).forEach(button => {
                    if (this.buttons[button].control === index) {
                        this.hud.callFunction("SET_DATA_SLOT", parseInt(button), this.buttons[button].control, title);
                    }
                });
            }
        }

        if (this.render) this.hud.callFunction("DRAW_INSTRUCTIONAL_BUTTONS", this.style);
    }

    /*
    * index: controlID or currentButton title. (if custom button you can type its name t_buttonName)
    * newControl: controlID or custom control (t_buttonName)
    */
    changeButtonControl(index: string, control: number) {
        switch (typeof index) {
            case "string": {
                Object.keys(this.buttons).forEach(button => {
                    if (this.buttons[button].title === index || this.buttons[button].control === index) {
                        index = getControl(control);
                        this.hud.callFunction("SET_DATA_SLOT", parseInt(button), index, this.buttons[button].title);
                    }
                });
                break;
            }
            case "number": {
                index = getControl(index);
                Object.keys(this.buttons).forEach(button => {
                    if (this.buttons[button].control === index) {
                        const c = getControl(control);
                        this.hud.callFunction("SET_DATA_SLOT", parseInt(button), c, this.buttons[button].title);
                    }
                });
            }
        }
        if (this.render) this.hud.callFunction("DRAW_INSTRUCTIONAL_BUTTONS", this.style);
    }

    /*
    * color: HEX string or RGBA Array
    */
    setBackgroundColor(bgColor: string) {
        if (bgColor) {
            if (Array.isArray(bgColor)) {
                this.hud.callFunction("SET_BACKGROUND_COLOUR", bgColor[0], bgColor[1], bgColor[2], bgColor[3]);
            } else if (bgColor.match(/#[0-9A-Fa-f]{6}/)) {
                const color = hexToRGB(bgColor.replace("#", ""));
                this.hud.callFunction("SET_BACKGROUND_COLOUR", color[0], color[1], color[2], 50);
            } else {
                mp.gui.chat.push("!{orange}[WARNING] !{white}Invalid color given. Make sure it suits as specified in resource's description");
            }
        }
        this.hud.callFunction("DRAW_INSTRUCTIONAL_BUTTONS", this.style);
    }

    /*
    * title: any text
    * controlID: you can find a list of controlID on wiki
    */
    addButton(title: string, controlID: any) {
        let slot: number; 
        let cnt: any;
        if (this.availableSlots.length > 0) {
            slot = this.availableSlots[0];
            const index = this.availableSlots.indexOf(slot);
            if (index > -1) {
                this.availableSlots.splice(index, 1);
            }
        } else {
            slot = this.counter++;
        }

        if (controlID) cnt = verifyControl(controlID);

        this.hud.callFunction("SET_DATA_SLOT", slot, cnt, title);
        this.buttons[slot] = {
            title: title ? title : "",
            control: cnt ? cnt : "",
            controlID: controlID ? controlID : 0
        };
        if (this.render) this.hud.callFunction("DRAW_INSTRUCTIONAL_BUTTONS", this.style);
    }

    /*
    * Bulk support for adding buttons
    */
    addButtons(buttons: TypeGamepadButton[] | TypeKeyboardButton[]) {
        if (buttons.length > 0) {
            buttons.forEach((button) => {
                this.addButton(button.title, button.id);
            });

            if (this.render) this.hud.callFunction("DRAW_INSTRUCTIONAL_BUTTONS", this.style);
        } else {
            return mp.gui.chat.push("!{red}[ERROR] !{white}Invalid arguement form, please use object form that is instructed on the resource's description.");
        }
    }

    /*
    * Añadir bontones de distintos controles gamepad/teclado
    */
    addDynamicButton2(buttons: TypeDinamicButton) {
        let buttonsController: TypeGamepadButton[] | TypeKeyboardButton[];
        if(mp.game.controls.isInputDisabled(0)){
            buttonsController = buttons.keyboard;
        }else{
            buttonsController = buttons.gamepad;
        }
        this.buttonsDynamic = buttons;
        mp.console.logInfo(`buttonsController ${JSON.stringify(buttonsController)}`)
        this.addButtons(buttonsController);
    }


    addKeyboardBind(buttons: TypeDinamicButton){
        buttons.keyboard.forEach((button) => {
            if(button.keyBind){
                mp.keys.bind(parseInt(button.keyBind, 16), true, button.action);
            }
        });
    }

    destroyKeyboardBind(buttons: TypeDinamicButton){
        buttons.keyboard.forEach((button) => {
            if(button.keyBind){
                mp.keys.unbind(parseInt(button.keyBind, 16), true, button.action);
            }
        });
    }

    /*
    * titleOrControlID: remove button by its title or controlID
    */
    removeButton(btn: string) {
        switch (typeof btn) {
            case "string": {
                Object.keys(this.buttons).forEach(button => {
                    if (this.buttons[button].title === btn) {
                        this.availableSlots.push(button);
                        this.hud.callFunction("SET_DATA_SLOT", parseInt(button), "", "");
                        delete this.buttons[button];
                    }
                });
                break;
            }
            case "number": {
                Object.keys(this.buttons).forEach(button => {
                    if (this.buttons[button].control === btn) {
                        this.availableSlots.push(button);
                        this.hud.callFunction("SET_DATA_SLOT", parseInt(button), "", "");
                        delete this.buttons[button];
                    }
                });
            }
        }
        this.hud.callFunction("DRAW_INSTRUCTIONAL_BUTTONS", this.style);
    }

    /*
    * removes all buttons
    */
    removeButtons() {
        this.counter = 0;
        this.buttons = {};
        this.resetBar();
    }

    /*
    * state: Boolean toggling visibility
    */
    toggleHud(state: boolean) {
        this.state = state;
        if (state) {
            const self = this;
            this.hud.callFunction("DRAW_INSTRUCTIONAL_BUTTONS", this.style);
            if (this.render === undefined) {
                this.render = new mp.Event("render", function () {
                    self.hud.renderFullscreen();
                    if(!isController || !self.buttonsDynamic?.gamepad) return;
                    self.buttonsDynamic.gamepad.forEach((button) => {
                        if(button){
                            if(button.combinedKeys){
                                if(!mp.game.controls.isControlPressed(0, button.combinedKeys)) return;
                            }

                            if(mp.game.controls.isControlJustPressed(0, button.id)){
                                button.action();
                            }    
                        }
                    })
                });
            } else {
                this.render.enable();
            }
        } else {
            if (this.render !== undefined) {
                this.render.destroy();
            }
            else {
                return false;
            }
        }
    }
    

    resetBar() {
        this.hud.callFunction("CLEAR_ALL");
        this.hud.callFunction("TOGGLE_MOUSE_BUTTONS", 0);
        this.hud.callFunction("CREATE_CONTAINER");
        this.hud.callFunction("SET_CLEAR_SPACE", 100);
    }

    //Ahora la funcion no es compatible con el metodo addbuttons normal
    restore(){

        if(!this.buttonsDynamic.gamepad && !this.buttonsDynamic.keyboard){
            console.log(`this.buttonsDynamic ${JSON.stringify(this.buttonsDynamic)}`)
            return;
        }
        
        let buttonsController: TypeGamepadButton[] | TypeKeyboardButton[];
        buttonsController = !isController ? this.buttonsDynamic.keyboard : this.buttonsDynamic.gamepad;
        
        this.removeButtons();
        const objPrint = JSON.stringify(buttonsController);
        mp.console.logInfo(`~y~obj: ${objPrint}`);
        
        this.addButtons(buttonsController);
    }

    destroy(){
        this.removeButtons();
        this.render.destroy();
        this.destroyKeyboardBind(this.buttonsDynamic);
        this.style = 0;
        this.counter = 0;
        this.hud.dispose();
        this.availableSlots = [];
        this.buttons = {};
        this.buttonsDynamic = { keyboard: [], gamepad: [] };
        this.toggleHud(false);
    }
}

function getControl (id:number):any {
    if (id > -1 && id < 357) {
        return mp.game.controls.getControlActionName(2, id, true);
    } else {
        mp.gui.chat.push('!{orange}[WARNING] !{white}Invalid controlID, make sure its between (0, 356).');
        return false;
    }
}

function verifyControl (btn:any):any {
    let control;
    switch (typeof btn) {
        case 'number': {
            control = getControl(btn);
            break;
        }

        case 'string': {
            if (btn.length > 1) {
                control = `t_${btn.toString()}`;
            }
        };
    }
    mp.gui.chat.push(`Verifying: ${control}`)
    return control;
}

function hexToRGB(hex:any) { // Thanks to root and lovely stackoverflow
    let bigint = parseInt(hex.replace(/[^0-9A-F]/gi, ''), 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

//Esto realmente tiene que estar separado en un singelton para poder poder registrar subscriptores de eventos
//Cuando el dispositivo de entrada cambia se notifica a los subscriptores
//En este caso ejecutaremos restore para refrescar los botones
//SetInterval para detectar si el jugador esta usando control o teclado/mouse
let isController = false;
let intervalControllerCheck:number|null = null;
function isUsingController(buttonHud: InstructionalButtonManager) {

    let oldValue: boolean | null = null;
    let actualValue = null;

    //isButtonsControllerPressed(buttonHud.buttonsDynamic);

    intervalControllerCheck = setInterval(() => {

        actualValue = !mp.game.controls.isInputDisabled(0);
        if(oldValue === actualValue) return;

        oldValue = actualValue;
        // index 0 suele usarse para controles generales
        if(!mp.game.controls.isInputDisabled(0)){
            //mp.console.logInfo("El jugador está usando gamepad");
            isController = true;
            // Mostrar botones de mando
        } else {
            //mp.console.logInfo("El jugador está usando teclado y ratón");
            isController = false;
            // Mostrar teclas
        }

        buttonHud.restore();
        
    }, 700);
}

let buttonPressedRender:any;

function isButtonsControllerPressed(buttons:TypeDinamicButton) {

    buttonPressedRender = new mp.Event("render",() => {
        if(!isController || !buttons?.gamepad) return;
        buttons.gamepad.forEach((button) => {
            if(button){
                if(button.combinedKeys){
                    if(!mp.game.controls.isControlPressed(0, button.combinedKeys)) return;
                }

                if(mp.game.controls.isControlJustPressed(0, button.id)){
                    button.action();
                }    
            }
        })
    });
}


//Buttons ID -> https://wiki.rage.mp/wiki/Controls
//Como implmentar el hud de botones mas instructivos -> https://docs.fivem.net/docs/game-references/instructional-buttons/

//Crear un singleton para gestionar los botones instructivos
//Modificar los botones en cualquier momento
//Mostrar u ocultar el hud de botones instructivos
//etc...
/*export const InstructionalButtons = (buttons:{[key: string]: number}) => {
    const buttonHud = new Hudmanager(-1, "#00000025");
    buttonHud.addButtons(buttons);
    buttonHud.toggleHud(true);

    isUsingController(buttonHud);
};*/

let buttonHud:InstructionalButtonManager|null;

export const InstructionalButtonsDynamic = (dynamicButtons:TypeDinamicButton) => {

    buttonHud = new InstructionalButtonManager(-1, "#00000025");

    mp.console.logInfo("InstructionalButtonsDynamic!!!!!!!");

    const objPrint = JSON.stringify(dynamicButtons);
    //mp.console.logInfo(`~y~obj: ${objPrint}`);

    dynamicButtons.keyboard.forEach((button) => {
        if(!button.keyBind){
            const keyBind = buttonsMap.get(button.id);
            if (keyBind && keyBind.vkHex !== undefined) {
                button.keyBind = keyBind.vkHex;
            }
        }
    })

    /*for (const key in dynamicButtons.keyboard.keysBind) {
        const value = dynamicButtons.keyboard.keysBind[key as keyof typeof dynamicButtons.keyboard.keysBind];
        const vk = ragempToVk.get(value);    
        if(vk){
            mp.console.logInfo(`Key Map : ${value} => ${vk?.toString(16)}`); // p. ej. -> "53" (== 'S')
            keyboardActions = {
                [vk]:dynamicButtons.keyboard.actions[value]
            }
        }
    }*/

    buttonHud.addDynamicButton2(dynamicButtons);
    buttonHud.addKeyboardBind(dynamicButtons);
    buttonHud.toggleHud(true);

    isUsingController(buttonHud);
};

export const destroyInstructionalButtonsDynamic = () => {
    if (buttonPressedRender !== undefined) {
        mp.console.logInfo("DestroyButton detecter");
        buttonPressedRender.destroy();
    }
    if(buttonHud){
        mp.console.logInfo("DestroyButtonHud detecter");
        buttonHud.destroy();
        buttonHud = null;
    }
    if(intervalControllerCheck){
        clearInterval(intervalControllerCheck);
    }
}


//TODO -> Todo esto se inicializara en la instancia del singleton
type TypeButtonEntity = {
  id: number;
  name: string;
  key: string;
  vkName: string;
  vkHex: string;
};

const buttonsObj: Record<string, TypeButtonEntity> = (mapJson as any).mapped;
const unmappedObj: Record<string, { id:number; name:string; key:string }> = (mapJson as any).unmapped;
const buttonsMap = new Map<number, TypeButtonEntity>();


Object.keys(buttonsObj).forEach(key => {
    const item = buttonsObj[key];
    buttonsMap.set(Number(key), item);
});






export enum XboxInputIndex {
  BACK_0 = 0,
  RIGHT_STICK_1 = 1,
  RIGHT_STICK_2 = 2,
  RIGHT_STICK_3 = 3,
  RIGHT_STICK_4 = 4,
  RIGHT_STICK_5 = 5,
  RIGHT_STICK_6 = 6,
  R3_7 = 7,
  LEFT_STICK_8 = 8,
  LEFT_STICK_9 = 9,
  LT_10 = 10,
  RT_11 = 11,
  RIGHT_STICK_12 = 12,
  RIGHT_STICK_13 = 13,
  DPAD_RIGHT_14 = 14,
  DPAD_LEFT_15 = 15,
  NONE_16 = 16,
  NONE_17 = 17,
  A_18 = 18,
  DPAD_DOWN_19 = 19,
  DPAD_DOWN_20 = 20,
  A_21 = 21,
  X_22 = 22,
  Y_23 = 23,
  RT_24 = 24,
  LT_25 = 25,
  R3_26 = 26,
  DPAD_UP_27 = 27,
  L3_28 = 28,
  R3_29 = 29,
  LEFT_STICK_30 = 30,
  LEFT_STICK_31 = 31,
  LEFT_STICK_32 = 32,
  LEFT_STICK_33 = 33,
  LEFT_STICK_34 = 34,
  LEFT_STICK_35 = 35,
  L3_36 = 36,
  LB_37 = 37,
  LB_38 = 38,
  LEFT_STICK_39 = 39,
  LEFT_STICK_40 = 40,
  LEFT_STICK_41 = 41,
  DPAD_UP_42 = 42,
  DPAD_DOWN_43 = 43,
  RB_44 = 44,
  B_45 = 45,
  DPAD_RIGHT_46 = 46,
  DPAD_LEFT_47 = 47,
  DPAD_DOWN_48 = 48,
  Y_49 = 49,
  R3_50 = 50,
  DPAD_RIGHT_51 = 51,
  DPAD_LEFT_52 = 52,
  Y_53 = 53,
  DPAD_RIGHT_54 = 54,
  RB_55 = 55,
  Y_56 = 56,
  B_57 = 57,
  DPAD_LEFT_58 = 58,
  LEFT_STICK_59 = 59,
  LEFT_STICK_60 = 60,
  LEFT_STICK_61 = 61,
  LEFT_STICK_62 = 62,
  LEFT_STICK_63 = 63,
  LEFT_STICK_64 = 64,
  NONE_65 = 65,
  RIGHT_STICK_66 = 66,
  RIGHT_STICK_67 = 67,
  LB_68 = 68,
  RB_69 = 69,
  A_70 = 70,
  RT_71 = 71,
  LT_72 = 72,
  A_73 = 73,
  DPAD_RIGHT_74 = 74,
  Y_75 = 75,
  RB_76 = 76,
  LT_77 = 77,
  RT_78 = 78,
  R3_79 = 79,
  B_80 = 80,
  NONE_81 = 81,
  NONE_82 = 82,
  NONE_83 = 83,
  NONE_84 = 84,
  DPAD_LEFT_85 = 85,
  L3_86 = 86,
  RT_87 = 87,
  LT_88 = 88,
  LB_89 = 89,
  RB_90 = 90,
  LT_91 = 91,
  RT_92 = 92,
  R3_93 = 93,
  NONE_94 = 94,
  RIGHT_STICK_95 = 95,
  NONE_96 = 96,
  NONE_97 = 97,
  RIGHT_STICK_98 = 98,
  X_99 = 99,
  NONE_100 = 100,
  DPAD_RIGHT_101 = 101,
  RB_102 = 102,
  DPAD_RIGHT_103 = 103,
  DPAD_RIGHT_104 = 104,
  A_105 = 105,
  NONE_106 = 106,
  LEFT_STICK_107 = 107,
  LEFT_STICK_108 = 108,
  LEFT_STICK_109 = 109,
  LEFT_STICK_110 = 110,
  LEFT_STICK_111 = 111,
  LEFT_STICK_112 = 112,
  L3_113 = 113,
  A_114 = 114,
  DPAD_LEFT_115 = 115,
  NONE_116 = 116,
  LB_117 = 117,
  RB_118 = 118,
  DPAD_RIGHT_119 = 119,
  A_120 = 120,
  R3_121 = 121,
  NONE_122 = 122,
  LEFT_STICK_123 = 123,
  LEFT_STICK_124 = 124,
  LEFT_STICK_125 = 125,
  LEFT_STICK_126 = 126,
  LEFT_STICK_127 = 127,
  LEFT_STICK_128 = 128,
  RT_129 = 129,
  LT_130 = 130,
  X_131 = 131,
  A_132 = 132,
  LB_133 = 133,
  RB_134 = 134,
  NONE_135 = 135,
  A_136 = 136,
  A_137 = 137,
  LT_138 = 138,
  RT_139 = 139,
  B_140 = 140,
  A_141 = 141,
  RT_142 = 142,
  X_143 = 143,
  Y_144 = 144,
  Y_145 = 145,
  LEFT_STICK_146 = 146,
  LEFT_STICK_147 = 147,
  LEFT_STICK_148 = 148,
  LEFT_STICK_149 = 149,
  LEFT_STICK_150 = 150,
  LEFT_STICK_151 = 151,
  LB_152 = 152,
  RB_153 = 153,
  A_154 = 154,
  NONE_155 = 155,
  NONE_156 = 156,
  NONE_157 = 157,
  NONE_158 = 158,
  NONE_159 = 159,
  NONE_160 = 160,
  NONE_161 = 161,
  NONE_162 = 162,
  NONE_163 = 163,
  NONE_164 = 164,
  NONE_165 = 165,
  NONE_166 = 166,
  NONE_167 = 167,
  NONE_168 = 168,
  NONE_169 = 169,
  B_170 = 170,
  NONE_171 = 171,
  DPAD_UP_172 = 172,
  DPAD_DOWN_173 = 173,
  DPAD_LEFT_174 = 174,
  DPAD_RIGHT_175 = 175,
  A_176 = 176,
  B_177 = 177,
  Y_178 = 178,
  X_179 = 179,
  NONE_180 = 180,
  NONE_181 = 181,
  RT_182 = 182,
  RB_183 = 183,
  R3_184 = 184,
  LB_185 = 185,
  L3_186 = 186,
  DPAD_DOWN_187 = 187,
  DPAD_UP_188 = 188,
  DPAD_LEFT_189 = 189,
  DPAD_RIGHT_190 = 190,
  A_191 = 191,
  Y_192 = 192,
  X_193 = 193,
  B_194 = 194,
  LEFT_STICK_195 = 195,
  LEFT_STICK_196 = 196,
  RIGHT_STICK_197 = 197,
  RIGHT_STICK_198 = 198,
  START_199 = 199,
  NONE_200 = 200,
  A_201 = 201,
  B_202 = 202,
  X_203 = 203,
  Y_204 = 204,
  LB_205 = 205,
  RB_206 = 206,
  LT_207 = 207,
  RT_208 = 208,
  L3_209 = 209,
  R3_210 = 210,
  RB_211 = 211,
  BACK_212 = 212,
  RB_213 = 213,
  X_214 = 214,
  A_215 = 215,
  X_216 = 216,
  BACK_217 = 217,
  LEFT_STICK_218 = 218,
  LEFT_STICK_219 = 219,
  RIGHT_STICK_220 = 220,
  RIGHT_STICK_221 = 221,
  Y_222 = 222,
  A_223 = 223,
  X_224 = 224,
  B_225 = 225,
  LB_226 = 226,
  RB_227 = 227,
  LT_228 = 228,
  RT_229 = 229,
  L3_230 = 230,
  R3_231 = 231,
  DPAD_UP_232 = 232,
  DPAD_DOWN_233 = 233,
  DPAD_LEFT_234 = 234,
  DPAD_RIGHT_235 = 235,
  BACK_236 = 236,
  NONE_237 = 237,
  NONE_238 = 238,
  NONE_239 = 239,
  NONE_240 = 240,
  NONE_241 = 241,
  NONE_242 = 242,
  NONE_243 = 243,
  BACK_244 = 244,
  NONE_245 = 245,
  NONE_246 = 246,
  NONE_247 = 247,
  NONE_248 = 248,
  NONE_249 = 249,
  L3_250 = 250,
  R3_251 = 251,
  LT_252 = 252,
  RT_253 = 253,
  NONE_254 = 254,
  A_255 = 255,
  X_256 = 256,
  RT_257 = 257,
  A_258 = 258,
  X_259 = 259,
  RT_260 = 260,
  DPAD_LEFT_261 = 261,
  DPAD_RIGHT_262 = 262,
  B_263 = 263,
  A_264 = 264,
  NONE_265 = 265,
  LEFT_STICK_266 = 266,
  LEFT_STICK_267 = 267,
  LEFT_STICK_268 = 268,
  LEFT_STICK_269 = 269,
  RIGHT_STICK_270 = 270,
  RIGHT_STICK_271 = 271,
  RIGHT_STICK_272 = 272,
  RIGHT_STICK_273 = 273,
  RIGHT_STICK_274 = 274,
  RIGHT_STICK_275 = 275,
  LEFT_STICK_276 = 276,
  LEFT_STICK_277 = 277,
  LEFT_STICK_278 = 278,
  LEFT_STICK_279 = 279,
  LEFT_STICK_280 = 280,
  LEFT_STICK_281 = 281,
  RIGHT_STICK_282 = 282,
  RIGHT_STICK_283 = 283,
  RIGHT_STICK_284 = 284,
  RIGHT_STICK_285 = 285,
  RIGHT_STICK_286 = 286,
  RIGHT_STICK_287 = 287,
  A_288 = 288,
  X_289 = 289,
  RIGHT_STICK_290 = 290,
  RIGHT_STICK_291 = 291,
  RIGHT_STICK_292 = 292,
  RIGHT_STICK_293 = 293,
  RIGHT_STICK_294 = 294,
  RIGHT_STICK_295 = 295,
  X_296 = 296,
  Y_297 = 297,
  A_298 = 298,
  LB_299 = 299,
  RB_300 = 300,
  A_301 = 301,
  NONE_302 = 302,
  DPAD_UP_303 = 303,
  R3_304 = 304,
  NONE_305 = 305,
  NONE_306 = 306,
  DPAD_RIGHT_307 = 307,
  DPAD_LEFT_308 = 308,
  DPAD_DOWN_309 = 309,
  BACK_310 = 310,
  DPAD_DOWN_311 = 311,
  DPAD_LEFT_312 = 312,
  DPAD_RIGHT_313 = 313,
  RB_314 = 314,
  LB_315 = 315,
  NONE_316 = 316,
  NONE_317 = 317,
  START_318 = 318,
  NONE_319 = 319,
  NONE_320 = 320,
  NONE_321 = 321,
  NONE_322 = 322,
  NONE_323 = 323,
  NONE_324 = 324,
  NONE_325 = 325,
  NONE_326 = 326,
  NONE_327 = 327,
  RT_328 = 328,
  NONE_329 = 329,
  NONE_330 = 330,
  NONE_331 = 331,
  RIGHT_STICK_332 = 332,
  RIGHT_STICK_333 = 333,
  LEFT_STICK_334 = 334,
  LEFT_STICK_335 = 335,
  LEFT_STICK_336 = 336,
  A_337 = 337,
  LEFT_STICK_338 = 338,
  LEFT_STICK_339 = 339,
  LEFT_STICK_340 = 340,
  LEFT_STICK_341 = 341,
  LEFT_STICK_342 = 342,
  LEFT_STICK_343 = 343,
  DPAD_RIGHT_344 = 344,
  A_345 = 345,
  LB_346 = 346,
  RB_347 = 347,
  Y_348 = 348,
  X_349 = 349,
  L3_350 = 350,
  L3_351 = 351,
  L3_352 = 352,
  A_353 = 353,
  A_354 = 354,
  DPAD_RIGHT_355 = 355,
  DPAD_RIGHT_356 = 356,
  A_357 = 357,
  RB_358 = 358,
  NONE_359 = 359,
  NONE_360 = 360,
}

export enum QwertyInputIndex {
  V_0 = 0,
  MOUSE_RIGHT_1 = 1,
  MOUSE_DOWN_2 = 2,
  NONE_3 = 3,
  MOUSE_DOWN_4 = 4,
  NONE_5 = 5,
  MOUSE_RIGHT_6 = 6,
  NONE_7 = 7,
  S_8 = 8,
  D_9 = 9,
  PAGEUP_10 = 10,
  PAGEDOWN_11 = 11,
  MOUSE_DOWN_12 = 12,
  MOUSE_RIGHT_13 = 13,
  SCROLLWHEEL_DOWN_14 = 14,
  SCROLLWHEEL_UP_15 = 15,
  SCROLLWHEEL_DOWN_16 = 16,
  SCROLLWHEEL_UP_17 = 17,
  ENTER_LEFT_MOUSE_BUTTON_SPACEBAR_18 = 18,
  LEFT_ALT_19 = 19,
  Z_20 = 20,
  LEFT_SHIFT_21 = 21,
  SPACEBAR_22 = 22,
  F_23 = 23,
  LEFT_MOUSE_BUTTON_24 = 24,
  RIGHT_MOUSE_BUTTON_25 = 25,
  C_26 = 26,
  ARROW_UP_SCROLLWHEEL_BUTTON_PRESS_27 = 27,
  NONE_28 = 28,
  B_29 = 29,
  D_30 = 30,
  S_31 = 31,
  W_32 = 32,
  S_33 = 33,
  A_34 = 34,
  D_35 = 35,
  LEFT_CTRL_36 = 36,
  TAB_37 = 37,
  E_38 = 38,
  BRACKET_LEFT_39 = 39,
  BRACKET_RIGHT_40 = 40,
  BRACKET_LEFT_41 = 41,
  BRACKET_RIGHT_42 = 42,
  BRACKET_LEFT_43 = 43,
  Q_44 = 44,
  R_45 = 45,
  E_46 = 46,
  G_47 = 47,
  Z_48 = 48,
  F_49 = 49,
  SCROLLWHEEL_DOWN_50 = 50,
  E_51 = 51,
  Q_52 = 52,
  NONE_53 = 53,
  E_54 = 54,
  SPACEBAR_55 = 55,
  F9_56 = 56,
  F10_57 = 57,
  G_58 = 58,
  D_59 = 59,
  LEFT_CTRL_60 = 60,
  LEFT_SHIFT_61 = 61,
  LEFT_CTRL_62 = 62,
  A_63 = 63,
  D_64 = 64,
  NONE_65 = 65,
  MOUSE_RIGHT_66 = 66,
  MOUSE_DOWN_67 = 67,
  RIGHT_MOUSE_BUTTON_68 = 68,
  LEFT_MOUSE_BUTTON_69 = 69,
  RIGHT_MOUSE_BUTTON_70 = 70,
  W_71 = 71,
  S_72 = 72,
  X_73 = 73,
  H_74 = 74,
  F_75 = 75,
  SPACEBAR_76 = 76,
  W_77 = 77,
  S_78 = 78,
  C_79 = 79,
  R_80 = 80,
  DOT_81 = 81,
  COMMA_82 = 82,
  EQUALS_83 = 83,
  MINUS_84 = 84,
  Q_85 = 85,
  E_86 = 86,
  W_87 = 87,
  S_88 = 88,
  A_89 = 89,
  D_90 = 90,
  RIGHT_MOUSE_BUTTON_91 = 91,
  LEFT_MOUSE_BUTTON_92 = 92,
  NONE_93 = 93,
  NONE_94 = 94,
  MOUSE_DOWN_95 = 95,
  NUMPAD_MINUS_SCROLLWHEEL_UP_96 = 96,
  NUMPAD_PLUS_SCROLLWHEEL_DOWN_97 = 97,
  MOUSE_RIGHT_98 = 98,
  SCROLLWHEEL_UP_99 = 99,
  BRACKET_LEFT_100 = 100,
  H_101 = 101,
  SPACEBAR_102 = 102,
  E_103 = 103,
  H_104 = 104,
  X_105 = 105,
  LEFT_MOUSE_BUTTON_106 = 106,
  NUMPAD_6_107 = 107,
  NUMPAD_4_108 = 108,
  NUMPAD_6_109 = 109,
  NUMPAD_5_110 = 110,
  NUMPAD_8_111 = 111,
  NUMPAD_5_112 = 112,
  G_113 = 113,
  RIGHT_MOUSE_BUTTON_114 = 114,
  SCROLLWHEEL_UP_115 = 115,
  BRACKET_LEFT_116 = 116,
  NUMPAD_7_117 = 117,
  NUMPAD_9_118 = 118,
  E_119 = 119,
  X_120 = 120,
  INSERT_121 = 121,
  LEFT_MOUSE_BUTTON_122 = 122,
  NUMPAD_6_123 = 123,
  NUMPAD_4_124 = 124,
  NUMPAD_6_125 = 125,
  NUMPAD_5_126 = 126,
  NUMPAD_8_127 = 127,
  NUMPAD_5_128 = 128,
  W_129 = 129,
  S_130 = 130,
  LEFT_SHIFT_131 = 131,
  LEFT_CTRL_132 = 132,
  A_133 = 133,
  D_134 = 134,
  LEFT_MOUSE_BUTTON_135 = 135,
  W_136 = 136,
  CAPSLOCK_137 = 137,
  Q_138 = 138,
  S_139 = 139,
  R_140 = 140,
  Q_141 = 141,
  LEFT_MOUSE_BUTTON_142 = 142,
  SPACEBAR_143 = 143,
  F_LEFT_MOUSE_BUTTON_144 = 144,
  F_145 = 145,
  D_146 = 146,
  A_147 = 147,
  D_148 = 148,
  S_149 = 149,
  W_150 = 150,
  S_151 = 151,
  Q_152 = 152,
  E_153 = 153,
  X_154 = 154,
  LEFT_SHIFT_155 = 155,
  NONE_156 = 156,
  DIGIT_1_157 = 157,
  DIGIT_2_158 = 158,
  DIGIT_6_159 = 159,
  DIGIT_3_160 = 160,
  DIGIT_7_161 = 161,
  DIGIT_8_162 = 162,
  DIGIT_9_163 = 163,
  DIGIT_4_164 = 164,
  DIGIT_5_165 = 165,
  F5_166 = 166,
  F6_167 = 167,
  F7_168 = 168,
  F8_169 = 169,
  F3_170 = 170,
  CAPSLOCK_171 = 171,
  ARROW_UP_172 = 172,
  ARROW_DOWN_173 = 173,
  ARROW_LEFT_174 = 174,
  ARROW_RIGHT_175 = 175,
  ENTER_LEFT_MOUSE_BUTTON_176 = 176,
  BACKSPACE_ESC_RIGHT_MOUSE_BUTTON_177 = 177,
  DELETE_178 = 178,
  SPACEBAR_179 = 179,
  SCROLLWHEEL_DOWN_180 = 180,
  SCROLLWHEEL_UP_181 = 181,
  L_182 = 182,
  G_183 = 183,
  E_184 = 184,
  F_185 = 185,
  X_186 = 186,
  ARROW_DOWN_187 = 187,
  ARROW_UP_188 = 188,
  ARROW_LEFT_189 = 189,
  ARROW_RIGHT_190 = 190,
  ENTER_191 = 191,
  TAB_192 = 192,
  NONE_193 = 193,
  BACKSPACE_194 = 194,
  D_195 = 195,
  S_196 = 196,
  BRACKET_RIGHT_197 = 197,
  SCROLLWHEEL_DOWN_198 = 198,
  P_199 = 199,
  ESC_200 = 200,
  ENTER_NUMPAD_ENTER_201 = 201,
  BACKSPACE_ESC_202 = 202,
  SPACEBAR_203 = 203,
  TAB_204 = 204,
  Q_205 = 205,
  E_206 = 206,
  PAGE_DOWN_207 = 207,
  PAGE_UP_208 = 208,
  LEFT_SHIFT_209 = 209,
  LEFT_CONTROL_210 = 210,
  TAB_211 = 211,
  HOME_212 = 212,
  HOME_213 = 213,
  DELETE_214 = 214,
  ENTER_215 = 215,
  SPACEBAR_216 = 216,
  CAPSLOCK_217 = 217,
  D_218 = 218,
  S_219 = 219,
  MOUSE_RIGHT_220 = 220,
  MOUSE_DOWN_221 = 221,
  RIGHT_MOUSE_BUTTON_222 = 222,
  LEFT_MOUSE_BUTTON_223 = 223,
  LEFT_CTRL_224 = 224,
  RIGHT_MOUSE_BUTTON_225 = 225,
  NONE_226 = 226,
  NONE_227 = 227,
  NONE_228 = 228,
  LEFT_MOUSE_BUTTON_229 = 229,
  NONE_230 = 230,
  NONE_231 = 231,
  W_232 = 232,
  S_233 = 233,
  A_234 = 234,
  D_235 = 235,
  V_236 = 236,
  LEFT_MOUSE_BUTTON_237 = 237,
  RIGHT_MOUSE_BUTTON_238 = 238,
  NONE_239 = 239,
  NONE_240 = 240,
  SCROLLWHEEL_UP_241 = 241,
  SCROLLWHEEL_DOWN_242 = 242,
  TILDE_BACKTICK_243 = 243,
  M_244 = 244,
  T_245 = 245,
  Y_246 = 246,
  NONE_247 = 247,
  NONE_248 = 248,
  N_249 = 249,
  R_250 = 250,
  F_251 = 251,
  X_252 = 252,
  C_253 = 253,
  LEFT_SHIFT_254 = 254,
  SPACEBAR_255 = 255,
  DELETE_256 = 256,
  LEFT_MOUSE_BUTTON_257 = 257,
  NONE_258 = 258,
  NONE_259 = 259,
  NONE_260 = 260,
  SCROLLWHEEL_UP_261 = 261,
  SCROLLWHEEL_DOWN_262 = 262,
  R_263 = 263,
  Q_264 = 264,
  NONE_265 = 265,
  D_266 = 266,
  D_267 = 267,
  S_268 = 268,
  S_269 = 269,
  MOUSE_RIGHT_270 = 270,
  MOUSE_RIGHT_271 = 271,
  MOUSE_DOWN_272 = 272,
  MOUSE_DOWN_273 = 273,
  BRACKET_LEFT_274 = 274,
  BRACKET_LEFT_275 = 275,
  BRACKET_LEFT_276 = 276,
  BRACKET_LEFT_277 = 277,
  D_278 = 278,
  D_279 = 279,
  LEFT_CTRL_280 = 280,
  LEFT_CTRL_281 = 281,
  MOUSE_RIGHT_282 = 282,
  MOUSE_RIGHT_283 = 283,
  MOUSE_RIGHT_284 = 284,
  MOUSE_RIGHT_285 = 285,
  MOUSE_RIGHT_286 = 286,
  MOUSE_RIGHT_287 = 287,
  F1_288 = 288,
  F2_289 = 289,
  MOUSE_RIGHT_290 = 290,
  MOUSE_DOWN_291 = 291,
  NONE_292 = 292,
  NONE_293 = 293,
  NONE_294 = 294,
  NONE_295 = 295,
  DELETE_296 = 296,
  DELETE_297 = 297,
  SPACEBAR_298 = 298,
  ARROW_DOWN_299 = 299,
  ARROW_UP_300 = 300,
  M_301 = 301,
  S_302 = 302,
  U_303 = 303,
  H_304 = 304,
  B_305 = 305,
  N_306 = 306,
  ARROW_RIGHT_307 = 307,
  ARROW_LEFT_308 = 308,
  T_309 = 309,
  R_310 = 310,
  K_311 = 311,
  BRACKET_LEFT_312 = 312,
  BRACKET_RIGHT_313 = 313,
  NUMPAD_PLUS_314 = 314,
  NUMPAD_MINUS_315 = 315,
  PAGE_UP_316 = 316,
  PAGE_DOWN_317 = 317,
  F5_318 = 318,
  C_319 = 319,
  V_320 = 320,
  SPACEBAR_321 = 321,
  ESC_322 = 322,
  X_323 = 323,
  C_324 = 324,
  V_325 = 325,
  LEFT_CTRL_326 = 326,
  F5_327 = 327,
  SPACEBAR_328 = 328,
  LEFT_MOUSE_BUTTON_329 = 329,
  RIGHT_MOUSE_BUTTON_330 = 330,
  RIGHT_MOUSE_BUTTON_331 = 331,
  MOUSE_DOWN_332 = 332,
  MOUSE_RIGHT_333 = 333,
  SCROLLWHEEL_DOWN_334 = 334,
  SCROLLWHEEL_UP_335 = 335,
  SCROLLWHEEL_DOWN_336 = 336,
  X_337 = 337,
  A_338 = 338,
  D_339 = 339,
  LEFT_SHIFT_340 = 340,
  LEFT_CTRL_341 = 341,
  D_342 = 342,
  LEFT_CTRL_343 = 343,
  F11_344 = 344,
  X_345 = 345,
  LEFT_MOUSE_BUTTON_346 = 346,
  RIGHT_MOUSE_BUTTON_347 = 347,
  SCROLLWHEEL_BUTTON_PRESS_348 = 348,
  TAB_349 = 349,
  E_350 = 350,
  E_351 = 351,
  LEFT_SHIFT_352 = 352,
  SPACEBAR_353 = 353,
  X_354 = 354,
  E_355 = 355,
  E_356 = 356,
  X_357 = 357,
  NONE_358 = 358,
  NONE_359 = 359,
  NONE_360 = 360,
}
