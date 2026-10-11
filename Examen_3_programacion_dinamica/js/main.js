/* =====================================================================
   main.js  —  Integrante 1
   Conecta la interfaz con el algoritmo. Es el único archivo que conoce
   a todos los módulos; entre ellos no se llaman.
   ===================================================================== */

/* ---------------------------------------------------------------------
   Capa de compatibilidad entre módulos.

   dp.js y memo.js exponen mochilaMatriz, mochilaUnaFila, mochilaMemo y
   mochilaSinMemoria, y devuelven {valor, seleccion, pasos, ...}. En cambio
   alternativos.js, experimento.js y la interfaz esperan DP.tabular,
   DP.unaSolaFila, Memo.resolver y Memo.sinMemoria, con resultados del tipo
   {ocupacion, seleccionados, traza, celdas, ms, ...}.

   Aquí solo se traducen nombres y formas. El cálculo lo sigue haciendo el
   código de dp.js y memo.js; si esos módulos pasan a exponer los nombres
   que esperan los demás, estas funciones no se instalan.
   --------------------------------------------------------------------- */
(function () {
  'use strict';

  function ahora() {
    return (typeof performance !== 'undefined' && performance.now)
      ? performance.now() : Date.now();
  }

  // Texto de cada paso de la reconstrucción (de dp[n][C] hacia dp[0][·]).
  function construirTraza(tabla, grupos, capacidad) {
    var traza = [];
    var c = capacidad;

    for (var i = grupos.length; i > 0; i--) {
      var g = grupos[i - 1];

      if (tabla[i][c] === tabla[i - 1][c]) {
        traza.push({
          tipo: 'descarta',
          texto: g.nombre + ' (' + g.tamano + '): dp[' + i + '][' + c + '] = dp[' + (i - 1) + '][' + c +
                 '] = ' + tabla[i][c] + '. Asignarlo no mejoraba, así que no entra.'
        });
      } else {
        traza.push({
          tipo: 'asigna',
          texto: g.nombre + ' (' + g.tamano + '): dp[' + i + '][' + c + '] = ' + tabla[i][c] +
                 ' supera a dp[' + (i - 1) + '][' + c + '] = ' + tabla[i - 1][c] +
                 '. Entra, y quedan ' + (c - g.tamano) + ' puestos para los grupos anteriores.'
        });
        c -= g.tamano;
      }
    }

    traza.push({
      tipo: 'base',
      texto: 'Llegamos a la fila 0 con ' + c + ' puestos sin repartir. Ahí vale el caso base: ' +
             'sin grupos no se ocupa nada, y el recorrido termina.'
    });
    return traza;
  }

  if (typeof DP !== 'undefined' && typeof DP.tabular !== 'function' &&
      typeof DP.mochilaMatriz === 'function') {

    DP.tabular = function (grupos, capacidad) {
      var inicio = ahora();
      var r = DP.mochilaMatriz(grupos, capacidad);
      return {
        tabla: r.tabla,
        ocupacion: r.valor,
        seleccionados: r.seleccion,
        camino: r.camino,
        traza: construirTraza(r.tabla, grupos, capacidad),
        celdas: (grupos.length + 1) * (capacidad + 1),
        ms: ahora() - inicio,
        metodo: 'tabulación'
      };
    };

    DP.unaSolaFila = function (grupos, capacidad) {
      var inicio = ahora();
      var r = DP.mochilaUnaFila(grupos, capacidad);
      return {
        ocupacion: r.valor,
        celdas: capacidad + 1,
        ms: ahora() - inicio,
        metodo: 'una sola fila'
      };
    };
  }

  if (typeof Memo !== 'undefined' && typeof Memo.resolver !== 'function' &&
      typeof Memo.mochilaMemo === 'function') {

    Memo.resolver = function (grupos, capacidad) {
      var inicio = ahora();
      var r = Memo.mochilaMemo(grupos, capacidad);
      var totalPosibles = (grupos.length + 1) * (capacidad + 1);
      var calculadas = r.estadosDelValor; // estados que cuesta el óptimo a secas
      return {
        ocupacion: r.valor,
        calculadas: calculadas,
        llamadas: r.llamadas,
        totalPosibles: totalPosibles,
        ahorro: totalPosibles > 0 ? (1 - calculadas / totalPosibles) * 100 : 0,
        ms: ahora() - inicio,
        metodo: 'memoización'
      };
    };

    Memo.sinMemoria = function (grupos, capacidad, topeGrupos) {
      var limite = topeGrupos || 20;
      if (grupos.length > limite) {
        return { ocupacion: null, excedido: true, limite: limite, llamadas: 0, ms: 0 };
      }
      var inicio = ahora();
      var r = Memo.mochilaSinMemoria(grupos, capacidad);
      return {
        ocupacion: r.abortado ? null : r.valor,
        excedido: !!r.abortado,
        llamadas: r.llamadas,
        ms: ahora() - inicio,
        metodo: 'recursión sin memoria'
      };
    };
  }
})();

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
