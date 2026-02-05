import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
//import { App } from './App'
import { useGlobalWindowEvents } from "./hooks/useGlobalWindowEvents";
import { App, useUIStore } from './Router'
import { LanguageProvider } from './contexts/LanguageContext'
import { HashRouter , BrowserRouter } from 'react-router-dom'
import './styles.css'

const Root = () =>{
  const visible = useUIStore((s) => s.visible);
  const toggleVisible = useUIStore((s) => s.toggleVisible);
  const show = useUIStore((s) => s.show);
  const hide = useUIStore((s) => s.hide);
  const [firstLoad, setFirstLoad] = useState(true);

  //Mejorar para no usar dispatch para interactuar con ragemp
  //Crear mejor un evento mp.events.add!!!
  /*
  mp.events.add("ui:systemEvent", (eventName: string, data?: any) => {
    switch(eventName) {
        case "open-app":
            show();
            break;
        case "close-app":
            hide();
            break;
        case "toggle-app":
            toggleVisible();
            break;
        default:
            console.warn("Unknown system event:", eventName);
    }
  });
*/
  useGlobalWindowEvents(
    ["toggle-app", "open-app", "close-app"],
    (e) => {
      if (e.type === "toggle-app") toggleVisible();
      if (e.type === "open-app") show();
      if (e.type === "close-app") hide();
    },
    { passive: true },  // opciones del window listener
  );

  useEffect(() => {
    // después del primer render, desactivamos la clase
    setFirstLoad(false);
  }, []);

  //TODO -> Revisar si la clase problems!!
  const className = `app-container ${!visible ? "app-hidden" : ""} ${firstLoad ? "problems" : ""}`;

  return (
    <React.StrictMode>
    <LanguageProvider>
      <div className={className}>
        <HashRouter  basename='/'>
          <App />
        </HashRouter >
      </div>
    </LanguageProvider>
  </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(<Root/>)