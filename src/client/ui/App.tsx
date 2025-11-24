import logo from "./assets/logo.png";
import React, { useState } from "react";
import mp from "./utils/mp-sage";

export const App = () => {

    const [counter, setCounter] = useState(0);
    const [text, setText] = useState("null");

    const handleIncrement = () => {
        onClickFunction();
        setText("holaa boton!!");
    }

    mp.events.add("cif:helloWorld", () => {
        setText("hola des de cliente!!");
        mp.trigger("client:helloWorld", "Abrimos CIF React!!");
    });
    
    return (
        <div>
            <h1>Hello, React + TypeScript</h1>
            <button onClick={handleIncrement}>Enviar evento a RAGEMP</button>
            <h2>Counter : {text}</h2>
            <img src={logo} alt="Logo" />
        </div>
    );
};

const onClickFunction = () => {
    mp.trigger("client:helloWorld", "Hola desde la UI de React!");
};

export const startEvents = () => {
    
    mp.events.add("cif:helloWorld2", () => {
        mp.trigger("client:helloWorld", "Evento cif dentro de startEvents!");
    });
};


