import { useEffect, useState } from "react";
import '../assets/css/speedometer.css'
import "../assets/css/speed_icon.css";
import "../assets/css/hud_data.css";
import "../assets/css/other.css";
import mp from '../utils/mp-sage';

const DEF_SPEED = 504.295;
const DEF_FUEL = 208.896;
const DEF_HEAL = 118.296;

// límites reales
//const maxSpeed = 280;
const MAX_FUEL = 100;
const MAX_HEAL = 100;

type TypeSpeedometerProps = {
  maxSpeed: number,
  actualSpeed: number,
  vehicleFuel: number,
  vehicleHeal: number
};


export const Speedometer = () => {
  // valores visibles por defecto (IMPORTANTE)
  const [active, setActive] = useState(false);
  const [maxSpeed, setMaxSpeed] = useState(0);
  const [speed, setSpeed] = useState(25);
  const [speedText, setSpeedText] = useState(25);
  const [fuelText, setFuelText] = useState(100);
  const [fuel, setFuel] = useState(100);
  const [healText, setHealText] = useState(100);
  const [heal, setHeal] = useState(100);

  const clamp = (v: number, max: number) => Math.min(Math.max(v, 0), max);

  const speedStroke = clamp(speed, maxSpeed) / maxSpeed * DEF_SPEED;

  const fuelStroke = clamp(fuel, MAX_FUEL) / MAX_FUEL * DEF_FUEL;

  const healStroke = clamp(heal, MAX_HEAL) / MAX_HEAL * DEF_HEAL;

  //Pagina para modificar svg -> https://boxy-svg.com/app

const showSpeedometer = (props: any) => {
  const finalData = JSON.parse(props);
  setMaxSpeed(finalData.maxSpeed);
  setFuel(finalData.vehicleFuel);
  setFuelText(finalData.maxSpeed);
  setHeal(finalData.vehicleHeal);
  setHealText(finalData.maxSpeed);
  setActive(true);
};

const updateSpeedometer = (props: any) => {
  const finalData = JSON.parse(props);
  setSpeed(finalData.actualSpeed);
  setSpeedText(finalData.actualSpeed);
  setFuel(finalData.vehicleFuel);
  setFuelText(finalData.vehicleFuel);
  setHeal(finalData.vehicleHeal);
  setHealText(finalData.vehicleHeal);
};

const hideSpeedometer = () => {
  setActive(false);
};

useEffect(() => {
  (window as any).uiShowSpeedometer = showSpeedometer;
  (window as any).uiUpdateSpeedometer = updateSpeedometer;
  (window as any).uiHideSpeedometer = hideSpeedometer;
  mp.events.add("ui:showSpeedometer", showSpeedometer);
  mp.events.add("ui:updateSpeedometer", updateSpeedometer);
  mp.events.add("ui:hideSpeedometer", hideSpeedometer);

  return () => {
    mp.events.remove("ui:showSpeedometer", showSpeedometer);
    mp.events.remove("ui:updateSpeedometer", updateSpeedometer);
    mp.events.remove("ui:hideSpeedometer", hideSpeedometer);
    delete (window as any).uiShowSpeedometer;
    delete (window as any).uiUpdateSpeedometer;
    delete (window as any).uiHideSpeedometer;
  };
}, []);

  if(active === false){
    return <></>;
  }

  return (
    <div style={{  minHeight: "calc(100vh - 18px)" }}>
      {/* HUD */}
      <div className="hud-right-bot">
        <div className="hud-speedometer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="300"
            height="250"
            viewBox="-4 -10 275 214"
          >
            {/* ENGINE */}
            <g>
                <path
                    fill="none"
                    stroke="white"
                    strokeWidth="1vh"
                    d="M17.319,170.926 C-0.528,135.060 -1.246,92.839 15.164,56.462"
                    style={{
                        strokeDasharray: `${healStroke} ${DEF_HEAL - healStroke}`,
                        strokeDashoffset: DEF_HEAL,
                    }}
                />
                <defs>
                    <path
                        id="engine-text-path"
                        d="M 17.319 170.926 C -0.528 135.06 -1.246 92.839 15.164 56.462 C 31.574 20.085 60.292 1.306 60.292 1.306"
                    />
                </defs>
                <text fill="white" fontSize="15" x="10" y="100" >
                    <textPath
                        href="#engine-text-path"
                        startOffset="75%"
                        textAnchor="middle"
                    >
                        {Math.round(heal)}%
                    </textPath>
                </text>
            </g>

            {/* FUEL */}
            <g 
                id="fuel-arc"
                stroke="#fa6f71"
                fill="#fa6f71"
                >
                <path
                    fill="none"
                    strokeWidth="1vh"
                    d="M224.989,204.006 C276.978,152.089 276.978,67.914 224.989,15.997"
                    style={{
                        strokeDasharray: `${fuelStroke} ${DEF_FUEL - fuelStroke}`,
                        strokeDashoffset: DEF_FUEL,
                    }}
                />
                <path 
                    d="M453.351,241.312v-5.443a1.87,1.87,0,0,0-.279-.947,21.322,21.322,0,0,0-2.013-2.783c-.578-.729-1.175-1.439-1.772-2.139l-.1-.114a.341.341,0,0,0-.549,0,.56.56,0,0,0,0,.672c.433.5.867,1.013,1.291,1.533l.395.473v3.161a.707.707,0,0,0,.048.322c0,.057.077.114.106.17l.318.473,1.06,1.6.722,1.089v5.206h0v.085a1.455,1.455,0,0,1,0,.218,1.086,1.086,0,0,1-.048.189v.057h0v.066l-.087.18a.348.348,0,0,1-.048.1c0,.047-.067.1,0,0l-.135.18-.067.076h0l-.173.142a.517.517,0,0,0-.1.057h-.058l-.221.076h-.212a1.385,1.385,0,0,1-.279,0h-.164l-.2-.066h0a.4.4,0,0,1-.327.095.564.564,0,0,1-.154-.114c-.029-.047.067.076,0,0h0l-.077-.095-.048-.066h0c0-.057-.067-.114-.1-.18a1.357,1.357,0,0,1-.067-.18h0v-.095a1.553,1.553,0,0,0-.087-.35c-.029-.114,0-.1,0-.161h0V240.99a3.884,3.884,0,0,0-.048-.672,2.236,2.236,0,0,0-.819-1.382,2.5,2.5,0,0,0-1.6-.341v-8.519a.874.874,0,0,0-.771-.947h-8.389a.884.884,0,0,0-.78.947v17.511H436.4v1.543h12.136v-1.543h-1.088v-8.168h.809l.231.076h.125s.144.076.164.133-.067-.076,0,0h0l.048.066.058.076h0c0,.1.1.2.135.3a.129.129,0,0,1,0,.057v.265h0v3.966a3.9,3.9,0,0,0,.482,1.685,1.741,1.741,0,0,0,1.531,1.1,2.107,2.107,0,0,0,1.926-1.06,3.566,3.566,0,0,0,.443-1.779C453.351,243.262,453.351,242.258,453.351,241.312Zm-7.195-4.354a.58.58,0,0,1-.51.634h-6.357a.58.58,0,0,1-.51-.634v-5.386a.58.58,0,0,1,.51-.634h6.357a.58.58,0,0,1,.51.634ZM449.142,240.621Zm3.294,4.562v-.057s-.048.019-.048.038Zm.144-9.408v2.1l-1.329-2.007-.154-.227v-2.111c.337.435.665.88.963,1.354l.193.284v.066a1.02,1.02,0,0,1,.077.142c0,.076.087.151.125.227l.048.1h0v.057h0Z" 
                    transform="translate(-142 -13) scale(0.9)"
                />
            </g>
            
            {/* SPEED */}
            <path
              fill="none"
              stroke="rgb(255, 232, 19)"
              strokeWidth="1vh"
              d="M60.340,185.660
                 C18.553,143.874 18.553,76.126 60.340,34.340
                 C102.126,-7.447 169.874,-7.447 211.660,34.340
                 C253.446,76.126 253.446,143.874 211.660,185.660"
              style={{
                strokeDasharray: `${speedStroke} ${DEF_SPEED - speedStroke}`,
                strokeDashoffset: DEF_SPEED,
              }}
            />
          </svg>

          <div className="hud-speed-text">
            <span>{speed}</span>
            <p>km/h</p>
          </div>

          
        </div>
      </div>

      {/* CONTROLES (EVENTOS) */}
      <div style={{ padding: 20, color: "white" }}>
        <h3>Debug Controls</h3>

        <div>
          <label>Original Value: {speedText}</label>
          <label>Speed: {speed}</label>
          <input
            type="range"
            min={0}
            max={maxSpeed}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
          />
        </div>

        <div>
          <label>Original Value: {fuelText}</label>
          <label>Fuel: {fuel}%</label>
          <input
            type="range"
            min={0}
            max={MAX_FUEL}
            value={fuel}
            onChange={(e) => setFuel(Number(e.target.value))}
          />
        </div>

        <div>
          <label>Original Value: {healText}</label>
          <label>Heal: {heal}%</label>
          <input
            type="range"
            min={0}
            max={MAX_HEAL}
            value={heal}
            onChange={(e) => setHeal(Number(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
}
