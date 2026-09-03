/* =====================================================================
   escenarios.js  —  Integrante 3
   Juegos de datos de control para probar y sustentar el tablero, y
   lectura de listas pegadas por el usuario.

   Cada escenario responde a una pregunta distinta sobre el algoritmo,
   no son solo "datos de relleno".
   ===================================================================== */

var Escenarios = (function () {
  'use strict';

  var MAX_LINEAS = 200;

  var catalogo = {
    clinica: {
      etiqueta: 'Clínica (4)',
      descripcion: 'El caso del enunciado: una consulta larga bloqueando tres turnos cortos.',
      turnos: [
        { nombre: 'Consulta médica general', duracion: 45 },
        { nombre: 'Vacunación', duracion: 5 },
        { nombre: 'Lectura de exámenes', duracion: 10 },
        { nombre: 'Curación básica', duracion: 15 }
      ]
    },

    taller: {
      etiqueta: 'Taller técnico (8)',
      descripcion: 'Duraciones muy dispares en un taller: el ahorro se dispara.',
      turnos: [
        { nombre: 'Cambio de aceite', duracion: 20 },
        { nombre: 'Revisión de frenos', duracion: 60 },
        { nombre: 'Calibración de llantas', duracion: 8 },
        { nombre: 'Diagnóstico electrónico', duracion: 90 },
        { nombre: 'Cambio de batería', duracion: 12 },
        { nombre: 'Alineación', duracion: 45 },
        { nombre: 'Revisión de luces', duracion: 6 },
        { nombre: 'Lavado técnico', duracion: 25 }
      ]
    },

    parejas: {
      etiqueta: 'Duraciones iguales (6)',
      descripcion: 'Todas duran lo mismo. El ahorro es 0 %: sin dispersión, reordenar no sirve de nada.',
      turnos: [
        { nombre: 'Toma de muestra 1', duracion: 15 },
        { nombre: 'Toma de muestra 2', duracion: 15 },
        { nombre: 'Toma de muestra 3', duracion: 15 },
        { nombre: 'Toma de muestra 4', duracion: 15 },
        { nombre: 'Toma de muestra 5', duracion: 15 },
        { nombre: 'Toma de muestra 6', duracion: 15 }
      ]
    },

    extremo: {
      etiqueta: 'Un caso atípico (7)',
      descripcion: 'Una cirugía de 240 minutos delante de seis trámites de 5. El peor escenario para FIFO.',
      turnos: [
        { nombre: 'Cirugía ambulatoria', duracion: 240 },
        { nombre: 'Entrega de fórmula', duracion: 5 },
        { nombre: 'Toma de tensión', duracion: 5 },
        { nombre: 'Sello de incapacidad', duracion: 5 },
        { nombre: 'Entrega de resultados', duracion: 5 },
        { nombre: 'Agendamiento', duracion: 5 },
        { nombre: 'Vacunación', duracion: 5 }
      ]
    },

    ordenada: {
      etiqueta: 'Ya ordenada (5)',
      descripcion: 'La cola llega ordenada de menor a mayor: SPT no la cambia y el ahorro es 0 %.',
      turnos: [
        { nombre: 'Trámite exprés', duracion: 5 },
        { nombre: 'Control de rutina', duracion: 10 },
        { nombre: 'Curación', duracion: 20 },
        { nombre: 'Terapia física', duracion: 40 },
        { nombre: 'Procedimiento menor', duracion: 75 }
      ]
    }
  };

  function obtener(clave) {
    var e = catalogo[clave];
    if (!e) return [];
    return e.turnos.map(function (t) { return { nombre: t.nombre, duracion: t.duracion }; });
  }

  function listar() {
    return Object.keys(catalogo).map(function (clave) {
      return { clave: clave, etiqueta: catalogo[clave].etiqueta, descripcion: catalogo[clave].descripcion };
    });
  }

  /* -------------------------------------------------------------------
     Cola sintética: n turnos con duraciones aleatorias. Útil para ver
     el comportamiento del tablero con volúmenes grandes.
     ------------------------------------------------------------------- */
  function aleatorio(n, minimo, maximo) {
    var turnos = [];
    for (var i = 1; i <= n; i++) {
      turnos.push({
        nombre: 'Turno ' + i,
        duracion: minimo + Math.floor(Math.random() * (maximo - minimo + 1))
      });
    }
    return turnos;
  }

  /* -------------------------------------------------------------------
     parsear(): lee un texto con un turno por línea.
     Acepta "Nombre, 45" | "Nombre; 45" | "Nombre  45" | "Nombre, 45 min".
     Devuelve los turnos válidos y el detalle de las líneas rechazadas,
     para que la persona sepa exactamente qué corregir.
     ------------------------------------------------------------------- */
  function parsear(texto) {
    var turnos = [];
    var errores = [];
    var lineas = String(texto).split(/\r?\n/);

    if (lineas.length > MAX_LINEAS) {
      errores.push('Máximo ' + MAX_LINEAS + ' líneas por carga.');
      lineas = lineas.slice(0, MAX_LINEAS);
    }

    for (var i = 0; i < lineas.length; i++) {
      var linea = lineas[i].trim();
      if (linea === '') continue;

      // nombre + separador + número final (con "min" opcional)
      var coincidencia = linea.match(/^(.+?)[\s,;\t]+(\d+)\s*(?:min\.?|minutos?)?$/i);

      if (!coincidencia) {
        errores.push('Línea ' + (i + 1) + ': falta la duración en minutos.');
        continue;
      }

      var nombre = coincidencia[1].trim().replace(/[,;]$/, '').trim();
      var duracion = parseInt(coincidencia[2], 10);

      if (nombre === '') {
        errores.push('Línea ' + (i + 1) + ': falta el nombre del turno.');
      } else if (nombre.length > 60) {
        errores.push('Línea ' + (i + 1) + ': el nombre supera los 60 caracteres.');
      } else if (duracion <= 0 || duracion > 600) {
        errores.push('Línea ' + (i + 1) + ': la duración debe estar entre 1 y 600 minutos.');
      } else {
        turnos.push({ nombre: nombre, duracion: duracion });
      }
    }

    return { turnos: turnos, errores: errores };
  }

  return {
    obtener: obtener,
    listar: listar,
    aleatorio: aleatorio,
    parsear: parsear
  };
})();
