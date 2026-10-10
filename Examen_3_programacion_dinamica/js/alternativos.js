/* =====================================================================
   alternativos.js  —  Luis Fernando Zapata Castaño
   Las otras formas de resolver el mismo problema. No están de adorno:
   cada una responde una pregunta que el profesor puede hacer.

     fuerza bruta  ->  "¿no bastaba con probar todas las combinaciones"
     greedy        ->  "¿no bastaba con llenar con los más grandes"

  
   ===================================================================== */

var Alternativos = (function () {
  'use strict';

  var TOPE_FUERZA_BRUTA = 22;   // 2^22 ≈ 4,2 millones de combinaciones

  /* -------------------------------------------------------------------
     FUERZA BRUTA — Θ(2^n · n)
     Recorre todos los subconjuntos posibles. Cada número de 0 a 2^n - 1
     se lee como una máscara de bits: el bit j encendido significa que
     el grupo j entra al aula.

     Da siempre la respuesta correcta. El problema es que el trabajo se
     duplica con cada grupo nuevo: con 10 grupos son 1.024 combinaciones,
     con 30 serían más de mil millones.
     ------------------------------------------------------------------- */
  function fuerzaBruta(grupos, capacidad) {
    var n = grupos.length;

    if (n > TOPE_FUERZA_BRUTA) {
      return {
        ocupacion: null,
        excedido: true,
        tope: TOPE_FUERZA_BRUTA,
        combinaciones: Math.pow(2, n),
        seleccionados: [],
        ms: 0,
        metodo: 'fuerza bruta'
      };
    }

    var inicio = ahora();
    var total = 1 << n;
    var mejorOcupacion = 0;
    var mejorMascara = 0;
    var evaluadas = 0;
    var descartadas = 0;

    for (var mascara = 0; mascara < total; mascara++) {
      var suma = 0;
      evaluadas++;

      for (var j = 0; j < n; j++) {
        if (mascara & (1 << j)) suma += grupos[j].tamano;
      }

      if (suma > capacidad) { descartadas++; continue; }  // no cabe en el aula
      if (suma > mejorOcupacion) {
        mejorOcupacion = suma;
        mejorMascara = mascara;
      }
    }

    var seleccionados = [];
    for (var k = 0; k < n; k++) {
      if (mejorMascara & (1 << k)) seleccionados.push(grupos[k]);
    }

    return {
      ocupacion: mejorOcupacion,
      excedido: false,
      seleccionados: seleccionados,
      combinaciones: total,
      evaluadas: evaluadas,
      descartadas: descartadas,
      ms: ahora() - inicio,
      metodo: 'fuerza bruta'
    };
  }

  /* -------------------------------------------------------------------
     GREEDY — Θ(n log n)
     Ordena los grupos por tamaño y los va metiendo mientras quepan.
     Es rapidísimo y a veces acierta, pero no tiene forma de retractarse:
     una vez que mete un grupo grande, no vuelve atrás aunque ese grupo
     esté bloqueando una combinación mejor.

     Se implementan los dos criterios porque fallan en casos distintos y
     eso deja claro que el problema no es "elegir mal el orden", sino que
     ningún orden fijo funciona siempre.
     ------------------------------------------------------------------- */
  function greedy(grupos, capacidad, criterio) {
    var inicio = ahora();

    var orden = grupos.slice().sort(function (a, b) {
      return criterio === 'menor' ? a.tamano - b.tamano : b.tamano - a.tamano;
    });

    var ocupacion = 0;
    var seleccionados = [];

    for (var i = 0; i < orden.length; i++) {
      if (ocupacion + orden[i].tamano <= capacidad) {
        ocupacion += orden[i].tamano;
        seleccionados.push(orden[i]);
      }
    }

    return {
      ocupacion: ocupacion,
      seleccionados: seleccionados,
      ms: ahora() - inicio,
      metodo: criterio === 'menor' ? 'greedy: el más pequeño primero' : 'greedy: el más grande primero'
    };
  }

  /* -------------------------------------------------------------------
     Corre las cuatro estrategias sobre la misma entrada y verifica que
     la programación dinámica coincida con la fuerza bruta. Esa
     verificación es lo que convierte la comparación en evidencia: si la
     DP fuera más rápida pero diera otro número, no probaría nada.
     ------------------------------------------------------------------- */
  function compararTodas(grupos, capacidad) {
    var porDP = DP.tabular(grupos, capacidad);
    var porBruta = fuerzaBruta(grupos, capacidad);
    var porMayor = greedy(grupos, capacidad, 'mayor');
    var porMenor = greedy(grupos, capacidad, 'menor');

    return {
      dp: porDP,
      bruta: porBruta,
      mayor: porMayor,
      menor: porMenor,
      // null cuando la fuerza bruta no se pudo correr por tamaño
      coincideConBruta: porBruta.excedido ? null : porBruta.ocupacion === porDP.ocupacion,
      greedyFalla: Math.max(porMayor.ocupacion, porMenor.ocupacion) < porDP.ocupacion
    };
  }

  function ahora() {
    return (typeof performance !== 'undefined' && performance.now)
      ? performance.now() : Date.now();
  }

  return {
    TOPE_FUERZA_BRUTA: TOPE_FUERZA_BRUTA,
    fuerzaBruta: fuerzaBruta,
    greedy: greedy,
    compararTodas: compararTodas
  };
})();
