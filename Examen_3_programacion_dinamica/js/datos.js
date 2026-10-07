/* =====================================================================
   datos.js  —  Integrante 2
   Los datos del problema, separados del código que los usa.

   Un escenario es un aula (capacidad en puestos) y la lista de grupos
   que solicitaron ese mismo bloque horario. Los datos son sintéticos,
   construidos para el ejercicio: no provienen de la programación real
   de ninguna universidad.
   ===================================================================== */

var Datos = (function () {
  'use strict';

  var escenarios = {
    bloque301: {
      etiqueta: 'Aula 301 · lunes 8-10',
      descripcion: 'Siete solicitudes para un aula de 45 puestos. Greedy deja 4 puestos sin usar; la programación dinámica llena el aula exacta.',
      capacidad: 45,
      grupos: [
        { nombre: 'Cálculo II',        tamano: 24 },
        { nombre: 'Física Mecánica',   tamano: 22 },
        { nombre: 'Bases de Datos',    tamano: 22 },
        { nombre: 'Algoritmos',        tamano: 17 },
        { nombre: 'Inglés IV',         tamano: 12 },
        { nombre: 'Lab. Electrónica',  tamano: 9  },
        { nombre: 'Seminario',         tamano: 6  }
      ]
    },

    trampa: {
      etiqueta: 'El caso donde greedy falla',
      descripcion: 'Aquí fallan los DOS criterios voraces. Empezar por el grupo más grande bloquea el aula; empezar por el más pequeño la fragmenta. La tabla encuentra la combinación exacta.',
      capacidad: 45,
      grupos: [
        { nombre: 'Cálculo II',          tamano: 24 },
        { nombre: 'Física Mecánica',     tamano: 22 },
        { nombre: 'Bases de Datos',      tamano: 22 },
        { nombre: 'Asesoría de tesis',   tamano: 2  },
        { nombre: 'Monitoría individual',tamano: 1  }
      ]
    },

    auditorio: {
      etiqueta: 'Auditorio · 120 puestos',
      descripcion: 'Aula grande y nueve solicitudes. La tabla pasa de 46 a 121 columnas: el tiempo crece con la capacidad, no con la cantidad de grupos.',
      capacidad: 120,
      grupos: [
        { nombre: 'Conferencia',        tamano: 58 },
        { nombre: 'Inducción',          tamano: 47 },
        { nombre: 'Cátedra abierta',    tamano: 41 },
        { nombre: 'Taller de escritura',tamano: 33 },
        { nombre: 'Semillero',          tamano: 28 },
        { nombre: 'Monitoría',          tamano: 19 },
        { nombre: 'Asesoría de tesis',  tamano: 14 },
        { nombre: 'Reunión docente',    tamano: 11 },
        { nombre: 'Club de lectura',    tamano: 7  }
      ]
    },

    exacta: {
      etiqueta: 'Ocupación perfecta',
      descripcion: 'Existe una combinación que usa los 50 puestos sin dejar ninguno libre. La tabla la encuentra; a ojo cuesta verla.',
      capacidad: 50,
      grupos: [
        { nombre: 'Estadística',     tamano: 29 },
        { nombre: 'Programación I',  tamano: 21 },
        { nombre: 'Redes',           tamano: 18 },
        { nombre: 'Sistemas',        tamano: 16 },
        { nombre: 'Ética',           tamano: 13 },
        { nombre: 'Deportes',        tamano: 8  }
      ]
    },

    imposible: {
      etiqueta: 'Ningún grupo cabe',
      descripcion: 'Todos los grupos superan la capacidad del salón. La respuesta correcta es cero puestos ocupados y ninguna asignación, no un error.',
      capacidad: 20,
      grupos: [
        { nombre: 'Cátedra Pascual',  tamano: 64 },
        { nombre: 'Física III',       tamano: 38 },
        { nombre: 'Química General',  tamano: 25 }
      ]
    }
  };

  function obtener(clave) {
    var e = escenarios[clave];
    if (!e) return null;

    // Copia profunda: los escenarios nunca se modifican desde la interfaz.
    return {
      clave: clave,
      etiqueta: e.etiqueta,
      descripcion: e.descripcion,
      capacidad: e.capacidad,
      grupos: e.grupos.map(function (g, i) {
        return { id: i + 1, nombre: g.nombre, tamano: g.tamano };
      })
    };
  }

  function listar() {
    return Object.keys(escenarios).map(function (clave) {
      return {
        clave: clave,
        etiqueta: escenarios[clave].etiqueta,
        descripcion: escenarios[clave].descripcion
      };
    });
  }

  return {
    obtener: obtener,
    listar: listar
  };
})();
