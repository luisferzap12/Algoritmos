/* =====================================================================
   memo.js  —  Integrante 3
   El mismo óptimo, resuelto de arriba hacia abajo (top-down) con
   MEMORIZACIÓN. Es el otro camino a la programación dinámica: no se
   llena la tabla en orden, se resuelve por recursión y se guarda cada
   estado la primera vez que aparece para no volver a calcularlo.

   Estado       memo[i][c] = óptimo de los primeros i grupos con capacidad c.
   Recurrencia  opt(i, c) = 0                                   si i = 0 o c = 0
                            opt(i-1, c)                        si tamano_i > c
                            max(opt(i-1, c),
                                tamano_i + opt(i-1, c - tamano_i))  si no
   Casos base   opt(0, c) = 0 e opt(i, 0) = 0.

   La diferencia con dp.js no es el resultado (da el mismo), sino el orden
   de cálculo y lo que se puede medir: aquí se cuentan los estados que de
   verdad se visitan. En la tabulación se calculan TODOS los (n+1)(C+1);
   con memorización solo se tocan los alcanzables desde (n, C). Ese conteo
   es la evidencia de que la memoización no repite subproblemas.

   Cota: como mucho (n+1)(C+1) estados distintos; cada uno, O(1) trabajo.
   Tiempo O(n·C), espacio O(n·C) (memo) + O(n) de pila de recursión.
   ===================================================================== */

var Memo = (function () {
  'use strict';

  // Centinela para desenrollar la recursión cuando se pasa del límite.
  var ABORTO = {};

  function crearMatriz(filas, columnas, valor) {
    var m = new Array(filas);
    for (var i = 0; i < filas; i++) {
      m[i] = new Array(columnas);
      for (var c = 0; c < columnas; c++) m[i][c] = valor;
    }
    return m;
  }

  function mochilaMemo(grupos, capacidad) {
    var n = grupos.length;
    var SIN_CALCULAR = null;

    // memo[i][c] queda en SIN_CALCULAR hasta que ese estado se resuelve.
    var memo = crearMatriz(n + 1, capacidad + 1, SIN_CALCULAR);

    var llamadas = 0; // veces que se invoca opt, repetidas incluidas
    var estadosCalculados = 0; // estados distintos que se resuelven de verdad

    /* Resuelve opt(i, c). Primero mira el caso base, después la memo: si el
       estado ya estaba resuelto lo devuelve tal cual, sin recurrir. */
    function opt(i, c) {
      llamadas += 1;

      if (i === 0 || c === 0) return 0; // caso base, no se guarda

      if (memo[i][c] !== SIN_CALCULAR) return memo[i][c]; // ¡ya calculado!

      estadosCalculados += 1;

      var peso = grupos[i - 1].tamano;
      var sinGrupo = opt(i - 1, c);
      var conGrupo = peso <= c ? peso + opt(i - 1, c - peso) : -1;
      var resultado = conGrupo > sinGrupo ? conGrupo : sinGrupo;

      memo[i][c] = resultado;
      return resultado;
    }

    var valor = opt(n, capacidad);
    var estadosDelValor = estadosCalculados; // sin la reconstrucción

    // Reconstrucción: se apoya en la misma memo. Si el mejor valor de (i, c)
    // se explica tomando el grupo i (opt(i-1, c-peso) + peso), entonces entró.
    var camino = [];
    var seleccion = [];
    var indices = [];
    var i = n;
    var c = capacidad;

    while (i > 0) {
      camino.push({ fila: i, columna: c });
      var peso = grupos[i - 1].tamano;
      if (peso <= c && opt(i - 1, c - peso) + peso === opt(i, c)) {
        seleccion.push(grupos[i - 1]);
        indices.push(i);
        c -= peso;
      }
      i -= 1;
    }
    camino.push({ fila: 0, columna: c });
    seleccion.reverse();
    indices.reverse();

    return {
      valor: valor,
      memo: memo,
      camino: camino,
      seleccion: seleccion,
      indices: indices,
      capacidad: capacidad,
      n: n,
      // estadosDelValor: los que cuesta obtener el óptimo a secas.
      // estadosCalculados: los que cuestan el óptimo + su reconstrucción.
      estadosDelValor: estadosDelValor,
      estadosCalculados: estadosCalculados,
      llamadas: llamadas
    };
  }

  /* La misma recurrencia, pero SIN tabla y SIN memo: el árbol de llamadas
     se expande sin control (~2^n nodos) porque cada subproblema se vuelve
     a calcular cada vez que se lo pide. Es el contraste que pide el
     examen: medir, en el mismo problema, cuánto cuesta no recordar. Se
     puede cortar con `limiteLlamadas` para no congelar el navegador. */
  function mochilaSinMemoria(grupos, capacidad, opciones) {
    var limite = (opciones && opciones.limiteLlamadas) || 5000000;
    var n = grupos.length;
    var llamadas = 0;
    var abortado = false;

    function opt(i, c) {
      llamadas += 1;
      if (llamadas > limite) {
        abortado = true;
        throw ABORTO;
      }

      if (i === 0 || c === 0) return 0;

      var peso = grupos[i - 1].tamano;
      var sinGrupo = opt(i - 1, c);
      var conGrupo = peso <= c ? peso + opt(i - 1, c - peso) : -1;
      return conGrupo > sinGrupo ? conGrupo : sinGrupo;
    }

    var valor = null;
    try {
      valor = opt(n, capacidad);
    } catch (e) {
      if (e !== ABORTO) throw e; // cualquier otro error sí se propaga
    }

    return {
      valor: valor,
      llamadas: llamadas,
      abortado: abortado,
      capacidad: capacidad,
      n: n
    };
  }

  return {
    mochilaMemo: mochilaMemo,
    mochilaSinMemoria: mochilaSinMemoria
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Memo;
}
