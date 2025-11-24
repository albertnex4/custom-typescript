// src/client/index.ts

import { initializePlayerModule } from './player/player-management';

// --- Inicialización ---

console.log('--- Iniciando Cliente RAGEMP ---');

// 1. Inicia toda la lógica del juego (registra eventos)
initializePlayerModule(); 

console.log('--- Cliente RAGEMP iniciado. Esperando compilación... ---');

// Todos los archivos importados aquí serán incluidos en el index.js final.