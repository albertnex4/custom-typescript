import logo from "./assets/logo.png";
import React, { useState, useEffect } from "react";
import mp from "./utils/mp-sage";
import { RichText } from "./components/base/RichText";
import { eventManager } from "../../shared/EventManager";
import { useNavigate } from "react-router-dom";

declare global {
  interface Window {
    updateHudData: (speed: number, health: number) => void;
    receiveAlert: (msg: string) => void;
    execute: (msg: string) => void;
  }
}

export const App = () => {
    const [counter, setCounter] = useState(0);
    const [text, setText] = useState("null");
    const navigate = useNavigate();

    const functionExecuted = (msg:string) => {
        onClickFunction(msg);
        setText("holaa desde window.execute!!");
    };

    //window.execute = (msg: string) => functionExecuted(msg);

    mp.events.add("client:helloWorld", (msg:string) => functionExecuted(msg));

    // Escuchar eventos con EventManager
    useEffect(() => {
        const unsubscribe = eventManager.on("cif:testNew", () => {
            //logger.debug("Evento cif:helloWorld recibido");
            setText("hola des de cliente2222!!");
            
        });

        return () => unsubscribe();
    }, []);

    const handleIncrement = (e: React.MouseEvent<HTMLButtonElement>) => {
        //Para eveitar que se ejecute el evento onClick con el teclado
        if (e.detail === 0) return;
        try {
            //logger.info("Click en botón Enviar evento");
            onClickFunction("ui.welcome");
            setText("holaa boton!!");
            //eventManager.emit("client:helloWorld", "holaaaaa clienttt!!");
        } catch (error) {
            //logger.error("Error en handleIncrement", error as Error);
        }
    }

    /*
    mp.events.add("ui:navigate", (url: string) => {
        navigate(url.replace('#/', '/')); // Quita el # si es necesario
    });
    */
    const changeUrl = () => {
        navigate("/acerca/123"); // react-router hash manejará #/acerca/123
    }
    
    return (
        <div>
            <h1>Hello, React + TypeScript</h1>
            <button onClick={handleIncrement}>Enviar evento a RAGEMP</button>
            <h2>Counter : {text}</h2>
            <img src={logo} alt="Logo" />
            <button onClick={changeUrl}>Navegar a Contacto</button>
            <RichText k="client.vehicle.speed" params={{ speed: "55" }} />
        </div>
    );
};

const onClickFunction = (msg:string) => {
    mp.trigger("client:helloWorld", msg);
};

export const startEvents = () => {
    
    mp.events.add("cif:testNew", () => {
        //mp.trigger("client:helloWorld", "Evento cif dentro de startEvents!");
    });
};


