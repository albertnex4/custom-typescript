// vehicle-deformation.ts

// ============================================================================
// CONSTANTS
// ============================================================================

const DEBUG = true;

// Iterations for damage application
const MAX_DEFORM_ITERATIONS = 50;

// The minimum damage value at a deformation point before being registered as actual damage
const DEFORMATION_DAMAGE_THRESHOLD = 0.05;

// Max difference for angle to be considered too steep (0.0-1.0)
const ANGLE_THRESHOLD = 0.5;

const INITIAL_DAMAGE = 50.0;
const DAMAGE_INCREMENTS = 5.0;

// ============================================================================
// INTERFACES
// ============================================================================

interface Vector3 {
    x: number;
    y: number;
    z: number;
}

interface DeformationOffset extends Vector3 {}

interface DeformationPoint {
    offset: Vector3;
    damageVector: Vector3;
    currentDamage?: number;
}

// ============================================================================
// CACHE
// ============================================================================

// Cache for deformation offsets by model hash
const deformationOffsets: Map<number, Vector3[]> = new Map();

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Normalizes a vector
 */
function normalize(v: Vector3): Vector3 {
    const length = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
    if (length === 0) return { x: 0, y: 0, z: 0 };
    
    return {
        x: v.x / length,
        y: v.y / length,
        z: v.z / length
    };
}

/**
 * Calculates dot product of two vectors
 */
function dot(v1: Vector3, v2: Vector3): number {
    return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
}

/**
 * Calculates vector magnitude
 */
function magnitude(v: Vector3): number {
    return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
}

/**
 * Clamps a vector along an arbitrary axis
 */
function clampVectorAlongAxis(v: Vector3, axis: Vector3): Vector3 {
    const axisNorm = normalize(axis);
    const dotProduct = dot(v, axisNorm);
    
    return {
        x: dotProduct * axisNorm.x,
        y: dotProduct * axisNorm.y,
        z: dotProduct * axisNorm.z
    };
}

/**
 * Negates a vector
 */
function negateVector(v: Vector3): Vector3 {
    return { x: -v.x, y: -v.y, z: -v.z };
}

/**
 * Rounds a float to the given number of decimals
 */
function round(value: number, numDecimals: number): number {
    return Math.floor(value * Math.pow(10, numDecimals)) / Math.pow(10, numDecimals);
}

/**
 * Debug logging
 */
function logDebug(text: string, ...args: any[]): void {
    if (DEBUG) {
        let formattedText = text;
        args.forEach(arg => {
            formattedText = formattedText.replace('%s', String(arg));
        });
        mp.console.logInfo(`[DEBUG] ${formattedText}`);
    }
}

// ============================================================================
// MAIN FUNCTIONS
// ============================================================================

/**
 * Gets deformation from a vehicle
 */
export function getVehicleDeformation(vehicle: VehicleMp): DeformationPoint[] {
    if (!vehicle || !mp.vehicles.exists(vehicle)) {
        throw new Error('Parameter "vehicle" must be a valid vehicle entity!');
    }

    const offsets = getVehicleOffsetsForDeformation(vehicle);
    const deformationPoints: DeformationPoint[] = [];

    // Get deformation from vehicle
    for (let i = 0; i < offsets.length; i++) {
        const offset = offsets[i];
        
        // Native: GET_VEHICLE_DEFORMATION_AT_POS (0x4EC6CFBC7B2E9536)
        const deformation = mp.game.invoke(
            '0x4EC6CFBC7B2E9536',
            vehicle.handle,
            offset.x,
            offset.y,
            offset.z
        ) as Vector3;
        //mp.console.logError(`deformation ${JSON.stringify(deformation)}`)

        const projectedDamageVector = clampVectorAlongAxis(
            deformation,
            negateVector(offset)
        );
        //mp.console.logError(`projectedDamageVector ${JSON.stringify(projectedDamageVector)}`)

        //if (magnitude(projectedDamageVector) > DEFORMATION_DAMAGE_THRESHOLD) {
            deformationPoints.push({
                offset: offset,
                damageVector: deformation
            });
        //}else{
            //mp.console.logError(`No entro en el if... ${magnitude(projectedDamageVector) > DEFORMATION_DAMAGE_THRESHOLD}`)
        //}
    }

    const plateText = mp.game.vehicle.getNumberPlateText(vehicle.handle);
    //logDebug('Got %s deformation point(s) from "%s".', deformationPoints.length, plateText);

    return deformationPoints;
}

/**
 * Sets deformation on a vehicle
 */
export function setVehicleDeformation(
    vehicle: VehicleMp,
    deformationPoints: DeformationPoint[],
    callback?: () => void
): void {
    if (!vehicle || !mp.vehicles.exists(vehicle)) {
        throw new Error('Parameter "vehicle" must be a valid vehicle entity!');
    }

    if (!Array.isArray(deformationPoints)) {
        throw new Error('Parameter "deformationPoints" must be an array!');
    }

    // Check for pre v2.2.0 data format (legacy check)
    if (deformationPoints.length > 0 && typeof (deformationPoints[0] as any).damageVector === 'number') {
        logDebug('Got pre v2.2.0 data, ignoring function call...');
        return;
    }

    // Create a copy to avoid mutation
    const points = deformationPoints.map(p => ({
        offset: { ...p.offset },
        damageVector: { ...p.damageVector },
        currentDamage: p.currentDamage
    }));

    // Apply deformation in a loop with delays
    let deform = true;
    let iterations = 0;

    const applyDeformationIteration = () => {
        if (!mp.vehicles.exists(vehicle)) {
            logDebug('Vehicle got deleted mid-deformation.');
            if (callback) callback();
            return;
        }

        if (!deform || iterations >= MAX_DEFORM_ITERATIONS) {
            const plateText = mp.game.vehicle.getNumberPlateText(vehicle.handle);
            logDebug('Applying deformation finished for "%s" in %s iterations.', plateText, iterations);
            if (callback) callback();
            return;
        }

        deform = false;

        for (let i = 0; i < points.length; i++) {
            const def = points[i];

            // Get current deformation at this point
            const currDef = mp.game.invoke(
                '0x4EC6CFBC7B79C098',
                vehicle.handle,
                def.offset.x,
                def.offset.y,
                def.offset.z
            ) as Vector3;

            const clampedDef = clampVectorAlongAxis(
                currDef,
                negateVector(def.offset)
            );

            // Check if we need more deformation
            if (magnitude(clampedDef) < magnitude(def.damageVector)) {
                // Damage/radius increase method
                if (def.currentDamage === undefined) {
                    def.currentDamage = INITIAL_DAMAGE;
                } else {
                    def.currentDamage += DAMAGE_INCREMENTS;
                }

                // Native: SET_VEHICLE_DAMAGE (0xA1DD317EA8FD4F29)
                mp.game.invoke(
                    '0xA1DD317EA8FD4F29',
                    vehicle.handle,
                    def.offset.x,
                    def.offset.y,
                    def.offset.z,
                    def.currentDamage, // damage
                    def.currentDamage, // radius
                    true // useOffsetFromVehicle
                );

                deform = true;
            }
        }

        iterations++;

        // Continue next iteration
        setTimeout(applyDeformationIteration, 0);
    };

    // Start the deformation process
    applyDeformationIteration();
}

/**
 * Returns offsets for deformation check
 */
export function getVehicleOffsetsForDeformation(vehicle: VehicleMp): Vector3[] {
    const model = vehicle.model;

    // Check cache
    if (deformationOffsets.has(model)) {
        return deformationOffsets.get(model)!;
    }

    // Get model dimensions
    const dimensions = mp.game.gameplay.getModelDimensions(model);
    const min = dimensions.minimum;
    const max = dimensions.maximum;

    const defPoints: Vector3[] = [];

    // Generate grid of points
    for (let x = -1; x <= 1; x += 0.25) {
        for (let y = 1; y >= -1; y -= 0.25) {
            for (let z = -1; z <= 1; z += 0.5) {
                // Skip points in the middle (interior of vehicle)
                if ((y < -0.55 || y > 0.55) && z > -0.6) {
                    defPoints.push({
                        x: (max.x - min.x) * x * 0.5 + (max.x + min.x) * 0.5,
                        y: (max.y - min.y) * y * 0.5 + (max.y + min.y) * 0.5,
                        z: (max.z - min.z) * z * 0.5 + (max.z + min.z) * 0.5
                    });
                }
            }
        }
    }

    // Filter out points that are too far or at steep angles
    /*const filteredPoints = defPoints.filter(point => 
        !isPointTooFarFromVehicle(point, vehicle)
    );

    // Cache the result
    deformationOffsets.set(model, filteredPoints);
    */

    return defPoints;
}

/**
 * Checks if a point is too far from the vehicle or the angle too steep
 */
function isPointTooFarFromVehicle(point: Vector3, vehicle: VehicleMp): boolean {
    const vehPos = vehicle.position;
    
    // Get point in world coordinates
    const pointInWorld = mp.game.entity.getOffsetFromInWorldCoords(
        vehicle.handle,
        point.x,
        point.y,
        point.z
    );

    // Perform raycast from point to vehicle center
    // Native: START_EXPENSIVE_SYNCHRONOUS_SHAPE_TEST_LOS_PROBE (0x377906D8A31E5586)
    const rayHandle = mp.game.invoke(
        '0x377906D8A31E5586',
        pointInWorld.x,
        pointInWorld.y,
        pointInWorld.z,
        vehPos.x,
        vehPos.y,
        vehPos.z,
        2, // flags (vehicles only)
        0,
        0
    );

    // Native: GET_SHAPE_TEST_RESULT (0x3D87450E15D98694)
    const result = mp.game.invoke('0x3D87450E15D98694', rayHandle);
    //mp.game.shapetest.getShapeTestResult(rayHandle, hit, endCoords, surfaceNormal, entityHit);
    const hit = result[1] as boolean;
    const hitEntity = result[4] as number;
    const hitPosition = { x: result[2], y: result[3], z: result[4] } as Vector3;
    const normal = { x: result[5], y: result[6], z: result[7] } as Vector3;

    // Check if ray hit the vehicle
    if (!hit || hitEntity !== vehicle.handle) {
        return true;
    }

    // Calculate vector from hit position to point
    const toPoint: Vector3 = {
        x: pointInWorld.x - hitPosition.x,
        y: pointInWorld.y - hitPosition.y,
        z: pointInWorld.z - hitPosition.z
    };

    // Check angle difference
    const angleDiff = 1.0 - dot(normalize(toPoint), normalize(normal));
    
    return angleDiff > ANGLE_THRESHOLD;
}

/**
 * Returns true if deformation is worse
 * TODO: Currently may not work perfectly
 */
export function isDeformationWorse(
    newDef: DeformationPoint[] | null,
    oldDef: DeformationPoint[] | null
): boolean {
    if (!Array.isArray(newDef) && newDef !== null) {
        throw new Error('Parameter "newDeformation" must be null or an array!');
    }
    if (!Array.isArray(oldDef) && oldDef !== null) {
        throw new Error('Parameter "oldDeformation" must be null or an array!');
    }

    if (oldDef === null || (newDef && newDef.length > oldDef.length)) {
        return true;
    } else if (!newDef || newDef.length < oldDef.length) {
        return false;
    }

    for (let i = 0; i < newDef.length; i++) {
        const newPoint = newDef[i];
        let found = false;

        for (let j = 0; j < oldDef.length; j++) {
            const oldPoint = oldDef[j];

            if (magnitude(newPoint.offset) === magnitude(oldPoint.offset)) {
                found = true;

                if (magnitude(newPoint.damageVector) > magnitude(oldPoint.damageVector)) {
                    return true;
                }
            }
        }

        if (!found) {
            return true;
        }
    }

    return false;
}

/**
 * Returns true if deformation is equal
 * TODO: May not work perfectly
 */
export function isDeformationEqual(
    newDef: DeformationPoint[] | null,
    oldDef: DeformationPoint[] | null
): boolean {
    if (oldDef === null && newDef === null) {
        return true;
    }
    if (oldDef === null || newDef === null || newDef.length !== oldDef.length) {
        return false;
    }

    for (let i = 0; i < newDef.length; i++) {
        if (magnitude(newDef[i].damageVector) !== magnitude(oldDef[i].damageVector)) {
            return false;
        }
    }

    return true;
}




// ============================================================================
// CONFIGURATION
// ============================================================================

// Blacklists
const typeBlacklist: number[] = [
    // Ejemplo: 15, 16 (helicopters, planes, etc)
];

const modelBlacklist: number[] = [
    // Ejemplo: mp.game.joaat('bmx'), mp.game.joaat('bike')
];

const plateBlacklist: string[] = [
    // Ejemplo: 'ADMIN', 'STAFF'
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Gets vehicle type
 */
function getVehicleType(vehicle: VehicleMp): number {
    // Native: GET_VEHICLE_CLASS (0x29439776AAA00A62)
    return mp.game.invoke('0x29439776AAA00A62', vehicle.handle) as number;
}

/**
 * Checks if vehicle is blacklisted
 */
function isVehicleBlacklisted(vehicle: VehicleMp): boolean {
    // Check type blacklist
    if (typeBlacklist.length > 0) {
        const vehicleType = getVehicleType(vehicle);
        for (let i = 0; i < typeBlacklist.length; i++) {
            if (typeBlacklist[i] === vehicleType) {
                return true;
            }
        }
    }

    // Check model blacklist
    if (modelBlacklist.length > 0) {
        const vehicleModel = vehicle.model;
        for (let i = 0; i < modelBlacklist.length; i++) {
            if (modelBlacklist[i] === vehicleModel) {
                return true;
            }
        }
    }

    // Check plate blacklist
    if (plateBlacklist.length > 0) {
        const vehiclePlate = mp.game.vehicle.getNumberPlateText(vehicle.handle);
        for (let i = 0; i < plateBlacklist.length; i++) {
            if (vehiclePlate.toUpperCase().includes(plateBlacklist[i].toUpperCase())) {
                return true;
            }
        }
    }

    return false;
}

/**
 * Applies deformation to a vehicle
 */
async function applyDeformation(
    vehicle: VehicleMp, 
    deformation: any
): Promise<void> {
    // Wait for vehicle to exist (max 5 seconds)
    if (!mp.vehicles.exists(vehicle)) {
        const endTime = Date.now() + 5000;
        
        while (!mp.vehicles.exists(vehicle) && Date.now() < endTime) {
            await new Promise(resolve => setTimeout(resolve, 0));
        }

        if (!mp.vehicles.exists(vehicle)) {
            return;
        }
    }

    // Verify it's a vehicle
    // Native: IS_ENTITY_A_VEHICLE (0x6E585A616ABB8401)
    const isVehicle = mp.game.invoke('0x6E585A616ABB8401', vehicle.handle) as boolean;
    if (!isVehicle) return;

    // Apply deformation or fix vehicle
    if (deformation && Array.isArray(deformation) && deformation.length > 0) {
        setVehicleDeformation(vehicle, deformation);
    } else {
        // Fix deformation (reset to pristine)
        // Native: SET_VEHICLE_DEFORMATION_FIXED (0x953DA1E1B12C0491)
        mp.game.invoke('0x953DA1E1B12C0491', vehicle.handle);
    }
}

// ============================================================================
// DAMAGE UPDATE TRACKING
// ============================================================================

// Track pending damage updates per vehicle
const damageUpdateTimers: Map<number, number> = new Map();

/**
 * Handles deformation update with debouncing
 */
async function handleDeformationUpdate(vehicle: VehicleMp): Promise<void> {
    const vehicleHandle = vehicle.handle;

    // Check if already updating
    if (damageUpdateTimers.has(vehicleHandle)) {
        // Reset timer (debounce)
        damageUpdateTimers.set(vehicleHandle, Date.now() + 1000);
        return;
    }

    // Set initial timer
    damageUpdateTimers.set(vehicleHandle, Date.now() + 1000);

    // Wait for timer to expire
    while (damageUpdateTimers.get(vehicleHandle)! > Date.now()) {
        await new Promise(resolve => setTimeout(resolve, 0));
    }

    // Clear timer
    damageUpdateTimers.delete(vehicleHandle);

    // Verify vehicle still exists
    if (!mp.vehicles.exists(vehicle)) {
        return;
    }

    // Check if we're the owner (for multiplayer sync)
    // Native: NETWORK_GET_ENTITY_OWNER (0x1F8E00FB18239600)
    const owner = mp.game.invoke('0x1F8E00FB18239600', vehicle.handle) as number;
    const localPlayer = mp.players.local.handle;
    
    // Native: PLAYER_ID (0x4F8644AF03D0E0D6)
    const localPlayerId = mp.game.invoke('0x4F8644AF03D0E0D6') as number;

    if (owner !== localPlayerId) {
        return;
    }

    // Get current deformation
    const deformation = getVehicleDeformation(vehicle);

    if (deformation && deformation.length > 0) {
        // Save to vehicle data (you'll need to implement syncing with server)
        //vehicle.setVariable('deformation', JSON.stringify(deformation));
        
        // Optionally trigger server event to save
        //mp.events.callRemote('server:saveVehicleDeformation', vehicle.remoteId, JSON.stringify(deformation));
    }
}

// ============================================================================
// EVENT HANDLERS
// ============================================================================

/**
 * Handle vehicle data changes (deformation sync from other players)
 */
mp.events.add('entityDataChange', (entity: EntityMp, key: string, value: any) => {
    // Check if it's a vehicle and the deformation key
    if (entity.type !== 'vehicle' || key !== 'deformation') {
        return;
    }

    const vehicle = entity as VehicleMp;
    
    // Parse deformation data
    let deformation: any = null;
    if (typeof value === 'string') {
        try {
            deformation = JSON.parse(value);
        } catch (e) {
            console.error('Failed to parse deformation data:', e);
            return;
        }
    } else {
        deformation = value;
    }

    // Apply deformation
    applyDeformation(vehicle, deformation);
});

/**
 * Handle vehicle damage events
 */
mp.events.add('entityDamaged', (entity: EntityMp, damager: EntityMp, weapon: number, bone: number) => {
    // Check if entity is a vehicle
    if (entity.type !== 'vehicle') {
        mp.console.logInfo(`No es entity vehicle ${entity.type}`);
        return;
    }

    const vehicle = entity as VehicleMp;

    // Skip if blacklisted
    if (isVehicleBlacklisted(vehicle)) {
        mp.console.logInfo(`Bloqueado????`);
        return;
    }

    // Handle deformation update
    //handleDeformationUpdate(vehicle);
});

/**
 * Alternative: Listen to vehicle collisions
 */
mp.events.add('vehicleCollision', (vehicle: VehicleMp, entity: EntityMp, position: Vector3) => {
    // Skip if blacklisted
    if (isVehicleBlacklisted(vehicle)) {
        return;
    }

    // Handle deformation update
    //handleDeformationUpdate(vehicle);
});

// ============================================================================
// VEHICLE REPAIR/FIX FUNCTION
// ============================================================================

/**
 * Fix vehicle deformation (reset to pristine state)
 */
export function fixVehicleDeformation(vehicle: VehicleMp): void {
    if (!mp.vehicles.exists(vehicle)) {
        throw new Error('Parameter "vehicle" must be a valid vehicle entity!');
    }

    // Clear deformation data
    //vehicle.setVariable('deformation', null);

    // Fix visually
    // Native: SET_VEHICLE_DEFORMATION_FIXED (0x953DA1E1B12C0491)
    //mp.game.invoke('0x953DA1E1B12C0491', vehicle.handle);

    // Optionally trigger server event to clear saved deformation
    //mp.events.callRemote('server:fixVehicleDeformation', vehicle.remoteId);
}

// ============================================================================
// VEHICLE SPAWN HANDLER
// ============================================================================

/**
 * Apply saved deformation when vehicle spawns
 */
mp.events.add('entityStreamIn', (entity: EntityMp) => {
    if (entity.type !== 'vehicle') {
        return;
    }

    const vehicle = entity as VehicleMp;

    // Check if vehicle has saved deformation data
    const deformationData = vehicle.getVariable('deformation');
    
    if (deformationData) {
        let deformation: any = null;
        
        if (typeof deformationData === 'string') {
            try {
                deformation = JSON.parse(deformationData);
            } catch (e) {
                console.error('Failed to parse deformation data on stream in:', e);
                return;
            }
        } else {
            deformation = deformationData;
        }

        // Apply deformation after a small delay
        setTimeout(() => {
            if (mp.vehicles.exists(vehicle)) {
                applyDeformation(vehicle, deformation);
            }
        }, 100);
    }
});

// ============================================================================
// AUTO-SAVE DEFORMATION ON EXIT
// ============================================================================

const playerEnterVehicleHandler = (vehicle: VehicleMp, seat: number) => {
    // Only save if driver
    if (seat !== -1) {
        mp.console.logInfo(`seat es diferente a 0... ${seat}`);
        return;
    }

    // Skip if blacklisted
    if (isVehicleBlacklisted(vehicle)) {
        mp.console.logInfo("blacklisted???");
        return;
    }

    // Get and save final deformation state
    const deformation = getVehicleDeformation(vehicle);
    mp.console.logInfo(JSON.stringify(deformation));
    
    if (deformation && deformation.length > 0) {
        //vehicle.setVariable('deformation', JSON.stringify(deformation));
        //mp.events.callRemote('server:saveVehicleDeformation', vehicle.remoteId, JSON.stringify(deformation));
    }
};

/**
 * Save deformation when player exits vehicle
 */
//mp.events.add('playerLeaveVehicle', playerEnterVehicleHandler);
mp.events.add('playerEnterVehicle', () => {
    
    setInterval(() => {
        if(mp.players.local.vehicle){
            const test = getVehicleDeformation(mp.players.local.vehicle);
            mp.console.logInfo(JSON.stringify(test));
        }
    },1000)
})

// ============================================================================
// COMMAND FOR TESTING
// ============================================================================

mp.events.add('playerCommand', (command: string) => {
    const args = command.split(' ');
    const cmd = args[0].toLowerCase();

    if (cmd === 'fixveh' || cmd === 'repair') {
        const vehicle = mp.players.local.vehicle;
        
        if (!vehicle) {
            mp.gui.chat.push('You must be in a vehicle!');
            return;
        }

        fixVehicleDeformation(vehicle);
        
        // Also repair engine and body
        mp.game.vehicle.setFixed(vehicle.handle);
        
        mp.gui.chat.push('Vehicle repaired!');
    }
});

// ============================================================================
// EXPORTS
// ============================================================================

export { isVehicleBlacklisted, handleDeformationUpdate };