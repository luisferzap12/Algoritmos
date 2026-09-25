/* =====================================================================
   alternativos.js  —  Integrante 4
   Dos algoritmos de grafos que sirven de contraste con Dijkstra.
   No están de adorno: cada uno responde una pregunta que el profesor
   puede hacer.

   1. BFS  -> "¿no bastaba con buscar el camino con menos tramos?"
   2. Bellman-Ford -> "¿y si un peso es negativo?"
   ===================================================================== */

var Alternativos = (function () {
  'use strict';

  /* -------------------------------------------------------------------
     BFS (recorrido en anchura). O(V + E).
     Encuentra el camino con MENOS TRAMOS, ignorando por completo los
     pesos. Es lo mismo que Dijkstra si todas las aristas valieran 1.

     En esta red hay una vía perimetral Robledo–Industriales de un solo
     tramo pero de 55 minutos: BFS la elige y Dijkstra no. Es la forma
     más clara de mostrar para qué sirve el peso...
     ------------------------------------------------------------------- */
  function bfs(grafo, origen, destino) {
    var anterior = {};
    var visitado = {};
    var fila = [origen];
    var operaciones = 0;

    visitado[origen] = true;
    anterior[origen] = null;

    while (fila.length > 0) {
      var actual = fila.shift();
      if (actual === destino) break;

      Grafo.vecinos(grafo, actual).forEach(function (arista) {
        operaciones++;
        if (!visitado[arista.vecino]) {
          visitado[arista.vecino] = true;
          anterior[arista.vecino] = actual;
          fila.push(arista.vecino);
        }
      });
    }

    var ruta = Dijkstra.reconstruir(anterior, origen, destino);

    return {
      ruta: ruta,
      alcanzado: ruta.length > 0,
      tramos: ruta.length > 0 ? ruta.length - 1 : 0,
      // Cuánto tiempo cuesta realmente el camino que eligió BFS.
      minutos: ruta.length > 0 ? costoDeRuta(grafo, ruta) : Infinity,
      operaciones: operaciones
    };
  }

  /* Suma los pesos de las aristas de una ruta concreta. */
  function costoDeRuta(grafo, ruta) {
    var total = 0;

    for (var i = 0; i < ruta.length - 1; i++) {
      var vecinos = Grafo.vecinos(grafo, ruta[i]);
      var mejor = Infinity;

      for (var j = 0; j < vecinos.length; j++) {
        if (vecinos[j].vecino === ruta[i + 1] && vecinos[j].peso < mejor) {
          mejor = vecinos[j].peso;
        }
      }
      if (mejor === Infinity) return Infinity;
      total += mejor;
    }
    return total;
  }

  /* -------------------------------------------------------------------
     Bellman-Ford. O(V · E).
     Relaja TODAS las aristas V-1 veces. Es más lento que Dijkstra, pero
     soporta pesos negativos y detecta ciclos negativos.

     Por qué funciona donde Dijkstra falla: Dijkstra da por definitiva la
     distancia de un nodo en el momento de visitarlo, apostando a que
     ningún camino posterior puede mejorarla. Esa apuesta solo es válida
     si los pesos no son negativos. Bellman-Ford no cierra nada: sigue
     viendo hasta que ninguna arista mejore...
     ------------------------------------------------------------------- */
  function bellmanFord(grafo, origen) {
    var distancia = {};
    var anterior = {};
    var operaciones = 0;

    var ids = Grafo.listaNodos(grafo);
    ids.forEach(function (id) {
      distancia[id] = Infinity;
      anterior[id] = null;
    });
    distancia[origen] = 0;

    // V-1 pasadas bastan: cualquier camino más corto tiene a lo sumo
    // V-1 aristas.
    for (var i = 0; i < ids.length - 1; i++) {
      var huboCambio = false;

      grafo.aristas.forEach(function (a) {
        operaciones++;
        if (relajar(distancia, anterior, a.desde, a.hasta, a.peso)) huboCambio = true;
        if (!grafo.dirigido) {
          if (relajar(distancia, anterior, a.hasta, a.desde, a.peso)) huboCambio = true;
        }
      });

      if (!huboCambio) break; // ya convergió, no hace falta seguir
    }

    // Una pasada extra: si todavía mejora algo, hay un ciclo negativo.
    var cicloNegativo = false;
    grafo.aristas.forEach(function (a) {
      if (distancia[a.desde] !== Infinity &&
          distancia[a.desde] + a.peso < distancia[a.hasta]) {
        cicloNegativo = true;
      }
    });

    return {
      distancia: distancia,
      anterior: anterior,
      cicloNegativo: cicloNegativo,
      operaciones: operaciones
    };
  }

  function relajar(distancia, anterior, desde, hasta, peso) {
    if (distancia[desde] === Infinity) return false;
    if (distancia[desde] + peso < distancia[hasta]) {
      distancia[hasta] = distancia[desde] + peso;
      anterior[hasta] = desde;
      return true;
    }
    return false;
  }

  /* -------------------------------------------------------------------
     Demostración del límite de Dijkstra.
     Corre los dos algoritmos sobre el grafo con una arista negativa y
     devuelve las distancias de cada uno para ponerlas lado a lado...
     ------------------------------------------------------------------- */
  function compararConNegativos() {
    var g = Datos.grafoNegativo();

    var porDijkstra = Dijkstra.conHeap(g, 'A', 'D', { traza: false });
    var porBellman = bellmanFord(g, 'A');

    var filas = Grafo.listaNodos(g).map(function (id) {
      return {
        nodo: id,
        dijkstra: porDijkstra.distancia[id],
        bellman: porBellman.distancia[id],
        coincide: porDijkstra.distancia[id] === porBellman.distancia[id]
      };
    });

    return {
      filas: filas,
      cicloNegativo: porBellman.cicloNegativo,
      hayDiscrepancia: filas.some(function (f) { return !f.coincide; })
    };
  }

  return {
    bfs: bfs,
    costoDeRuta: costoDeRuta,
    bellmanFord: bellmanFord,
    compararConNegativos: compararConNegativos
  };
})();
