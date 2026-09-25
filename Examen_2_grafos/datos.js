// =====================================================
// DATOS DEL GRAFO
// Rutas entre sedes del ITM y el Centro
// =====================================================

// Nodos: sedes del ITM y el Centro
const lugares = {
  robledo: {
    nombre: "ITM Robledo",
    x: 90,
    y: 90
  },

  castilla: {
    nombre: "ITM Castilla",
    x: 330,
    y: 60
  },

  floresta: {
    nombre: "ITM Floresta",
    x: 90,
    y: 300
  },

  prado: {
    nombre: "ITM Prado",
    x: 520,
    y: 140
  },

  centro: {
    nombre: "Centro",
    x: 330,
    y: 240
  },

  fraternidad: {
    nombre: "ITM Fraternidad",
    x: 520,
    y: 330
  }
};

// Aristas: conexiones entre lugares y tiempo en minutos
// El grafo es no dirigido.
const vias = [
  ["robledo", "castilla", 14],
  ["robledo", "floresta", 16],
  ["castilla", "prado", 15],
  ["castilla", "centro", 18],
  ["floresta", "centro", 20],
  ["floresta", "fraternidad", 25],
  ["prado", "centro", 7],
  ["prado", "fraternidad", 8],
  ["centro", "fraternidad", 9]
];
