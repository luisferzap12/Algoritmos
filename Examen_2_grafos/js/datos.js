/* =====================================================
   datos.js
   Datos del grafo y escenarios
   ===================================================== */

var Datos = (function () {
  "use strict";

  var base = {
    nodos: {
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
    },

    aristas: [
      ["robledo", "castilla", 14],
      ["robledo", "floresta", 16],
      ["castilla", "prado", 15],
      ["castilla", "centro", 18],
      ["floresta", "centro", 20],
      ["floresta", "fraternidad", 25],
      ["prado", "centro", 7],
      ["prado", "fraternidad", 8],
      ["centro", "fraternidad", 9]
    ]
  };

  function copiarGrafo() {
    return {
      nodos: JSON.parse(JSON.stringify(base.nodos)),
      aristas: base.aristas.map(function (a) {
        return [a[0], a[1], a[2]];
      })
    };
  }

  function grafoBase() {
    return copiarGrafo();
  }

  function listarEscenarios() {
    return [
      {
        clave: "normal",
        etiqueta: "Escenario normal",
        descripcion: "Tiempos normales de recorrido."
      }
    ];
  }

  function conEscenario(clave) {
    return copiarGrafo();
  }

  return {
    grafoBase: grafoBase,
    listarEscenarios: listarEscenarios,
    conEscenario: conEscenario
  };
})();
