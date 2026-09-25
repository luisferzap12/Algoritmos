/* =====================================================
   datos.js
   Datos del grafo y escenarios
   ===================================================== */

var Datos = (function () {
  "use strict";

  /* ---------------------------------------------------
     Grafo base: 11 sedes / puntos de referencia,
     20 vías (aristas no dirigidas, peso en minutos).
     --------------------------------------------------- */
  var base = {
    nodos: {
      robledo:      { nombre: "ITM Robledo",      x: 60,  y: 180 },
      castilla:     { nombre: "ITM Castilla",     x: 320, y: 60  },
      floresta:     { nombre: "ITM Floresta",     x: 160, y: 80  },
      prado:        { nombre: "Prado",            x: 560, y: 160 },
      centro:       { nombre: "Centro",           x: 340, y: 240 },
      fraternidad:  { nombre: "ITM Fraternidad",  x: 560, y: 320 },
      industriales: { nombre: "Industriales",     x: 400, y: 420 },
      laureles:     { nombre: "Laureles",         x: 60,  y: 340 },
      aranjuez:     { nombre: "Aranjuez",         x: 480, y: 60  },
      belen:        { nombre: "Belén",            x: 60,  y: 460 },
      estadio:      { nombre: "Estadio",          x: 200, y: 220 }
    },

    // [origen, destino, minutos]
    aristas: [
      ["robledo",      "castilla",     14],
      ["robledo",      "floresta",     16],
      ["robledo",      "laureles",     10],
      ["robledo",      "industriales", 55], // vía perimetral directa (el "atajo" engañoso)
      ["castilla",     "prado",        15],
      ["castilla",     "centro",       10],
      ["castilla",     "aranjuez",     12],
      ["floresta",     "centro",       20],
      ["floresta",     "belen",        18],
      ["floresta",     "estadio",       9],
      ["laureles",     "belen",        11],
      ["laureles",     "estadio",       8],
      ["belen",        "industriales", 21],
      ["prado",        "centro",        7],
      ["prado",        "fraternidad",   8],
      ["prado",        "aranjuez",      9],
      ["centro",       "fraternidad",   9],
      ["centro",       "industriales", 14],
      ["fraternidad",  "industriales", 12],
      ["estadio",      "centro",       13]
    ]
  };

  function copiarGrafo(datosGrafo) {
    return {
      nodos: JSON.parse(JSON.stringify(datosGrafo.nodos)),
      aristas: datosGrafo.aristas.map(function (a) {
        return [a[0], a[1], a[2]];
      })
    };
  }

  function grafoBase() {
    return copiarGrafo(base);
  }

  /* ---------------------------------------------------
     Escenarios: cada uno transforma una copia del
     grafo base. Nunca se muta 'base' directamente.
     --------------------------------------------------- */

  function buscarArista(aristas, a, b) {
    for (var i = 0; i < aristas.length; i++) {
      var e = aristas[i];
      if ((e[0] === a && e[1] === b) || (e[0] === b && e[1] === a)) {
        return e;
      }
    }
    return null;
  }

  function quitarArista(aristas, a, b) {
    return aristas.filter(function (e) {
      var esEsta = (e[0] === a && e[1] === b) || (e[0] === b && e[1] === a);
      return !esEsta;
    });
  }

  function quitarTodasLasAristasDe(aristas, nodo) {
    return aristas.filter(function (e) {
      return e[0] !== nodo && e[1] !== nodo;
    });
  }

  var escenarios = {
    normal: {
      etiqueta: "Escenario normal",
      descripcion: "Tiempos normales de recorrido, sin novedades en la red.",
      aplicar: function (g) {
        return g;
      }
    },

    hora_pico: {
      etiqueta: "Hora pico",
      descripcion:
        "El tráfico en las vías principales (no metro) se duplica. Las vías periféricas casi no cambian.",
      aplicar: function (g) {
        var viasCongestionadas = [
          ["robledo", "castilla"],
          ["castilla", "centro"],
          ["centro", "industriales"],
          ["robledo", "industriales"]
        ];
        viasCongestionadas.forEach(function (par) {
          var e = buscarArista(g.aristas, par[0], par[1]);
          if (e) e[2] = Math.round(e[2] * 1.8);
        });
        return g;
      }
    },

    cierre_via: {
      etiqueta: "Cierre de vía",
      descripcion:
        "La vía Prado–Centro está cerrada por obras. Dijkstra debe rodear por otro camino.",
      aplicar: function (g) {
        g.aristas = quitarArista(g.aristas, "prado", "centro");
        return g;
      }
    },

    corredor_metro: {
      etiqueta: "Corredor del metro",
      descripcion:
        "El corredor Centro–Fraternidad–Industriales se comporta como línea de metro: mucho más rápido.",
      aplicar: function (g) {
        var corredor = [
          ["centro", "fraternidad"],
          ["fraternidad", "industriales"],
          ["centro", "industriales"]
        ];
        corredor.forEach(function (par) {
          var e = buscarArista(g.aristas, par[0], par[1]);
          if (e) e[2] = Math.max(2, Math.round(e[2] * 0.35));
        });
        return g;
      }
    },

    sede_incomunicada: {
      etiqueta: "Sede incomunicada",
      descripcion:
        "Aranjuez queda sin ninguna vía habilitada. Sirve para ver el caso en que no existe ruta.",
      aplicar: function (g) {
        g.aristas = quitarTodasLasAristasDe(g.aristas, "aranjuez");
        return g;
      }
    }
  };

  function listarEscenarios() {
    return Object.keys(escenarios).map(function (clave) {
      return {
        clave: clave,
        etiqueta: escenarios[clave].etiqueta,
        descripcion: escenarios[clave].descripcion
      };
    });
  }

  function conEscenario(clave) {
    var g = grafoBase();
    var escenario = escenarios[clave] || escenarios.normal;
    return escenario.aplicar(g);
  }

  /* ---------------------------------------------------
     Grafo dirigido con peso negativo (4 nodos).
     Demuestra que Dijkstra falla cuando hay pesos
     negativos, y por qué Bellman-Ford sí lo resuelve.

     Formato distinto al grafo principal a propósito:
     Alternativos.bellmanFord() lee a.desde / a.hasta / a.peso
     (objetos, no arreglos) y usa 'dirigido' para no relajar
     en ambos sentidos. Alternativos.compararConNegativos()
     llama a Dijkstra.conHeap(g, 'A', 'D', ...) directo, sin
     pasar por Grafo.construir(), así que 'vecinos' ya debe
     venir armado aquí, y solo en el sentido de cada arista.

     A -> B : 2
     A -> C : 3
     C -> B : -2
     B -> D : 1

     Distancia real desde A: A=0, B=1 (por A->C->B = 1),
     C=3, D=2 (por B->D = 1+1).
     Dijkstra (sin reabrir nodos) cierra B en 2 apenas lo saca
     de la cola, antes de procesar C, así que nunca aplica la
     mejora de -2: reporta B=2 (incorrecto) y D=3 (incorrecto).
     --------------------------------------------------- */
  function grafoNegativo() {
    return {
      origen: "A",
      destino: "D",
      dirigido: true,
      nodos: {
        A: { nombre: "A" },
        B: { nombre: "B" },
        C: { nombre: "C" },
        D: { nombre: "D" }
      },
      aristas: [
        { desde: "A", hasta: "B", peso: 2 },
        { desde: "A", hasta: "C", peso: 3 },
        { desde: "C", hasta: "B", peso: -2 },
        { desde: "B", hasta: "D", peso: 1 }
      ],
      vecinos: {
        A: [
          { vecino: "B", peso: 2 },
          { vecino: "C", peso: 3 }
        ],
        B: [{ vecino: "D", peso: 1 }],
        C: [{ vecino: "B", peso: -2 }],
        D: []
      }
    };
  }

  return {
    grafoBase: grafoBase,
    listarEscenarios: listarEscenarios,
    conEscenario: conEscenario,
    grafoNegativo: grafoNegativo
  };
})();
