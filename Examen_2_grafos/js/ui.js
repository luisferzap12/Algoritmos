/* =====================================================================
   ui.js  —  Integrante 1
   Estado de la consulta y pintado de la interfaz.

   Todo lo que proviene de los datos se inserta con textContent. La
   versión anterior armaba el HTML concatenando cadenas, lo que además
   de inseguro obliga a reparsear el documento en cada vuelta.
   ===================================================================== */

var UI = (function () {
  "use strict";

  var escenarioActual = "normal";
  var el = {};

  function init() {
    el.mapa = document.getElementById("mapa");
    el.origen = document.getElementById("origen");
    el.destino = document.getElementById("destino");
    el.escenarios = document.getElementById("escenarios");
    el.descripcionEscenario = document.getElementById("descripcionEscenario");
    el.btnCalcular = document.getElementById("btnCalcular");
    el.aviso = document.getElementById("aviso");
    el.resultado = document.getElementById("resultado");
    el.totalMinutos = document.getElementById("totalMinutos");
    el.rutaSecuencia = document.getElementById("rutaSecuencia");
    el.tramos = document.getElementById("tramos");
    el.visitados = document.getElementById("visitados");
    el.operaciones = document.getElementById("operaciones");
    el.textoBfs = document.getElementById("textoBfs");
    el.pasos = document.getElementById("pasos");
    el.tablaDistancias = document.getElementById("tablaDistancias");
    el.resumenGrafo = document.getElementById("resumenGrafo");
    el.btnExperimento = document.getElementById("btnExperimento");
    el.canvasExperimento = document.getElementById("canvasExperimento");
    el.notaExperimento = document.getElementById("notaExperimento");
    el.btnNegativos = document.getElementById("btnNegativos");
    el.salidaNegativos = document.getElementById("salidaNegativos");
    el.tablaNegativos = document.getElementById("tablaNegativos");
    el.notaNegativos = document.getElementById("notaNegativos");
  }

  /* ------------------------------ estado --------------------------- */

  function obtenerConsulta() {
    return {
      origen: el.origen.value,
      destino: el.destino.value,
      escenario: escenarioActual,
    };
  }

  function fijarEscenario(clave) {
    escenarioActual = clave;
  }

  function validar(consulta) {
    if (consulta.origen === consulta.destino) {
      return {
        ok: false,
        mensaje:
          "El origen y el destino son el mismo punto. Elige dos sedes distintas.",
      };
    }
    return { ok: true };
  }

  function mostrarAviso(mensaje) {
    el.aviso.textContent = mensaje;
    el.aviso.hidden = false;
  }

  function limpiarAviso() {
    el.aviso.textContent = "";
    el.aviso.hidden = true;
  }

  /* --------------------------- renderizado ------------------------- */

  function llenarSelectores(grafo, origenPorDefecto, destinoPorDefecto) {
    [el.origen, el.destino].forEach(function (selector) {
      selector.innerHTML = "";
      var fragmento = document.createDocumentFragment();

      Grafo.listaNodos(grafo).forEach(function (id) {
        var opcion = document.createElement("option");
        opcion.value = id;
        opcion.textContent = grafo.nodos[id].nombre;
        fragmento.appendChild(opcion);
      });

      selector.appendChild(fragmento);
    });

    el.origen.value = origenPorDefecto;
    el.destino.value = destinoPorDefecto;
  }

  function renderEscenarios(lista, alElegir) {
    el.escenarios.innerHTML = "";

    lista.forEach(function (e) {
      var boton = document.createElement("button");
      boton.type = "button";
      boton.className =
        "ficha" + (e.clave === escenarioActual ? " ficha--activa" : "");
      boton.textContent = e.etiqueta;
      boton.setAttribute("data-clave", e.clave);
      boton.addEventListener("click", function () {
        escenarioActual = e.clave;
        marcarFichaActiva(e.clave);
        el.descripcionEscenario.textContent = e.descripcion;
        alElegir(e.clave);
      });
      el.escenarios.appendChild(boton);
    });
  }

  function marcarFichaActiva(clave) {
    var fichas = el.escenarios.querySelectorAll(".ficha");
    for (var i = 0; i < fichas.length; i++) {
      if (fichas[i].getAttribute("data-clave") === clave) {
        fichas[i].classList.add("ficha--activa");
      } else {
        fichas[i].classList.remove("ficha--activa");
      }
    }
  }

  function renderResumenGrafo(grafo) {
    var e = Grafo.estadisticas(grafo);
    el.resumenGrafo.textContent =
      e.V +
      " nodos · " +
      e.E +
      " aristas · grado promedio " +
      e.gradoPromedio.toFixed(1) +
      " · " +
      (e.conexo ? "grafo conexo" : "grafo NO conexo: hay sedes incomunicadas");
  }

  function renderMapa(grafo, resultado) {
    Mapa.render(el.mapa, grafo, {
      ruta: resultado ? resultado.ruta : [],
      orden: resultado ? resultado.orden : [],
    });
  }

  function renderResultado(grafo, resultado, porBfs) {
    el.resultado.hidden = false;

    if (!resultado.alcanzado) {
      el.totalMinutos.textContent = "∞";
      el.rutaSecuencia.textContent =
        "No existe ningún camino entre esas dos sedes con las vías disponibles.";
      el.tramos.textContent = "—";
      el.visitados.textContent = resultado.orden.length;
      el.operaciones.textContent = resultado.operaciones;
      el.textoBfs.textContent = "Sin ruta, no hay nada que comparar.";
      return;
    }

    el.totalMinutos.textContent = resultado.total;
    el.rutaSecuencia.textContent = resultado.ruta
      .map(function (id) {
        return grafo.nodos[id].nombre;
      })
      .join("  ·  ");

    el.tramos.textContent = resultado.tramos;
    el.visitados.textContent =
      resultado.orden.length + " de " + Grafo.listaNodos(grafo).length;
    el.operaciones.textContent = resultado.operaciones;

    renderComparativaBfs(grafo, resultado, porBfs);
  }

  function renderComparativaBfs(grafo, resultado, porBfs) {
    if (!porBfs.alcanzado) {
      el.textoBfs.textContent = "El recorrido en anchura no encontró camino.";
      return;
    }

    var rutaBfs = porBfs.ruta
      .map(function (id) {
        return grafo.nodos[id].nombre;
      })
      .join(" · ");
    var diferencia = porBfs.minutos - resultado.total;

    if (diferencia > 0) {
      el.textoBfs.textContent =
        "Buscando solo el camino con menos tramos (recorrido en anchura) se obtiene " +
        rutaBfs +
        ": " +
        porBfs.tramos +
        " tramos, pero " +
        porBfs.minutos +
        " minutos, " +
        diferencia +
        " más que la ruta de Dijkstra. Menos tramos no significa menos tiempo, y por eso las aristas tienen peso.";
    } else {
      el.textoBfs.textContent =
        "Aquí el camino con menos tramos coincide en tiempo con el de Dijkstra (" +
        porBfs.minutos +
        " minutos). Prueba con Robledo → Industriales para ver un caso donde no coinciden.";
    }
  }

  function renderPasos(pasos) {
    el.pasos.innerHTML = "";
    var fragmento = document.createDocumentFragment();

    pasos.forEach(function (p) {
      var li = document.createElement("li");
      li.className = "paso paso--" + p.tipo;
      li.textContent = p.texto;
      fragmento.appendChild(li);
    });

    el.pasos.appendChild(fragmento);
  }

  function renderTablaDistancias(grafo, resultado) {
    el.tablaDistancias.innerHTML = "";
    var fragmento = document.createDocumentFragment();

    Grafo.listaNodos(grafo).forEach(function (id) {
      var d = resultado.distancia[id];
      var previo = resultado.anterior[id];

      var tr = document.createElement("tr");
      if (resultado.ruta.indexOf(id) !== -1) tr.className = "fila--ruta";

      tr.appendChild(celda(grafo.nodos[id].nombre));
      tr.appendChild(celda(d === Infinity ? "∞" : d, "num"));
      tr.appendChild(
        celda(
          previo
            ? grafo.nodos[previo].nombre
            : id === resultado.origen
              ? "origen"
              : "—",
        ),
      );

      fragmento.appendChild(tr);
    });

    el.tablaDistancias.appendChild(fragmento);
  }

  function celda(valor, clase) {
    var td = document.createElement("td");
    td.textContent = valor;
    if (clase) td.className = clase;
    return td;
  }

  /* ------------------------- experimento --------------------------- */

  function renderExperimento(salida) {
    Graficas.complejidad(el.canvasExperimento, salida.mediciones);

    var r = salida.resumen;
    var texto =
      "Con V = " +
      r.V +
      " nodos y E = " +
      r.E +
      " aristas, la versión con montículo tardó " +
      r.msHeap.toFixed(1) +
      " ms y la de O(V²) " +
      r.msSimple.toFixed(1) +
      " ms: " +
      r.vecesMasRapido.toFixed(1) +
      " veces más rápida.";

    texto +=
      salida.discrepancias === 0
        ? " Las dos versiones devolvieron la misma distancia en todos los tamaños."
        : " ATENCIÓN: hubo " +
          salida.discrepancias +
          " tamaños donde las versiones no coincidieron.";

    el.notaExperimento.textContent = texto;
  }

  function estadoBotonExperimento(ocupado) {
    el.btnExperimento.disabled = ocupado;
    el.btnExperimento.textContent = ocupado ? "Midiendo…" : "Medir de nuevo";
  }

  /* --------------------------- negativos --------------------------- */

  function renderNegativos(comparacion) {
    el.salidaNegativos.hidden = false;
    el.tablaNegativos.innerHTML = "";
    var fragmento = document.createDocumentFragment();

    comparacion.filas.forEach(function (f) {
      var tr = document.createElement("tr");
      if (!f.coincide) tr.className = "fila--discrepancia";
      tr.appendChild(celda(f.nodo));
      tr.appendChild(celda(f.dijkstra === Infinity ? "∞" : f.dijkstra, "num"));
      tr.appendChild(celda(f.bellman === Infinity ? "∞" : f.bellman, "num"));
      tr.appendChild(celda(f.coincide ? "sí" : "NO"));
      fragmento.appendChild(tr);
    });

    el.tablaNegativos.appendChild(fragmento);

    el.notaNegativos.textContent = comparacion.hayDiscrepancia
      ? "Dijkstra fija la distancia de B en 2 al visitarlo y nunca la revisa, aunque después descubre que por C se llega en 1. Bellman-Ford sí la corrige. La conclusión práctica: usar Dijkstra exige comprobar antes que ningún peso sea negativo."
      : "En esta corrida no hubo diferencia.";
  }

  function referencias() {
    return el;
  }

  return {
    init: init,
    obtenerConsulta: obtenerConsulta,
    fijarEscenario: fijarEscenario,
    validar: validar,
    mostrarAviso: mostrarAviso,
    limpiarAviso: limpiarAviso,
    llenarSelectores: llenarSelectores,
    renderEscenarios: renderEscenarios,
    renderResumenGrafo: renderResumenGrafo,
    renderMapa: renderMapa,
    renderResultado: renderResultado,
    renderPasos: renderPasos,
    renderTablaDistancias: renderTablaDistancias,
    renderExperimento: renderExperimento,
    estadoBotonExperimento: estadoBotonExperimento,
    renderNegativos: renderNegativos,
    referencias: referencias,
  };
})();
