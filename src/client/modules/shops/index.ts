//Gestionara que tienda se muestra en el cliente
//Inicializara los eventos de la tienda selecionada
//Al acceder a la tienda activara los eventos y al salir de la tienda los desactivara

export function initializeShopsModule() {

    //Registraremos los eventos para poder gestionar las tiendas
    //Estos eventos activaran/desactivaran los eventos de la tienda
    mp.events.add("createShopVehicle", () => {
        mp.gui.chat.push("Inicializado módulo de tienda Vehiculos.");
    });
    mp.events.add("destroyShopVehicle", () => {
        mp.gui.chat.push("Eliminando módulo de tienda Vehiculos.");
    });
}