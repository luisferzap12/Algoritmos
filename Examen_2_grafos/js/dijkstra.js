/* =====================================================================
   dijkstra.js  —  Integrante 3
   Camino de costo mínimo desde un origen, con pesos no negativos.

   Hay dos implementaciones del MISMO algoritmo. Cambia solo cómo se
   busca el siguiente nodo a visitar:

     conHeap()  usa el montículo de cola-prioridad.js  ->  O((V+E) log V)
     simple()   recorre todos los nodos en cada vuelta ->  O(V²)

   Las dos devuelven siempre la misma ruta. Tener ambas permite
   comparar los tiempos reales en experimento.js y sustentar por qué la
   estructura de datos importa aunque el algoritmo sea idéntico.

   Idea del algoritmo: se mantiene una distancia provisional a cada
   nodo. En cada vuelta se toma el nodo no visitado con la menor
   distancia provisional; como los pesos no son negativos, ningún camino
   que salga de nodos más lejanos podría mejorarla, así que esa
   distancia ya es definitiva. Desde ese nodo se intenta mejorar la
   distancia de sus vecinos (relajación) y se repite.
   ===================================================================== */

var Dijkstra = (function () {
  'use strict';

  /* -------------------------------------------------------------------
     Versión con cola de prioridad. O((V + E) log V).
     ------------------------------------------------------------------- */
  function conHeap(grafo, origen, destino, opciones) {
    var traza = !opciones || opciones.traza !== false;
    var inicio = tiempoActual();

    var distancia = {};
    var anterior = {};
    var visitado = {};
    var pasos = [];
    var orden = [];

    Grafo.listaNodos(grafo).forEach(function (id) {
      distancia[id] = Infinity;
      anterior[id] = null;
      visitado[id] = false;
    });
    distancia[origen] = 0;

    var cola = ColaPrioridad.crear();
    ColaPrioridad.insertar(cola, origen, 0);

    if (traza) {
      pasos.push(paso('inicio', origen,
        'Todas las distancias empiezan en infinito, salvo el origen, que vale 0.'));
    }

    while (!ColaPrioridad.vacia(cola)) {
      var tope = ColaPrioridad.extraerMin(cola);
      var actual = tope.valor;

      // Borrado perezoso: si un nodo mejoró su distancia se insertó otra
      // vez, así que puede aparecer repetido. Las copias viejas se
      // ignoran al salir.
      if (visitado[actual]) continue;

      visitado[actual] = true;
      orden.push(actual);

      if (traza) {
        pasos.push(paso('visita', actual,
          'Visito ' + nombre(grafo, actual) + ' con ' + distancia[actual] +
          ' min. Esa distancia ya es definitiva.'));
      }

      if (actual === destino) {
        if (traza) {
          pasos.push(paso('fin', actual,
            'Llegué al destino: no hace falta seguir explorando.'));
        }
        break;
      }

      Grafo.vecinos(grafo, actual).forEach(function (arista) {
        if (visitado[arista.vecino]) return;

        var candidata = distancia[actual] + arista.peso;

        if (candidata < distancia[arista.vecino]) {
          if (traza) {
            pasos.push(paso('mejora', arista.vecino,
              nombre(grafo, arista.vecino) + ': ' + distancia[actual] + ' + ' +
              arista.peso + ' = ' + candidata + ' min' +
              (distancia[arista.vecino] === Infinity
                ? ' (primera ruta conocida)'
                : ' — mejora los ' + distancia[arista.vecino] + ' min anteriores')));
          }
          distancia[arista.vecino] = candidata;
          anterior[arista.vecino] = actual;
          ColaPrioridad.insertar(cola, arista.vecino, candidata);
        } else if (traza) {
          pasos.push(paso('descarta', arista.vecino,
            nombre(grafo, arista.vecino) + ': ' + distancia[actual] + ' + ' +
            arista.peso + ' = ' + candidata + ' min, no mejora los ' +
            distancia[arista.vecino] + ' min que ya tenía.'));
        }
      });
    }

    return armarResultado(grafo, origen, destino, distancia, anterior, pasos,
                          orden, cola.operaciones, tiempoActual() - inicio, 'heap');
  }

  /* -------------------------------------------------------------------
     Versión sin cola de prioridad. O(V²): en cada vuelta recorre todos
     los nodos para encontrar el mínimo.
     ------------------------------------------------------------------- */
  function simple(grafo, origen, destino, opciones) {
    var traza = !opciones || opciones.traza !== false;
    var inicio = tiempoActual();

    var distancia = {};
    var anterior = {};
    var visitado = {};
    var pasos = [];
    var orden = [];
    var operaciones = 0;

    var ids = Grafo.listaNodos(grafo);
    ids.forEach(function (id) {
      distancia[id] = Infinity;
      anterior[id] = null;
      visitado[id] = false;
    });
    distancia[origen] = 0;

    while (true) {
      var actual = null;
      for (var i = 0; i < ids.length; i++) {
        operaciones++;
        if (!visitado[ids[i]] && (actual === null || distancia[ids[i]] < distancia[actual])) {
          actual = ids[i];
        }
      }

      if (actual === null || distancia[actual] === Infinity) break;

      visitado[actual] = true;
      orden.push(actual);

      if (traza) {
        pasos.push(paso('visita', actual,
          'Visito ' + nombre(grafo, actual) + ' con ' + distancia[actual] + ' min.'));
      }

      if (actual === destino) break;

      Grafo.vecinos(grafo, actual).forEach(function (arista) {
        if (visitado[arista.vecino]) return;
        var candidata = distancia[actual] + arista.peso;
        if (candidata < distancia[arista.vecino]) {
          distancia[arista.vecino] = candidata;
          anterior[arista.vecino] = actual;
        }
      });
    }

    return armarResultado(grafo, origen, destino, distancia, anterior, pasos,
                          orden, operaciones, tiempoActual() - inicio, 'simple');
  }

  /* -------------------------------------------------------------------
     Reconstrucción de la ruta: se camina hacia atrás desde el destino
     usando el arreglo `anterior`, y al final se invierte.
     ------------------------------------------------------------------- */
  function reconstruir(anterior, origen, destino) {
    var ruta = [];
    var id = destino;
    var tope = 0;

    while (id !== null && id !== undefined) {
      ruta.unshift(id);
      if (id === origen) break;
      id = anterior[id];
      if (++tope > 10000) break; // salvaguarda contra ciclos imprevistos
    }
    return ruta[0] === origen ? ruta : [];
  }

  function armarResultado(grafo, origen, destino, distancia, anterior, pasos,
                          orden, operaciones, ms, variante) {
    var ruta = reconstruir(anterior, origen, destino);

    return {
      origen: origen,
      destino: destino,
      ruta: ruta,
      alcanzado: ruta.length > 0,
      total: ruta.length > 0 ? distancia[destino] : Infinity,
      tramos: ruta.length > 0 ? ruta.length - 1 : 0,
      distancia: distancia,
      anterior: anterior,
      pasos: pasos,
      orden: orden,
      operaciones: operaciones,
      ms: ms,
      variante: variante
    };
  }

  function paso(tipo, nodo, texto) {
    return { tipo: tipo, nodo: nodo, texto: texto };
  }

  function nombre(grafo, id) {
    return grafo.nodos[id] ? grafo.nodos[id].nombre : id;
  }

  function tiempoActual() {
    return (typeof performance !== 'undefined' && performance.now)
      ? performance.now()
      : Date.now();
  }

  return {
    conHeap: conHeap,
    simple: simple,
    reconstruir: reconstruir
  };
})();
