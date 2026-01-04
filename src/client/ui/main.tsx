import React, { useEffect } from 'react'
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

  useGlobalWindowEvents(
    ["toggle-app", "open-app", "close-app"],
    (e) => {
      if (e.type === "toggle-app") toggleVisible();
      if (e.type === "open-app") show();
      if (e.type === "close-app") hide();
    },
    { passive: true },  // opciones del window listener
  );

  return (
    <React.StrictMode>
    <LanguageProvider>
      <div className={`app-container ${visible ? "" : "app-hidden"}`}>
        <HashRouter  basename='/'>
          <App />
        </HashRouter >
      </div>
    </LanguageProvider>
  </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(<Root/>)