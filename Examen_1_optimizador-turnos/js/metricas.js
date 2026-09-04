/* =====================================================================
   metricas.js  —  Integrante 4
   Simulación de la cola y cálculo de indicadores.

   Modelo: un solo servidor (una ventanilla / un consultorio), todas las
   solicitudes disponibles en t = 0, sin interrupciones ni prioridades.
   Bajo esas condiciones SPT minimiza la espera promedio; fuera de ellas
   (llegadas escalonadas, urgencias) deja de ser óptimo. Ver README.
   ===================================================================== */

var Metricas = (function () {
  'use strict';

  /* -------------------------------------------------------------------
     simular(): recorrido lineal O(n) sobre una secuencia ya ordenada.
     Wi = suma de las duraciones que la preceden.
     ------------------------------------------------------------------- */
  function simular(secuencia) {
    var reloj = 0;
    var esperaTotal = 0;
    var detalle = [];

    for (var i = 0; i < secuencia.length; i++) {
      var t = secuencia[i];
      detalle.push({
        nombre: t.nombre,
        duracion: t.duracion,
        inicio: reloj,        // el momento en que se le atiende
        espera: reloj,        // como todas llegan en t=0, espera = inicio
        fin: reloj + t.duracion
      });
      esperaTotal += reloj;
      reloj += t.duracion;
    }

    var n = secuencia.length;

    return {
      detalle: detalle,
      esperaTotal: esperaTotal,
      esperaPromedio: n > 0 ? esperaTotal / n : 0,
      // El makespan (instante en que se cierra la cola) es idéntico en
      // TODAS las estrategias: reordenar no crea ni destruye trabajo.
      // Lo que cambia es cómo se reparte la espera entre las personas.
      makespan: reloj,
      peorEspera: detalle.length > 0 ? detalle[detalle.length - 1].espera : 0
    };
  }

  /* -------------------------------------------------------------------
     ahorro(): porcentaje de reducción, protegido contra división por 0.
     El código original devolvía "NaN%" con un solo turno en la cola.
     ------------------------------------------------------------------- */
  function ahorro(base, optimizado) {
    if (!isFinite(base) || base <= 0) return 0;
    var pct = ((base - optimizado) / base) * 100;
    return Math.max(0, pct);
  }

  /* -------------------------------------------------------------------
     comparar(): corre las cuatro estrategias sobre la misma cola.
     ------------------------------------------------------------------- */
  function comparar(cola) {
    var resultadoSpt = Algoritmo.spt(cola);
    var resultadoLpt = Algoritmo.lpt(cola);

    var estrategias = {
      fifo: simular(cola.slice()),
      aleatorio: simular(Algoritmo.barajar(cola)),
      spt: simular(resultadoSpt.orden),
      lpt: simular(resultadoLpt.orden)
    };

    return {
      estrategias: estrategias,
      ahorroVsFifo: ahorro(estrategias.fifo.esperaPromedio, estrategias.spt.esperaPromedio),
      ahorroVsAleatorio: ahorro(estrategias.aleatorio.esperaPromedio, estrategias.spt.esperaPromedio),
      comparaciones: resultadoSpt.comparaciones,
      msOrdenamiento: resultadoSpt.ms,
      n: cola.length
    };
  }

  /* -------------------------------------------------------------------
     Verificación de la cota teórica T = Σ (n - i) · t_i  (i base 1).
     Debe coincidir exactamente con la espera total simulada; se usa en
     la sustentación para mostrar que la fórmula y el código concuerdan.
     ------------------------------------------------------------------- */
  function esperaTeorica(secuencia) {
    var n = secuencia.length;
    var total = 0;
    for (var i = 0; i < n; i++) {
      total += (n - (i + 1)) * secuencia[i].duracion;
    }
    return total;
  }

  return {
    simular: simular,
    comparar: comparar,
    ahorro: ahorro,
    esperaTeorica: esperaTeorica
  };
})();
