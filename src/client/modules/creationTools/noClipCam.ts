/**
 * Original Creator Morbo
 * Credits Morbo
 * 
 * 
 * Modo dios para poder tener la camara libre
 * 
 * F2 - Activer/Desactivar
 * W/A/S/D/E/Q - Mover la camara
 * Shift - Mover mas rapido
 * LCtr - Mover mas lento
 */

// Helpers
const getNormalizedVector = (vector: Vector3): Vector3 => {
  const mag = Math.sqrt(
    vector.x * vector.x +
    vector.y * vector.y +
    vector.z * vector.z
  );

  vector.x /= mag;
  vector.y /= mag;
  vector.z /= mag;

  return vector;
};

const getCrossProduct = (v1: Vector3, v2: Vector3): Vector3 => {
  const vector = new mp.Vector3(0, 0, 0);

  vector.x = v1.y * v2.z - v1.z * v2.y;
  vector.y = v1.z * v2.x - v1.x * v2.z;
  vector.z = v1.x * v2.y - v1.y * v2.x;

  return vector;
};

// Key binds
const bindVirtualKeys: { F2: number } = {
  F2: 0x71
};

const bindASCIIKeys: {
  Q: number;
  E: number;
  LCtrl: number;
  Shift: number;
} = {
  Q: 69,
  E: 81,
  LCtrl: 16,
  Shift: 17
};

declare global {
  interface PlayerMp {
    cameras: {
      noClip: number;
    } | null;
  }
}

export function initNoClip(): void {
    mp.game.graphics.notify('~r~NoClip ~w~by ~b~Morbo');

    // State
    let isNoClip: boolean = false;
    let noClipCamera: CameraMp|null = null;
    let shiftModifier: boolean = false;
    let controlModifier: boolean = false;

    const localPlayer = mp.players.local;

    // Toggle NoClip
    mp.keys.bind(bindVirtualKeys.F2, true, () => {
        isNoClip = !isNoClip;
        mp.game.ui.displayRadar(!isNoClip);

        if (isNoClip) {
            startNoClip();
        } else {
            stopNoClip();
        }
    });

    function startNoClip(): void {
        mp.game.graphics.notify('NoClip ~g~activated');

        const camPos = new mp.Vector3(
            localPlayer.position.x,
            localPlayer.position.y,
            localPlayer.position.z
        );

        const camRot = mp.game.cam.getGameplayCamRot(2);

        noClipCamera = mp.cameras.new('default', camPos, camRot, 45);
        mp.players.local.cameras = {noClip:noClipCamera.handle};
        noClipCamera.setActive(true);

        mp.game.cam.renderScriptCams(true, false, 0, true, false);

        localPlayer.freezePosition(true);
        localPlayer.setInvincible(true);
        localPlayer.setVisible(false, false);
        localPlayer.setCollision(false, false);
    }

    function stopNoClip(): void {
        mp.game.graphics.notify('NoClip ~r~disabled');

        if (noClipCamera) {
            localPlayer.position = noClipCamera.getCoord();
            localPlayer.setHeading(noClipCamera.getRot(2).z);

            noClipCamera.destroy(true);
            noClipCamera = null;
            mp.players.local.cameras = null;
        }

        mp.game.cam.renderScriptCams(false, false, 0, true, false);

        localPlayer.freezePosition(false);
        localPlayer.setInvincible(false);
        localPlayer.setVisible(true, false);
        localPlayer.setCollision(true, false);
    }

    function render(){
        if (!noClipCamera) return;

        controlModifier = mp.keys.isDown(bindASCIIKeys.LCtrl);
        shiftModifier = mp.keys.isDown(bindASCIIKeys.Shift);

        const rot = noClipCamera.getRot(2);

        let fastMult = 0.5;
        let slowMult = 0.3;

        if (shiftModifier) {
            fastMult = 3;
        } else if (controlModifier) {
            slowMult = 0.1;
        }

        //Movimiento del raton???
        const rightAxisX = mp.game.controls.getDisabledControlNormal(0, 220);
        const rightAxisY = mp.game.controls.getDisabledControlNormal(0, 221);


        const leftAxisX = mp.game.controls.getDisabledControlNormal(0, 218);
        const leftAxisY = mp.game.controls.getDisabledControlNormal(0, 219);

        //Posicion de la camara
        const pos = noClipCamera.getCoord();
        //spawnPos = pos + (rr * 10)
        //Direccion de la camara (hacia donde apunta)
        const rr = noClipCamera.getDirection();

        const vector = new mp.Vector3(
            rr.x * leftAxisY * fastMult * slowMult,
            rr.y * leftAxisY * fastMult * slowMult,
            rr.z * leftAxisY * fastMult * slowMult
        );

        //Movimiento vertical (Eje Z global)
        const upVector = new mp.Vector3(0, 0, 1);
        //Movimiento horizontal relativo a la vista.
        const rightVector = getCrossProduct(
            getNormalizedVector(rr),
            getNormalizedVector(upVector)
        );

        rightVector.x *= leftAxisX * fastMult * slowMult;
        rightVector.y *= leftAxisX * fastMult * slowMult;
        rightVector.z *= leftAxisX * fastMult * slowMult;

        let upMovement = 0.0;
        if (mp.keys.isDown(bindASCIIKeys.Q)) upMovement = fastMult * slowMult;

        let downMovement = 0.0;
        if (mp.keys.isDown(bindASCIIKeys.E)) downMovement = fastMult * slowMult;

        mp.players.local.position = new mp.Vector3(
            pos.x + vector.x + 1,
            pos.y + vector.y + 1,
            pos.z + vector.z + 1
        );

        mp.players.local.heading = rr.z;

        noClipCamera.setCoord(
            pos.x - vector.x + rightVector.x,
            pos.y - vector.y + rightVector.y,
            pos.z - vector.z + rightVector.z + upMovement - downMovement
        );

        //Mover la camara del juego con el movimiento del ratos
        if(!mp.gui.cursor.visible){
            noClipCamera.setRot(
                rot.x + rightAxisY * -5.0,
                0.0,
                rot.z + rightAxisX * -5.0,
                2
            );
        }
    }


    // Render loop
    mp.events.add('render', render);
}
