/* =====================================================================
   modelo.js  —  Integrante 2
   El vocabulario del problema: qué es un grupo válido y cómo se mide
   qué tan bien quedó ocupada un aula.

   Este archivo no sabe nada de programación dinámica. Traduce entre el
   lenguaje del algoritmo (números y capacidades) y el lenguaje de la
   universidad (puestos, estudiantes, porcentaje de ocupación).
   ===================================================================== */

var Modelo = (function () {
  'use strict';

  var MAX_GRUPOS = 24;      // más que esto y la fuerza bruta deja de correr
  var MAX_CAPACIDAD = 500;  // más que esto y la tabla no se puede dibujar

  /* -------------------------------------------------------------------
     Validación de un grupo nuevo escrito a mano.
     ------------------------------------------------------------------- */
  function validarGrupo(nombre, tamano, cantidadActual) {
    if (nombre === '') {
      return { ok: false, mensaje: 'Escribe el nombre del grupo o de la asignatura.' };
    }
    if (nombre.length > 40) {
      return { ok: false, mensaje: 'El nombre no puede superar los 40 caracteres.' };
    }
    if (!Number.isInteger(tamano) || tamano <= 0) {
      return { ok: false, mensaje: 'El número de estudiantes debe ser un entero mayor que cero.' };
    }
    if (tamano > MAX_CAPACIDAD) {
      return { ok: false, mensaje: 'Un grupo no puede superar los ' + MAX_CAPACIDAD + ' estudiantes.' };
    }
    if (cantidadActual >= MAX_GRUPOS) {
      return { ok: false, mensaje: 'Máximo ' + MAX_GRUPOS + ' grupos: más allá, la fuerza bruta deja de ser comparable.' };
    }
    return { ok: true, nombre: nombre, tamano: tamano };
  }

  function validarCapacidad(capacidad) {
    if (!Number.isInteger(capacidad) || capacidad <= 0) {
      return { ok: false, mensaje: 'La capacidad del aula debe ser un entero mayor que cero.' };
    }
    if (capacidad > MAX_CAPACIDAD) {
      return { ok: false, mensaje: 'Capacidad máxima admitida: ' + MAX_CAPACIDAD + ' puestos.' };
    }
    return { ok: true, capacidad: capacidad };
  }

  /* -------------------------------------------------------------------
     Métricas de una asignación. Recibe los grupos escogidos y traduce
     el número crudo a lo que le importa a quien asigna aulas.
     ------------------------------------------------------------------- */
  function metricas(seleccionados, grupos, capacidad) {
    var ocupados = sumarTamanos(seleccionados);
    var totalSolicitado = sumarTamanos(grupos);

    return {
      ocupados: ocupados,
      libres: capacidad - ocupados,
      capacidad: capacidad,
      porcentaje: capacidad > 0 ? (ocupados / capacidad) * 100 : 0,
      gruposAsignados: seleccionados.length,
      gruposSolicitantes: grupos.length,
      // Estudiantes que pidieron el aula y se quedaron sin ella.
      sinAula: totalSolicitado - ocupados,
      exacta: ocupados === capacidad
    };
  }

  function sumarTamanos(lista) {
    var total = 0;
    for (var i = 0; i < lista.length; i++) total += lista[i].tamano;
    return total;
  }

  /* -------------------------------------------------------------------
     Diferencia entre dos estrategias, en el lenguaje del problema.
     ------------------------------------------------------------------- */
  function comparar(mejor, peor) {
    var diferencia = mejor.ocupados - peor.ocupados;
    return {
      diferencia: diferencia,
      hayDiferencia: diferencia > 0,
      puntosPorcentuales: mejor.porcentaje - peor.porcentaje
    };
  }

  /* -------------------------------------------------------------------
     Cuántos bits hacen falta para escribir la capacidad. Es el dato que
     sostiene la discusión sobre la complejidad pseudo-polinomial: el
     tiempo crece con C, pero el tamaño de la entrada crece con log C.
     ------------------------------------------------------------------- */
  function bitsDeCapacidad(capacidad) {
    return capacidad > 0 ? Math.ceil(Math.log2(capacidad + 1)) : 0;
  }

  return {
    MAX_GRUPOS: MAX_GRUPOS,
    MAX_CAPACIDAD: MAX_CAPACIDAD,
    validarGrupo: validarGrupo,
    validarCapacidad: validarCapacidad,
    metricas: metricas,
    sumarTamanos: sumarTamanos,
    comparar: comparar,
    bitsDeCapacidad: bitsDeCapacidad
  };
})();
