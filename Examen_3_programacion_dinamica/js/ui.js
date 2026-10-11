/* =====================================================================
   ui.js  —  Integrante 1
   Estado de la pantalla y pintado del DOM.

   Todo lo que escribe la persona se inserta con textContent. El estado
   (los grupos y la capacidad) vive aquí dentro, en una clausura: nadie
   lo modifica desde afuera sin pasar por estas funciones.
   ===================================================================== */

var UI = (function () {
  'use strict';

  var grupos = [];
  var capacidad = 45;
  var secuencia = 1;
  var escenarioActual = 'bloque301';
  var el = {};

  function init() {
    el.escenarios = document.getElementById('escenarios');
    el.descripcionEscenario = document.getElementById('descripcionEscenario');
    el.capacidad = document.getElementById('capacidad');
    el.lista = document.getElementById('lista');
    el.conteo = document.getElementById('conteo');
    el.nombre = document.getElementById('nombre');
    el.tamano = document.getElementById('tamano');
    el.btnAgregar = document.getElementById('btnAgregar');
    el.btnResolver = document.getElementById('btnResolver');
    el.aviso = document.getElementById('aviso');

    el.resultado = document.getElementById('resultado');
    el.ocupados = document.getElementById('ocupados');
    el.capacidadTotal = document.getElementById('capacidadTotal');
    el.barraOcupada = document.getElementById('barraOcupada');
    el.resumenOcupacion = document.getElementById('resumenOcupacion');
    el.asignados = document.getElementById('asignados');
    el.libres = document.getElementById('libres');
    el.sinAula = document.getElementById('sinAula');
    el.celdas = document.getElementById('celdas');
    el.textoGreedy = document.getElementById('textoGreedy');
    el.textoBruta = document.getElementById('textoBruta');

    el.contenedorTabla = document.getElementById('contenedorTabla');
    el.traza = document.getElementById('traza');
    el.tablaEnfoques = document.getElementById('tablaEnfoques');
    el.notaEnfoques = document.getElementById('notaEnfoques');

    el.btnExpGrupos = document.getElementById('btnExpGrupos');
    el.canvasGrupos = document.getElementById('canvasGrupos');
    el.notaGrupos = document.getElementById('notaGrupos');
    el.btnExpCapacidad = document.getElementById('btnExpCapacidad');
    el.canvasCapacidad = document.getElementById('canvasCapacidad');
    el.notaCapacidad = document.getElementById('notaCapacidad');
  }

  /* ------------------------------ estado --------------------------- */

  function cargarEscenario(clave) {
    var e = Datos.obtener(clave);
    if (!e) return;

    escenarioActual = clave;
    capacidad = e.capacidad;
    grupos = e.grupos.map(function (g) {
      return { id: secuencia++, nombre: g.nombre, tamano: g.tamano };
    });
    el.capacidad.value = capacidad;
    el.descripcionEscenario.textContent = e.descripcion;
  }

  function agregar(nombre, tamano) {
    grupos.push({ id: secuencia++, nombre: nombre, tamano: tamano });
  }

  function eliminar(id) {
    grupos = grupos.filter(function (g) { return g.id !== id; });
  }

  function obtenerGrupos() { return grupos; }
  function obtenerCapacidad() { return capacidad; }

  function leerCapacidad() {
    var valor = Number(el.capacidad.value);
    var revision = Modelo.validarCapacidad(valor);
    if (revision.ok) capacidad = valor;
    return revision;
  }

  function leerGrupoNuevo() {
    return Modelo.validarGrupo(el.nombre.value.trim(), Number(el.tamano.value), grupos.length);
  }

  function limpiarFormularioGrupo() {
    el.nombre.value = '';
    el.tamano.value = '';
    el.nombre.focus();
  }

  function mostrarAviso(mensaje) {
    el.aviso.textContent = mensaje;
    el.aviso.hidden = false;
  }

  function limpiarAviso() {
    el.aviso.textContent = '';
    el.aviso.hidden = true;
  }

  /* --------------------------- renderizado ------------------------- */

  function renderEscenarios(lista, alElegir) {
    el.escenarios.innerHTML = '';

    lista.forEach(function (e) {
      var boton = document.createElement('button');
      boton.type = 'button';
      boton.className = 'ficha' + (e.clave === escenarioActual ? ' ficha--activa' : '');
      boton.textContent = e.etiqueta;
      boton.setAttribute('data-clave', e.clave);
      boton.addEventListener('click', function () { alElegir(e.clave); });
      el.escenarios.appendChild(boton);
    });
  }

  function marcarEscenario(clave) {
    var fichas = el.escenarios.querySelectorAll('.ficha');
    for (var i = 0; i < fichas.length; i++) {
      if (fichas[i].getAttribute('data-clave') === clave) fichas[i].classList.add('ficha--activa');
      else fichas[i].classList.remove('ficha--activa');
    }
  }

  function renderGrupos(alEliminar) {
    el.lista.innerHTML = '';
    el.conteo.textContent = grupos.length;
    el.btnResolver.disabled = grupos.length === 0;

    if (grupos.length === 0) {
      var vacio = document.createElement('li');
      vacio.className = 'vacio';
      vacio.textContent = 'No hay solicitudes. Carga un escenario o agrega un grupo.';
      el.lista.appendChild(vacio);
      return;
    }

    var fragmento = document.createDocumentFragment();

    grupos.forEach(function (g, i) {
      var li = document.createElement('li');
      if (g.tamano > capacidad) li.className = 'no-cabe';

      var orden = document.createElement('span');
      orden.className = 'grupo-orden';
      orden.textContent = i + 1;

      var nombre = document.createElement('span');
      nombre.className = 'grupo-nombre';
      nombre.textContent = g.nombre;

      var tam = document.createElement('span');
      tam.className = 'grupo-tamano';
      tam.textContent = g.tamano;

      var quitar = document.createElement('button');
      quitar.type = 'button';
      quitar.className = 'grupo-quitar';
      quitar.textContent = '\u00D7';
      quitar.setAttribute('aria-label', 'Quitar ' + g.nombre);
      quitar.addEventListener('click', function () { alEliminar(g.id); });

      li.appendChild(orden);
      li.appendChild(nombre);
      li.appendChild(tam);
      li.appendChild(quitar);
      fragmento.appendChild(li);
    });

    el.lista.appendChild(fragmento);
  }

  function renderResultado(comparacion, metricas) {
    el.resultado.hidden = false;
    var dp = comparacion.dp;

    el.ocupados.textContent = metricas.ocupados;
    el.capacidadTotal.textContent = metricas.capacidad;
    el.barraOcupada.style.width = Math.min(100, metricas.porcentaje).toFixed(1) + '%';

    el.resumenOcupacion.textContent = metricas.exacta
      ? 'Ocupación exacta: la combinación llena el aula sin dejar un solo puesto libre (' +
        metricas.porcentaje.toFixed(0) + ' %).'
      : 'Ocupación del ' + metricas.porcentaje.toFixed(1) + ' %. No existe ninguna combinación mejor: ' +
        'la tabla las evaluó todas sin enumerarlas.';

    el.libres.textContent = metricas.libres;
    el.sinAula.textContent = metricas.sinAula;
    el.celdas.textContent = dp.celdas.toLocaleString('es-CO');

    renderAsignados(dp.seleccionados);
    renderGreedy(comparacion, metricas);
    renderBruta(comparacion);
  }

  function renderAsignados(seleccionados) {
    el.asignados.innerHTML = '';

    if (seleccionados.length === 0) {
      var vacio = document.createElement('li');
      vacio.className = 'vacio';
      vacio.textContent = 'Ningún grupo cabe en el aula. La respuesta correcta es cero, no un error.';
      el.asignados.appendChild(vacio);
      return;
    }

    var fragmento = document.createDocumentFragment();
    seleccionados.forEach(function (g) {
      var li = document.createElement('li');
      var nombre = document.createElement('span');
      nombre.textContent = g.nombre;
      var tam = document.createElement('span');
      tam.className = 'grupo-tamano';
      tam.textContent = g.tamano;
      li.appendChild(nombre);
      li.appendChild(tam);
      fragmento.appendChild(li);
    });
    el.asignados.appendChild(fragmento);
  }

  function renderGreedy(comparacion, metricas) {
    var mayor = comparacion.mayor.ocupacion;
    var menor = comparacion.menor.ocupacion;
    var optimo = comparacion.dp.ocupacion;
    var peor = Math.min(mayor, menor);

    if (optimo > Math.max(mayor, menor)) {
      el.textoGreedy.textContent =
        'Empezando por el grupo más grande se ocupan ' + mayor + ' puestos; empezando por el más pequeño, ' +
        menor + '. La programación dinámica ocupa ' + optimo + '. Los dos criterios voraces fallan sobre los ' +
        'mismos datos, así que el problema no es el orden: es que ninguna elección local es segura. ' +
        'La diferencia son ' + (optimo - peor) + ' estudiantes que sí alcanzan cupo.';
    } else if (optimo > peor) {
      el.textoGreedy.textContent =
        'Aquí uno de los criterios voraces acierta (' + Math.max(mayor, menor) + ' puestos) y el otro no (' +
        peor + '). Que a veces acierte no lo hace correcto: sin demostración no se sabe cuándo va a fallar, ' +
        'y el escenario «el caso donde greedy falla» muestra que falla.';
    } else {
      el.textoGreedy.textContent =
        'En este escenario los criterios voraces alcanzan el mismo resultado que la programación dinámica (' +
        optimo + ' puestos). Prueba el escenario «el caso donde greedy falla» para ver dónde se rompen.';
    }
  }

  function renderBruta(comparacion) {
    var bruta = comparacion.bruta;

    if (bruta.excedido) {
      el.textoBruta.textContent =
        'Con ' + comparacion.dp.seleccionados.length + ' o más grupos la fuerza bruta deja de correr: serían ' +
        bruta.combinaciones.toLocaleString('es-CO') + ' combinaciones. La tabla resolvió el mismo problema con ' +
        comparacion.dp.celdas.toLocaleString('es-CO') + ' estados.';
      return;
    }

    el.textoBruta.textContent =
      'Probar todas las combinaciones posibles (' + bruta.combinaciones.toLocaleString('es-CO') +
      ') da ' + bruta.ocupacion + ' puestos, el mismo resultado que la tabla, que necesitó ' +
      comparacion.dp.celdas.toLocaleString('es-CO') + ' estados. ' +
      (comparacion.coincideConBruta
        ? 'Las dos coinciden: la programación dinámica no es una aproximación, es exacta.'
        : 'ATENCIÓN: no coinciden, hay un error en alguna de las dos.');
  }

  function renderTabla(resultado) {
    Tabla.render(el.contenedorTabla, resultado, grupos, capacidad);
  }

  function renderTraza(traza) {
    el.traza.innerHTML = '';
    var fragmento = document.createDocumentFragment();

    traza.forEach(function (p) {
      var li = document.createElement('li');
      li.className = 'paso paso--' + p.tipo;
      li.textContent = p.texto;
      fragmento.appendChild(li);
    });

    el.traza.appendChild(fragmento);
  }

  function renderEnfoques(comparacion) {
    el.tablaEnfoques.innerHTML = '';
    var fragmento = document.createDocumentFragment();

    var filas = [
      ['Tabulación (abajo hacia arriba)', comparacion.tabulacion.celdas, comparacion.tabulacion.ocupacion],
      ['Memoización (arriba hacia abajo)', comparacion.memoizacion.calculadas, comparacion.memoizacion.ocupacion],
      ['Recursión sin memoria',
        comparacion.sinMemoria.excedido ? 'no corre' : comparacion.sinMemoria.llamadas,
        comparacion.sinMemoria.excedido ? '—' : comparacion.sinMemoria.ocupacion]
    ];

    filas.forEach(function (f) {
      var tr = document.createElement('tr');
      tr.appendChild(celda(f[0]));
      tr.appendChild(celda(typeof f[1] === 'number' ? f[1].toLocaleString('es-CO') : f[1], 'num'));
      tr.appendChild(celda(f[2], 'num'));
      fragmento.appendChild(tr);
    });

    el.tablaEnfoques.appendChild(fragmento);

    el.notaEnfoques.textContent =
      'La memoización evitó ' + comparacion.estadosAhorrados.toLocaleString('es-CO') + ' estados (' +
      comparacion.memoizacion.ahorro.toFixed(1) + ' % de la tabla): solo calcula los que la recursión visita. ' +
      'La tabulación los llena todos, pero deja la tabla completa, que es lo que permite dibujarla y reconstruir la respuesta.';
  }

  function celda(valor, clase) {
    var td = document.createElement('td');
    td.textContent = valor;
    if (clase) td.className = clase;
    return td;
  }

  /* -------------------------- experimentos ------------------------- */

  function renderExpGrupos(salida) {
    Graficas.porGrupos(el.canvasGrupos, salida.mediciones);

    var ultima = salida.mediciones[salida.mediciones.length - 1];
    var texto = 'Con n = ' + ultima.n + ' grupos, la tabla tardó ' + ultima.msDP.toFixed(2) + ' ms usando ' +
      ultima.celdasDP.toLocaleString('es-CO') + ' estados; la fuerza bruta tardó ' +
      (ultima.brutaExcedida ? 'más de lo admitido' : ultima.msBruta.toFixed(1) + ' ms') +
      ' revisando ' + ultima.combinaciones.toLocaleString('es-CO') + ' combinaciones.';

    texto += salida.discrepancias === 0
      ? ' Las dos devolvieron la misma ocupación en todos los tamaños.'
      : ' ATENCIÓN: hubo ' + salida.discrepancias + ' tamaños donde no coincidieron.';

    el.notaGrupos.textContent = texto;
  }

  function renderExpCapacidad(salida) {
    Graficas.porCapacidad(el.canvasCapacidad, salida.mediciones);

    var primera = salida.mediciones[0];
    var ultima = salida.mediciones[salida.mediciones.length - 1];

    el.notaCapacidad.textContent =
      'Con los mismos ' + salida.n + ' grupos: pasar de ' + primera.capacidad.toLocaleString('es-CO') +
      ' a ' + ultima.capacidad.toLocaleString('es-CO') + ' puestos multiplicó el tiempo por ' +
      (ultima.ms / Math.max(primera.ms, 0.001)).toFixed(1) + ', mientras el dato de entrada pasó de ' +
      primera.bits + ' a ' + ultima.bits + ' bits. El tiempo creció con el valor de C, no con su tamaño: ' +
      'por eso Θ(n·C) es pseudo-polinomial.';
  }

  function estadoBoton(boton, ocupado, textoFinal) {
    boton.disabled = ocupado;
    boton.textContent = ocupado ? 'Midiendo…' : textoFinal;
  }

  function referencias() { return el; }

  return {
    init: init,
    cargarEscenario: cargarEscenario,
    agregar: agregar,
    eliminar: eliminar,
    obtenerGrupos: obtenerGrupos,
    obtenerCapacidad: obtenerCapacidad,
    leerCapacidad: leerCapacidad,
    leerGrupoNuevo: leerGrupoNuevo,
    limpiarFormularioGrupo: limpiarFormularioGrupo,
    mostrarAviso: mostrarAviso,
    limpiarAviso: limpiarAviso,
    renderEscenarios: renderEscenarios,
    marcarEscenario: marcarEscenario,
    renderGrupos: renderGrupos,
    renderResultado: renderResultado,
    renderTabla: renderTabla,
    renderTraza: renderTraza,
    renderEnfoques: renderEnfoques,
    renderExpGrupos: renderExpGrupos,
    renderExpCapacidad: renderExpCapacidad,
    estadoBoton: estadoBoton,
    referencias: referencias
  };
})();
