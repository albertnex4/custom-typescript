// SideMenu.tsx
import React, { useEffect, useState } from "react";
import "../assets/css/checkpoint.css";
import mp from "../utils/mp-sage";

//TODO -> Igual es mejor pasar a esto!!!
/*
const [selection, setSelection] = useState<{
  index: number | null;
  checkpoint: Checkpoint | null;
}>({
  index: null,
  checkpoint: null,
});
*/

// menuTypes.ts
export type Vector3 = {
  x: number | null;
  y: number | null;
  z: number | null;
};

type CheckpointId = number;

export interface Checkpoint {
  id: CheckpointId;
  position: Vector3;
  scale: number;
  enabled: boolean;
}

//Type de client ragemp
type ScaledPosition = {
  id: number;
  position: Vector3;
  scale: number;
};

type TypeUpdateEvent = {
    positionElement: ScaledPosition; 
    keyPosition:number
}

export const isValidVector = (v: Vector3) =>
  v.x !== null && v.y !== null && v.z !== null;

export const SideMenu: React.FC = () => {
  const [checkpointsMap, setCheckpointsMap] = useState<Map<number, Checkpoint>>(new Map());
  const [checkpointOrder, setCheckpointOrder] = useState<number[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<CheckpointId | null>(null);


  const checkpoints = Array.from(checkpointsMap.values());
  const selected = selectedIndex !== null ? checkpointsMap.get(selectedIndex) : null;

  useEffect(() => {
    mp.trigger("client:initializeColshapes");
    return () => {
      // 🔴 Se ejecuta SOLO al desmontar el componente
      mp.trigger("client:destroyColshapes");
    };
  }, []);
  
  const updateSelected = (data: Partial<Checkpoint>, setIndex?:number) => {
    const index = selectedIndex ?? setIndex;
    if (index === null || index === undefined) return;

    setCheckpointsMap(prev => {
      const map = new Map(prev);
      const current = map.get(index);
      if (!current) return prev;
      map.set(index, { ...current, ...data });
      return map;
    });
  };

  const updateVector = (axis: keyof Vector3, value: number | null) => {
    if (!selected) return;
    updateSelected({
      position: {
        ...selected.position,
        [axis]: value,
      },
    });
  };

  const createCheckpoint = (data?: Partial<Checkpoint>) => {
    const id = data?.id ?? checkpointsMap.size;

    const checkpoint: Checkpoint = {
      id: id,
      position: data?.position ?? { x: null, y: null, z: null },
      scale: data?.scale ?? 3,
      enabled: data?.enabled ?? true,
    };

    setCheckpointsMap(prev => {
      const map = new Map(prev);
      map.set(id, checkpoint);
      return map;
    });

    //Para ordenar implmentar mas adelante
    //setCheckpointOrder(prev => [...prev, id]);
    
    //No dejamos selecionado ningun elemento
    setSelectedIndex(null);
  };

  const updateRacePositionElement = (clientElement:TypeUpdateEvent|string) => {
    try{
      let elementObject:TypeUpdateEvent;
      if(typeof clientElement === "string"){
          elementObject = JSON.parse(clientElement);
      } else {
          elementObject = clientElement;
      }
      setSelectedIndex(elementObject.keyPosition);
      updateSelected(elementObject.positionElement, elementObject.keyPosition);
    }catch(error){
      mp.trigger("client:errorFromUi", "EERRRRRRORORORORORORORORORORO DE UIIIIIIIIIIIII");
    }
  }

  const addRacePositionElement = (positionElement?:ScaledPosition|string, notifyClient:boolean = false) => {
    const data:ScaledPosition =
        typeof positionElement === "string" ? JSON.parse(positionElement) : positionElement;
    let checkpointElement:Checkpoint | undefined;
    if(data){
       checkpointElement = {
        id: data.id,
        position: data.position,
        scale: data.scale,
        enabled: true
      }
    }
    createCheckpoint(checkpointElement);
    if(notifyClient){
      mp.trigger("client:addRacePositionElement", JSON.stringify(positionElement))
    }
  }

  mp.events.add("ui:addRacePositionElement", (position:any) => addRacePositionElement(position));
  mp.events.add("ui:updateRacePositionElement", (clientElement:TypeUpdateEvent) => updateRacePositionElement(clientElement));
  
  (window as any).uiaddRacePositionElement = (position:ScaledPosition) => addRacePositionElement(position);
  (window as any).uiupdateRacePositionElement = (clientElement:TypeUpdateEvent) => updateRacePositionElement(clientElement);


  return (
    <div className="editor-menu">
      <header>
        <span>Editor de Checkpoints</span>
        <button onClick={() => {createCheckpoint()}}>＋</button>
      </header>

      <div className="checkpoint-list">
        {checkpoints.map(cp => (
          <div
            key={cp.id}
            className={`checkpoint-item ${cp.id === selectedIndex ? "active" : ""}`}
            onClick={() => {
                //TODO -> Llamar a la funcion editRacePosition
                if(selectedIndex !== cp.id){
                    setSelectedIndex(cp.id)
                }else{
                    setSelectedIndex(null)
                }
                mp.trigger("client:editModeRacePosition", cp.id)
            }}
          >
            Checkpoint #{cp.id.toString().slice(-4)}
          </div>
        ))}
      </div>

      {selected && (
        <div className="checkpoint-editor">
          <h4>Checkpoint seleccionado : {selected.id}</h4>

         <div className="control-block">
            <label>Posición</label>
            <div className="vector-inputs">
                {(["x", "y", "z"] as const).map(axis => (
                <div className="input-wrapper" key={axis}>
                    <label>{axis.toUpperCase()}</label>
                    <input
                    type="number"
                    placeholder={axis.toUpperCase()}
                    pattern="\d*"
                    onKeyDown={e => {
                        if (e.key === "e" || e.key === "E") e.preventDefault();
                    }}
                    value={selected.position[axis] ?? ""}
                    onChange={e =>
                        updateVector(
                        axis,
                        e.target.value === ""
                            ? null
                            : Number(e.target.value)
                        )
                    }
                    />
                </div>
                ))}
            </div>
          </div>

          {/* Scale */}
          <div className="control-block">
            <label>Radio {selected.scale.toFixed(1)}</label>
            <input
              type="range"
              min={1}
              max={10}
              value={selected.scale}
              onChange={e =>
                updateSelected({ scale: Number(e.target.value) })
              }
            />
          </div>

          {/* Enabled */}
          <div className="control-block checkbox">
            <input
              type="checkbox"
              checked={selected.enabled}
              onChange={e =>
                updateSelected({ enabled: e.target.checked })
              }
            />
            <label>Checkpoint activo</label>
          </div>

          {/* Actions */}
          <div className="actions">
            <button
              disabled={!isValidVector(selected.position)}
              onClick={() =>
                mp.trigger("teleportToCheckpoint", selected.position)
              }
            >
              Teleport
            </button>

            <button
              disabled={!isValidVector(selected.position)}
              onClick={() =>{
                const jsonString = JSON.stringify(
                  {
                    positionElement : {
                      position:selected.position, scale:selected.scale
                    }, 
                    keyPosition: selected.id
                  }
                );
                mp.trigger("client:updateRacePosition", jsonString)
              }}
            >
              Actualizar
            </button>

            <button
              className="danger"
              onClick={() =>{

                setCheckpointsMap(prev => {
                  const copy = new Map(prev);
                  copy.delete(selected.id);
                  return copy;
                });

                mp.trigger("client:deleteRacePosition", selected.id);
              }}
            >
              Eliminar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const RenderRaceCreator = () => {

    return <SideMenu />;

    /*const [godMode, setGodMode] = useState(false);
    const [speed, setSpeed] = useState(1);

    const [teleport, setTeleport] = useState<Vector3>({
      x: null,
      y: null,
      z: null,
    });

    const [checkpointPos, setCheckpointPos] = useState<Vector3>({
      x: null,
      y: null,
      z: null,
    });

    const [scale, setScale] = useState(3);
    const [visible, setVisible] = useState(true);
    const [index, setIndex] = useState(0);

    const items: MenuItem[] = [
    {
        id: "player",
        label: "Jugador",
        controls: [
        {
            type: "checkbox",
            label: "God Mode",
            value: godMode,
            onChange: v => {
            setGodMode(v);
            mp.trigger("toggleGodMode", v);
            },
        },
        {
            type: "number",
            label: "Velocidad movimiento",
            value: speed,
            step: 0.1,
            onChange: v => {
            setSpeed(v);
            mp.trigger("setPlayerSpeed", v);
            },
        },
        {
            type: "button",
            label: "Guardar posición actual",
            large: true,
            onClick: () => mp.trigger("savePlayerPosition"),
        },
        ],
    },

    {
        id: "teleport",
        label: "Teleport rápido",
        controls: [
        {
            type: "vector3",
            label: "Destino",
            value: teleport,
            onChange: setTeleport,
        },
        {
            type: "button",
            label: "Teleportar",
            large: true,
            onClick: () => {
            if (
                teleport.x === null ||
                teleport.y === null ||
                teleport.z === null
            )
                return;

            mp.trigger("teleport", teleport);
            },
        },
        ],
    },

    {
        id: "checkpoint",
        label: "Checkpoint",
        controls: [
        {
            type: "vector3",
            label: "Posición",
            value: checkpointPos,
            onChange: setCheckpointPos,
        },
        {
            type: "number",
            label: "Radio",
            value: scale,
            step: 0.5,
            onChange: setScale,
        },
        {
            type: "checkbox",
            label: "Visible",
            value: visible,
            onChange: setVisible,
        },
        {
            type: "number",
            label: "Índice",
            value: index,
            step: 1,
            onChange: setIndex,
        },
        {
            type: "button",
            label: "Crear checkpoint",
            large: true,
            onClick: () => {
            if (
                checkpointPos.x === null ||
                checkpointPos.y === null ||
                checkpointPos.z === null
            )
                return;

            mp.trigger("createCheckpoint", {
                position: checkpointPos,
                scale,
                visible,
                index,
            });
            },
        },
        {
            type: "button",
            label: "Actualizar seleccionado",
            onClick: () =>
            mp.trigger("updateSelectedCheckpoint", {
                position: checkpointPos,
                scale,
                visible,
            }),
        },
        ],
    },

    {
        id: "race",
        label: "Carrera",
        controls: [
        {
            type: "button",
            label: "Exportar carrera",
            large: true,
            onClick: () => mp.trigger("exportRace"),
        },
        {
            type: "button",
            label: "Limpiar checkpoints",
            onClick: () => mp.trigger("clearCheckpoints"),
        },
        ],
    },
    ];*/
}

