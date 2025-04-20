const gameContainer = document.getElementById('game-area');
const customCursor = document.getElementById('custom-cursor');
const scoreDisplay = document.getElementById('score');
const gameOverMessage = document.getElementById('game-over-message');

let score = 0;
let gameActive = true;
let animationFrameId;

// --- Ninja Data ---
let ninjas = [];
const ninjaElements = [
    document.getElementById('ninja'),
    document.getElementById('ninja-1')
];

// Posición del cursor (relativa al gameContainer)
let cursorX = 0;
let cursorY = 0;
let prevCursorX = 0; // Para detectar colisión entre frames
let prevCursorY = 0; // Para detectar colisión entre frames

// Velocidad y aceleración del cursor para predicción avanzada
let cursorVelX = 0;
let cursorVelY = 0;
let cursorAccX = 0;
let cursorAccY = 0;
let lastCursorX = 0;
let lastCursorY = 0;
let lastVelX = 0;
let lastVelY = 0;

// Historial de posiciones del cursor para predicción
const cursorHistory = [];
const HISTORY_LENGTH = 20; // Aumentado para mejor análisis

// --- Variables de Dificultad Base (Compartidas) ---
const BASE_STALKING_SPEED = 2.8;
const BASE_DASH_SPEED = 25;
const BASE_DASH_COOLDOWN = 30;
const BASE_PREDICTION_FACTOR = 0.7;
const BASE_STRATEGY_CHANGE_INTERVAL = 4;
let BASE_CURVE_FACTOR = 0.25; // Ahora no es const para poder modificarlo
let BASE_AGGRESSION_FACTOR = 1.2;

// Variables de estado del ninja
let ninjaState = 'stalking'; // 'stalking', 'dashing', 'resting'
let dashCooldown = BASE_DASH_COOLDOWN;
let dashDirection = { x: 0, y: 0 };
let dashSpeed = BASE_DASH_SPEED;
let stalkingSpeed = BASE_STALKING_SPEED;
let restTime = 0;
let predictionFactor = BASE_PREDICTION_FACTOR;
let lastStrategyChangeOrbCount = 0;
let currentStrategy = 'direct'; // 'direct', 'predict', 'zigzag', 'ambush', 'intercept', 'curve'
let ambushTarget = { x: 0, y: 0 };
let interceptPoint = { x: 0, y: 0 };
let lastDashTime = 0;
let aggressionFactor = 1.2; // Aumentado ligeramente el valor inicial (de 1.0)

// Efectos visuales
let trailElements = [];
const MAX_TRAILS = 5;
let lastTrailTime = 0;

// Medición de desempeño del jugador
let playerAvoidScore = 0; // Qué tan bien evita el jugador (para ajustar dificultad)
let lastPlayerPos = [];

// Variables para control de orbes
let lastOrbSpawnTime = 0;
const ORB_SPAWN_INTERVAL = 5000; // 5 segundos entre orbes
let activeOrbs = [];
let orbCount = 0; // Contador de orbes generados
let orbsCollected = 0; // Contador de orbes recolectados

const NUM_FUTURE_ORBS = 3;
let futureOrbPositions = [];

// Añadir función para actualizar el color del ninja basado en agresividad
function updateNinjaColor(ninja) {
    // Mapear aggressionFactor desde 1.0-3.0 a un valor entre 0 y 1
    const aggression = Math.min(3.0, Math.max(1.0, ninja.aggressionFactor)) - 1.0;
    const normalizedAggression = aggression / 2.0; // De 0 a 1

    // Interpolación de color: Verde (pacífico) -> Amarillo -> Rojo (agresivo)
    // RGB para verde: 46, 204, 113
    // RGB para amarillo: 241, 196, 15
    // RGB para rojo: 231, 76, 60

    let r, g, b;

    if (normalizedAggression < 0.5) {
        // Verde a amarillo
        const t = normalizedAggression * 2; // 0 a 1 en primera mitad
        r = Math.round(46 + (241 - 46) * t);
        g = Math.round(204 + (196 - 204) * t);
        b = Math.round(113 + (15 - 113) * t);
    } else {
        // Amarillo a rojo
        const t = (normalizedAggression - 0.5) * 2; // 0 a 1 en segunda mitad
        r = Math.round(241 + (231 - 241) * t);
        g = Math.round(196 + (76 - 196) * t);
        b = Math.round(15 + (60 - 15) * t);
    }

    // Generar color CSS y shadow
    const color = `rgb(${r}, ${g}, ${b})`;
    const shadow = `0 0 15px rgba(${r}, ${g}, ${b}, 0.5)`;

    // Aplicar el color al ninja
    ninja.element.style.backgroundColor = color;
    ninja.element.style.boxShadow = shadow;

    // También actualiza el color del trail
    ninja.trailColor = color;
}

function changeStrategy(ninja) { // Acepta el ninja a cambiar
    const basicStrategies = ['direct', 'zigzag', 'curve'];
    const advancedStrategies = ['predict', 'intercept', 'ambush', 'deny'];
    let allStrategies = [...basicStrategies, ...advancedStrategies];
    let newStrategy;

    // *** Lógica de Cooperación/Diversificación ***
    const otherNinja = ninjas.find(n => n.isActive && n.id !== ninja.id);
    const otherStrategy = otherNinja ? otherNinja.currentStrategy : null;
    let attempts = 0;

    do {
        attempts++;
        const advancedChance = Math.min(0.25 + orbsCollected * 0.03, 0.9);
        if (Math.random() < advancedChance || playerAvoidScore > 45) {
            newStrategy = advancedStrategies[Math.floor(Math.random() * advancedStrategies.length)];
        } else {
            newStrategy = basicStrategies[Math.floor(Math.random() * basicStrategies.length)];
        }
        // Intentar evitar la misma estrategia que el otro (si existe)
        // y evitar combinaciones problemáticas (ambos direct, ambos ambush, ambos deny)
    } while (
        attempts < 10 && // Evitar bucle infinito
        newStrategy === ninja.currentStrategy || // Evitar repetir la misma
        (otherNinja && (
            newStrategy === otherStrategy ||
            (newStrategy === 'direct' && otherStrategy === 'direct') ||
            (newStrategy === 'ambush' && otherStrategy === 'ambush') ||
            (newStrategy === 'deny' && otherStrategy === 'deny')
        )
        )
    );

    // Guardar la estrategia anterior para quitar su clase
    const oldStrategy = ninja.currentStrategy;
    if (oldStrategy) {
        ninja.element.classList.remove(oldStrategy);
    }

    ninja.currentStrategy = newStrategy;

    switch (ninja.currentStrategy) {
        case 'ambush':
            setAmbushPoint(ninja);
            break;
        case 'intercept':
            calculateInterceptionPoint(ninja);
            break;
    }

    // Agregar la nueva clase de estrategia
    ninja.element.classList.add(ninja.currentStrategy);
    ninja.lastStrategyChangeOrbCount = orbsCollected;

    // Actualizar el color basado en la agresividad actual
    updateNinjaColor(ninja);
}

// Modificar la función createTrail para usar el color del ninja
function createTrail(ninja) { // Acepta el ninja
    if (Date.now() - ninja.lastTrailTime < 100) return;
    ninja.lastTrailTime = Date.now();

    const trail = document.createElement('div');
    trail.className = 'ninja-trail';
    trail.style.width = `${ninja.element.offsetWidth * 0.8}px`;
    trail.style.height = `${ninja.element.offsetHeight * 0.8}px`;
    trail.style.left = `${ninja.visualX}px`;
    trail.style.top = `${ninja.visualY}px`;
    trail.style.backgroundColor = ninja.trailColor || ninja.element.style.backgroundColor;
    trail.style.transform = 'translate(-50%, -50%)';
    trail.style.borderRadius = '50%'; // Trails también circulares

    gameContainer.appendChild(trail);
    ninja.trailElements.push(trail);

    setTimeout(() => {
        trail.style.opacity = '0';
        setTimeout(() => {
            trail.remove();
            ninja.trailElements = ninja.trailElements.filter(el => el !== trail);
        }, 500);
    }, 300);

    if (ninja.trailElements.length > MAX_TRAILS) {
        const oldestTrail = ninja.trailElements.shift();
        oldestTrail.remove();
    }
}

// Función para limpiar los trails de un ninja
function clearTrails(ninja) {
    if (ninja.trailElements) {
        ninja.trailElements.forEach(trail => {
            if (trail && trail.parentNode) {
                trail.remove();
            }
        });
        ninja.trailElements = [];
    }
}

// Modificar moveSingleNinja para actualizar el color según agresividad
function moveSingleNinja(ninja) {
    // *** Verificación temprana de dashDirection ***
    if (typeof ninja.dashDirection !== 'object' || ninja.dashDirection === null) {
        console.warn(`WARNING in moveSingleNinja: ninja.dashDirection was invalid for ninja ID ${ninja.id}! Re-initializing.`, ninja);
        ninja.dashDirection = { x: 0, y: 0 };
    }
    // *** Fin Verificación ***

    // Cambiar estrategia basado en orbes (usa orbsCollected global)
    if (orbsCollected - ninja.lastStrategyChangeOrbCount > BASE_STRATEGY_CHANGE_INTERVAL) {
        changeStrategy(ninja);
    }

    // Aumentar agresividad si está lejos (usa pos ninja y cursor global)
    const distToCursor = Math.hypot(ninja.x - cursorX, ninja.y - cursorY);
    const farDistanceThreshold = 300;
    if (distToCursor > farDistanceThreshold && ninja.state === 'stalking') {
        // Usar ninja.aggressionFactor
        ninja.aggressionFactor = Math.min(3.0, ninja.aggressionFactor * 1.2);
        if (Date.now() - ninja.lastDashTime > 1000) {
            prepareDash(ninja);
        }
    } else if (ninja.state === 'stalking') {
        // Volver gradualmente a la agresión base si no está lejos
        ninja.aggressionFactor += (BASE_AGGRESSION_FACTOR - ninja.aggressionFactor) * 0.01;
    }

    // Actualizar el color basado en la agresividad actual
    updateNinjaColor(ninja);

    switch (ninja.state) {
        case 'stalking':
            stalkCursor(ninja);
            ninja.dashCooldownFrames--;
            if (ninja.dashCooldownFrames <= 0) {
                console.log(`Ninja ${ninja.id} preparing dash. Current dashDirection:`, ninja.dashDirection); // Log antes de llamar
                prepareDash(ninja);
            }
            break;
        case 'dashing':
            performDash(ninja);
            break;
        case 'resting':
            ninja.restTime--;
            if (ninja.restTime <= 0) {
                ninja.state = 'stalking';
                // Usar cooldown base actualizado por dificultad
                ninja.dashCooldownFrames = BASE_DASH_COOLDOWN;
            }
            break;
    }
    updateNinjaVisualPosition(ninja);
}

// Modificar initializeNinjaObject para incluir el color inicial
function initializeNinjaObject(element, id, startActive = false) {
    const initialX = id === 0 ?
        gameContainer.offsetWidth * 0.1 :
        gameContainer.offsetWidth * 0.9; // Posición inicial opuesta
    const initialY = id === 0 ?
        gameContainer.offsetHeight * 0.1 :
        gameContainer.offsetHeight * 0.9;

    const ninjaData = {
        id: id,
        element: element,
        x: initialX,
        y: initialY,
        visualX: initialX,
        visualY: initialY,
        state: startActive ? 'stalking' : 'inactive', // Estado inicial
        isActive: startActive,
        dashCooldownFrames: BASE_DASH_COOLDOWN,
        dashDuration: 0,
        restTime: 0,
        currentStrategy: 'direct',
        lastStrategyChangeOrbCount: 0,
        ambushTarget: { x: 0, y: 0 },
        interceptPoint: { x: 0, y: 0 },
        lastDashTime: 0,
        stalkingSpeed: BASE_STALKING_SPEED,
        dashSpeed: BASE_DASH_SPEED,
        predictionFactor: BASE_PREDICTION_FACTOR,
        curveFactor: BASE_CURVE_FACTOR,
        aggressionFactor: BASE_AGGRESSION_FACTOR,
        trailElements: [],
        lastTrailTime: 0,
        justActivated: false,
        dashDirection: { x: 0, y: 0 },
        trailColor: '#2ecc71' // Color inicial verde
    };

    // Establecer color inicial
    updateNinjaColor(ninjaData);

    console.log(`Ninja ${id} initialized. dashDirection:`, ninjaData.dashDirection); // Log de inicialización
    return ninjaData;
}

function generateFutureOrbPosition() {
    const margin = 30;
    const safeWidth = gameContainer.offsetWidth - (margin * 2);
    const safeHeight = gameContainer.offsetHeight - (margin * 2);
    const orbX = margin + Math.random() * safeWidth;
    const orbY = margin + Math.random() * safeHeight;
    return { x: orbX, y: orbY };
}

function populateFutureOrbs() {
    while (futureOrbPositions.length < NUM_FUTURE_ORBS) {
        futureOrbPositions.push(generateFutureOrbPosition());
    }
}

function getNextOrbPosition() {
    if (futureOrbPositions.length === 0) {
        populateFutureOrbs(); // Asegurarse de que haya posiciones si está vacío
    }
    // Devolver y eliminar la primera posición pre-calculada
    return futureOrbPositions.shift();
}

function clearOrbs() {
    const orbsContainer = document.getElementById('orbs-container');
    while (orbsContainer.firstChild) {
        orbsContainer.removeChild(orbsContainer.firstChild);
    }
    activeOrbs = [];
    // No necesitamos limpiar futureOrbPositions aquí,
    // initializeGame ya lo hace.
}

function spawnOrb() {
    const now = Date.now();
    if (now - lastOrbSpawnTime < 100) return;

    lastOrbSpawnTime = now;
    orbCount++;

    const pos = getNextOrbPosition(); // Obtiene la siguiente posición pre-calculada
    populateFutureOrbs(); // Genera una nueva posición futura para rellenar

    const orb = document.createElement('div');
    orb.className = 'orb';
    orb.style.left = `${pos.x}px`;
    orb.style.top = `${pos.y}px`;
    orb.dataset.orbX = pos.x; // Guardar la posición en el dataset para referencia
    orb.dataset.orbY = pos.y;

    // Añadir el orbe al contenedor
    document.getElementById('orbs-container').appendChild(orb);
    activeOrbs.push(orb);
}

function checkOrbCollision() {
    const cursorRadius = 10;
    const orbRadius = 7.5;

    for (let i = activeOrbs.length - 1; i >= 0; i--) {
        const orb = activeOrbs[i];
        const orbRect = orb.getBoundingClientRect();
        const gameAreaRect = gameContainer.getBoundingClientRect();

        // Calcular posición relativa al game-area
        const orbX = orbRect.left - gameAreaRect.left + orbRect.width / 2;
        const orbY = orbRect.top - gameAreaRect.top + orbRect.height / 2;

        const dx = orbX - cursorX;
        const dy = orbY - cursorY;
        const distance = Math.hypot(dx, dy);

        if (distance < cursorRadius + orbRadius) {
            // Eliminar el orbe instantáneamente
            if (orb.parentNode) {
                orb.remove();
            }

            // Eliminar el orbe de la lista activa
            activeOrbs.splice(i, 1);
            orbCount--;

            // Aumentar el contador de orbes recolectados
            orbsCollected++;
            scoreDisplay.textContent = orbsCollected;

            // Actualizar dificultad basada en orbes recolectados
            updateDifficulty(orbsCollected);

            // Generar un nuevo orbe inmediatamente
            spawnOrb();
        }
    }
}

// --- Configuración Inicial --- //

function initializeGame() {
    orbsCollected = 0;
    gameActive = true;
    scoreDisplay.textContent = orbsCollected;
    gameOverMessage.style.display = 'none';

    customCursor.style.transition = 'none';

    // Ahora la llamada a initializeNinjaObject es válida
    ninjas = [
        initializeNinjaObject(ninjaElements[0], 0, true),
        initializeNinjaObject(ninjaElements[1], 1, false)
    ];

    ninjas.forEach(ninja => {
        // Resetear estilos visuales
        ninja.element.style.display = ninja.isActive ? 'block' : 'none';
        ninja.element.style.transform = 'translate(-50%, -50%)';
        ninja.element.className = 'ninja'; // Resetear clases de estrategia

        // Establecer el color inicial (verde)
        ninja.aggressionFactor = BASE_AGGRESSION_FACTOR; // Agresividad base
        updateNinjaColor(ninja); // Establecer el color inicial basado en agresividad

        if (ninja.isActive) {
            updateNinjaVisualPosition(ninja); // Posicionar visualmente
        }
        // Limpiar trails anteriores
        clearTrails(ninja);
    });

    // Reiniciar dificultad base (compartida)
    BASE_CURVE_FACTOR = 0.25;
    BASE_AGGRESSION_FACTOR = 1.2;
    updateDifficulty(0); // Aplicar valores iniciales a ninjas activos

    futureOrbPositions = [];
    populateFutureOrbs();

    clearOrbs();
    orbCount = 0;
    spawnOrb();

    // *** Corregir Inicialización del Cursor ***
    // Forzar la posición inicial al centro después de un breve retraso
    // para asegurar que las dimensiones del contenedor estén listas.
    setTimeout(() => {
        if (gameContainer) { // Asegurarse que el contenedor existe
            cursorX = gameContainer.offsetWidth / 2;
            cursorY = gameContainer.offsetHeight / 2;
            prevCursorX = cursorX;
            prevCursorY = cursorY;
            if (customCursor) { // Asegurarse que el cursor existe
                customCursor.style.left = `${cursorX}px`;
                customCursor.style.top = `${cursorY}px`;
            }
        } else {
            console.error("#game-area no encontrado para centrar cursor");
            cursorX = 0; cursorY = 0; prevCursorX = 0; prevCursorY = 0;
        }
    }, 10); // Un pequeño delay de 10ms

    // Resetear historial y skill del jugador
    cursorHistory.length = 0;
    lastPlayerPos = [];
    playerAvoidScore = 0;

    // Asegurarse de que el cursor sigue al mouse desde el inicio
    document.removeEventListener('mousemove', updateCursorPosition);
    document.addEventListener('mousemove', updateCursorPosition);

    // Iniciar ciclo del juego
    cancelAnimationFrame(animationFrameId);
    gameLoop();
}

// --- Movimiento del Cursor --- //

function updateCursorPosition(event) {
    if (!gameContainer || !customCursor) return;

    const rect = gameContainer.getBoundingClientRect();

    // *** LOGGING PARA DIAGNÓSTICO ***

    prevCursorX = cursorX;
    prevCursorY = cursorY;
    lastCursorX = cursorX;
    lastCursorY = cursorY;
    lastVelX = cursorVelX;
    lastVelY = cursorVelY;

    let calculatedX = event.clientX - rect.left;
    let calculatedY = event.clientY - rect.top;


    cursorX = Math.max(0, Math.min(calculatedX, gameContainer.offsetWidth));
    cursorY = Math.max(0, Math.min(calculatedY, gameContainer.offsetHeight));


    requestAnimationFrame(() => {
    customCursor.style.left = `${cursorX}px`;
    customCursor.style.top = `${cursorY}px`;
    });

    cursorVelX = cursorX - lastCursorX;
    cursorVelY = cursorY - lastCursorY;
    cursorAccX = cursorVelX - lastVelX;
    cursorAccY = cursorVelY - lastVelY;

    cursorHistory.push({
        x: cursorX,
        y: cursorY,
        velX: cursorVelX,
        velY: cursorVelY,
        accX: cursorAccX,
        accY: cursorAccY,
        timestamp: Date.now()
    });

    if (cursorHistory.length > HISTORY_LENGTH) {
        cursorHistory.shift();
    }

    if (lastPlayerPos.length === 0 || Date.now() - lastPlayerPos[lastPlayerPos.length - 1].timestamp > 500) {
        lastPlayerPos.push({ x: cursorX, y: cursorY, timestamp: Date.now() });
        if (lastPlayerPos.length > 10) lastPlayerPos.shift();
        analyzePlayerSkill();
    }
}

// Analizar qué tan bien evita el jugador al ninja
function analyzePlayerSkill() {
    if (lastPlayerPos.length < 3) return;

    // Calcular distancia promedio al ninja
    let totalDistance = 0;
    for (const pos of lastPlayerPos) {
        const dx = pos.x - cursorX;
        const dy = pos.y - cursorY;
        totalDistance += Math.hypot(dx, dy);
    }

    const avgDistance = totalDistance / lastPlayerPos.length;

    // Calcular cuán impredecible es el movimiento (cambios de dirección)
    let directionChanges = 0;
    for (let i = 2; i < lastPlayerPos.length; i++) {
        const prevVector = {
            x: lastPlayerPos[i - 1].x - lastPlayerPos[i - 2].x,
            y: lastPlayerPos[i - 1].y - lastPlayerPos[i - 2].y
        };

        const currVector = {
            x: lastPlayerPos[i].x - lastPlayerPos[i - 1].x,
            y: lastPlayerPos[i].y - lastPlayerPos[i - 1].y
        };

        // Producto punto para ver cambio de dirección
        const dotProduct = prevVector.x * currVector.x + prevVector.y * currVector.y;
        const prevMag = Math.hypot(prevVector.x, prevVector.y);
        const currMag = Math.hypot(currVector.x, currVector.y);

        if (prevMag > 0 && currMag > 0) {
            const cosAngle = dotProduct / (prevMag * currMag);
            // Si el coseno es negativo, hay un cambio significativo de dirección
            if (cosAngle < 0) directionChanges++;
        }
    }

    // Ajustar el puntaje de evitación
    playerAvoidScore = avgDistance * 0.05 + directionChanges * 10;
}

// --- Lógica del Ninja (Refactorizada) --- //

// Modificar gameLoop para iterar sobre ninjas activos
function gameLoop() {
    if (!gameActive) return;

    // *** LOG: Estado actual del juego ***
    if (orbsCollected === 3) {
        console.log(`START LOOP: Orbs=${orbsCollected}, Ninjas Active: [${ninjas.map(n => n.isActive ? n.id : '-').join(', ')}]`);
    }

    let caughtByNinja = null;
    ninjas.forEach(ninja => {
        if (ninja.isActive) {
            if (orbsCollected === 3) {
                console.log(`  NINJA ${ninja.id}: (${ninja.x.toFixed(0)}, ${ninja.y.toFixed(0)}), state=${ninja.state}, justActivated=${ninja.justActivated}`);
            }
            moveSingleNinja(ninja);
            if (!caughtByNinja && checkCollision(ninja)) {
                if (orbsCollected === 3) {
                    console.log(`  COLLISION DETECTED WITH NINJA ${ninja.id}!`);
                }
                caughtByNinja = ninja;
            }

            if (ninja.justActivated) {
                ninja.justActivated = false;
                if (orbsCollected >= 3) {
                    console.log(`  RESET justActivated for ninja ${ninja.id}`);
                }
            }
        }
    });

    checkOrbCollision(); // Sigue siendo global

    if (caughtByNinja) {
        console.log(`GAME OVER! Caught by ninja ${caughtByNinja.id} at orbs=${orbsCollected}`);
        captureCursor(caughtByNinja);
        endGame(caughtByNinja);
    } else {
        animationFrameId = requestAnimationFrame(gameLoop);
    }
}

function stalkCursor(ninja) {
    let targetX, targetY;
    let applyCurve = false;

    switch (ninja.currentStrategy) {
        case 'direct':
            targetX = cursorX;
            targetY = cursorY;
            break;
        case 'predict':
            if (cursorHistory.length >= 3) {
                const predictTime = 0.8;
                targetX = cursorX + cursorVelX * 15 * ninja.predictionFactor + 0.5 * cursorAccX * Math.pow(15, 2) * ninja.predictionFactor;
                targetY = cursorY + cursorVelY * 15 * ninja.predictionFactor + 0.5 * cursorAccY * Math.pow(15, 2) * ninja.predictionFactor;
                const isSlowingDown = (Math.abs(cursorVelX) > 0.5 && Math.sign(cursorAccX) !== Math.sign(cursorVelX)) || (Math.abs(cursorVelY) > 0.5 && Math.sign(cursorAccY) !== Math.sign(cursorVelY));
                if (isSlowingDown && Math.abs(cursorAccX) > 0.1 && Math.abs(cursorAccY) > 0.1) { // Avoid division by zero
                    const stopX = cursorX + (cursorVelX * Math.abs(cursorVelX / cursorAccX));
                    const stopY = cursorY + (cursorVelY * Math.abs(cursorVelY / cursorAccY));
                    targetX = (targetX + stopX) / 2;
                    targetY = (targetY + stopY) / 2;
                }
            } else {
                targetX = cursorX;
                targetY = cursorY;
            }
            break;
        case 'zigzag':
            const angle = Date.now() * 0.005;
            const distFactor = Math.min(1, Math.max(0.3, 250 / Math.hypot(ninja.x - cursorX, ninja.y - cursorY)));
            const offsetX = Math.sin(angle) * 150 * distFactor;
            const offsetY = Math.cos(angle * 1.3) * 150 * distFactor;
            targetX = cursorX + offsetX;
            targetY = cursorY + offsetY;
            break;
        case 'ambush':
            const distToAmbush = Math.hypot(ninja.ambushTarget.x - ninja.x, ninja.ambushTarget.y - ninja.y);
            if (distToAmbush < 20) {
                prepareDash(ninja);
                return;
            }
            if (Math.random() < 0.01) {
                setAmbushPoint(ninja);
            }
            targetX = ninja.ambushTarget.x;
            targetY = ninja.ambushTarget.y;
            break;
        case 'intercept':
            calculateInterceptionPoint(ninja);
            targetX = ninja.interceptPoint.x;
            targetY = ninja.interceptPoint.y;
            const distToIntercept = Math.hypot(ninja.interceptPoint.x - ninja.x, ninja.interceptPoint.y - ninja.y);
            if (distToIntercept < 30) {
                prepareDash(ninja);
                return;
            }
            break;
        case 'curve':
            targetX = cursorX;
            targetY = cursorY;
            applyCurve = true;
            break;
        case 'deny':
            {
                let closestOrbPos = null;
                if (activeOrbs.length > 0 && activeOrbs[0].dataset.orbX) {
                    closestOrbPos = { x: parseFloat(activeOrbs[0].dataset.orbX), y: parseFloat(activeOrbs[0].dataset.orbY) };
                } else if (futureOrbPositions.length > 0) {
                    closestOrbPos = futureOrbPositions[0];
                }
                if (closestOrbPos) {
                    const dxPlayerOrb = closestOrbPos.x - cursorX;
                    const dyPlayerOrb = closestOrbPos.y - cursorY;
                    const denyRatio = 0.33;
                    targetX = cursorX + dxPlayerOrb * denyRatio;
                    targetY = cursorY + dyPlayerOrb * denyRatio;
                    applyCurve = true;
                } else {
                    targetX = cursorX;
                    targetY = cursorY;
                }
            }
            break;
    }

    targetX = Math.max(0, Math.min(targetX, gameContainer.offsetWidth));
    targetY = Math.max(0, Math.min(targetY, gameContainer.offsetHeight));

    const dx = targetX - ninja.x;
    const dy = targetY - ninja.y;
    const dist = Math.hypot(dx, dy);

    if (dist > 0) {
        const normalizedDx = dx / dist;
        const normalizedDy = dy / dist;
        let moveX = normalizedDx;
        let moveY = normalizedDy;

        if (applyCurve || (ninja.currentStrategy !== 'zigzag' && Math.random() < ninja.curveFactor * 0.2)) {
            const perpendicularX = -normalizedDy;
            const perpendicularY = normalizedDx;
            const curveInfluence = Math.sin(Date.now() * 0.004) * ninja.curveFactor * (0.5 + Math.random() * 0.5);
            moveX = (moveX + perpendicularX * curveInfluence);
            moveY = (moveY + perpendicularY * curveInfluence);
            const moveMagnitude = Math.hypot(moveX, moveY);
            if (moveMagnitude > 0) {
                moveX /= moveMagnitude;
                moveY /= moveMagnitude;
            }
        }

        const distanceFactor = Math.min(2.0, Math.max(1.0, dist / 150));
        let effectiveSpeed = ninja.stalkingSpeed * ninja.aggressionFactor * distanceFactor;
        const closeRangeThreshold = 70;
        const closeRangeBoost = 1.9;
        if (dist < closeRangeThreshold) {
            effectiveSpeed *= closeRangeBoost;
        }
        effectiveSpeed = Math.min(effectiveSpeed, ninja.dashSpeed * 0.95);
        const step = effectiveSpeed;

        ninja.x += moveX * step;
        ninja.y += moveY * step;
    }
}

function prepareDash(ninja) {
    // *** DEFENSIVE CHECK: Ensure ninja object and dashDirection are valid ***
    if (!ninja || typeof ninja !== 'object') {
        console.error("CRITICAL ERROR in prepareDash: Invalid ninja object passed!", ninja);
        return; // Cannot proceed
    }
    if (typeof ninja.dashDirection !== 'object' || ninja.dashDirection === null) {
        console.error(`CRITICAL ERROR in prepareDash: ninja.dashDirection is invalid for ninja ID ${ninja.id}! Re-initializing.`, ninja);
        // Attempt fallback initialization (this might hide the root cause)
        ninja.dashDirection = { x: 0, y: 0 };
    }
    // *** END CHECK ***

    ninja.state = 'dashing';
    ninja.lastDashTime = Date.now();

    // *** Asegurar que las variables base sean números válidos ANTES de los cálculos ***
    let safeCursorX = typeof cursorX === 'number' ? cursorX : (gameContainer ? gameContainer.offsetWidth / 2 : 0); // Fallback al centro o 0
    let safeCursorY = typeof cursorY === 'number' ? cursorY : (gameContainer ? gameContainer.offsetHeight / 2 : 0); // Fallback al centro o 0
    let safeCursorVelX = typeof cursorVelX === 'number' ? cursorVelX : 0;
    let safeCursorVelY = typeof cursorVelY === 'number' ? cursorVelY : 0;

    // Determinar orbe objetivo seguro
    let safeTargetOrbX = safeCursorX; // Por defecto, la posición segura del cursor
    let safeTargetOrbY = safeCursorY;
    if (activeOrbs.length > 0 && activeOrbs[0].dataset.orbX) {
        const orbX = parseFloat(activeOrbs[0].dataset.orbX);
        const orbY = parseFloat(activeOrbs[0].dataset.orbY);
        // Usar el orbe solo si sus coordenadas son números válidos
        if (!isNaN(orbX) && !isNaN(orbY)) {
            safeTargetOrbX = orbX;
            safeTargetOrbY = orbY;
        }
    }

    // Inicializar dashTarget con valores seguros
    let dashTarget = { x: safeCursorX, y: safeCursorY };
    const dashPredictionMultiplier = 15 + orbsCollected * 0.6;
    const towardsOrbFactor = 0.3 + orbsCollected * 0.02;

    switch (ninja.currentStrategy) {
        case 'predict':
        case 'curve':
        case 'deny':
            if (cursorHistory.length >= 3) {
                // Usar variables seguras en el cálculo
                let predictedX = safeCursorX + safeCursorVelX * dashPredictionMultiplier + 0.5 * cursorAccX * Math.pow(dashPredictionMultiplier, 2) * 0.1;
                let predictedY = safeCursorY + safeCursorVelY * dashPredictionMultiplier + 0.5 * cursorAccY * Math.pow(dashPredictionMultiplier, 2) * 0.1;

                // Asegurar que la predicción no sea NaN/Infinity
                predictedX = isFinite(predictedX) ? predictedX : safeCursorX;
                predictedY = isFinite(predictedY) ? predictedY : safeCursorY;

                dashTarget.x = predictedX * (1 - towardsOrbFactor) + safeTargetOrbX * towardsOrbFactor;
                dashTarget.y = predictedY * (1 - towardsOrbFactor) + safeTargetOrbY * towardsOrbFactor;
            } else {
                dashTarget.x = safeCursorX * (1 - towardsOrbFactor) + safeTargetOrbX * towardsOrbFactor;
                dashTarget.y = safeCursorY * (1 - towardsOrbFactor) + safeTargetOrbY * towardsOrbFactor;
            }
            break;
        case 'intercept':
            if (ninja.interceptPoint && typeof ninja.interceptPoint.x === 'number' && typeof ninja.interceptPoint.y === 'number') {
                dashTarget.x = ninja.interceptPoint.x;
                dashTarget.y = ninja.interceptPoint.y;
            } else {
                console.error(`Ninja ${ninja.id} in 'intercept' state has invalid interceptPoint! Falling back.`);
                dashTarget.x = safeCursorX; // Usar fallback seguro
                dashTarget.y = safeCursorY;
            }
            break;
        case 'zigzag':
            // Usar variables seguras directamente (ya no necesita las comprobaciones locales)
            dashTarget.x = (safeCursorX + safeCursorVelX * dashPredictionMultiplier * 0.5) * (1 - towardsOrbFactor * 0.5) + safeTargetOrbX * towardsOrbFactor * 0.5;
            dashTarget.y = (safeCursorY + safeCursorVelY * dashPredictionMultiplier * 0.5) * (1 - towardsOrbFactor * 0.5) + safeTargetOrbY * towardsOrbFactor * 0.5;
            break;
        default: // Caso 'direct' y otros no específicos
            // Usar variables seguras
            dashTarget.x = safeCursorX * (1 - towardsOrbFactor) + safeTargetOrbX * towardsOrbFactor;
            dashTarget.y = safeCursorY * (1 - towardsOrbFactor) + safeTargetOrbY * towardsOrbFactor;
            break;
    }

    // *** Comprobación final antes de asignar/clampear ***
    if (typeof dashTarget.x !== 'number' || !isFinite(dashTarget.x)) {
        console.error(`Invalid dashTarget.x calculated (${dashTarget.x}) for strategy ${ninja.currentStrategy}. Falling back to ninja position.`);
        dashTarget.x = ninja.x;
    }
    if (typeof dashTarget.y !== 'number' || !isFinite(dashTarget.y)) {
        console.error(`Invalid dashTarget.y calculated (${dashTarget.y}) for strategy ${ninja.currentStrategy}. Falling back to ninja position.`);
        dashTarget.y = ninja.y;
    }

    dashTarget.x = Math.max(0, Math.min(dashTarget.x, gameContainer.offsetWidth));
    dashTarget.y = Math.max(0, Math.min(dashTarget.y, gameContainer.offsetHeight));

    const dx = dashTarget.x - ninja.x;
    const dy = dashTarget.y - ninja.y;
    const dist = Math.hypot(dx, dy);

    if (dist > 0) {
        ninja.dashDirection.x = dx / dist;
        ninja.dashDirection.y = dy / dist;
    } else {
        const angle = Math.random() * Math.PI * 2;
        ninja.dashDirection.x = Math.cos(angle);
        ninja.dashDirection.y = Math.sin(angle);
    }

    const dashDistanceFactor = Math.min(1.5, Math.max(0.8, dist / 250));
    ninja.dashDuration = Math.floor(BASE_DASH_COOLDOWN * dashDistanceFactor);

    ninja.element.classList.add('dashing');
    ninja.dashCooldownFrames = BASE_DASH_COOLDOWN + ninja.dashDuration + 10;
}

function performDash(ninja) {
    ninja.x += ninja.dashDirection.x * ninja.dashSpeed;
    ninja.y += ninja.dashDirection.y * ninja.dashSpeed;

    ninja.x = Math.max(0, Math.min(ninja.x, gameContainer.offsetWidth));
    ninja.y = Math.max(0, Math.min(ninja.y, gameContainer.offsetHeight));

    ninja.dashDuration--;

    if (ninja.dashDuration <= 0 ||
        ninja.x <= 0 || ninja.x >= gameContainer.offsetWidth ||
        ninja.y <= 0 || ninja.y >= gameContainer.offsetHeight) {

        ninja.state = 'resting';
        ninja.restTime = Math.max(5, 15 - orbsCollected * 0.2);
        ninja.element.classList.remove('dashing');
    }
}

function updateNinjaVisualPosition(ninja) { // Acepta el ninja
    let currentLerpFactor = 0.15;
    if (ninja.state === 'dashing') {
        currentLerpFactor = 0.4;
    }

    ninja.visualX += (ninja.x - ninja.visualX) * currentLerpFactor;
    ninja.visualY += (ninja.y - ninja.visualY) * currentLerpFactor;

    ninja.element.style.left = `${ninja.visualX}px`;
    ninja.element.style.top = `${ninja.visualY}px`;
}

// --- Detección de Colisiones (Refactorizado) --- //
function checkCollision(ninja) {
    if (orbsCollected === 3) {
        // Añadir log de los radios raw
        const rawNinjaSize = ninja.element.offsetWidth;
        const rawCursorSize = customCursor.offsetWidth;
        console.log(`    [RAW SIZES] Ninja ${ninja.id}: ${rawNinjaSize}x${ninja.element.offsetHeight}, Cursor: ${rawCursorSize}x${customCursor.offsetHeight}`);
    }

    if (ninja.justActivated) {
        if (orbsCollected === 3) {
            console.log(`    Grace period active, NO COLLISION w/ Ninja ${ninja.id}`);
        }
        return false;
    }

    // *** USAR TAMAÑOS CONSTANTES con valores aumentados para mayor precisión ***
    const ninjaRadius = 32; // Aumentado de 30 a 32 para mayor margen
    const cursorRadius = 12; // Aumentado de 10 a 12

    const dx = ninja.visualX - cursorX;
    const dy = ninja.visualY - cursorY;
    const distance = Math.hypot(dx, dy);

    const collisionThreshold = (ninjaRadius + cursorRadius) * 1.0; // Cambiado de 0.90 a 1.0 para no reducir el umbral

    if (orbsCollected === 3) {
        console.log(`    Distance=${distance.toFixed(1)}, Threshold=${collisionThreshold.toFixed(1)}, Collision=${distance <= collisionThreshold}`);
    }

    if (distance <= collisionThreshold) {
        return true;
    }

    // Método 2: Detección de línea mejorada para movimientos rápidos
    const cursorMovement = Math.hypot(cursorX - prevCursorX, cursorY - prevCursorY);
    if (cursorMovement > (ninjaRadius + cursorRadius) * 0.8) { // Umbral reducido para activarse con movimientos más pequeños
        return lineIntersectsCircle(
            prevCursorX, prevCursorY, cursorX, cursorY,
            ninja.visualX, ninja.visualY, ninjaRadius
        );
    }
    return false;
}

function lineIntersectsCircle(x1, y1, x2, y2, cx, cy, r) {
    // Vector del segmento de línea
    const dx = x2 - x1;
    const dy = y2 - y1;

    // Vector desde el punto inicial al centro del círculo
    const fx = cx - x1;
    const fy = cy - y1;

    // Producto punto para proyección
    const a = dx * dx + dy * dy; // Longitud del vector al cuadrado
    const b = 2 * (dx * fx + dy * fy);
    const c = (fx * fx + fy * fy) - r * r;

    // Discriminante
    let discriminant = b * b - 4 * a * c;

    if (discriminant < 0) {
        // No hay intersección
        return false;
    }

    // Calcular puntos de intersección
    discriminant = Math.sqrt(discriminant);
    const t1 = (-b - discriminant) / (2 * a);
    const t2 = (-b + discriminant) / (2 * a);

    // Verificar si la intersección está en el segmento
    return (t1 >= 0 && t1 <= 1) || (t2 >= 0 && t2 <= 1);
}

// --- Manejo de Captura (Refactorizado) --- //
function captureCursor(catchingNinja) { // Acepta el ninja que captura
    customCursor.style.transition = 'left 0.1s linear, top 0.1s linear';
    cursorX = catchingNinja.visualX;
    cursorY = catchingNinja.visualY;
    customCursor.style.left = `${cursorX}px`;
    customCursor.style.top = `${cursorY}px`;
}

function updateDifficulty(collectedCount) {
    // Calcular nuevos valores base compartidos
    const newStalkingSpeed = Math.min(BASE_STALKING_SPEED + collectedCount * 0.06, 5.0);
    const newDashSpeed = Math.min(BASE_DASH_SPEED + collectedCount * 0.12, 42);
    const newDashCooldown = Math.max(BASE_DASH_COOLDOWN - collectedCount * 0.4, 12);
    const newPredictionFactor = Math.min(BASE_PREDICTION_FACTOR + collectedCount * 0.01, 0.95);
    BASE_CURVE_FACTOR = Math.min(0.25 + collectedCount * 0.015, 0.8);
    BASE_AGGRESSION_FACTOR = Math.max(1.2, 1.6 - (playerAvoidScore * 0.01)) + collectedCount * 0.015;

    // Aplicar a todos los ninjas activos
    ninjas.forEach(ninja => {
        if (ninja.isActive) {
            ninja.stalkingSpeed = newStalkingSpeed;
            ninja.dashSpeed = newDashSpeed;
            // BASE_DASH_COOLDOWN se usa directamente en prepareDash/moveNinja
            ninja.predictionFactor = newPredictionFactor;
            ninja.curveFactor = BASE_CURVE_FACTOR;
            ninja.aggressionFactor = BASE_AGGRESSION_FACTOR;

            // Actualizar el color del ninja basado en su agresividad actual
            updateNinjaColor(ninja);
        }
    });

    if (collectedCount === 10) {
        console.log(`updateDifficulty(${collectedCount}): About to check for activating ninja 1, isActive=${ninjas[1].isActive}`);
    }

    // *** Activar Segundo Ninja ***
    if (collectedCount >= 10 && !ninjas[1].isActive) {
        console.log(`ACTIVATING NINJA 1 at orbs=${collectedCount}`);
        activateSecondNinja();
        // *** Dar aún más tiempo de gracia al jugador ***
        setTimeout(() => {
            console.log("Extra grace timeout completed.");
        }, 500); // 500ms de tiempo extra
    }
}

function activateSecondNinja() {
    const ninja1 = ninjas[1];
    const ninja0 = ninjas[0]; // Asumir que ninja 0 siempre está activo

    if (ninja1.isActive) return; // Ya está activo, no hacer nada

    ninja1.isActive = true;
    ninja1.state = 'stalking';

    // --- Lógica de Posicionamiento Mejorada ---
    const centerX = gameContainer.offsetWidth / 2;
    const centerY = gameContainer.offsetHeight / 2;
    let targetX, targetY;

    // Intentar posicionar opuesto a ninja0 relativo al centro
    if (ninja0 && ninja0.isActive) {
        const dx0 = ninja0.x - centerX;
        const dy0 = ninja0.y - centerY;
        targetX = centerX - dx0;
        targetY = centerY - dy0;
    } else {
        // Fallback si ninja0 no está (raro), poner en esquina opuesta al cursor
        targetX = cursorX < centerX ? gameContainer.offsetWidth - 75 : 75;
        targetY = cursorY < centerY ? gameContainer.offsetHeight - 75 : 75;
    }

    // Asegurar distancia mínima del cursor
    const minDistCursor = 200; // Distancia mínima segura al cursor
    let dxCursor = targetX - cursorX;
    let dyCursor = targetY - cursorY;
    let distCursorSq = dxCursor * dxCursor + dyCursor * dyCursor;

    // Si está demasiado cerca del cursor, recalcular posición lejos del cursor
    if (distCursorSq < minDistCursor * minDistCursor) {
        console.log("Ninja 1 initial pos too close to cursor, pushing away...");
        const angleFromCursor = Math.atan2(dyCursor, dxCursor); // Ángulo desde cursor a pos calculada

        // *** CORRECCIÓN: Usar '+' para empujar EN la dirección, no '-' que invierte ***
        targetX = cursorX + Math.cos(angleFromCursor) * minDistCursor;
        targetY = cursorY + Math.sin(angleFromCursor) * minDistCursor;
    }

    // Asegurar que esté dentro de los límites con margen
    const margin = 75; // Margen con los bordes
    ninja1.x = Math.max(margin, Math.min(targetX, gameContainer.offsetWidth - margin));
    ninja1.y = Math.max(margin, Math.min(targetY, gameContainer.offsetHeight - margin));

    ninja1.visualX = ninja1.x;
    ninja1.visualY = ninja1.y;
    // --- Fin Lógica de Posicionamiento ---

    // --- Asegurar que el Ninja es visible visualmente ---
    ninja1.element.classList.add('active'); // Usar la clase que muestra el elemento
    ninja1.element.style.left = `${ninja1.visualX}px`;
    ninja1.element.style.top = `${ninja1.visualY}px`;

    // Medidas adicionales para la visibilidad
    ninja1.element.style.display = 'block';
    ninja1.element.style.visibility = 'visible';
    ninja1.element.style.opacity = '1';

    // Debug: Imprimir tamaño
    console.log(`Ninja 1 activado. Dimensiones: ${ninja1.element.offsetWidth}x${ninja1.element.offsetHeight}`);

    // Asegurar que la estrategia se aplica correctamente
    ninja1.currentStrategy = 'direct';
    ninja1.element.classList.add(ninja1.currentStrategy);
    changeStrategy(ninja1);

    ninja1.justActivated = true; // Activar frame de gracia
    console.log(`Segundo ninja activado at: (${ninja1.x.toFixed(0)}, ${ninja1.y.toFixed(0)})`);
}

function endGame(catchingNinja) {
    console.log(`END GAME called, caught by ninja ${catchingNinja.id}, orbs=${orbsCollected}`);

    gameActive = false;

    // Aplicar efecto al ninja que captura
    catchingNinja.element.style.boxShadow = '0 0 30px red';
    catchingNinja.element.style.transform = 'translate(-50%, -50%) scale(1.2)';

    // Detener al otro ninja si existe
    ninjas.forEach(ninja => {
        if (ninja !== catchingNinja) {
            ninja.state = 'inactive'; // O 'resting'
            ninja.isActive = false;
        }
    });

    gameOverMessage.style.display = 'block';
    gameOverMessage.innerHTML = `¡Te atrapó!<br>Recolectaste ${orbsCollected} orbes<br><br>Click para jugar de nuevo`;

    gameContainer.addEventListener('click', initializeGame, { once: true });
}

// --- Inicio --- //
document.addEventListener('DOMContentLoaded', () => {
    // Crear el footer con los créditos
    const footer = document.createElement('div');
    footer.className = 'game-footer';
    footer.innerHTML = `
        <p>Juego creado mediante <strong>vibe coding</strong> usando <span class="ai-model">Claude-3.7-Sonnet</span> y <span class="ai-model">Gemini-2-5 Pro Max</span></p>
        <p>Costo de desarrollo: USD 6,50</p>
        <p>Creador: <a href="https://github.com/santiago-paz" target="_blank">@santiago-paz</a></p>
        <p>Proyecto profesional: <a href="https://www.reema.ar" target="_blank">Reema</a></p>
    `;

    // Agregar estilos para el footer
    const footerStyle = document.createElement('style');
    footerStyle.textContent = `
        .game-footer {
            padding: 15px 20px;
            background-color: #f5f5f5;
            border-radius: 8px;
            text-align: center;
            font-family: Arial, sans-serif;
            color: #333;
            width: 100%;
            max-width: 800px;
            margin-left: auto;
            margin-right: auto;
            display: block;
            box-sizing: border-box;
            clear: both;
        }
        .game-footer p {
            margin: 5px 0;
        }
        .game-footer a {
            color: #0066cc;
            text-decoration: none;
        }
        .game-footer a:hover {
            text-decoration: underline;
        }
        .ai-model {
            color: #9c27b0;
            font-weight: bold;
        }
        body {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            min-height: 100vh;
            padding: 20px 0;
        }
    `;
    document.head.appendChild(footerStyle);

    // Insertar el footer después del contenedor del juego
    const gameContainer = document.getElementById('game-container');
    if (gameContainer) {
        // Si el contenedor del juego existe, insertar el footer después
        gameContainer.parentNode.insertBefore(footer, gameContainer.nextSibling);
    } else {
        // Si por alguna razón no existe, añadirlo al final del body
        document.body.appendChild(footer);
    }

    initializeGame();
});

window.addEventListener('resize', () => {
    if (!gameActive) {
        ninjas.forEach(ninja => {
            // Reposicionar ninjas si la ventana cambia (podría mejorarse)
            ninja.x = gameContainer.offsetWidth / 2;
            ninja.y = gameContainer.offsetHeight / 2;
            updateNinjaVisualPosition(ninja);
        });
    }
});

// Función para establecer un punto de emboscada para un ninja
function setAmbushPoint(ninja) {
    const targetOrbIndex = Math.random() < 0.6 ? 0 : Math.floor(Math.random() * futureOrbPositions.length);
    const targetFutureOrb = futureOrbPositions[targetOrbIndex];

    if (targetFutureOrb && Math.random() < 0.4 + orbsCollected * 0.015) {
        ninja.ambushTarget.x = targetFutureOrb.x + (Math.random() - 0.5) * 150;
        ninja.ambushTarget.y = targetFutureOrb.y + (Math.random() - 0.5) * 150;
    } else if (cursorHistory.length < 5) {
        const angle = Math.random() * Math.PI * 2;
        const distance = 200 + Math.random() * 200;
        ninja.ambushTarget.x = cursorX + Math.cos(angle) * distance;
        ninja.ambushTarget.y = cursorY + Math.sin(angle) * distance;
    } else {
        const recentHistory = cursorHistory.slice(-5);
        const avgVelX = recentHistory.reduce((sum, pos) => sum + pos.velX, 0) / recentHistory.length;
        const avgVelY = recentHistory.reduce((sum, pos) => sum + pos.velY, 0) / recentHistory.length;
        const futureX = cursorX + avgVelX * 20;
        const futureY = cursorY + avgVelY * 20;
        ninja.ambushTarget.x = futureX * 2 - cursorX + (Math.random() - 0.5) * 150;
        ninja.ambushTarget.y = futureY * 2 - cursorY + (Math.random() - 0.5) * 150;
    }

    // Asegurar que el punto de emboscada esté dentro de los límites del juego
    ninja.ambushTarget.x = Math.max(0, Math.min(ninja.ambushTarget.x, gameContainer.offsetWidth));
    ninja.ambushTarget.y = Math.max(0, Math.min(ninja.ambushTarget.y, gameContainer.offsetHeight));
}

// Función para calcular el punto de intercepción para un ninja
function calculateInterceptionPoint(ninja) {
    if (cursorHistory.length < 3) {
        ninja.interceptPoint.x = cursorX;
        ninja.interceptPoint.y = cursorY;
        return;
    }

    const predictTime = 1.0;
    const recentHistory = cursorHistory.slice(-3);
    const avgVelX = recentHistory.reduce((sum, pos) => sum + pos.velX, 0) / recentHistory.length;
    const avgVelY = recentHistory.reduce((sum, pos) => sum + pos.velY, 0) / recentHistory.length;
    const avgAccX = recentHistory.reduce((sum, pos) => sum + pos.accX, 0) / recentHistory.length;
    const avgAccY = recentHistory.reduce((sum, pos) => sum + pos.accY, 0) / recentHistory.length;

    const futureX = cursorX + avgVelX * predictTime * 60 + 0.5 * avgAccX * Math.pow(predictTime * 60, 2);
    const futureY = cursorY + avgVelY * predictTime * 60 + 0.5 * avgAccY * Math.pow(predictTime * 60, 2);

    const dx = futureX - ninja.x;
    const dy = futureY - ninja.y;
    const distance = Math.hypot(dx, dy);
    const timeToReach = distance / (ninja.stalkingSpeed * 60 * ninja.aggressionFactor);

    if (timeToReach > 0) {
        const adjustedPredictTime = Math.min(predictTime, timeToReach);
        ninja.interceptPoint.x = cursorX + avgVelX * adjustedPredictTime * 60 + 0.5 * avgAccX * Math.pow(adjustedPredictTime * 60, 2);
        ninja.interceptPoint.y = cursorY + avgVelY * adjustedPredictTime * 60 + 0.5 * avgAccY * Math.pow(adjustedPredictTime * 60, 2);
    } else {
        ninja.interceptPoint.x = futureX;
        ninja.interceptPoint.y = futureY;
    }

    // Asegurar que el punto de intercepción esté dentro de los límites del juego
    ninja.interceptPoint.x = Math.max(0, Math.min(ninja.interceptPoint.x, gameContainer.offsetWidth));
    ninja.interceptPoint.y = Math.max(0, Math.min(ninja.interceptPoint.y, gameContainer.offsetHeight));
}