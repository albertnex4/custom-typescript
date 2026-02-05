type TypeCreateWeaponObject = {
    weaponHash: number,
    ammoCount: number,
    position : Vector3
    showWorldModel: boolean,
    scale: number,
    p7: number,
    p8: number,
    p9: number
}

type TypeCreateObject = {
  objectHash: number;
  position: Vector3;
}

//Hacer un ObjectPool???
//O hacer un Pool Generico???
export class WeaponPool {
  //Para eliminar la clase completamente dentro de una funcion propia de la clase
  // const destroy = UIManager.destroyInstance;
  // Promise.resolve().then(() => destroy());

  //SINGLETON
  private static _instance: WeaponPool | null = null;

  /**
   * Solo se creara una sola instancia
   * Una vez generada siempre sera devuelta la misma instancia
   */
  static get instance(): WeaponPool {
      if (!WeaponPool._instance) {
          WeaponPool._instance = new WeaponPool();
      }
      return WeaponPool._instance;
  }

  /* Eliminamos completamanete la clase */
  static destroyInstance() {
      if (WeaponPool._instance) {
          WeaponPool._instance.destroy();
          WeaponPool._instance = null;
      }
  }

  //INSTANCIA SINGLETON
  private poolObjects: Map<number, TypeCreateWeaponObject|TypeCreateObject> =  new Map();
  private poolIds: Set<number> = new Set();

  /* REGISTRO DE EVENTOS */
  private handlerBrowserCreated?: (browser: BrowserMp) => void;
  private handlerBrowserDomReady?: (browser: BrowserMp) => void;
  private handlerBrowserLoadingFailed?: (browser: BrowserMp) => void;


  private constructor() {
      // Guardas handlers
      //this.handlerBrowserCreated = this.onBrowserCreated.bind(this);
      //this.handlerBrowserDomReady = this.onBrowserDomReady.bind(this);
      //this.handlerBrowserLoadingFailed = this.onBrowserLoadingFailed.bind(this);

      // Los registras
      //mp.events.add("browserCreated", this.handlerBrowserCreated);
      //mp.events.add("browserDomReady", this.handlerBrowserDomReady);
      //mp.events.add("browserLoadingFailed", this.handlerBrowserLoadingFailed);
  }

  createWeaponObject(weaponObject: TypeCreateWeaponObject){
    const weaponGameId = mp.game.weapon.createWeaponObject(
        weaponObject.weaponHash,
        weaponObject.ammoCount,
        weaponObject.position.x,weaponObject.position.y,weaponObject.position.z,
        true,
        1,0,0,0
    );
    mp.console.logInfo(`[WeaponPool] createWeaponObject EJECUTADO -> ${weaponGameId}`);

    this.poolIds.add(weaponGameId);
    //TODO -> Mirar si sera util
    this.poolObjects.set(weaponGameId, weaponObject);

    return weaponGameId;
  }

  deleteWeaponObject(weaponGameId:number){
    if(this.poolIds.has(weaponGameId)){
        mp.console.logInfo("[WeaponPool] deleteObject EJECUTADO!");
        mp.game.object.deleteObject(weaponGameId);
        this.poolIds.delete(weaponGameId);
    }
  }

  createObject(object: TypeCreateObject){
    const weaponGameId = mp.game.object.create(object.objectHash, object.position.x, object.position.y, object.position.z, false, true, false);
    mp.console.logInfo(`[WeaponPool Object] createWeaponObject EJECUTADO -> ${weaponGameId}`);

    this.poolIds.add(weaponGameId);
    //TODO -> Mirar si sera util
    this.poolObjects.set(weaponGameId, object);

    return weaponGameId;
  }

  deleteObject(objectGameId:number){
    if(this.poolIds.has(objectGameId)){
        mp.console.logInfo("[WeaponPool Object] deleteObject EJECUTADO!");
        mp.game.object.deleteObject(objectGameId);
        this.poolIds.delete(objectGameId);
    }
  }

  deleteAll(){
    for (const weaponGameId of this.poolIds) {
        mp.console.logInfo("[WeaponPool] deleteObject EJECUTADO!");
        mp.game.object.deleteObject(weaponGameId);
    }
    this.poolIds.clear();
    this.poolObjects.clear();
  }

  removeAll(){
    for (const weaponGameId of this.poolIds) {
        mp.console.logInfo("[WeaponPool] removeWeaponObject EJECUTADO!");
        const weaponObject = this.poolObjects.get(weaponGameId);
        if (weaponObject && "weaponHash" in weaponObject) {
          const weaponModelHash = mp.game.weapon.getWeapontypeModel(Number(weaponObject?.weaponHash));
          if (Number.isInteger(weaponModelHash) && weaponModelHash !== 0 && mp.game.streaming.hasModelLoaded(weaponModelHash)) {
              mp.console.logInfo("[WeaponPool] setModelAsNoLongerNeeded EJECUTADO!");
              mp.game.streaming.setModelAsNoLongerNeeded(weaponModelHash);
          }
        }
    }
    this.poolIds.clear();
    this.poolObjects.clear();
  }

  removeWeaponObject(weaponGameId:number){
    if(this.poolIds.has(weaponGameId)){
        if (Number.isInteger(weaponGameId) && weaponGameId !== 0 && mp.game.streaming.hasModelLoaded(weaponGameId)) {
            mp.console.logInfo("[WeaponPool] setModelAsNoLongerNeeded EJECUTADO!");
            mp.game.streaming.setModelAsNoLongerNeeded(weaponGameId);
        }
    }
  }

  /* Limpiar recursos */
  private destroy(): void {
    //mp.events.remove("browserCreated", this.handlerBrowserCreated);
    //mp.events.remove("browserDomReady", this.handlerBrowserDomReady);
    //mp.events.remove("browserLoadingFailed", this.handlerBrowserLoadingFailed);

    this.deleteAll();
  }

  /* EJEMPLOS DE CREAR EVENTOS REACTIVOS */
  private onBrowserCreated(browser: BrowserMp) {
    mp.console.logInfo("[UIManager] Browser creado!");
  }

  private onBrowserDomReady(browser: BrowserMp) {
    mp.console.logInfo("[UIManager] DOM Ready!");
  }

  private onBrowserLoadingFailed(browser: BrowserMp) {  
    mp.console.logInfo("[UIManager] Error cargando UI");
  }
  /* FIN EVENTOS NAVEGADO */

}





//Blips

type TypeCreateBlip = {
    code: string,
    sprite: number,
    position: Vector3,
    options?: {
        alpha?: number;
        color?: number;
        dimension?: number;
        drawDistance?: number;
        name?: string;
        rotation?: number;
        scale?: number;
        shortRange?: boolean;
    }
}

export class BlipsPool {
  //Para eliminar la clase completamente dentro de una funcion propia de la clase
  // const destroy = UIManager.destroyInstance;
  // Promise.resolve().then(() => destroy());

  //SINGLETON
  private static _instance: BlipsPool | null = null;

  /**
   * Solo se creara una sola instancia
   * Una vez generada siempre sera devuelta la misma instancia
   */
  static get instance(): BlipsPool {
      if (!BlipsPool._instance) {
          BlipsPool._instance = new BlipsPool();
      }
      return BlipsPool._instance;
  }

  /* Eliminamos completamanete la clase */
  static destroyInstance() {
      if (BlipsPool._instance) {
          BlipsPool._instance.destroy();
          BlipsPool._instance = null;
      }
  }

  //INSTANCIA SINGLETON
  private poolObjects: Map<string, BlipMp> =  new Map();


  private constructor() {

  }

  createBlip(blipObject: TypeCreateBlip){

    if(!blipObject){
        blipObject = {
            code: 'default',
            sprite: 60,
            position: new mp.Vector3(427.95, -981.05, 28),
            options: {
                color: 2,
                name: "Default Test",
                shortRange: true,
            }
        }
    }
    const blipMp = mp.blips.new(
        blipObject.sprite,
        blipObject.position,
        blipObject.options
    )

    mp.console.logInfo(`[BlipPool] mp.blips.new EJECUTADO -> ${blipObject.code}`);
    this.poolObjects.set(blipObject.code, blipMp);

    return blipMp.id;
  }

  deleteBlip(code:string){
    if(this.poolObjects.has(code)){
        const blip = this.poolObjects.get(code);
        mp.console.logInfo("[BlipPool] destroy EJECUTADO!");
        blip?.destroy();
        this.poolObjects.delete(code);
    }
  }

  deleteAll(){
    for (const [key, value] of this.poolObjects) {
        mp.console.logInfo("[BlipPool] destroy EJECUTADO!");
        value.destroy();
    }
    this.poolObjects.clear();
  }

  /* Limpiar recursos */
  private destroy(): void {
    //mp.events.remove("browserCreated", this.handlerBrowserCreated);
    //mp.events.remove("browserDomReady", this.handlerBrowserDomReady);
    //mp.events.remove("browserLoadingFailed", this.handlerBrowserLoadingFailed);

    this.deleteAll();
  }

}
