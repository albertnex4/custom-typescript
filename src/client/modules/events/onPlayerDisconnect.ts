//Añadir todos los eventos a ejecutar cuando se detecta que el jugador se desconecta del servidor
//TODO -> Detectar si el jugador ha salido del juego o ha tenido un problema y se ha cerrado el juego
//Guardar datos locales del jugador en el servidor
//Eliminar ciertos objetos generados para no dejar rastro

import { WeaponPool } from "../weapons/weaponPool";

export function initializeOnPlayerDisconnect() {
    mp.events.add("playerQuit", (player) => {
        mp.gui.chat.push(`Execute playerQuit!!!`);
        //deleteObjects();
        deleteWeapons();
    });
}

export const deleteWeapons = () => {
    WeaponPool.instance.deleteAll();
    WeaponPool.destroyInstance();
}

export const deleteObjects = () => {
    mp.objects.forEach((object) => {
        mp.gui.chat.push(`Execute delte!! : ${object.id}`);
        object.destroy();
    });
}