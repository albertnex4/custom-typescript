import React, { useEffect, useMemo, useRef, useState } from 'react';
import "../assets/css/wheelSelector.css";
import { motion, AnimatePresence } from "motion/react"
import * as Icons from '../assets/svg';
import mp from '../utils/mp-sage';

export type ActionItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  onSelect?: () => void;
  notFilled?: boolean | null;
  fillPercentage?: number | null;
  subActions?: ActionItem[]; // Opciones hijas
};

const actions: ActionItem[] = [
  { id: 'wifi', label: 'Wi‑Fi', icon: <Icons.Wifi />, subActions: [
    { id: 'wifi-on', label: 'Encender', icon: <Icons.Wifi />, onSelect: () => console.log("WiFi ON") },
    { id: 'wifi-off', label: 'Apagar', icon: <Icons.Wifi />, onSelect: () => console.log("WiFi OFF") },
  ]},
  { id: 'airplane', label: 'Airplane', icon: <Icons.Airplane />, onSelect: () => console.log('Airplane mode') },
  { id: 'bluetooth', label: 'Bluetooth', icon: <Icons.Bluetooth />, notFilled: true, subActions: [
    { id: 'bt-1', label: 'Auriculares', icon: <Icons.Bluetooth />, onSelect: () => {} },
    { id: 'bt-2', label: 'Teclado', icon: <Icons.Bluetooth />, onSelect: () => {} },
  ]},
  { id: 'location', label: 'Location', icon: <Icons.Location />, onSelect: () => console.log('Location selected') },
  { id: 'sound', label: 'Sound', icon: <Icons.Sound />, fillPercentage: 75, subActions: [
    { id: 'vol-up', label: 'Subir', icon: <Icons.Sound />, onSelect: () => {} },
    { id: 'vol-down', label: 'Bajar', icon: <Icons.Sound />, onSelect: () => {} },
    { id: 'mute', label: 'Silencio', icon: <Icons.Sound />, onSelect: () => {} },
  ]},
  { id: 'brightness', label: 'Brightness', icon: <Icons.Brightness />, onSelect: () => console.log('Brightness selected') },
  { id: 'call', label: 'Call', icon: <Icons.Call />, onSelect: () => console.log('Call selected'), subActions: [
    { id: 'answer', label: 'Answer', icon: <Icons.Call />, onSelect: () => console.log('Answering call') },
    { id: 'decline', label: 'Decline', icon: <Icons.Call />, onSelect: () => console.log('Declining call') },
  ]},
  { id: 'message', label: 'Message', icon: <Icons.Message />, onSelect: () => console.log('Message selected') },
];

const defaultActions: ActionItem[] = [
  { id: 'wifi', label: 'Wi‑Fi', icon: <Icons.Wifi />, subActions: [
    { id: 'wifi-on', label: 'Encender', icon: <Icons.Wifi />, onSelect: () => console.log("WiFi ON") },
    { id: 'wifi-off', label: 'Apagar', icon: <Icons.Wifi />, onSelect: () => console.log("WiFi OFF") },
  ]},
  { id: 'airplane', label: 'Airplane', icon: <Icons.Airplane />, onSelect: () => console.log('Airplane mode') },
  { id: 'bluetooth', label: 'Bluetooth', icon: <Icons.Bluetooth />, notFilled: true, subActions: [
    { id: 'bt-1', label: 'Auriculares', icon: <Icons.Bluetooth />, onSelect: () => {} },
    { id: 'bt-2', label: 'Teclado', icon: <Icons.Bluetooth />, onSelect: () => {} },
  ]},
  { id: 'location', label: 'Location', icon: <Icons.Location />, onSelect: () => console.log('Location selected') },
];

const vehicleActions: ActionItem[] = [
  {
    id: 'engine',
    label: 'Motor',
    icon: <Icons.Engine />,
    subActions: [
      { id: 'engine-on', label: 'Encender', icon: <Icons.Engine />, onSelect: () => console.log('Engine ON') },
      { id: 'engine-off', label: 'Apagar', icon: <Icons.Engine />, onSelect: () => console.log('Engine OFF') },
    ],
  },
  {
    id: 'gear',
    label: 'Gear',
    icon: <Icons.Gear />,
  },
  {
    id: 'doors',
    label: 'Puertas',
    icon: <Icons.CarDoor />,
    subActions: [
      { id: 'lock', label: 'Bloquear', icon: <Icons.Lock />, onSelect: () => console.log('Doors Locked') },
      { id: 'unlock', label: 'Desbloquear', icon: <Icons.Unlock />, onSelect: () => console.log('Doors Unlocked') },
    ],
  },
  {
    id: 'lights',
    label: 'Luces',
    icon: <Icons.Lights />,
    subActions: [
      { id: 'lights-on', label: 'Encender', icon: <Icons.Lights />, onSelect: () => {} },
      { id: 'lights-off', label: 'Apagar', icon: <Icons.Lights />, onSelect: () => {} },
    ],
  },
  {
    id: 'climate',
    label: 'Clima',
    icon: <Icons.Climate />,
    fillPercentage: 65,
    subActions: [
      { id: 'temp-up', label: 'Subir', icon: <Icons.Climate />, onSelect: () => {} },
      { id: 'temp-down', label: 'Bajar', icon: <Icons.Climate />, onSelect: () => {} },
    ],
  },
  {
    id: 'horn',
    label: 'Claxon',
    icon: <Icons.Horn />,
    onSelect: () => console.log('Horn pressed'),
  },
  {
    id: 'location',
    label: 'Ubicación',
    icon: <Icons.CarLocation />,
    onSelect: () => console.log('Vehicle location'),
  },
  {
    id: 'fuel',
    label: 'Combustible',
    icon: <Icons.Fuel />,
    fillPercentage: 40,
  },
];



const WheelSelector: React.FC = () => {
  const [open, setOpen] = useState(true);
  //const [actions, setActions] = useState<ActionItem[]>(defaultActions);
  const [text ,setText] = useState<string>("No data");

  return (
    <div className="wheel-hub">
      <h1>Radial Menu — Demo (Gamepad + Mouse)</h1>
      <p>Open a gamepad and move the left joystick / dpad to navigate; press A / button 0 to select.</p>
      <p>{text}</p>
      <div style={{ width: 520, height: 520 }}>
        <RadialMenu open={open} onClose={() => setOpen(false)} />
      </div>
      <div style={{ marginTop: 18 }}>
        <button onClick={() => setOpen(o => !o)}>{open ? 'Hide' : 'Show'} Menu</button>
      </div>
    </div>
  );
};

/* ===================== src/geometry.ts ===================== */
export const degToRad = (deg: number) => (deg * Math.PI) / 180;

export function describeDonutSlice(cx: number, cy: number, innerR: number, outerR: number, startAngle: number, endAngle: number) {
  const largeArc = endAngle - startAngle <= 180 ? '0' : '1';
  const startOuterX = cx + outerR * Math.cos(degToRad(startAngle));
  const startOuterY = cy + outerR * Math.sin(degToRad(startAngle));
  const endOuterX = cx + outerR * Math.cos(degToRad(endAngle));
  const endOuterY = cy + outerR * Math.sin(degToRad(endAngle));
  const startInnerX = cx + innerR * Math.cos(degToRad(endAngle));
  const startInnerY = cy + innerR * Math.sin(degToRad(endAngle));
  const endInnerX = cx + innerR * Math.cos(degToRad(startAngle));
  const endInnerY = cy + innerR * Math.sin(degToRad(startAngle));

  return `M ${startOuterX} ${startOuterY} A ${outerR} ${outerR} 0 ${largeArc} 1 ${endOuterX} ${endOuterY} L ${startInnerX} ${startInnerY} A ${innerR} ${innerR} 0 ${largeArc} 0 ${endInnerX} ${endInnerY} Z`;
}

type Props = {
  //actions: ActionItem[];
  open?: boolean;
  onClose?: () => void;
};

//const GAMEPAD_POLL_MS = 16; // ~60fps
const GAMEPAD_POLL_MS = 50;
const STICK_DEADZONE = 0.4;

function useGamepadNavigation(count: number, enabled: boolean) {
  const [index, setIndex] = useState<number | null>(null);
  const lastMoveRef = useRef(0);
  const lastButtonSelectRef = useRef(false);
  const lastButtonBackRef = useRef(false);

   let raf = 0;

      function poll() {
      const gps = navigator.getGamepads ? navigator.getGamepads() : [];
      const gp = gps[0];
      if (gp) {
        const now = performance.now();
        // axes: left stick usually 0 (x),1(y)
        const ax = gp.axes[0] ?? 0;
        const ay = gp.axes[1] ?? 0;

        if (Math.abs(ax) > STICK_DEADZONE || Math.abs(ay) > STICK_DEADZONE) {
          if (now - lastMoveRef.current > 120) {
            // determine angle from stick
            const angle = Math.atan2(ay, ax) * (180 / Math.PI); // -180..180
            // convert to 0..360 and match radial index
            const ang360 = (angle + 90 + 360) % 360; // rotate so up is 0
            const sector = Math.floor((ang360 / 360) * count) % count;
            setIndex(sector);
            lastMoveRef.current = now;
          }
        }

         // Botón A / X (Seleccionar)
        const pressedA = gp.buttons[0]?.pressed;
        if (pressedA && !lastButtonSelectRef.current) {
          window.dispatchEvent(new CustomEvent('gamepad-select'));
        }
        lastButtonSelectRef.current = !!pressedA;

        // Botón B / Círculo (Atrás)
        const pressedB = gp.buttons[1]?.pressed;
        if (pressedB && !lastButtonBackRef.current) {
          window.dispatchEvent(new CustomEvent('gamepad-back'));
        }
        lastButtonBackRef.current = !!pressedB;
      }

      //raf = requestAnimationFrame(poll);
    }

  useEffect(() => {

    let raf = 0;
    const intervalTest = setInterval(() => {
        raf = requestAnimationFrame(poll);
    }, GAMEPAD_POLL_MS);

    if (!enabled) {
      clearInterval(intervalTest);
      return;
    }

    return () =>{
      clearInterval(intervalTest);
      cancelAnimationFrame(raf);
    }; 
  }, [count, enabled]);

  return [index, setIndex] as const;
}

type InputState = {
    hovered: number | null;
    gpIndex: number | null;
    lastInputVal: number | null;
    lastInputRef: 'mouse' | 'gamepad' | null;
};

type HoveredState = {
  old: number | null;
  actual: number | null;
};

const MAX_ANGLE = 360;

const RadialMenu: React.FC<Props> = ({ open = true, onClose }) => {
  const [currentMenu, setCurrentMenu] = useState<ActionItem[]>(vehicleActions);
  //const currentMenu = currentMenuTest !== null ? currentMenuTest : actions;
  const [history, setHistory] = useState<ActionItem[][]>([]);
  const [hovered, setHovered] = useState<HoveredState>({
    old: null,
    actual: null,
  });
  
  const count = currentMenu.length;
  const angleTest = MAX_ANGLE / count;
  const anglePer = useRef<number>(angleTest);
  if(anglePer.current !== angleTest){
    anglePer.current = angleTest;
  }

  const [gpIndex] = useGamepadNavigation(count, open);
  const radiusOuter = 200;
  const radiusInner = 120;
  const size = (radiusOuter + 20) * 2;
  const center = size / 2;

  if(hovered.old !== null && history.length > 0){
    const lastHisory = history[history.length - 1];
    const { fillPercentage, notFilled } = lastHisory[hovered.old];
    if(notFilled){
        anglePer.current = MAX_ANGLE / lastHisory.length;
    }
    else if(fillPercentage !== null && fillPercentage !== undefined){
        let angle = !notFilled ? MAX_ANGLE : fillPercentage;
        anglePer.current = angle - (fillPercentage / 100 * MAX_ANGLE);
    }
    else{
        anglePer.current = MAX_ANGLE / count;
    }
  }
  
  const inputState = useRef<InputState>({
    hovered: null,
    gpIndex: null,
    lastInputVal: null,
    lastInputRef: null,
  });
  const lastInputRef = useRef<'mouse' | 'gamepad' | null>(null);

  const handleAction = (item: ActionItem) => {
    if (item.subActions) {
      // Si tiene sub-acciones, guardamos el menú actual en el historial y entramos
      setHistory(prev => [...prev, currentMenu]);
      setCurrentMenu(item.subActions);

      setHovered(prev => ({
        old: prev.actual,
        actual: null
     }));


    } else if (item.onSelect) {
      item.onSelect();
    }
  };

  const goBack = () => {
    if (history.length > 0) {
      const prevMenu = history[history.length - 1];
      anglePer.current = 360 / prevMenu.length;
      setHistory(prev => prev.slice(0, -1));
      setCurrentMenu(prevMenu);
      setHovered(prev => ({
        old: null,
        actual: null
     }));
    }
  };

  useEffect(() => {
  // @ts-ignore
  window.ui = {
    setWheelActions: (data : string) => {
      switch (data) {
      case 'vehicle':
        setCurrentMenu(vehicleActions);
        break;
      case 'ped':
      case 'object':
        setCurrentMenu(actions);
        break;
      default:
        setCurrentMenu(defaultActions);
    }
    },
  };

  return () => {
    // @ts-ignore
    delete window.ui;
  };
}, []);


  mp.events.add("ui:changeWheelSelector", (data:string) => {
    //setText(`Enter data!!!! ${data}`);
    //const finalData = JSON.parse(data);
    //const info = finalData.info;
    let wheelActions = null;
  
    switch (data) {
      case 'vehicle':
        setCurrentMenu(vehicleActions);
        break;
      case 'ped':
      case 'object':
        setCurrentMenu(actions);
        break;
      default:
        setCurrentMenu(defaultActions);
    }

  });

  const slices = useMemo(() => {
    return currentMenu.map((a, i) => {
      const angle = anglePer.current;
      const start = i * angle - 90;
      const end = start + angle;
      const mid = start + angle / 2;
      const midRad = degToRad(mid);
      const iconR = (radiusInner + radiusOuter) / 2;
      const fillPercentage = a.fillPercentage || null;
      const notFilled = a.notFilled || null;
      return { 
        item: a, 
        index: i, 
        path: describeDonutSlice(center, center, radiusInner, radiusOuter, start, end),
        iconX: center + Math.cos(midRad) * iconR,
        iconY: center + Math.sin(midRad) * iconR ,
        fillPercentage : fillPercentage,
        notFilled : notFilled,
      };
    });
  }, [currentMenu, center]);
  
  
  useEffect(() => {
    function handler() {
      let idx = null;
      if (gpIndex != null) {
        idx = gpIndex;
      } 
      if (idx != null){
        console.log(slices);
        slices[idx] && handleAction(slices[idx].item);
      } 
    }
    if(hovered.actual !== gpIndex && slices[gpIndex!]){
        console.log(gpIndex);
        setHovered(prev => ({
          old: prev.actual,
          actual: gpIndex
        }));
    }
    window.addEventListener('gamepad-select', handler as EventListener);
    window.addEventListener('gamepad-back', goBack)
    return () => {
        window.removeEventListener('gamepad-select', handler as EventListener);
        window.removeEventListener('gamepad-back', goBack);
    }
  }, [gpIndex]);  

  if (!open) return null;

  return (
    <div className="radial-root" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Círculo de fondo central (Botón Atrás) */}
        <circle 
          cx={center} cy={center} r={radiusInner - 5} 
          fill="white" 
          onClick={goBack}
          style={{ cursor: history.length > 0 ? 'pointer' : 'default', fill: 'transparent' }}
        />
        
        <text 
          x={center} y={center + 5} 
          textAnchor="middle" 
          style={{ fontSize: 12, pointerEvents: 'none', fontWeight: 'bold' }}
        >
          {history.length > 0 ? "VOLVER" : hovered.actual ? currentMenu[hovered.actual]?.label : "SETTINGS"}
        </text>

        <AnimatePresence mode="wait">
          <motion.g 
            key={currentMenu[0]?.id} // Trigger animación al cambiar menú
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            {slices.map((s) => (
              <g key={s.item.id}>
                <motion.path
                  d={s.path}
                  fill={hovered.actual === s.index ? '#19B5FE' : '#dcdcdc'}
                  stroke="#fff"
                  strokeWidth={2}
                  onMouseEnter={() => setHovered(prev => ({ ...prev, actual: s.index }))}
                  onClick={() => handleAction(s.item)}
                  style={{ cursor: 'pointer' }}
                />
                <g transform={`translate(${s.iconX - 14}, ${s.iconY - 14})`} style={{ pointerEvents: 'none' }}>
                  {s.item.icon}
                </g>
              </g>
            ))}
          </motion.g>
        </AnimatePresence>
      </svg>
      <div style={{ position: 'absolute', left: 12, bottom: 12, fontSize: 13, color: '#666' }}>
        {hovered.actual != null && currentMenu[hovered.actual] ? `Selected: ${currentMenu[hovered.actual].label}` : 'No selection'}
      </div>
    </div>
  );
};

export default WheelSelector;