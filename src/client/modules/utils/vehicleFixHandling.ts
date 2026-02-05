//Sirve para que JS sea menos flexible
//Evita la creación accidental de variables globales:
//Convierte errores silenciosos en excepciones
'use strict';


//Clase para convertir correctamente algunos valores de las fisicas de los vehiculos
export function fixHandling(vehicle:VehicleMp) {
    if (vehicle === undefined || vehicle.handle === 0)
        return;
    vehicle.setMod(11, vehicle.getMod(11));
    mp.game.vehicle.modifyTopSpeed(vehicle.handle, 1.0);
    vehicle.setEnginePowerMultiplier(1.0);
    vehicle.setEngineTorqueMultiplier(1.0);
    mp.game.vehicle.setCheatPowerIncrease(vehicle.handle, 1.0);
}

export function setHandling(vehicle:VehicleMp, key:string, value:any) {
    if (vehicle === undefined || vehicle.handle === 0)
        return;
    switch (key) {
        case 'fInitialDragCoeff':
            vehicle.setHandling(key, value / 10000);
            break;
        case 'fDriveBiasFront':
            vehicle.setHandling(key, value * 2);
            break;
        case 'fInitialDriveMaxFlatVel':
            vehicle.setHandling(key, value / 3.6);
            break;
        case 'fBrakeBiasFront':
            vehicle.setHandling(key, value * 2);
            break;
        case 'fTractionCurveLateral':
            vehicle.setHandling(key, value * 0.017453292);
            break;
        case 'fTractionBiasFront':
            vehicle.setHandling(key, value * 2);
            break;
        case 'fSuspensionCompDamp':
            vehicle.setHandling(key, value / 10);
            break;
        case 'fSuspensionReboundDamp':
            vehicle.setHandling(key, value / 10);
            break;
        case 'fSuspensionBiasFront':
            vehicle.setHandling(key, value * 2);
            break;
        case 'fAntiRollBarBiasFront':
            vehicle.setHandling(key, value * 2);
            break;
        case 'fSteeringLock':
            vehicle.setHandling(key, value * 0.017453292);
            break;
        default:
            vehicle.setHandling(key, value);
            break;
    }
    fixHandling(vehicle);
}

export function getHandling(vehicle:VehicleMp, key:string) {
    if (vehicle === undefined || vehicle.handle === 0)
        return -1;

    const value = Number(vehicle.getHandling(key));

    switch (key) {
        case 'fInitialDragCoeff': return value * 10000;
        case 'fDriveBiasFront': return value / 2;
        case 'fInitialDriveMaxFlatVel': return value * 3.6;
        case 'fBrakeBiasFront': return value / 2;
        case 'fTractionCurveLateral': return value / 0.017453292;
        case 'fTractionBiasFront': return value / 2;
        case 'fSuspensionCompDamp': return value * 10;
        case 'fSuspensionReboundDamp': return value * 10;
        case 'fSuspensionBiasFront': return value / 2;
        case 'fAntiRollBarBiasFront': return value / 2;
        case 'fSteeringLock': return value / 0.017453292;
        default: return vehicle.getHandling(key);
    }
}



export function applyDriftHandling(vehicle:VehicleMp) {
    if (!vehicle) return;

    //vehicle.setMod(11, 3); // Engine
    vehicle.toggleMod(18, true); // Turbo
    vehicle.setMod(11, 3); //Motor (Nivel 4) - Aumenta la aceleración base
    vehicle.setMod(13, 2); //Transmisión (Nivel 4) - Mejora ligeramente el tiempo de cambio
    vehicle.setMod(12, 2); //Frenos (Nivel 4)
    vehicle.setDriftTyresEnabled(true);

    // 1. ÁNGULO DE GIRO (Steering Lock)
    // Los coches normales tienen 35-40 grados. Un coche de drift necesita 50-60.
mp.console.logInfo(`Original Value fMass : ${vehicle.getHandling("fMass")}`);
//vehicle.setHandling("fMass", 1000.0);
mp.console.logInfo(`Original Value fInitialDragCoeff : ${Number(vehicle.getHandling("fInitialDragCoeff")) * 10000}`);
//vehicle.setHandling("fInitialDragCoeff", 15.5 / 10000);
mp.console.logInfo(`Original Value fPercentSubmerged : ${vehicle.getHandling("fPercentSubmerged")}`);
//vehicle.setHandling("fPercentSubmerged", 85.0);
mp.console.logInfo(`Original Value fDriveBiasFront : ${Number(vehicle.getHandling("fDriveBiasFront"))* 2}`);
//vehicle.setHandling("fDriveBiasFront", 0.0  * 2);
mp.console.logInfo(`Original Value nInitialDriveGears : ${vehicle.getHandling("nInitialDriveGears")}`);
vehicle.setHandling("nInitialDriveGears", 6);
mp.console.logInfo(`Original Value fInitialDriveForce : ${vehicle.getHandling("fInitialDriveForce")}`);
vehicle.setHandling("fInitialDriveForce", 1.9);
mp.console.logInfo(`Original Value fDriveInertia : ${vehicle.getHandling("fDriveInertia")}`);
//vehicle.setHandling("fDriveInertia", 1.0);
mp.console.logInfo(`Original Value fClutchChangeRateScaleUpShift : ${vehicle.getHandling("fClutchChangeRateScaleUpShift")}`);
vehicle.setHandling("fClutchChangeRateScaleUpShift", 5.0);
mp.console.logInfo(`Original Value fClutchChangeRateScaleDownShift : ${vehicle.getHandling("fClutchChangeRateScaleDownShift")}`);
vehicle.setHandling("fClutchChangeRateScaleDownShift", 5.0);
mp.console.logInfo(`Original Value fInitialDriveMaxFlatVel : ${Number(vehicle.getHandling("fInitialDriveMaxFlatVel")) * 3.6}`);
//vehicle.setHandling("fInitialDriveMaxFlatVel", 100.0  / 3.6);
mp.console.logInfo(`Original Value fBrakeForce : ${vehicle.getHandling("fBrakeForce")}`);
vehicle.setHandling("fBrakeForce", 1.55);
mp.console.logInfo(`Original Value fBrakeBiasFront : ${vehicle.getHandling("fBrakeBiasFront")}`);
vehicle.setHandling("fBrakeBiasFront", 0.75);
mp.console.logInfo(`Original Value fHandBrakeForce : ${vehicle.getHandling("fHandBrakeForce")}`);
vehicle.setHandling("fHandBrakeForce", 3.5);
mp.console.logInfo(`Original Value fSteeringLock : ${Number(vehicle.getHandling("fSteeringLock")) * 0.017453292}`);
vehicle.setHandling("fSteeringLock", 90 * 0.017453292);
mp.console.logInfo(`Original Value fTractionCurveMax : ${vehicle.getHandling("fTractionCurveMax")}`);
vehicle.setHandling("fTractionCurveMax", 1.45);
mp.console.logInfo(`Original Value fTractionCurveMin : ${vehicle.getHandling("fTractionCurveMin")}`);
vehicle.setHandling("fTractionCurveMin", 1.95);
mp.console.logInfo(`Original Value fTractionCurveLateral : ${Number(vehicle.getHandling("fTractionCurveLateral")) * 0.017453292}`);
vehicle.setHandling("fTractionCurveLateral", 25.0 * 0.017453292);
mp.console.logInfo(`Original Value fTractionSpringDeltaMax : ${vehicle.getHandling("fTractionSpringDeltaMax")}`);
vehicle.setHandling("fTractionSpringDeltaMax", 0.15);
mp.console.logInfo(`Original Value fLowSpeedTractionLossMult : ${vehicle.getHandling("fLowSpeedTractionLossMult")}`);
vehicle.setHandling("fLowSpeedTractionLossMult", 0.5);
mp.console.logInfo(`Original Value fTractionBiasFront : ${Number(vehicle.getHandling("fTractionBiasFront")) * 2}`);
vehicle.setHandling("fTractionBiasFront", 0.45 * 2);
mp.console.logInfo(`Original Value fTractionLossMult : ${vehicle.getHandling("fTractionLossMult")}`);
vehicle.setHandling("fTractionLossMult", 1.8);
mp.console.logInfo(`Original Value fSuspensionForce : ${vehicle.getHandling("fSuspensionForce")}`);
vehicle.setHandling("fSuspensionForce", 2.5 );
mp.console.logInfo(`Original Value fSuspensionCompDamp : ${Number(vehicle.getHandling("fSuspensionCompDamp")) * 10}`);
vehicle.setHandling("fSuspensionCompDamp", 1.4 / 10);
mp.console.logInfo(`Original Value fSuspensionReboundDamp : ${Number(vehicle.getHandling("fSuspensionReboundDamp")) * 10}`);
vehicle.setHandling("fSuspensionReboundDamp", 2.2 / 10);
mp.console.logInfo(`Original Value fSuspensionUpperLimit : ${vehicle.getHandling("fSuspensionUpperLimit")}`);
vehicle.setHandling("fSuspensionUpperLimit", 0.06 );
mp.console.logInfo(`Original Value fSuspensionLowerLimit : ${vehicle.getHandling("fSuspensionLowerLimit")}`);
vehicle.setHandling("fSuspensionLowerLimit", -0.05 );
mp.console.logInfo(`Original Value fSuspensionRaise : ${vehicle.getHandling("fSuspensionRaise")}`);
vehicle.setHandling("fSuspensionRaise", -0.0);
mp.console.logInfo(`Original Value fSuspensionBiasFront : ${Number(vehicle.getHandling("fSuspensionBiasFront")) * 2}`);
vehicle.setHandling("fSuspensionBiasFront", 0.5 * 2);

    //mp.console.logInfo(`Original Value fDownforceModifier : ${vehicle.getHandling("fDownforceModifier")}`);
    //vehicle.setHandling("fDownforceModifier", 0.5 );
    //mp.console.logInfo(`Modified Value fDownforceModifier : ${0.5}`);
    
    // 6. FUERZA DE COLISIÓN/INERCIA
    // A veces ayuda a mantener el momento angular
    //mp.console.logInfo(`Original Value fInertiaMult : ${vehicle.getHandling("fInertiaMult")}`);
    //vehicle.setHandling("fInertiaMult", [1.0, 1.2, 1.0]); // Más inercia en el eje Y
}