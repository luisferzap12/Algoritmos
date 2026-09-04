var Algoritmo = (function () {
  "use strict";

  /* -------------------------------------------------------------------
     Merge Sort — estable, O(n log n) en el peor caso.
     Recibe un contador para instrumentar el número de comparaciones.
     ------------------------------------------------------------------- */
  function mergeSort(lista, comparar, contador) {
    if (lista.length <= 1) return lista;

    var medio = Math.floor(lista.length / 2);
    var izquierda = mergeSort(lista.slice(0, medio), comparar, contador);
    var derecha = mergeSort(lista.slice(medio), comparar, contador);

    return mezclar(izquierda, derecha, comparar, contador);
  }

  function mezclar(a, b, comparar, contador) {
    var resultado = [];
    var i = 0;
    var j = 0;

    while (i < a.length && j < b.length) {
      contador.comparaciones++;
      // <= mantiene la estabilidad: ante empates gana quien llegó primero.
      if (comparar(a[i], b[j]) <= 0) {
        resultado.push(a[i++]);
      } else {
        resultado.push(b[j++]);
      }
    }
    while (i < a.length) resultado.push(a[i++]);
    while (j < b.length) resultado.push(b[j++]);

    return resultado;
  }

  /* -------------------------------------------------------------------
     Criterios de comparación
     ------------------------------------------------------------------- */
  var porDuracionAsc = function (a, b) {
    return a.duracion - b.duracion;
  };
  var porDuracionDesc = function (a, b) {
    return b.duracion - a.duracion;
  };

  /* -------------------------------------------------------------------
     ordenar(): envoltura instrumentada. Devuelve el orden resultante,
     el número de comparaciones y el tiempo de ejecución medido.
     ------------------------------------------------------------------- */
  function ordenar(tareas, comparar) {
    var contador = { comparaciones: 0 };
    var inicio = performance.now();
    var orden = mergeSort(tareas.slice(), comparar, contador);
    var fin = performance.now();

    return {
      orden: orden,
      comparaciones: contador.comparaciones,
      ms: fin - inicio,
    };
  }

  /* -------------------------------------------------------------------
     ELECCIÓN VORAZ (greedy choice):
     en cada paso se atiende la tarea pendiente de menor duración.
     Ordenar ascendentemente por duración equivale a aplicar esa
     elección n veces, y por el argumento de intercambio es el óptimo
     global para minimizar la espera promedio.
     ------------------------------------------------------------------- */
  function spt(tareas) {
    return ordenar(tareas, porDuracionAsc);
  }

  /* Contraejemplo deliberado: la elección voraz invertida (la tarea más
     larga primero) produce el PEOR orden posible. Sirve para demostrar
     que el criterio de la elección es lo que hace óptimo al algoritmo. */
  function lpt(tareas) {
    return ordenar(tareas, porDuracionDesc);
  }

  /* -------------------------------------------------------------------
     Barajado Fisher-Yates, O(n): genera el "orden aleatorio" contra el
     que el examen pide comparar.
     ------------------------------------------------------------------- */
  function barajar(tareas) {
    var copia = tareas.slice();
    for (var i = copia.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = copia[i];
      copia[i] = copia[j];
      copia[j] = tmp;
    }
    return copia;
  }

  /* -------------------------------------------------------------------
     Banco de pruebas empírico: mide el tiempo real de ordenamiento para
     tamaños crecientes de n y lo contrasta con la curva teórica
     c · n · log2(n). Es la evidencia experimental de la complejidad.
     ------------------------------------------------------------------- */
  function benchmark(tamanos) {
    var mediciones = [];

    for (var k = 0; k < tamanos.length; k++) {
      var n = tamanos[k];
      var sinteticas = [];
      for (var i = 0; i < n; i++) {
        sinteticas.push({
          id: i,
          nombre: "t" + i,
          duracion: 1 + Math.floor(Math.random() * 240),
        });
      }
      var r = spt(sinteticas);
      mediciones.push({
        n: n,
        ms: r.ms,
        comparaciones: r.comparaciones,
        teorico: n * Math.log2(n), // n·log n sin constante
      });
    }

    // Escalamos la curva teórica al último punto medido para poder
    // superponerla con los tiempos reales en la misma gráfica.
    var ultima = mediciones[mediciones.length - 1];
    var escala = ultima.teorico > 0 ? ultima.ms / ultima.teorico : 0;
    for (var m = 0; m < mediciones.length; m++) {
      mediciones[m].teoricoEscalado = mediciones[m].teorico * escala;
    }

    return mediciones;
  }

  return {
    mergeSort: mergeSort,
    ordenar: ordenar,
    spt: spt,
    lpt: lpt,
    barajar: barajar,
    benchmark: benchmark,
    porDuracionAsc: porDuracionAsc,
    porDuracionDesc: porDuracionDesc,
  };
})();
