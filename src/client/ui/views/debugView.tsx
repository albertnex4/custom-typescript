import { useState, JSX } from "react";
import mp from "../utils/mp-sage";
import { useNavigate } from "react-router-dom";



export const Debug = () => {
  const navigate = useNavigate();

  type DebugElement = {
    type: string;
    text: string;
    vars: object;
    varsDefault: object;
    inputTypes: [];
    executeFunctionName: string;
    executeFunction: (params:any) => void;
  };

  type TypeInputMap = "text" | "number" | "checkBox" | "color" | "position";
  type RenderInput = (input: any, element: any) => JSX.Element;

  const debugElements: DebugElement[] = [
    {
      type: "spawnVehicle",
      text: "Hacer aparecer un coche",
      vars: {carModel:"text",carColor:"color",carPlate:"text",carPosition:"position", isWorldPosition:"checkBox", setDriftTest:"checkBox"},
      varsDefault: {carModel:"adder",carPosition:[3,3,0], carPlate:"DEFAULT", isWorldPosition:false, setDriftTest:false},
      inputTypes: [],
      executeFunctionName: "debugSpawnVehicle",
      executeFunction: (params) => {
        let values = params.vars;
        values.carPosition = [values.carPosition.positionX ?? 0, values.carPosition.positionY ?? 0, values.carPosition.positionZ ?? 0]
        values.carColor = hexToRgb(values.carColor);
        mp.trigger("debugSpawnVehicle", JSON.stringify(values))
      },
    },
    {
      type: "spawnWeaponObject",
      text: "Hacer aparecer una arma",
      vars: {weaponModel:"text",weaponPosition:"position"},
      varsDefault: {weaponModel:"weapon_sniperrifle",weaponPosition:[3,3,0]},
      inputTypes: [],
      executeFunctionName: "debugSpawnWeaponObject",
      executeFunction: (params) => {
        let values = params.vars;
        values.weaponPosition = [values.weaponPosition.positionX ?? 0, values.weaponPosition.positionY ?? 0, values.weaponPosition.positionZ ?? 0]
        mp.trigger("debugSpawnVehicle", {...values})
      },
    },
    {
      type: "giveWeapon",
      text: "Dar arma a jugador",
      vars: {weaponModel:"text", ammo:"number"},
      varsDefault: {weaponModel:"weapon_sniperrifle",ammo:300},
      inputTypes: [],
      executeFunctionName: "debugGiveWeapon",
      executeFunction: (params) => {},
    },
    {
      type: "wheelSelector",
      text: "Selección de rueda",
      vars: {},
      varsDefault: {},
      inputTypes: [],
      executeFunctionName: "test",
      executeFunction: (params) => {navigate("/wheel");},
    },
    {
      type: "RaycastingTest",
      text: "Test de raycasting",
      vars: {distance:"number", debug:"checkBox", show:"checkBox"},
      varsDefault: {distance:"5", debug:true, show:true},
      inputTypes: [],
      executeFunctionName: "ParaQueQueriaEsto??",
      executeFunction: (params) => {
        let values = params.vars;
        console.log(values);
        if(values.show){
          mp.trigger("client:createRaycast")
        }else{
          mp.trigger("client:destroyRaycast")
        }
      },
    },

  ];

  const [values, setValues] = useState<Record<string, any>>({});

  const layout: React.CSSProperties = {
    width: "100%",
    display: "flex",
    gap: "16px",
    flexWrap : "wrap",
  };

  const cardElement: React.CSSProperties = {
    border: "1px solid black",
  }

  function getInputTypes(element: DebugElement) {
    return (Object.keys(element.vars) as Array<keyof typeof element.vars>).map(
      (name) => ({
        name,
        type: element.vars[name] as TypeInputMap,
      })
    );
  }

  
  function hexToRgb(hex: string): number[] | null {
    if(!hex) return [];
    
    const cleanHex = hex.replace("#", "");

    if (cleanHex.length !== 6) return null;

    const r = parseInt(cleanHex.slice(0, 2), 16);
    const g = parseInt(cleanHex.slice(2, 4), 16);
    const b = parseInt(cleanHex.slice(4, 6), 16);

    return [r, g, b];
  }

  const valuesChange = (e: React.ChangeEvent<HTMLInputElement>, input:any, element:DebugElement) =>{

    let finalValue = null;
    switch(input.type){
        case "position":
            finalValue = {
                [input.name]: {
                    ...values.spawnVehicle?.carPosition,
                    [e.target.name] : Number(e.target.value)
                }
            };
            break;
        case "number":
            finalValue = {[input.name]: Number(e.target.value)};
            break;
        case "checkBox":
            finalValue = {[input.name]: e.target.checked};
            break;
        default:
            finalValue = {[input.name]: e.target.value};

    }

    setValues((prev) => ({
        ...prev,
        [element.type]: {
        ...prev[element.type], // mantener los valores anteriores de este elemento
        ...finalValue},
    }));
  }

  var toggleLock = false;

  function execute(element:DebugElement, strictMode = false){
    if (toggleLock) return;

    openAlert(element, strictMode);    
    toggleLock = true;
    setTimeout(() => (toggleLock = false), 10000); // bloquea brevemente
  }

  
  function openAlert(element:DebugElement, strictMode = false){
    const vars = values[element.type] ?? null;
    //if(!vars) return;

    if(strictMode){
        const allVars = Object.keys(element.vars).length;
        const enterVars = Object.keys(vars).length;

        if(enterVars <= allVars) return ;
    }

    let msg = "Inicio de valores \n";
    for (const key in vars) {
        msg += `${key} : ${vars[key]} \n`;
    }
    

    
    element?.executeFunction({vars : {...element.varsDefault, ...vars}, element: element});
    
    //alert(msg);
  }

  const inputMap:Record<TypeInputMap, RenderInput> = {
    text: (input:any, element:any) => {
        const valueInput = values[element.type]?.[input.name] ?? element.varsDefault?.[input.name];
        return <input type="text" value={valueInput} onChange={(e) => valuesChange(e, input, element)} />
    },
    number: (input:any, element:any) => {
        const valueInput = values[element.type]?.[input.name] ?? element.varsDefault?.[input.name];
        return <input type="number" value={valueInput} onChange={(e) => valuesChange(e, input, element)} />
    },
    checkBox: (input:any, element:any) => {
        const valueInput = values[element.type]?.[input.name] ?? false;
        return <input type="checkbox" name={input.name} value={valueInput} onChange={(e) => valuesChange(e, input, element)} />
    },
    color: (input:any, element:any) => {
        const valueInput = values[element.type]?.[input.name] ?? element.varsDefault?.[input.name];
        return <input type="color" value={valueInput} onChange={(e) => valuesChange(e, input, element)} />
    },
    position: (input:any, element:any) => {
        const valueInputX = values[element.type]?.[input.name]?.["positionX"] ?? element.varsDefault?.[input.name][0];
        const valueInputY = values[element.type]?.[input.name]?.["positionY"] ?? element.varsDefault?.[input.name][1];
        const valueInputZ = values[element.type]?.[input.name]?.["positionZ"] ?? element.varsDefault?.[input.name][2];
        const checkBoxInput = {
            name : "checkBoxPosition",
            type : "checkBox"
        }
        return( 
            <div>
                <label>Position X</label>
                    <input type="number" name="positionX" value={valueInputX} onChange={(e) => valuesChange(e, input, element)} />,
                <label>Position Y</label>
                    <input type="number" name="positionY" value={valueInputY} onChange={(e) => valuesChange(e, input, element)} />,
                <label>Position Z</label>
                    <input type="number" name="positionZ" value={valueInputZ} onChange={(e) => valuesChange(e, input, element)} />,
            </div>
        );
    }
  };


  return (
    <section style={layout}>
      {debugElements.map((element) => (
        <div key={element.type} style={cardElement} >
          <h3>{element.text}</h3>

          {getInputTypes(element).map((input) => (
            <div key={input.name}>
              <label>{input.name}</label>
              {inputMap[input.type]?.(input, element)}
            </div>
          ))}

          <button onClick={() => execute(element, false)}>Ejecutar</button>
        </div>
      ))}
    </section>
  );
}