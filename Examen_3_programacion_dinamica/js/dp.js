/* =====================================================================
   dp.js  —  Integrante 3
   El algoritmo: mochila 0/1 resuelta por TABULACIÓN (bottom-up).

   Problema (asignador de aulas): un aula tiene `capacidad` puestos y hay
   `n` grupos; cada grupo pide `tamano` estudiantes. Cada grupo se asigna
   completo y a lo más una vez: es una mochila 0/1 donde el "peso" y el
   "valor" de un grupo son el mismo número (cuántos estudiantes trae). Se
   busca el subconjunto de grupos cuyo total no pase de la capacidad y
   sea lo más grande posible.

   Estado       dp[i][c] = máximo de estudiantes que se pueden acomodar
                           usando los primeros i grupos con capacidad c.
   Recurrencia  dp[i][c] = dp[i-1][c]                              si tamano_i > c
                           max(dp[i-1][c],
                               tamano_i + dp[i-1][c - tamano_i])  si no
   Casos base   dp[0][c] = 0  para todo c   (sin grupos, nadie ocupa)
                dp[i][0] = 0  para todo i   (aula sin puestos)

   Cota: estados = (n+1)(C+1) y cada uno cuesta O(1) transiciones.
   Tiempo O(n·C), espacio O(n·C). Es O(n·C), no O(n·C·algo): la tabla
   entera se llena una sola vez.

   Es pseudo-polinomial en C: O(n·C) crece con el VALOR de la capacidad,
   no con los bits que la escriben (log C). Por eso no contradice que la
   mochila 0/1 sea NP-difícil: con una capacidad enorme la tabla estalla.
   ===================================================================== */

var DP = (function () {
  'use strict';

  /* El peso de un grupo es su número de estudiantes. */
  function pesoDe(grupo) {
    return grupo.tamano;
  }

  /* Matriz filas × columnas rellena con un valor constante. */
  function crearMatriz(filas, columnas, valor) {
    var m = new Array(filas);
    for (var i = 0; i < filas; i++) {
      m[i] = new Array(columnas);
      for (var c = 0; c < columnas; c++) m[i][c] = valor;
    }
    return m;
  }

  /* Tabulación pura: llena dp[i][c] para i = 1..n y c = 0..C. */
  function construirTabla(grupos, capacidad) {
    var n = grupos.length;
    var dp = crearMatriz(n + 1, capacidad + 1, 0);
    // dp[0][*] y dp[*][0] ya valen 0: son los casos base.

    for (var i = 1; i <= n; i++) {
      var peso = pesoDe(grupos[i - 1]);
      for (var c = 0; c <= capacidad; c++) {
        if (peso > c) {
          dp[i][c] = dp[i - 1][c]; // no cabe: se hereda la fila anterior
        } else {
          var sinGrupo = dp[i - 1][c];
          var conGrupo = peso + dp[i - 1][c - peso];
          dp[i][c] = conGrupo > sinGrupo ? conGrupo : sinGrupo;
        }
      }
    }
    return dp;
  }

  /* Punto de entrada: devuelve la tabla y el óptimo de la capacidad dada. */
  function mochilaMatriz(grupos, capacidad) {
    var n = grupos.length;
    var tabla = construirTabla(grupos, capacidad);
    return {
      valor: tabla[n][capacidad],
      tabla: tabla,
      capacidad: capacidad,
      n: n
    };
  }

  return {
    mochilaMatriz: mochilaMatriz,
    capacidadDe: pesoDe
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = DP;
}
