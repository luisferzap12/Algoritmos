/* =====================================================================
   ui.js  —  Integrante 1
   Estado de la cola y pintado de la interfaz.

   Todo el texto que escribe la persona se inserta con textContent, no
   con innerHTML: un nombre como <img onerror=...> no debe ejecutarse.
   ===================================================================== */

var UI = (function () {
  'use strict';

  var cola = [];
  var secuencia = 1;

  var el = {};

  function init() {
    el.formulario = document.getElementById('formulario');
    el.nombre = document.getElementById('nombre');
    el.duracion = document.getElementById('duracion');
    el.error = document.getElementById('error');
    el.lista = document.getElementById('lista');
    el.conteo = document.getElementById('conteo');
    el.btnSimular = document.getElementById('btnSimular');
    el.btnVaciar = document.getElementById('btnVaciar');
    el.btnEjemplo = document.getElementById('btnEjemplo');
    el.btnComplejidad = document.getElementById('btnComplejidad');
    el.ahorro = document.getElementById('ahorro');
    el.esperaFifo = document.getElementById('esperaFifo');
    el.esperaSpt = document.getElementById('esperaSpt');
    el.esperaAleatorio = document.getElementById('esperaAleatorio');
    el.makespan = document.getElementById('makespan');
    el.comparaciones = document.getElementById('comparaciones');
    el.ganttFifo = document.getElementById('ganttFifo');
    el.ganttSpt = document.getElementById('ganttSpt');
    el.leyendaFifo = document.getElementById('leyendaFifo');
    el.leyendaSpt = document.getElementById('leyendaSpt');
    el.tablaFifo = document.getElementById('tablaFifo');
    el.tablaSpt = document.getElementById('tablaSpt');
    el.resultados = document.getElementById('resultados');
    el.canvasBarras = document.getElementById('canvasBarras');
    el.canvasComplejidad = document.getElementById('canvasComplejidad');
    el.notaComplejidad = document.getElementById('notaComplejidad');
    el.escenarios = document.getElementById('escenarios');
    el.descripcionEscenario = document.getElementById('descripcionEscenario');
    el.lote = document.getElementById('lote');
    el.errorLote = document.getElementById('errorLote');
    el.btnAgregarLote = document.getElementById('btnAgregarLote');
    el.btnReemplazarLote = document.getElementById('btnReemplazarLote');
    el.btnAleatoria = document.getElementById('btnAleatoria');
  }

  /* ---------------------- estado de la cola ------------------------ */

  function agregar(nombre, duracion) {
    cola.push({ id: secuencia++, nombre: nombre, duracion: duracion });
  }

  function eliminar(id) {
    cola = cola.filter(function (t) { return t.id !== id; });
  }

  function vaciar() {
    cola = [];
  }

  function cargarEjemplo() {
    reemplazar(Escenarios.obtener('clinica'));
  }

  /* Agrega una lista completa al final de la cola. */
  function agregarVarios(turnos) {
    turnos.forEach(function (t) { agregar(t.nombre, t.duracion); });
  }

  /* Descarta la cola actual y la sustituye por la lista recibida. */
  function reemplazar(turnos) {
    cola = turnos.map(function (t) {
      return { id: secuencia++, nombre: t.nombre, duracion: t.duracion };
    });
  }

  function obtenerCola() {
    return cola;
  }

  /* --------------------- validación del formulario ------------------ */

  function leerFormulario() {
    var nombre = el.nombre.value.trim();
    var duracion = Number(el.duracion.value);

    if (nombre === '') {
      return { ok: false, mensaje: 'Escribe el nombre o el tipo de turno.' };
    }
    if (nombre.length > 60) {
      return { ok: false, mensaje: 'El nombre no puede superar los 60 caracteres.' };
    }
    if (!Number.isInteger(duracion) || duracion <= 0) {
      return { ok: false, mensaje: 'La duración debe ser un número entero de minutos mayor que cero.' };
    }
    if (duracion > 600) {
      return { ok: false, mensaje: 'La duración máxima admitida es de 600 minutos.' };
    }
    return { ok: true, nombre: nombre, duracion: duracion };
  }

  function mostrarError(mensaje) {
    el.error.textContent = mensaje;
    el.error.hidden = false;
  }

  function limpiarError() {
    el.error.textContent = '';
    el.error.hidden = true;
  }

  /* --------------------- carga por lote y escenarios ---------------- */

  function renderEscenarios(alElegir) {
    el.escenarios.innerHTML = '';

    Escenarios.listar().forEach(function (e) {
      var boton = document.createElement('button');
      boton.type = 'button';
      boton.className = 'ficha-escenario';
      boton.textContent = e.etiqueta;
      boton.title = e.descripcion;
      boton.addEventListener('click', function () {
        el.descripcionEscenario.textContent = e.descripcion;
        alElegir(e.clave);
      });
      el.escenarios.appendChild(boton);
    });
  }

  function leerLote() {
    var lectura = Escenarios.parsear(el.lote.value);

    if (lectura.turnos.length === 0) {
      var motivo = lectura.errores.length > 0
        ? lectura.errores.join(' ')
        : 'Escribe al menos un turno con el formato: nombre, minutos.';
      return { ok: false, mensaje: motivo };
    }

    return { ok: true, turnos: lectura.turnos, avisos: lectura.errores };
  }

  function mostrarErrorLote(mensaje) {
    el.errorLote.textContent = mensaje;
    el.errorLote.hidden = false;
  }

  function limpiarErrorLote() {
    el.errorLote.textContent = '';
    el.errorLote.hidden = true;
  }

  function limpiarLote() {
    el.lote.value = '';
  }

  function limpiarFormulario() {
    el.formulario.reset();
    el.nombre.focus();
  }

  /* ------------------------- renderizado ---------------------------- */

  function renderCola(alEliminar) {
    el.lista.innerHTML = '';
    el.conteo.textContent = cola.length;
    el.btnSimular.disabled = cola.length === 0;

    if (cola.length === 0) {
      var vacio = document.createElement('li');
      vacio.className = 'vacio';
      vacio.textContent = 'La cola está vacía. Agrega un turno o carga el caso de ejemplo.';
      el.lista.appendChild(vacio);
      return;
    }

    var fragmento = document.createDocumentFragment();

    cola.forEach(function (t, i) {
      var li = document.createElement('li');

      var orden = document.createElement('span');
      orden.className = 'turno-orden';
      orden.textContent = i + 1;

      var nombre = document.createElement('span');
      nombre.className = 'turno-nombre';
      nombre.textContent = t.nombre;

      var minutos = document.createElement('span');
      minutos.className = 'turno-minutos';
      minutos.textContent = t.duracion + ' min';

      var quitar = document.createElement('button');
      quitar.type = 'button';
      quitar.className = 'turno-quitar';
      quitar.textContent = '\u00D7';
      quitar.setAttribute('aria-label', 'Quitar ' + t.nombre + ' de la cola');
      quitar.addEventListener('click', function () { alEliminar(t.id); });

      li.appendChild(orden);
      li.appendChild(nombre);
      li.appendChild(minutos);
      li.appendChild(quitar);
      fragmento.appendChild(li);
    });

    el.lista.appendChild(fragmento);
  }

  function renderResultados(comparacion) {
    var e = comparacion.estrategias;
    var escala = Math.max(e.fifo.makespan, e.spt.makespan, 1);

    el.resultados.hidden = false;

    el.ahorro.textContent = comparacion.ahorroVsFifo.toFixed(1) + '%';
    el.esperaFifo.textContent = e.fifo.esperaPromedio.toFixed(1);
    el.esperaSpt.textContent = e.spt.esperaPromedio.toFixed(1);
    el.esperaAleatorio.textContent = e.aleatorio.esperaPromedio.toFixed(1);
    el.makespan.textContent = e.spt.makespan;
    el.comparaciones.textContent = comparacion.comparaciones;

    el.leyendaFifo.textContent = 'espera promedio ' + e.fifo.esperaPromedio.toFixed(1) +
      ' min · espera total ' + e.fifo.esperaTotal + ' min';
    el.leyendaSpt.textContent = 'espera promedio ' + e.spt.esperaPromedio.toFixed(1) +
      ' min · espera total ' + e.spt.esperaTotal + ' min';

    Graficos.renderLineaTiempo(el.ganttFifo, e.fifo, escala);
    Graficos.renderLineaTiempo(el.ganttSpt, e.spt, escala);
    Graficos.renderComparativa(el.canvasBarras, e);

    renderTabla(el.tablaFifo, e.fifo);
    renderTabla(el.tablaSpt, e.spt);
  }

  function renderTabla(tbody, resultado) {
    tbody.innerHTML = '';
    var fragmento = document.createDocumentFragment();

    resultado.detalle.forEach(function (d) {
      var tr = document.createElement('tr');
      tr.appendChild(celda(d.nombre));
      tr.appendChild(celda(d.duracion, 'num'));
      tr.appendChild(celda(d.espera, 'num'));
      tr.appendChild(celda(d.fin, 'num'));
      fragmento.appendChild(tr);
    });

    var total = document.createElement('tr');
    total.className = 'fila-total';
    total.appendChild(celda('Espera total'));
    total.appendChild(celda('', 'num'));
    total.appendChild(celda(resultado.esperaTotal, 'num'));
    total.appendChild(celda('', 'num'));
    fragmento.appendChild(total);

    tbody.appendChild(fragmento);
  }

  function celda(valor, clase) {
    var td = document.createElement('td');
    td.textContent = valor;
    if (clase) td.className = clase;
    return td;
  }

  function renderComplejidad(mediciones) {
    Graficos.renderComplejidad(el.canvasComplejidad, mediciones);
    var ultima = mediciones[mediciones.length - 1];
    el.notaComplejidad.textContent =
      'Con n = ' + ultima.n.toLocaleString('es-CO') + ' el ordenamiento tomó ' +
      ultima.ms.toFixed(1) + ' ms y realizó ' + ultima.comparaciones.toLocaleString('es-CO') +
      ' comparaciones.';
  }

  function referencias() {
    return el;
  }

  return {
    init: init,
    agregar: agregar,
    eliminar: eliminar,
    vaciar: vaciar,
    cargarEjemplo: cargarEjemplo,
    agregarVarios: agregarVarios,
    reemplazar: reemplazar,
    renderEscenarios: renderEscenarios,
    leerLote: leerLote,
    mostrarErrorLote: mostrarErrorLote,
    limpiarErrorLote: limpiarErrorLote,
    limpiarLote: limpiarLote,
    obtenerCola: obtenerCola,
    leerFormulario: leerFormulario,
    mostrarError: mostrarError,
    limpiarError: limpiarError,
    limpiarFormulario: limpiarFormulario,
    renderCola: renderCola,
    renderResultados: renderResultados,
    renderComplejidad: renderComplejidad,
    referencias: referencias
  };
})();
