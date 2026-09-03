/* =====================================================================
   main.js  —  Integrante 1
   Orquestación: escucha los eventos de la interfaz y coordina los
   módulos de algoritmo, métricas y gráficos.
   ===================================================================== */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    UI.init();
    var el = UI.referencias();

    UI.cargarEjemplo();
    pintarCola();
    simular(); // el tablero arranca con el caso del enunciado ya resuelto

    el.formulario.addEventListener('submit', function (evento) {
      evento.preventDefault();
      var datos = UI.leerFormulario();

      if (!datos.ok) {
        UI.mostrarError(datos.mensaje);
        return;
      }

      UI.limpiarError();
      UI.agregar(datos.nombre, datos.duracion);
      UI.limpiarFormulario();
      pintarCola();
    });

    el.btnSimular.addEventListener('click', simular);

    el.btnEjemplo.addEventListener('click', function () {
      UI.cargarEjemplo();
      UI.limpiarError();
      pintarCola();
      simular();
    });

    el.btnVaciar.addEventListener('click', function () {
      UI.vaciar();
      UI.limpiarError();
      pintarCola();
      el.resultados.hidden = true;
    });

    UI.renderEscenarios(function (clave) {
      UI.reemplazar(Escenarios.obtener(clave));
      UI.limpiarErrorLote();
      pintarCola();
      simular();
    });

    el.btnAgregarLote.addEventListener('click', function () {
      var lectura = UI.leerLote();
      if (!lectura.ok) { UI.mostrarErrorLote(lectura.mensaje); return; }

      UI.agregarVarios(lectura.turnos);
      avisar(lectura);
      UI.limpiarLote();
      pintarCola();
      simular();
    });

    el.btnReemplazarLote.addEventListener('click', function () {
      var lectura = UI.leerLote();
      if (!lectura.ok) { UI.mostrarErrorLote(lectura.mensaje); return; }

      UI.reemplazar(lectura.turnos);
      avisar(lectura);
      UI.limpiarLote();
      pintarCola();
      simular();
    });

    el.btnAleatoria.addEventListener('click', function () {
      UI.reemplazar(Escenarios.aleatorio(20, 5, 120));
      UI.limpiarErrorLote();
      el.descripcionEscenario.textContent = 'Cola sintética de 20 turnos con duraciones entre 5 y 120 minutos.';
      pintarCola();
      simular();
    });

    /* Las líneas mal escritas no bloquean la carga: se avisan y las
       demás entran igual. */
    function avisar(lectura) {
      if (lectura.avisos.length > 0) {
        UI.mostrarErrorLote('Se cargaron ' + lectura.turnos.length +
          ' turnos. ' + lectura.avisos.join(' '));
      } else {
        UI.limpiarErrorLote();
      }
    }

    el.btnComplejidad.addEventListener('click', function () {
      el.btnComplejidad.disabled = true;
      el.btnComplejidad.textContent = 'Midiendo…';

      // Cedemos un frame para que el navegador pinte el estado del botón
      // antes de bloquear el hilo con la medición.
      requestAnimationFrame(function () {
        var mediciones = Algoritmo.benchmark([1000, 5000, 10000, 25000, 50000, 100000]);
        UI.renderComplejidad(mediciones);
        el.btnComplejidad.disabled = false;
        el.btnComplejidad.textContent = 'Medir de nuevo';
      });
    });

    function pintarCola() {
      UI.renderCola(function (id) {
        UI.eliminar(id);
        pintarCola();
        if (UI.obtenerCola().length > 0) {
          simular();
        } else {
          el.resultados.hidden = true;
        }
      });
    }

    function simular() {
      var cola = UI.obtenerCola();
      if (cola.length === 0) return;
      UI.renderResultados(Metricas.comparar(cola));
    }
  });
})();
