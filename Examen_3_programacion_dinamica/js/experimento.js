/* =====================================================================
   experimento.js  —  Luis Fernando Zapata Castaño
   Medición empírica. Convierte las complejidades declaradas en el
   README en números medidos en el navegador.

   Hay dos experimentos porque Θ(n·C) tiene dos variables, y el segundo
   es el que sostiene la afirmación más fina del proyecto: que este
   algoritmo es pseudo-polinomial.
   ===================================================================== */

var Experimento = (function () {
  'use strict';

  /* Genera grupos sintéticos cuyos tamaños van de 1 a un tercio de la
     capacidad, para que varios quepan a la vez y la tabla tenga algo
     que decidir. */
  function gruposAleatorios(n, capacidad) {
    var lista = [];
    var maximo = Math.max(2, Math.floor(capacidad / 3));

    for (var i = 1; i <= n; i++) {
      lista.push({
        id: i,
        nombre: 'g' + i,
        tamano: 1 + Math.floor(Math.random() * maximo)
      });
    }
    return lista;
  }

  /* -------------------------------------------------------------------
     EXPERIMENTO 1 — crecer el número de grupos
     Capacidad fija, n creciente. La programación dinámica crece de
     forma lineal con n; la fuerza bruta duplica su trabajo con cada
     grupo nuevo. A partir de cierto punto la fuerza bruta deja de ser
     medible y se reporta como "no corre".
     ------------------------------------------------------------------- */
  function crecerGrupos(tamanos, capacidad) {
    var mediciones = [];
    var discrepancias = 0;

    tamanos.forEach(function (n) {
      var grupos = gruposAleatorios(n, capacidad);

      var porDP = DP.tabular(grupos, capacidad);
      var porBruta = Alternativos.fuerzaBruta(grupos, capacidad);

      if (!porBruta.excedido && porBruta.ocupacion !== porDP.ocupacion) discrepancias++;

      mediciones.push({
        n: n,
        capacidad: capacidad,
        msDP: porDP.ms,
        msBruta: porBruta.excedido ? null : porBruta.ms,
        celdasDP: porDP.celdas,
        combinaciones: Math.pow(2, n),
        brutaExcedida: porBruta.excedido,
        coinciden: porBruta.excedido ? null : porBruta.ocupacion === porDP.ocupacion
      });
    });

    return { mediciones: mediciones, discrepancias: discrepancias };
  }

  /* -------------------------------------------------------------------
     EXPERIMENTO 2 — crecer la capacidad del aula
     Número de grupos fijo, capacidad creciente. Es el experimento que
     demuestra la naturaleza pseudo-polinomial:

       la capacidad se duplica  ->  el tiempo se duplica
       la capacidad se duplica  ->  el tamaño de la entrada crece UN bit

     Es decir, el tiempo es lineal en el VALOR de C y exponencial en el
     NÚMERO DE DÍGITOS de C. Por eso Θ(n·C) no cuenta como polinomial.
     ------------------------------------------------------------------- */
  function crecerCapacidad(n, capacidades) {
    var mediciones = [];

    capacidades.forEach(function (C) {
      var grupos = gruposAleatorios(n, C);
      var porDP = DP.unaSolaFila(grupos, C);

      mediciones.push({
        capacidad: C,
        bits: Math.ceil(Math.log2(C + 1)),   // lo que ocupa C en la entrada
        ms: porDP.ms,
        celdas: n * (C + 1)
      });
    });

    return { mediciones: mediciones, n: n };
  }

  /* -------------------------------------------------------------------
     EXPERIMENTO 3 — tabulación contra memoización
     Mismo problema, los dos enfoques de programación dinámica, y
     cuántos estados tocó cada uno.
     ------------------------------------------------------------------- */
  function compararEnfoques(grupos, capacidad) {
    var porTabla = DP.tabular(grupos, capacidad);
    var porMemo = Memo.resolver(grupos, capacidad);
    var sinNada = Memo.sinMemoria(grupos, capacidad);

    return {
      tabulacion: porTabla,
      memoizacion: porMemo,
      sinMemoria: sinNada,
      coinciden: porTabla.ocupacion === porMemo.ocupacion,
      estadosAhorrados: porTabla.celdas - porMemo.calculadas
    };
  }

  return {
    gruposAleatorios: gruposAleatorios,
    crecerGrupos: crecerGrupos,
    crecerCapacidad: crecerCapacidad,
    compararEnfoques: compararEnfoques
  };
})();
