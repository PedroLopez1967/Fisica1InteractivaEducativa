export const g = 9.8;

export const toRad = (deg: number) => (deg * Math.PI) / 180;

export interface ProjectileAnswers {
    posY: number;
    velY: number;
    timeMax: number;
    maxHeight: number;
    range: number;
}

export const calculateProjectileValues = (v0: number, angle: number, t: number = 2): ProjectileAnswers => {
    const rad = toRad(angle);
    const vy0 = v0 * Math.sin(rad);
    const vx0 = v0 * Math.cos(rad);

    // a) Posición Y en t
    const posY = vy0 * t - 0.5 * g * t * t;

    // b) Velocidad Y en t
    const velY = vy0 - g * t;

    // c) Tiempo altura máxima (vy = 0)
    const timeMax = vy0 / g;

    // d) Altura máxima
    const maxHeight = vy0 * timeMax - 0.5 * g * timeMax * timeMax;

    // e) Alcance horizontal (total flight time = 2 * timeMax)
    const totalTime = 2 * timeMax;
    const range = vx0 * totalTime;

    return {
        posY,
        velY,
        timeMax,
        maxHeight,
        range
    };
};

export const checkAnswer = (userValue: string, correctValue: number, tolerancePercent: number = 5): boolean => {
    const userNum = parseFloat(userValue);
    if (isNaN(userNum)) return false;

    const diff = Math.abs(userNum - correctValue);
    const tolerance = Math.abs(correctValue * (tolerancePercent / 100));

    // Handle case where correct value is 0 (use absolute tolerance)
    if (Math.abs(correctValue) < 1e-6) {
        return diff < 0.1;
    }

    return diff <= tolerance;
};

// Vector Calculations
export interface VectorComponents {
    x: number;
    y: number;
}

export interface VectorResult {
    x: number;
    y: number;
    magnitude: number;
    angle: number;
}

export const calculateVectorComponents = (magnitude: number, angle: number): VectorComponents => {
    const rad = toRad(angle);
    return {
        x: magnitude * Math.cos(rad),
        y: magnitude * Math.sin(rad)
    };
};

export const calculateResultant = (magA: number, angA: number, magB: number, angB: number): VectorResult => {
    const compA = calculateVectorComponents(magA, angA);
    const compB = calculateVectorComponents(magB, angB);

    const rx = compA.x + compB.x;
    const ry = compA.y + compB.y;

    return {
        x: rx,
        y: ry,
        magnitude: Math.sqrt(rx * rx + ry * ry),
        angle: (Math.atan2(ry, rx) * 180) / Math.PI
    };
};

// Dynamics Calculations
export interface DynamicsResult {
    normal: number;
    friction: number;
    acceleration: number;
    netForceX: number;
    isStatic: boolean;
}

export const calculateDynamics = (
    mass: number,
    force: number,
    angle: number,
    muStatic: number,
    muKinetic: number
): DynamicsResult => {
    const g = 9.8;
    const rad = toRad(angle);

    // 1. Calculate Normal Force: N = mg - Fsin(theta)
    let normal = (mass * g) - (force * Math.sin(rad));
    if (normal < 0) normal = 0;

    // 2. Calculate Max Static Friction: fs_max = mu_s * N
    const maxStaticFriction = muStatic * normal;

    // 3. Calculate Horizontal Force Component: Fx = Fcos(theta)
    const fx = force * Math.cos(rad);

    // 4. Determine Motion
    let friction = 0;
    let acceleration = 0;
    let netForceX = 0;
    let isStatic = false;

    // Check if force is enough to overcome static friction
    if (Math.abs(fx) <= maxStaticFriction) {
        isStatic = true;
        friction = fx; // Friction opposes and equals the applied force component
        acceleration = 0;
        netForceX = 0;
    } else {
        isStatic = false;
        // Kinetic friction
        const kineticFriction = muKinetic * normal;
        // Direction of friction is opposite to motion (which is direction of fx)
        friction = kineticFriction * Math.sign(fx);

        netForceX = fx - friction;
        acceleration = netForceX / mass;
    }

    return {
        normal,
        friction,
        acceleration,
        netForceX,
        isStatic
    };
};

// Energy Calculations
export interface EnergyResult {
    pe: number; // Potential Energy
    ke: number; // Kinetic Energy
    total: number; // Total Energy
    velocity: number; // Current Velocity
}

export const calculateEnergy = (
    mass: number,
    height: number,
    currentVelocity: number
): EnergyResult => {
    const g = 9.8;
    const pe = mass * g * height;
    const ke = 0.5 * mass * currentVelocity * currentVelocity;

    return {
        pe,
        ke,
        total: pe + ke,
        velocity: currentVelocity
    };
};

export const calculateFreeFall = (
    initialHeight: number,
    time: number
): { height: number; velocity: number } => {
    const g = 9.8;
    // h = h0 - 0.5 * g * t^2
    let height = initialHeight - 0.5 * g * time * time;
    if (height < 0) height = 0;

    // v = g * t
    // If hit ground, v is impact velocity (calculated from energy or kinematics at h=0)
    // But for simple time-based:
    let velocity = g * time;

    // Cap velocity if hit ground
    if (height === 0) {
        // v = sqrt(2 * g * h0)
        velocity = Math.sqrt(2 * g * initialHeight);
    }

    return { height, velocity };
};

