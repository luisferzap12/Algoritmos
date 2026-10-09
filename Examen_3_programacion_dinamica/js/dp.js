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

  /* Tabulación pura: llena dp[i][c] para i = 1..n y c = 0..C.
     Si recibe un arreglo `pasos`, registra allí cada celda calculada en
     orden topológico (fila por fila), que es lo que anima la traza. */
  function construirTabla(grupos, capacidad, pasos) {
    var n = grupos.length;
    var dp = crearMatriz(n + 1, capacidad + 1, 0);
    // dp[0][*] y dp[*][0] ya valen 0: son los casos base.

    for (var i = 1; i <= n; i++) {
      var peso = pesoDe(grupos[i - 1]);
      for (var c = 0; c <= capacidad; c++) {
        var sinGrupo = dp[i - 1][c];
        var cabe = peso <= c;
        var conGrupo = cabe ? peso + dp[i - 1][c - peso] : null;
        var toma = cabe && conGrupo > sinGrupo;

        dp[i][c] = toma ? conGrupo : sinGrupo;

        if (pasos) {
          pasos.push({
            i: i,
            c: c,
            peso: peso,
            sinGrupo: sinGrupo, // dp[i-1][c]
            conGrupo: conGrupo, // tamano_i + dp[i-1][c - peso]
            valor: dp[i][c],
            cabe: cabe,
            toma: toma // ¿la reconstrucción pasa por aquí tomando el grupo?
          });
        }
      }
    }
    return dp;
  }

  /* Reconstrucción: recorre la tabla desde dp[n][C] hacia atrás y decide,
     celda por celda, si el grupo i entró al óptimo. Si dp[i][c] heredó el
     valor de dp[i-1][c], el grupo i no entró; si subió, entró y el resto se
     busca en la columna c - peso. El camino es el conjunto de celdas
     visitadas, que tabla.js resalta en la matriz. */
  function reconstruir(tabla, grupos, capacidad) {
    var camino = [];
    var seleccion = [];
    var indices = [];

    var i = grupos.length;
    var c = capacidad;

    while (i > 0) {
      camino.push({ fila: i, columna: c });

      var peso = pesoDe(grupos[i - 1]);
      if (tabla[i][c] === tabla[i - 1][c]) {
        i -= 1; // el grupo no entró: se sube de fila con la misma columna
      } else {
        seleccion.push(grupos[i - 1]);
        indices.push(i);
        c -= peso; // sí entró: se busca el resto en la capacidad restante
        i -= 1;
      }
    }
    camino.push({ fila: 0, columna: c });

    seleccion.reverse();
    indices.reverse();
    return { camino: camino, seleccion: seleccion, indices: indices };
  }

  /* Punto de entrada: devuelve la tabla, el óptimo y la reconstrucción
     (camino, grupos elegidos y la traza completa para animar la tabla). */
  function mochilaMatriz(grupos, capacidad) {
    var n = grupos.length;
    var pasos = [];
    var tabla = construirTabla(grupos, capacidad, pasos);
    var reconstruccion = reconstruir(tabla, grupos, capacidad);

    return {
      valor: tabla[n][capacidad],
      tabla: tabla,
      camino: reconstruccion.camino,
      seleccion: reconstruccion.seleccion,
      indices: reconstruccion.indices,
      pasos: pasos,
      capacidad: capacidad,
      n: n
    };
  }

  /* Variante de una sola fila. dp[c] guarda el óptimo que la fila en curso
     va construyendo; no se conservan las filas anteriores. El detalle que
     hace que funcione es recorrer la capacidad HACIA ATRÁS (de C a peso):
     así dp[c - peso] todavía es el valor de la fila anterior y cada grupo
     se usa a lo más una vez. Hacia adelante se reusaría el mismo grupo y
     el problema se volvería la mochila no acotada. Espacio O(C). */
  function mochilaUnaFila(grupos, capacidad, opciones) {
    var conHistorial = !!(opciones && opciones.conHistorial);
    var n = grupos.length;
    var dp = new Array(capacidad + 1);
    var historial = conHistorial ? [] : null;

    for (var c = 0; c <= capacidad; c++) dp[c] = 0; // base: dp[0] = 0 y columna 0

    for (var i = 1; i <= n; i++) {
      var peso = pesoDe(grupos[i - 1]);
      for (var c2 = capacidad; c2 >= peso; c2--) {
        var conGrupo = peso + dp[c2 - peso]; // dp[c2-peso] es de la fila anterior
        if (conGrupo > dp[c2]) dp[c2] = conGrupo;
      }
      if (conHistorial) historial.push(dp.slice());
    }

    return {
      valor: dp[capacidad],
      dp: dp,
      historial: historial,
      capacidad: capacidad,
      n: n
    };
  }

  return {
    mochilaMatriz: mochilaMatriz,
    mochilaUnaFila: mochilaUnaFila,
    reconstruir: reconstruir,
    capacidadDe: pesoDe
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = DP;
}
