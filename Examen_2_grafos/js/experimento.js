/* =====================================================================
   experimento.js
   Medición empírica de la complejidad.

   Genera redes aleatorias conexas de tamaño creciente y corre sobre
   cada una las dos versiones de Dijkstra.

   Se adapta a la estructura actual de grafo.js:
   Grafo.construir(datos)
   ===================================================================== */

var Experimento = (function () {
  "use strict";

  /*
   * Genera un grafo aleatorio conexo.
   *
   * Primero crea los nodos.
   * Después conecta todos los nodos en cadena para garantizar
   * que el grafo sea conexo.
   * Finalmente agrega algunas conexiones adicionales.
   */
  function grafoAleatorio(V, gradoPromedio) {
    var nodos = {};
    var aristas = [];

    // Crear los nodos
    for (var i = 0; i < V; i++) {
      nodos["n" + i] = {
        nombre: "n" + i,
        x: 0,
        y: 0
      };
    }

    // Crear un camino que conecte todos los nodos.
    // Esto garantiza que el grafo sea conexo.
    for (var j = 1; j < V; j++) {
      aristas.push([
        "n" + (j - 1),
        "n" + j,
        1 + Math.floor(Math.random() * 100)
      ]);
    }

    // Agregar aristas adicionales
    var extra = Math.max(
      0,
      Math.round((V * gradoPromedio) / 2) - (V - 1)
    );

    var puestas = 0;
    var intentos = 0;

    while (puestas < extra && intentos < extra * 10) {
      intentos++;

      var a = Math.floor(Math.random() * V);
      var b = Math.floor(Math.random() * V);

      if (a === b) {
        continue;
      }

      aristas.push([
        "n" + a,
        "n" + b,
        1 + Math.floor(Math.random() * 100)
      ]);

      puestas++;
    }

    // Convertir los datos al formato que entiende grafo.js
    return Grafo.construir({
      nodos: nodos,
      aristas: aristas
    });
  }

  /*
   * Corre la comparación para cada tamaño de grafo.
   */
  function comparar(tamanos, gradoPromedio) {
    var grado = gradoPromedio || 6;
    var mediciones = [];
    var discrepancias = 0;

    tamanos.forEach(function (V) {
      var g = grafoAleatorio(V, grado);

      var origen = "n0";
      var destino = "n" + (V - 1);

      // Dijkstra con montículo
      var rHeap = Dijkstra.conHeap(
        g,
        origen,
        destino,
        { traza: false }
      );

      // Dijkstra simple O(V²)
      var rSimple = Dijkstra.simple(
        g,
        origen,
        destino,
        { traza: false }
      );

      // Verificar que ambas versiones produzcan
      // la misma distancia mínima.
      if (rHeap.total !== rSimple.total) {
        discrepancias++;
      }

      mediciones.push({
        V: V,
        E: g.aristas.length,
        msHeap: rHeap.ms,
        msSimple: rSimple.ms,
        opsHeap: rHeap.operaciones,
        opsSimple: rSimple.operaciones,
        distancia: rHeap.total,
        coinciden: rHeap.total === rSimple.total
      });
    });

    return {
      mediciones: mediciones,
      discrepancias: discrepancias,
      resumen: resumir(mediciones)
    };
  }

  /*
   * Resume la última medición.
   */
  function resumir(mediciones) {
    if (mediciones.length === 0) {
      return null;
    }

    var ultima = mediciones[mediciones.length - 1];

    return {
      V: ultima.V,
      E: ultima.E,
      msHeap: ultima.msHeap,
      msSimple: ultima.msSimple,
      vecesMasRapido:
        ultima.msHeap > 0
          ? ultima.msSimple / ultima.msHeap
          : 0,
      opsHeap: ultima.opsHeap,
      opsSimple: ultima.opsSimple
    };
  }

  return {
    grafoAleatorio: grafoAleatorio,
    comparar: comparar
  };
})();
