/* =====================================================
   grafo.js
   Construcción y consulta del grafo
   ===================================================== */

var Grafo = (function () {
  "use strict";

  // Construye la lista de adyacencia a partir de los datos
  function construir(datos) {
    var grafo = {
      nodos: datos.nodos,
      aristas: datos.aristas,
      vecinos: {}
    };

    // Crear lista vacía de vecinos para cada nodo
    listaNodos(grafo).forEach(function (id) {
      grafo.vecinos[id] = [];
    });

    // El grafo es NO dirigido:
    // cada vía se agrega en los dos sentidos.
    datos.aristas.forEach(function (arista) {
      var origen = arista[0];
      var destino = arista[1];
      var peso = arista[2];

      grafo.vecinos[origen].push({
        vecino: destino,
        peso: peso
      });

      grafo.vecinos[destino].push({
        vecino: origen,
        peso: peso
      });
    });

    return grafo;
  }

  // Devuelve la lista de identificadores de los nodos
  function listaNodos(grafo) {
    return Object.keys(grafo.nodos);
  }

  // Devuelve los vecinos de un nodo
  function vecinos(grafo, id) {
    return grafo.vecinos[id] || [];
  }

  // Devuelve estadísticas básicas del grafo
  function estadisticas(grafo) {
    var V = listaNodos(grafo).length;
    var totalGrados = 0;

    listaNodos(grafo).forEach(function (id) {
      totalGrados += grafo.vecinos[id].length;
    });

    // Cada arista aparece dos veces porque el grafo es no dirigido
    var E = totalGrados / 2;

    return {
      V: V,
      E: E,
      gradoPromedio: V === 0 ? 0 : totalGrados / V,
      conexo: esConexo(grafo)
    };
  }

  // Comprueba si todos los nodos están conectados
  function esConexo(grafo) {
    var nodos = listaNodos(grafo);

    if (nodos.length === 0) {
      return true;
    }

    var visitados = {};
    var cola = [nodos[0]];

    visitados[nodos[0]] = true;

    while (cola.length > 0) {
      var actual = cola.shift();

      grafo.vecinos[actual].forEach(function (conexion) {
        var vecino = conexion.vecino;

        if (!visitados[vecino]) {
          visitados[vecino] = true;
          cola.push(vecino);
        }
      });
    }

    return Object.keys(visitados).length === nodos.length;
  }

  // Construir el grafo base usando los datos de Datos
  function grafoBase() {
    return construir(Datos.grafoBase());
  }

  return {
    construir: construir,
    listaNodos: listaNodos,
    vecinos: vecinos,
    estadisticas: estadisticas,
    esConexo: esConexo,
    grafoBase: grafoBase
  };
})();
