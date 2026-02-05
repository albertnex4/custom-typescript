import { WeaponPool } from "../weapons/weaponPool";

const TARGET_MODEL = mp.game.joaat("gr_prop_gr_target_05b");


export function initializeShotRange() {

    let objectPosition:any;
    let playerShot:boolean = false;
    let checkImpactUntil = 0;
    let hitEntity:any = null;
    let objectServerId:number;

    
    const checkImpactedInArea = (objectPosition:Vector3, closeShot = false) => {
        if(mp.game.gameplay.hasBulletImpactedInArea(objectPosition.x, objectPosition.y, objectPosition.z+0.80, 0.10, true, true)){
            if(!closeShot){
                mp.console.logInfo(`🎯 Tiro Puntos : +10`);
            }else{
                mp.console.logInfo(`🎯 Tiro Puntos : +10 (cercano)`);    
            }
            checkImpactUntil = 0;
            mp.events.callRemote("SR_Hit", objectServerId);
            return true;
        }

        if(mp.game.gameplay.hasBulletImpactedInArea(objectPosition.x, objectPosition.y, objectPosition.z+1.3, 0.07, true, true)){
            if(!closeShot){
                mp.console.logInfo(`🎯 Tiro Puntos : +25`);
            }else{
                mp.console.logInfo(`🎯 Tiro Puntos : +25 (cercano)`);    
            }
            checkImpactUntil = 0;
            mp.events.callRemote("SR_Hit", objectServerId);
            return true;
        }

        if(mp.game.gameplay.hasBulletImpactedInArea(objectPosition.x, objectPosition.y, objectPosition.z+0.9, 0.50, true, true)){
            if(!closeShot){
                mp.console.logInfo(`🎯 Tiro Puntos : +5`);
            }else{
                mp.console.logInfo(`🎯 Tiro Puntos : +5 (cercano)`);    
            }
            checkImpactUntil = 0;
            mp.events.callRemote("SR_Hit", objectServerId);
            return true;
        }

        return false;
    }

    
    mp.events.add("render", () =>{

        mp.game.entity.setOnlyDamagedByPlayer

        if (!objectPosition || !objectServerId) return;

            mp.game.graphics.drawLine(
            mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z,
            objectPosition.x, objectPosition.y, objectPosition.z,
            255,
            0,
            0,
            255
            );

        mp.game.graphics.drawMarker(
            28, // círculo
            objectPosition.x,
            objectPosition.y,
            objectPosition.z+0.8,
            0, 0, 0,
            90, 0, 0,
            0.10,
            0.10,
            0.02,
            0, 255, 0, 255,
            false,
            false,
            2,
            false,
            null,
            null,
            false
        );

        mp.game.graphics.drawMarker(
            28, // círculo
            objectPosition.x,
            objectPosition.y,
            objectPosition.z+1.3,
            0, 0, 0,
            90, 0, 0,
            0.07,
            0.07,
            0.02,
            255, 0, 0, 200,
            false,
            false,
            2,
            false,
            null,
            null,
            false
        );

        mp.game.graphics.drawMarker(
            28, // círculo
            objectPosition.x,
            objectPosition.y,
            objectPosition.z+0.9,
            0, 0, 0,
            90, 0, 0,
            0.50,
            0.50,
            0.02,
            0, 213, 255, 150,
            false,
            false,
            2,
            false,
            null,
            null,
            false
        );

        if (Date.now() > checkImpactUntil) return;

        checkImpactedInArea(objectPosition)
                
    });

    //ACTUALMENTE
    //El sistema funciona solo con una diana, el servidor indica que diana se tiene que disparar
    //Por el lado del cliene no sabemos a que diana esta disparando, pero si sabemos cuando ha disparado a la diana del servidor
    //A partir de esto podemos suponer que cuando el cliente ha disparado en la diana hace referencia a la ultima diana entragada por el servidor
    mp.events.add("playerWeaponShot", (pos: Vector3, entity: EntityMp) => {

        checkImpactUntil = Date.now() + 50; // ventana de 150 ms

        if(objectPosition){
            checkImpactedInArea(objectPosition, true);
        }
    });

    mp.events.add("SR_Start", (objectModel:any) => {
        //objectPosition = positions[0];
        objectPosition = objectModel.Position;
        objectServerId = objectModel.Id;

        const obj = mp.objects.atRemoteId(objectServerId);
        const objPrint = JSON.stringify(obj);
        mp.console.logInfo(`~y~obj: ${objPrint}`);

        //const objPrint = JSON.stringify(positions[0]);
        //mp.console.logInfo(`~y~positions: ${objPrint}`);
        mp.game.graphics.notify(`~g~Minijuego iniciado`);
    });


    mp.events.add("SR_End", (score: number) => {
        mp.game.graphics.notify(`~y~Puntuación final: ${score}`);
    });


    mp.events.add("SR_LoadInterior", () => {
        mp.game.streaming.requestIpl("v_7_shadowrange");


        const interiorId = mp.game.interior.getInteriorAtCoords(800.47, -3005.18, -70.0);
        mp.players.local.position = new mp.Vector3(800.47, -3005.18, -70.0);
        if (interiorId !== 0) {
            mp.game.interior.refreshInterior(interiorId);
        }
    });

    /*mp.keys.bind(0x4E, true, () => { // Tecla N
        
        loadInterior();
        
    });*/

    /*mp.keys.bind(0x45, true, () => { // Tecla E -> https://learn.microsoft.com/es-es/windows/win32/inputdev/virtual-key-codes?redirectedfrom=MSDN
       
        //mp.console.logInfo("Start Shot Range");
        mp.events.callRemote("SR_StartGame");
        //initPositionObject(TARGET_MODEL,mp.players.local.position);
        
    });*/

}

const loadInterior = () => {
    mp.game.streaming.requestIpl("v_7_shadowrange");

    const interiorId = mp.game.interior.getInteriorAtCoords(800.47, -3005.18, -70.0);
    mp.players.local.position = new mp.Vector3(821.5705, -2163.812, 29.656);
    //mp.players.local.position = new mp.Vector3(800.47, -3005.18, -70.0);
    if (interiorId !== 0) {
        mp.game.interior.refreshInterior(interiorId);
    }
}



//TODO -> Crear una funcion que unifique como posicionar objetos y elementos
// Tiene que tener en cuenta la camara del jugador para que siempre se mueva el objecto
// Correctamente con las mismas teclas

//Para poder posicionar drawMarkers area
const initPositionObject = (object:number,objectPosition2:Vector3) => {

    //Crea un objeto delante del jugador

    objectPosition2.y += 3;

    let obj = {
        objectHash : object,
        position : objectPosition2
    }
    const weaponHandle = WeaponPool.instance.createObject(obj);
        const originalPosition = new mp.Vector3(
        objectPosition2.x,
        objectPosition2.y,
        objectPosition2.z
    );

    let finalPosition = new mp.Vector3(
        objectPosition2.x,
        objectPosition2.y,
        objectPosition2.z
    );

    let finalScale = 0.10;

    mp.console.logInfo(`objectId : ${weaponHandle}`);

    mp.keys.bind(0x26, true, () => { // Flecha arriba
        finalPosition.z += 0.10;
        const logPosition = new mp.Vector3(
            originalPosition.x - finalPosition.x,
            originalPosition.y - finalPosition.y,
            originalPosition.z - finalPosition.z,
        );
        mp.console.logInfo(`logPosition : ${logPosition} | scale : ${finalScale}`);
    });

    mp.keys.bind(	0x28, true, () => { // Flecha abajo
        finalPosition.z -= 0.10;
    });

    mp.keys.bind(0x27, true, () => { // Flecha derecha
        finalPosition.x += 0.10;
    });

    mp.keys.bind(0x25, true, () => { // Flecha izquierda
        finalPosition.x -= 0.10;
    });

    mp.keys.bind(0x5A, true, () => { // Flecha Z
        finalScale += 0.10;
    });

    mp.keys.bind(0x58, true, () => { // Flecha X
        finalScale -= 0.10;
    });

    mp.events.add("render", () =>{

        if (!finalPosition) return;

        mp.game.graphics.drawMarker(
            28, // círculo
            finalPosition.x,
            finalPosition.y,
            finalPosition.z,
            0, 0, 0,
            90, 0, 0,
            finalScale,
            finalScale,
            0.02,
            0, 255, 0, 255,
            false,
            false,
            2,
            false,
            null,
            null,
            false
        );
                
    });
};