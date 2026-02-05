export class UIManager {
  //Para eliminar la clase completamente dentro de una funcion propia de la clase
  // const destroy = UIManager.destroyInstance;
  // Promise.resolve().then(() => destroy());

  //SINGLETON
  private static _instance: UIManager | null = null;

  /**
   * Solo se creara una sola instancia
   * Una vez generada siempre sera devuelta la misma instancia
   */
  static get instance(): UIManager {
      if (!UIManager._instance) {
          UIManager._instance = new UIManager();
      }
      return UIManager._instance;
  }

  /* Eliminamos completamanete la clase */
  static destroyInstance() {
      if (UIManager._instance) {
          UIManager._instance.destroy();
          UIManager._instance = null;
      }
  }

  //INSTANCIA SINGLETON
  private browser: BrowserMp | null = null;
  private isDomReady = false;
  private readyResolvers: Array<() => void> = [];

  private isBrowserCreated = false;
  private isShowing = false;
  private observers: Set<(isShowing: boolean) => void> = new Set();
  private readonly UI_URL = "http://package/ui/index.html";
  private actualView:string|null = null;

  /* REGISTRO DE EVENTOS */
  private handlerBrowserCreated: (browser: BrowserMp) => void;
  private handlerBrowserDomReady: (browser: BrowserMp) => void;
  private handlerBrowserLoadingFailed: (browser: BrowserMp) => void;


  private constructor() {
      // Guardas handlers
      this.handlerBrowserCreated = this.onBrowserCreated.bind(this);
      this.handlerBrowserDomReady = this.onBrowserDomReady.bind(this);
      this.handlerBrowserLoadingFailed = this.onBrowserLoadingFailed.bind(this);

      // Los registras
      mp.events.add("browserCreated", this.handlerBrowserCreated);
      mp.events.add("browserDomReady", this.handlerBrowserDomReady);
      mp.events.add("browserLoadingFailed", this.handlerBrowserLoadingFailed);
  }

  /**
 * Espera a que el DOM del navegador esté cargado.
 * Si this.isDomReady siempre es false no se ejecutara nada
 * Ponemos timeout por seguridad 
 * Ejemplo: await UIManager.instance.ready();
 */
  async ready(): Promise<void> {
    return new Promise((resolve, reject) => {
        if (this.isDomReady) return resolve();
        this.readyResolvers.push(resolve);
        setTimeout(() => {
          if (!this.isDomReady){
            mp.console.logInfo("UIManager.ready() timeout: DOM no cargado");
            return reject();
          }
        }, 10000);
    });
  }

  /* Ocultar la UI */
  hide(): void {
    if (!this.isShowing) {
      console.warn("[UIManager] UI ya está oculta");
      return;
    }

    try {
      this.isShowing = false;
      if (this.browser) {
        this.dispatchEvent('close-app');
      }
      mp.gui.cursor.show(false, false);
      this.notifyObservers();
      mp.console.logInfo("[UIManager] UI ocultada");

    } catch (error) {
      console.error("[UIManager] Error al ocultar UI:", error);
    }
  }

  async showAsync(): Promise<void> {
    if (this.isShowing) {
      console.warn("[UIManager] UI ya está visible");
      return;
    }

    try {
      this.isShowing = true;
      if(!this.isBrowserCreated){
        this.browser = mp.browsers.new(this.UI_URL);
        this.isBrowserCreated = true;
        await this.ready(); 
      }

      if(this.actualView !== null){
        this.changeUrl(this.actualView);
      }
      this.dispatchEvent('open-app');
      //TODO -> Desactivar chat
      // Añadir config para poder configurar como se tiene que comporatar cada ui
      // Ejemplo wheel menu desactivar controles de accion (apuntar, disparar, etc)
      // Permitir cursor y movimient
      mp.gui.cursor.show(false, true);
  
      mp.console.logInfo("[UIManager] UI mostrada");
    } catch (error) {
      console.error("[UIManager] Error al mostrar UI:", error);
      this.isShowing = false;
    }
  }

  async toggleAsync(): Promise<void> {
    if(this.isShowing){
      this.hide()
    } else{
      this.showAsync();
    }
  }

  /* Obtener estado actual */
  isVisible(): boolean {
    return this.isShowing;
  }

  /**
   * Ejecutar una función en la UI
   * Ej : uiManager.callUI("client:helloWorld", "ui.welcome"); 
   * Para poder ser llamado es necesario crear un evento mp.events.add en la UI
   * Ej : mp.events.add("client:helloWorld", (msg:string) => functionExecuted(msg));
   */
  callUI(functionName: string, ...args: any[]): void {
    if (!this.browser) {
      console.warn("[UIManager] No hay navegador abierto");
      return;
    }

    try {
      this.browser.call(functionName, ...args);
    } catch (error) {
      console.error(`[UIManager] Error al llamar ${functionName}:`, error);
    }
  }

  //Ejemplos de ejecutar distintas funciones JS de UI
  
  //Ejecutar evento nativo js
  dispatchEvent(eventName: string, params?: Object): void {
    const jsCommand = `window.dispatchEvent(new Event("${eventName}"));`
    this.execute(jsCommand);
  }

  //Modificar la url a partir de window
  changeUrl(url:string, params?: string){
    this.actualView = url;
    if(this.isDomReady){
      const jsCommand = `window.location.hash = "${this.actualView}";`;
      this.execute(jsCommand);
    }
  }

  //Ejecutar funciones establecidas en window por la UI
  dispatchFunctions(functionName: string, data:{info:object,data:object}){
    const jsCommand = `window.${functionName}(${JSON.stringify(data.info)}, ${JSON.stringify(data.data)})`
    this.execute(jsCommand);
  }

  //TODO -> Añadir patron suscripción
  /**
   * Suscribirse a cambios de visibilidad ?? REVISAR!!
   */
  onChange(callback: (isShowing: boolean) => void): () => void {
    this.observers.add(callback);
    return () => this.observers.delete(callback);
  }

  /**
   * Notificar a todos los observadores ?? REVISAR!!
   */
  private notifyObservers(): void {
    this.observers.forEach(callback => {
      try {
        callback(this.isShowing);
      } catch (error) {
        console.error("[UIManager] Error en observador:", error);
      }
    });
  }

  /**
   * Ejecutar una función en la UI
   * Ej : uiManager.execute('window.execute("ui.inventory.title");');
   * Para poder ser llamado es necesario crear una función window.execute en la UI
   * Ej : window.execute = (msg: string) => functionExecuted(msg);
   */
  private execute(jsCode: string, cached:boolean = false): void {
    if (!this.browser) {
      mp.gui.chat.push("[UIManager] No hay navegador abierto");
      //console.warn("[UIManager] No hay navegador abierto");
      return;
    }

    try {
      if(cached){
        this.browser.executeCached(jsCode);
      }else{
        this.browser.execute(jsCode);
      }
    } catch (error) {
      //console.error(`[UIManager] Error al llamar :`, error);
    }
  }

  //Para controlar mejor cuando la UI esta cargada o no
  /* INICIO EVENTOS NAVEGADOR */
  private onBrowserCreated(browser: BrowserMp) {
      if (browser !== this.browser) return;
      mp.console.logInfo("[UIManager] Browser creado!");
  }

  private onBrowserDomReady(browser: BrowserMp) {
    if (browser !== this.browser) return;
    mp.console.logInfo("[UIManager] DOM Ready!");

    this.isDomReady = true;
    this.resolveReady();
  }

  private onBrowserLoadingFailed(browser: BrowserMp) {
      if (browser !== this.browser) return;
      mp.console.logInfo("[UIManager] Error cargando UI");
  }
  /* FIN EVENTOS NAVEGADO */

  private resolveReady() {
    this.readyResolvers.forEach(fn => fn());
    this.readyResolvers = [];
  }

  /* Limpiar recursos */
  destroy(): void {
    mp.events.remove("browserCreated", this.handlerBrowserCreated);
    mp.events.remove("browserDomReady", this.handlerBrowserDomReady);
    mp.events.remove("browserLoadingFailed", this.handlerBrowserLoadingFailed);

    // Destruir browser
    if (this.browser) {
        this.browser.destroy();
        this.browser = null;
    }
    this.isShowing = false;
    this.isDomReady = false;
    this.readyResolvers = [];
    this.observers.clear();
  }


}

// Singleton
//export const uiManager = new UIManager();
