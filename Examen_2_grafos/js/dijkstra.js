/* =====================================================
   dijkstra.js
   Algoritmo de Dijkstra
   Integrante 2
   ===================================================== */

var Dijkstra = (function () {
  "use strict";

  function ejecutar(grafo, origen, destino) {
    var distancias = {};
    var anterior = {};
    var visitados = {};
    var pasos = [];
    var orden = [];

    // PASO 1:
    // Inicializamos todas las distancias en infinito.
    // La distancia del origen comienza en 0.
    Grafo.listaNodos(grafo).forEach(function (nodo) {
      distancias[nodo] = Infinity;
      anterior[nodo] = null;
      visitados[nodo] = false;
    });

    distancias[origen] = 0;

    // PASOS 2 y 3:
    // Elegimos el nodo no visitado con menor distancia
    // y revisamos sus vecinos.
    while (true) {
      var actual = null;
      var menor = Infinity;

      Grafo.listaNodos(grafo).forEach(function (nodo) {
        if (!visitados[nodo] && distancias[nodo] < menor) {
          menor = distancias[nodo];
          actual = nodo;
        }
      });

      // No quedan nodos alcanzables.
      if (actual === null) {
        break;
      }

      visitados[actual] = true;
      orden.push(actual);

      pasos.push(
        "Se visita " +
          grafo.nodos[actual].nombre +
          " con distancia " +
          distancias[actual] +
          " minutos."
      );

      // Si llegamos al destino, podemos terminar.
      if (actual === destino) {
        break;
      }

      grafo.vecinos[actual].forEach(function (conexion) {
        var vecino = conexion.vecino;
        var nuevaDistancia =
          distancias[actual] + conexion.peso;

        if (
          !visitados[vecino] &&
          nuevaDistancia < distancias[vecino]
        ) {
          distancias[vecino] = nuevaDistancia;
          anterior[vecino] = actual;

          pasos.push(
            "Se mejora " +
              grafo.nodos[vecino].nombre +
              " a " +
              nuevaDistancia +
              " minutos pasando por " +
              grafo.nodos[actual].nombre +
              "."
          );
        }
      });
    }

    // PASO 4:
    // Reconstruimos la ruta desde el destino hacia el origen.
    var ruta = [];

    if (distancias[destino] !== Infinity) {
      var actualRuta = destino;

      while (actualRuta !== null) {
        ruta.unshift(actualRuta);
        actualRuta = anterior[actualRuta];
      }
    }

    return {
      distancia: distancias[destino],
      distancias: distancias,
      anterior: anterior,
      ruta: ruta,
      orden: orden,
      pasos: pasos
    };
  }

  return {
    ejecutar: ejecutar,
    conHeap: ejecutar
  };
})();
