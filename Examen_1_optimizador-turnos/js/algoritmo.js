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
})();
