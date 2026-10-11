/* =====================================================================
   main.js  —  Integrante 1
   Conecta la interfaz con el algoritmo. Es el único archivo que conoce
   a todos los módulos; entre ellos no se llaman.
   ===================================================================== */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    UI.init();
    var el = UI.referencias();

    UI.renderEscenarios(Datos.listar(), function (clave) {
      UI.cargarEscenario(clave);
      UI.marcarEscenario(clave);
      UI.limpiarAviso();
      pintarGrupos();
      resolver();
    });

    UI.cargarEscenario('bloque301');
    pintarGrupos();
    resolver();

    el.btnResolver.addEventListener('click', resolver);

    el.capacidad.addEventListener('change', function () {
      var revision = UI.leerCapacidad();
      if (!revision.ok) { UI.mostrarAviso(revision.mensaje); return; }
      UI.limpiarAviso();
      pintarGrupos();
      resolver();
    });

    el.btnAgregar.addEventListener('click', function () {
      var datos = UI.leerGrupoNuevo();
      if (!datos.ok) { UI.mostrarAviso(datos.mensaje); return; }

      UI.limpiarAviso();
      UI.agregar(datos.nombre, datos.tamano);
      UI.limpiarFormularioGrupo();
      pintarGrupos();
      resolver();
    });

    el.btnExpGrupos.addEventListener('click', function () {
      UI.estadoBoton(el.btnExpGrupos, true);

      // Se cede un cuadro de animación para que el botón alcance a
      // repintarse antes de bloquear el hilo con la medición.
      requestAnimationFrame(function () {
        UI.renderExpGrupos(Experimento.crecerGrupos([8, 12, 16, 18, 20, 22], 200));
        UI.estadoBoton(el.btnExpGrupos, false, 'Medir de nuevo');
      });
    });

    el.btnExpCapacidad.addEventListener('click', function () {
      UI.estadoBoton(el.btnExpCapacidad, true);

      requestAnimationFrame(function () {
        UI.renderExpCapacidad(
          Experimento.crecerCapacidad(20, [10000, 25000, 50000, 100000, 200000, 400000]));
        UI.estadoBoton(el.btnExpCapacidad, false, 'Medir de nuevo');
      });
    });

    function pintarGrupos() {
      UI.renderGrupos(function (id) {
        UI.eliminar(id);
        pintarGrupos();
        if (UI.obtenerGrupos().length > 0) resolver();
        else el.resultado.hidden = true;
      });
    }

    function resolver() {
      var grupos = UI.obtenerGrupos();
      var capacidad = UI.obtenerCapacidad();
      if (grupos.length === 0) return;

      var comparacion = Alternativos.compararTodas(grupos, capacidad);
      var metricas = Modelo.metricas(comparacion.dp.seleccionados, grupos, capacidad);

      UI.renderResultado(comparacion, metricas);
      UI.renderTabla(comparacion.dp);
      UI.renderTraza(comparacion.dp.traza);
      UI.renderEnfoques(Experimento.compararEnfoques(grupos, capacidad));
    }
  });
})();
