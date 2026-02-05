//TEXTO SIMPLE
//mp.labels.new("Welcome to Los Santos", new mp.Vector3(vehPos.x, vehPos.y, vehPos.z),{ los: true, font: 1, drawDistance: 100});

import { destroyInstructionalButtonsDynamic, InstructionalButtonsDynamic, TypeDinamicButton, XboxInputIndex } from "../ui/InstructionalButtons";
import { UIManager } from "../ui/UIManager";

type CheckpointId = number;

type ScaledPosition = {
  id: number;
  position: Vector3;
  scale: number;
};

type TypeUpdateEvent = {
    positionElement: ScaledPosition; 
    keyPosition:number
}


let racePositions = new Map<CheckpointId, ScaledPosition>();
let raceOrder: CheckpointId[] = [];
let actualPositionIndex: CheckpointId|null = 0;
let actualPosition: ScaledPosition | null = null;
let finalScale = 4.0;
let renderMarkerEvent: any = null;
let showAllMarkers = true;
let nextCheckpointId = 0;

//TODO -> Sistema de botones en pantalla

export function initializeColshapes() {

    mp.keys.bind(0x42, false, getPosition); // B key
    mp.keys.bind(0x26, true, () => moveMarker("up")); // Flecha arriba
    mp.keys.bind(0x28, true, () => moveMarker("down")); // Flecha abajo
    mp.keys.bind(0x27, true, () => moveMarker("right")); // Flecha derecha (right)
    mp.keys.bind(0x25, true, () => moveMarker("left")); // Flecha izquierda (left)
    mp.keys.bind(0x5A, true, () => moveMarker("scaleUp")); // Flecha Z (scaleUp)
    mp.keys.bind(0x58, true, () => moveMarker("scaleDown")); // Flecha X (scaleDown)
    mp.keys.bind(0x43, true, savePositionColshape); // Flecha C

    const buttons2:TypeDinamicButton = {
        keyboard : [
          {
            id: 234,
            title: "Titulo 1",
            action: () => {mp.console.logInfo("He pulsado id 234 con title : Titulo 1");}
          },
          {
            id: 250,
            title: "KEYBOARD 2",
            action: () => {mp.console.logInfo("He pulsado id 234 con title : Titulo 250");}
          },
          {
            id: 301,
            title: "textaaaaaaacoooooooooo 3",
            action: () => {mp.console.logInfo("He pulsado id 234 con title : Titulo 301");}
          },
        ],
        gamepad : [
          {
            id: XboxInputIndex.L3_36,
            title: "Xbox 1",
            action: () => {mp.console.logInfo("He pulsado Xbox L3");},
            combinedKeys: XboxInputIndex.DPAD_DOWN_173
          },
          {
            id: XboxInputIndex.B_194,
            title: "Hola Xbox 2",
            action: () => {mp.console.logInfo("He pulsado Xbox B");},
            combinedKeys: XboxInputIndex.DPAD_DOWN_173
          },
          {
            id: XboxInputIndex.Y_23,
            title: "Xbox360 :) 3",
            action: () => {mp.console.logInfo("He pulsado Xbox Y");}
          },
        ]
    }
    
    InstructionalButtonsDynamic(buttons2);

    //TODO -> Testear mas a fondo el tema de true y false en .bind
    //mp.keys.bind(0x5A, true, () => showOnlySelectedElement(false)); // Flecha Z (scaleUp)
    //mp.keys.bind(0x5A, false, () => showOnlySelectedElement(true)); // Flecha Z (scaleUp)

    //Recibir posicion colshape desde el cef
    //mp.events.add("client:setRacePositions", (positions: ScaledPosition[]) => setRacePositions(positions));
    mp.events.add("client:addRacePositionElement", (position: ScaledPosition) => addRacePositionElement(position, false));
    mp.events.add("client:showOnlySelectedElement", (show:boolean) => showOnlySelectedElement(show));
    mp.events.add("client:updateRacePosition", (uiElement:TypeUpdateEvent) => {updateRacePosition(uiElement)});
    mp.events.add("client:editModeRacePosition", (keyPosition:number) => {editModeRacePosition(keyPosition)});
    mp.events.add("client:deleteRacePosition", (keyPosition:number) => {deleteRacePosition(keyPosition)});


    mp.events.add("client:errorFromUi", (msg:string) => {errorFromUi(msg)});

    
    //TODO -> Crear un sistema donde ponder indicar la posicion del checpoint
    //Ejemplo checpoint posicion: 
    // Antes del checpoint el jugador llega a gran velocidad de una recta
    // Despues del checpoint el jugador debe reducir la velocidad y girar a la izquierda (cerrada 90 grados)
    //Indicar en el checpoint como sera el tramo entre el checpoint actual y el siguiente
    //Notas -> https://imgur.com/KxXGXHO

    renderMarkerEvent = mp.events.add("render", showMarkers);
}

export const destroyColshapes = () => {
    mp.keys.unbind(0x42, false, getPosition); // B key
    mp.keys.unbind(0x43, true, savePositionColshape); // Flecha C
    mp.keys.unbind(0x26, true, () => moveMarker("up")); // Flecha arriba
    mp.keys.unbind(0x28, true, () => moveMarker("down")); // Flecha abajo
    mp.keys.unbind(0x27, true, () => moveMarker("right")); // Flecha derecha (right)
    mp.keys.unbind(0x25, true, () => moveMarker("left")); // Flecha izquierda (left)
    //mp.keys.unbind(0x5A, true, () => moveMarker("scaleUp")); // Flecha Z (scaleUp)
    //mp.keys.unbind(0x58, true, () => moveMarker("scaleDown")); // Flecha X (scaleDown)
    mp.keys.unbind(0x5A, true, editModeRacePosition); // Flecha Z (scaleUp)
    mp.keys.unbind(0x58, true, () => editModeRacePosition(1)); // Flecha X (scaleDown)
    mp.events.remove("render", showMarkers);
    mp.events.remove("client:setRacePositions", setRacePositions);
    mp.events.remove("client:addRacePositionElement", addRacePositionElement);
    mp.events.remove("client:showOnlySelectedElement", showOnlySelectedElement);
    mp.events.remove("client:updateRacePosition", updateRacePosition);
    mp.events.remove("client:editModeRacePosition", editModeRacePosition);
    mp.events.remove("client:deleteRacePosition", deleteRacePosition);
    renderMarkerEvent = false;
    racePositions.clear();
    actualPositionIndex = 0;
    actualPosition = null;
    nextCheckpointId = 0;
    raceOrder = [];
    destroyInstructionalButtonsDynamic();
};

function errorFromUi(msg:string){
    mp.console.logInfo(msg);
}


//TODO -> Que la posicion se estableza eniendo en cuenta la mirada del jugador
function getPosition(){
    /*let playerPos = mp.players.local.position;
    if(mp.players.local.isInAnyVehicle(true)) {
        //playerPos = mp.players.local.vehicle.position;
        playerPos.z -= 0.35;
    }else{
        //playerPos = mp.players.local.position;
        playerPos.z -= 1.0; // posicionar en el suelo
    }*/

    //spawnPos = pos + (rr * 10)
    //Posicion de la camara (camPos) getCoord()
    //Direccion de la camara (camDir) getDirection()
    let camPos = null;
    let camDir = null;
    if(!mp.players.local.cameras?.noClip){
        camPos = mp.cameras.gameplay.getCoord();
        camDir = mp.cameras.gameplay.getDirection();
    }else{
        let cam = mp.cameras.atHandle(mp.players.local.cameras.noClip);
        camPos = cam.getCoord();
        camDir = cam.getDirection();
    }


    mp.console.logInfo(`Camera position?????' ${JSON.stringify(camPos)}`);
    mp.console.logInfo(`Camera direction?????' ${JSON.stringify(camDir)}`);

    const objectPos:Vector3 = new mp.Vector3(
        camPos.x + camDir.x * 10,
        camPos.y + camDir.y * 10,
        camPos.z + camDir.z * 10
    );

    // Verificar altura del terreno
    let groundZ = mp.game.gameplay.getGroundZFor3dCoord(objectPos.x, objectPos.y, objectPos.z, false, false);
    mp.console.logInfo(`groundZ ${groundZ}`);
    // Asegurarse de que el objeto no quede debajo del suelo
    if(objectPos){
        // Si no se puede obtener una altura válida, coloca el objeto por encima de la cámara
        const pathfind = mp.game.pathfind.getSafeCoordForPed(objectPos.x, objectPos.y, objectPos.z, true, 28)
        if(objectPos.z && pathfind?.z){
            objectPos.z = pathfind.z - 0.9;
        }
    }

    addRacePositionElement({id:0, position: objectPos, scale: finalScale })
    //someColShape = mp.colshapes.newCircle(colShapePos.x, colShapePos.y, finalScale); // Crea un colshape circular en el origen con radio 5.0
}

//Guardar posicion de carrera
//Enviamos la posicion del elemento o si tiene sentido todo el array
//Al cef para actualizar los datos entre cef y client
function savePositionColshape(onlyActualPosition:boolean = false){    
    //TODO -> Accion para enviar las cordenadas al cef
    if (actualPositionIndex === null) return;
    const cp = racePositions.get(actualPositionIndex);
    if (!cp) return;
    const uiElement:TypeUpdateEvent = {
        positionElement: cp,
        keyPosition: actualPositionIndex
    }

    const uiElementJson = JSON.stringify(uiElement);
    UIManager.instance.callUI('ui:updateRacePositionElement', uiElementJson);

    mp.console.logInfo(`Final index: ${actualPositionIndex}`);
    mp.console.logInfo(`Final position: ${uiElementJson}`);
}

//Establece cordenadas en una posicion del array de vectores
function updateRacePosition(elementUpdate:TypeUpdateEvent|string){
    const data: TypeUpdateEvent =
        typeof elementUpdate === "string" ? JSON.parse(elementUpdate) : elementUpdate;

    const cp = racePositions.get(data.keyPosition);
    if (!cp) return;
    //let playerPosition = mp.players.local.position;
    //let position = {position:new mp.Vector3(playerPosition.x,playerPosition.y,playerPosition.z), scale: finalScale}
    //let keyPosition = 3;
    //TODO -> Hacer un historico de cambios para poder retroceder
    racePositions.set(data.keyPosition, { ...cp, ...data.positionElement});
    actualPositionIndex = data.keyPosition;
    actualPosition = data.positionElement;
}

function deleteRacePosition(keyPosition:number){
    if(!racePositions.has(keyPosition)) return;
    mp.console.logInfo(`Delete index: ${keyPosition}`);
    racePositions.delete(keyPosition);
    mp.console.logInfo(`new index: ${0}`);
    actualPosition = null;
    actualPositionIndex = 0;
}

//Establece un array de vectores como posiciones de carrera
function setRacePositions(positions:ScaledPosition[]){
    racePositions.clear();
    raceOrder = [];

    let maxId = 0;

    positions.forEach(pos => {
        racePositions.set(pos.id, {
            id: pos.id,
            position: new mp.Vector3(
                pos.position.x,
                pos.position.y,
                pos.position.z
            ),
            scale: pos.scale,
        });

        raceOrder.push(pos.id);

        if (pos.id >= maxId) {
            maxId = pos.id + 1;
        }
    });

    nextCheckpointId = maxId;

    actualPositionIndex = raceOrder.length ? raceOrder[0] : null;
}

function editModeRacePosition(index:number){
    if (!racePositions.has(index)) return;
    actualPositionIndex = index;
}

function addRacePositionElement(position:ScaledPosition|string, notifyCef:boolean = true){
   const data: Omit<ScaledPosition, "id"> =
        typeof position === "string" ? JSON.parse(position) : position;

    const id = nextCheckpointId++;

    const checkpoint: ScaledPosition = {
        id: id,
        position: data.position,
        scale: data.scale,
    };

    racePositions.set(id, checkpoint);
    raceOrder.push(id);

    actualPositionIndex = id;

    if (notifyCef) {
        UIManager.instance.callUI("ui:addRacePositionElement",JSON.stringify(checkpoint));
    }
}

function showMarkers() {
    let position = mp.players.local.position;
    const texto = `X : ${position.x.toFixed(4)} | Y : ${position.y.toFixed(4)} | Z : ${position.z.toFixed(4)}`;
    const testPos = !mp.game.ui.isRadarHidden() ? 0.26 : 0.10;
    mp.game.graphics.drawText(`${texto}`, [testPos, 0.96], {
        font: 4, color: [255, 255, 255, 255], scale: [0.40, 0.40], outline: true
    });
    if (raceOrder.length === 0) return;

    const idsToShow = showAllMarkers
        ? raceOrder
        : actualPositionIndex !== null
            ? [actualPositionIndex]
            : [];

    idsToShow.forEach(id => {
        const cp = racePositions.get(id);
        if (cp) createMarker(cp);
    });
}

//Mostramos solo el marker que esta selecionado
//Los demas markers no se renderizaran
function showOnlySelectedElement(show:boolean){
    showAllMarkers = !show;
}

function createMarker(pos: ScaledPosition){
    mp.game.graphics.drawMarker(
        1,              // type
        pos.position.x, pos.position.y, pos.position.z, // position
        0, 0, 0,        // dir
        0, 0, 0,        // rot
        pos.scale,      // scaleX (diámetro en X)
        pos.scale,      // scaleY (diámetro en Y)
        0.2,           // scaleZ (altura fina)
        255, 0, 0, 200, // color RGBA
        false,          // bobUpAndDown
        false,          // faceCamera
        2,              // p19 (fijo a 2 en muchos ejemplos)
        false, null, null, false
    );
}


function moveMarker(typeMove:string){
    if (actualPositionIndex === null) return;

    const cp = racePositions.get(actualPositionIndex);
    if(!cp) return;

    switch(typeMove){
        case "up": cp.position.y += 0.3; break;
        case "down": cp.position.y -= 0.3; break;
        case "right": cp.position.x += 0.3; break;
        case "left": cp.position.x -= 0.3; break;
        case "scaleUp": cp.scale += 0.3; break;
        case "scaleDown": cp.scale -= 0.3; break;
    }
}