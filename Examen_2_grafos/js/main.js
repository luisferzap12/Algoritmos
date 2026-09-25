/* =====================================================================
   main.js  —  Integrante 1
   Orquestación. Es el único archivo que conoce a todos los módulos;
   entre ellos no se llaman.
   ===================================================================== */

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    UI.init();
    var el = UI.referencias();

    // FIX: Datos.grafoBase() solo trae {nodos, aristas}. Grafo.construir()
    // agrega la lista de adyacencia (vecinos) que necesitan Grafo.estadisticas,
    // Dijkstra, etc. Sin esto, cualquier función que lea grafo.vecinos[id]
    // truena con "Cannot read properties of undefined".
    var grafoActual = Grafo.construir(Datos.grafoBase());

    // Robledo → Industriales por defecto: es el par donde se ve que el
    // camino de menos tramos no es el más rápido.
    UI.llenarSelectores(grafoActual, "robledo", "industriales");
    UI.renderEscenarios(Datos.listarEscenarios(), function () {
      calcular();
    });
    UI.renderResumenGrafo(grafoActual);
    calcular();

    el.btnCalcular.addEventListener("click", calcular);
    el.origen.addEventListener("change", calcular);
    el.destino.addEventListener("change", calcular);

    el.btnExperimento.addEventListener("click", function () {
      UI.estadoBotonExperimento(true);

      // Se cede un cuadro de animación para que el botón alcance a
      // repintarse: JavaScript es de un solo hilo y la medición lo
      // bloquea por completo.
      requestAnimationFrame(function () {
        var salida = Experimento.comparar([100, 250, 500, 1000, 2000, 4000], 6);
        UI.renderExperimento(salida);
        UI.estadoBotonExperimento(false);
      });
    });

    el.btnNegativos.addEventListener("click", function () {
      UI.renderNegativos(Alternativos.compararConNegativos());
    });

    function calcular() {
      var consulta = UI.obtenerConsulta();
      var revision = UI.validar(consulta);

      if (!revision.ok) {
        UI.mostrarAviso(revision.mensaje);
        return;
      }
      UI.limpiarAviso();

      // FIX: mismo caso — conEscenario() también entrega el grafo "crudo".
      grafoActual = Grafo.construir(Datos.conEscenario(consulta.escenario));

      var resultado = Dijkstra.conHeap(
        grafoActual,
        consulta.origen,
        consulta.destino,
      );
      var porBfs = Alternativos.bfs(
        grafoActual,
        consulta.origen,
        consulta.destino,
      );

      UI.renderResumenGrafo(grafoActual);
      UI.renderMapa(grafoActual, resultado);
      UI.renderResultado(grafoActual, resultado, porBfs);
      UI.renderPasos(resultado.pasos);
      UI.renderTablaDistancias(grafoActual, resultado);
    }
  });
})();
