import { isEntity } from "../utils/utils";
import { UIManager } from "../ui/UIManager";

const HAND_BONE = 57005; // SKEL_R_Hand
const RAY_DISTANCE = 5.0;
const DEBUG_COLOR: RGBA = [255, 0, 0, 250];

type RaycastHit = {
  entity?: EntityMp | number;
  position?: Vector3;
  normal?: Vector3;
  type?: RageEnums.EntityType | null;
};

/**
 * Convert camera rotation to direction vector
 */
function rotationToDirection(rot: Vector3): Vector3 {
  const radX = rot.x * Math.PI / 180;
  const radZ = rot.z * Math.PI / 180;
  const cosX = Math.abs(Math.cos(radX));

  return new mp.Vector3(
    -Math.sin(radZ) * cosX,
    Math.cos(radZ) * cosX,
    Math.sin(radX)
  );
}

/**
 * Raycast from player's hand forward
 */
export function raycastFromHand(debug = true): RaycastHit | null {
  const player = mp.players.local;
  if (!player || !player.handle) return null;

  // 1️⃣ Start position (hand)
  const startPos = player.getBoneCoords(HAND_BONE, 0, 0, 0);

  // 2️⃣ Direction from camera
  const camRot = mp.game.cam.getGameplayCamRot(2);
  const direction = rotationToDirection(camRot);

  // 3️⃣ End position (5m forward)
  const endPos = new mp.Vector3(
    startPos.x + direction.x * RAY_DISTANCE,
    startPos.y + direction.y * RAY_DISTANCE,
    startPos.z + direction.z * RAY_DISTANCE
  );

  // 4️⃣ Debug line
  if (debug) {
    mp.game.graphics.drawLine(
      startPos.x, startPos.y, startPos.z,
      endPos.x, endPos.y, endPos.z,
      DEBUG_COLOR[0],
      DEBUG_COLOR[1],
      DEBUG_COLOR[2],
      DEBUG_COLOR[3]
    );
  }

  // 5️⃣ Raycast (ORDEN CORRECTO)
  const hit = mp.raycasting.testPointToPoint(
    startPos,
    endPos,
    player, // ignoreEntity
  );

  if (!hit) return null;

  return {
    entity: hit.entity,
    position: hit.position,
    normal: hit.surfaceNormal,
    type: typeof hit.entity !== 'number' ? hit.entity.type : null,
  };
}

let lastEntityHandle: number | null = null;

function processRaycast(hit: RaycastHit | null) {
    if (!hit || !hit.entity) {
        lastEntityHandle = null;
        return;
    } 

    const handle = typeof hit.entity === 'number'
        ? hit.entity
        : hit.entity.handle;

    if (handle === lastEntityHandle) return;
    lastEntityHandle = handle;

    let entityType = null;
    if (isEntity(hit.entity)) {
        switch (hit.entity.type) {
            case RageEnums.EntityType.VEHICLE:
                entityType = RageEnums.EntityType.VEHICLE;
                mp.gui.chat.push('🚗 Vehículo detectado');
                break;
            case RageEnums.EntityType.PED:
                entityType = RageEnums.EntityType.PED;
                mp.gui.chat.push('🧍 Ped detectado');
                break;
            case RageEnums.EntityType.OBJECT:
                entityType = RageEnums.EntityType.OBJECT;
                mp.gui.chat.push('📦 Objeto detectado');
                break;
            default:
                entityType = 'default'
                mp.gui.chat.push('📦 Elsseeeeeee');
        }
    } else {
        entityType = 'default';
        mp.gui.chat.push(`⚠ Entidad nativa detectada (handle ${hit.entity})`);
    }

    //TODO -> Mirar si nos interesa actualizar la wheel si es un objeto nativo!!!!
    mp.gui.chat.push(`Send ${entityType}`);
    UIManager.instance.callUI('ui:changeWheelSelector', entityType);
}


export function initializeRaycast() {
  let raycastInterval:number | null = null;
  mp.events.add('client:createRaycast', () => {
    if (raycastInterval !== null) return; // evita duplicados
    mp.gui.chat.push('Start Raycast');
    raycastInterval = setInterval(() => {
        //Implmentar pasar parametros para modificar el raycast
        const hit = raycastFromHand(true);
        if(!hit) return;
        processRaycast(hit);
    }, 10);
  });

  mp.events.add('client:destroyRaycast', () => {
    if(raycastInterval !== null){
        clearInterval(raycastInterval)
        raycastInterval = null;
        mp.gui.chat.push('Stop Raycast');
    }
  });
}