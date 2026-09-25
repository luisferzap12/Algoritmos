/* =====================================================================
   experimento.js  —  Luis Fernando Zapata 
   Medición empírica de la complejidad.

   Genera redes aleatorias conexas de tamaño creciente y corre sobre
   cada una las dos versiones de Dijkstra. Las dos devuelven la misma
   ruta; lo que cambia es el tiempo, y ahí se ve la diferencia entre
   O(V²) y O((V + E) log V).

   El experimento incluye una verificación: si en algún tamaño las dos
   versiones no coinciden en la distancia calculada, se reporta. Medir
   sin verificar no sirve de nada.
   ===================================================================== */

var Experimento = (function () {
  'use strict';

  /* -------------------------------------------------------------------
     Genera un grafo conexo de V nodos. Primero encadena todos los nodos
     en un camino (garantiza conexidad), luego agrega aristas extra al
     azar hasta alcanzar el grado promedio pedido.
     ------------------------------------------------------------------- */
  function grafoAleatorio(V, gradoPromedio) {
    var g = Grafo.crear(false);

    for (var i = 0; i < V; i++) {
      Grafo.agregarNodo(g, 'n' + i, { nombre: 'n' + i, x: 0, y: 0 });
    }
    for (var j = 1; j < V; j++) {
      Grafo.agregarArista(g, 'n' + (j - 1), 'n' + j, 1 + Math.floor(Math.random() * 100));
    }

    var extra = Math.max(0, Math.round((V * gradoPromedio) / 2) - (V - 1));
    var puestas = 0;
    var intentos = 0;

    while (puestas < extra && intentos < extra * 10) {
      intentos++;
      var a = Math.floor(Math.random() * V);
      var b = Math.floor(Math.random() * V);
      if (a === b) continue;
      Grafo.agregarArista(g, 'n' + a, 'n' + b, 1 + Math.floor(Math.random() * 100));
      puestas++;
    }
    return g;
  }

  /* -------------------------------------------------------------------
     Corre la comparación para una lista de tamaños.
     La traza se desactiva: construir los textos explicativos costaría
     más que el propio algoritmo y falsearía la medición.
     ------------------------------------------------------------------- */
  function comparar(tamanos, gradoPromedio) {
    var grado = gradoPromedio || 6;
    var mediciones = [];
    var discrepancias = 0;

    tamanos.forEach(function (V) {
      var g = grafoAleatorio(V, grado);
      var origen = 'n0';
      var destino = 'n' + (V - 1);

      var rHeap = Dijkstra.conHeap(g, origen, destino, { traza: false });
      var rSimple = Dijkstra.simple(g, origen, destino, { traza: false });

      if (rHeap.total !== rSimple.total) discrepancias++;

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

  /* Cuántas veces más rápida resultó la versión con montículo en el
     tamaño más grande medido. */
  function resumir(mediciones) {
    if (mediciones.length === 0) return null;
    var ultima = mediciones[mediciones.length - 1];

    return {
      V: ultima.V,
      E: ultima.E,
      msHeap: ultima.msHeap,
      msSimple: ultima.msSimple,
      vecesMasRapido: ultima.msHeap > 0 ? ultima.msSimple / ultima.msHeap : 0,
      opsHeap: ultima.opsHeap,
      opsSimple: ultima.opsSimple
    };
  }

  return {
    grafoAleatorio: grafoAleatorio,
    comparar: comparar
  };
})();
