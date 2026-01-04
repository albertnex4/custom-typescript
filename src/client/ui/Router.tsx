import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import { useGlobalWindowEvents } from "./hooks/useGlobalWindowEvents";
import { create } from "zustand";
import { App as AppTest } from "./App";
import { WeaponData } from "../../shared/types/weaponTypes";
import { useState } from "react";
import { Debug } from "./views/debugView";
import WheelSelector from "./views/wheelSelector";


declare global {
  interface Window {
    setData: (info: object, data: WeaponData) => void;
  }
}

interface UIState {
  visible: boolean;
  toggleVisible: () => void;
  show: () => void;
  hide: () => void;
}

export const useUIStore = create<UIState>((set) => ({
    //Para dev visible true
  visible: true,
  toggleVisible: () => set((s) => ({ visible: !s.visible })),
  show: () => set({ visible: true }),
  hide: () => set({ visible: false }),
}));

export const App = () => {
   return (
    <div>
      <h1>Navegación con BrowserRouter</h1>

      <Routes>
        <Route path="/" element={<AppTest />} />
        <Route path="/wheel" element={<WheelSelector />} />
        <Route path="/acerca/:param?" element={<Acerca />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/debug" element={<Debug />} />

        {/* Ruta default */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

function Inicio() {
  return <h2>Página de Inicio</h2>;
}

interface ShopState {
    loaded: boolean;
    loadedData: boolean;
    data: WeaponData|null;
    type: string|null;

    setData: (info:any,data:WeaponData) => void;

}

const useShop = create<ShopState>((set) => ({
    loaded: false,
    loadedData: false,
    data: null,
    type: null,

    setData: (info:any, data:WeaponData) => set(() => {
        info.loaded = true;
        info.loadedData = true;
        return {data : data, ...info}
    })
}));

const Acerca = () => {
  //Para gestionar los params crear un custom hook 
  const globalStore = useShop((s) => s);
  const { param } = useParams();  
  const navigate = useNavigate();
  const setData = useShop((s) => s.setData);
  const data = useShop((s) => s.data);
  const loadedData = useShop((s) => s.loadedData);
  const [text, setText] = useState("Default");

  /*window.setData = (info, data:WeaponData) => {
    setData(info,data);
  }*/

  mp.events.add("ui:setData", (data:string) => {
    setText("Datos recividos!!!");
    const finalData = JSON.parse(data);
    const info = finalData.info;
    const gameData:WeaponData = finalData.data;
    //setText(info.type);
    setData(info,gameData);
  });

  //Se puede navegar 
  // Con navigate de react router (mantiene un historial)
  // Con window.location.hash lo puede ejecutar cualquier js
  const goHome = () => {
    navigate("/"); // react-router hash manejará #/acerca/123
  };

  return(
    <>
        {loadedData && data &&<h2>{data.Description}</h2>}
        <h2>Acerca {param ? `de ID: ${param}` : ""}</h2>
        {text && <h2>{text}</h2>}
        {globalStore.type && <h2>{globalStore.type}</h2>}
        <button onClick={goHome}>Ir a Acerca</button>
    </>
  ) ;
}

function Contacto() {
  return <h2>Contacto</h2>;
}

function NotFound(){
    return <h2>404 NOT FOUND!!</h2>;
}


//Para hacer botones se esten bloqueados un tiempo
/*const toggleVisibleSafe = () => {
  if (toggleLock) return;
  toggleLock = true;
  useUIStore.setState((s) => ({ visible: !s.visible }));
  setTimeout(() => (toggleLock = false), 50); // bloquea brevemente
};*/
